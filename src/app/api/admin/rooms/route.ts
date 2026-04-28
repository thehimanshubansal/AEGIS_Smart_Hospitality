import { NextRequest, NextResponse } from "next/server";
import "@/lib/firebase";
import { getDataConnectInstance } from "@/lib/firebase";
import { getDemoSeedData, GuestLike, mapRoomForAdmin, RoomLike } from "@/lib/admin-data";
import {
  listRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  updateGuest,
  listGuests
} from "@/dataconnect-generated";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

type RoomStatus = "vacant" | "occupied" | "cleaning" | "maintenance";

type GlobalRoomStore = typeof globalThis & {
  __adminRoomMemoryStore?: RoomLike[];
};

const ROOM_STATUSES = new Set<RoomStatus>([
  "vacant",
  "occupied",
  "cleaning",
  "maintenance",
]);

function getMemoryStore() {
  const globalStore = globalThis as GlobalRoomStore;

  if (!globalStore.__adminRoomMemoryStore) {
    globalStore.__adminRoomMemoryStore = [];
  }

  return globalStore.__adminRoomMemoryStore;
}

function mergeRooms(primaryRooms: RoomLike[], fallbackRooms: RoomLike[]) {
  const roomMap = new Map<string, RoomLike>();

  for (const room of [...primaryRooms, ...fallbackRooms]) {
    roomMap.set(room.id, room);
  }

  return [...roomMap.values()].sort((left, right) => {
    if (left.floor !== right.floor) {
      return left.floor - right.floor;
    }

    return left.number.localeCompare(right.number, undefined, { numeric: true });
  });
}

function createMemoryRoom(params: {
  number: string;
  floor: number;
  type: string;
  status: RoomStatus;
}) {
  const room: RoomLike = {
    id: `demo-room-dev-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    number: params.number,
    floor: params.floor,
    type: params.type,
    status: params.status,
    guests: [],
  };

  getMemoryStore().push(room);
  return room;
}

function findMemoryRoom(roomId: string) {
  return getMemoryStore().find((room) => room.id === roomId) ?? null;
}

function upsertMemoryRoom(roomId: string, updater: (room: RoomLike) => RoomLike) {
  const store = getMemoryStore();
  const index = store.findIndex((room) => room.id === roomId);

  if (index === -1) {
    return null;
  }

  store[index] = updater(store[index]);
  return store[index];
}

function removeMemoryRoom(roomId: string) {
  const store = getMemoryStore();
  const index = store.findIndex((room) => room.id === roomId);

  if (index === -1) {
    return false;
  }

  store.splice(index, 1);
  return true;
}

function parseRoomNumber(value: unknown) {
  const normalized = typeof value === "string" ? value.trim().toUpperCase() : "";
  return normalized.length > 0 ? normalized : null;
}

function parseRoomType(value: unknown) {
  const normalized = typeof value === "string" ? value.trim() : "";
  return normalized.length > 0 ? normalized : null;
}

function parseFloor(value: unknown) {
  const normalized = Number.parseInt(String(value), 10);
  return Number.isInteger(normalized) && normalized >= 0 ? normalized : null;
}

function parseRoomStatus(value: unknown): RoomStatus | null {
  if (typeof value !== "string") return null;

  const normalized = value.trim().toLowerCase();
  return ROOM_STATUSES.has(normalized as RoomStatus)
    ? (normalized as RoomStatus)
    : null;
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    const normalized = error.message.toLowerCase();

    if (
      normalized.includes("unique constraint") ||
      normalized.includes("duplicate") ||
      normalized.includes("unique") ||
      normalized.includes("already exists")
    ) {
      return "Room number already exists.";
    }

    return error.message;
  }

  return fallback;
}

function isDuplicateRoomError(error: unknown) {
  return getErrorMessage(error, "").toLowerCase().includes("already exists");
}

export async function GET(req: NextRequest) {
  const memoryRooms = getMemoryStore();

  try {
    const includeDemo = req.nextUrl.searchParams.get("includeDemo") === "true";
    const dc = getDataConnectInstance();
    const res = await listRooms(dc);
    console.log("[API Rooms GET] Raw Data Connect response:", JSON.stringify(res.data));
    const rooms = (res.data?.rooms || []) as unknown as RoomLike[];
    
    console.log(`[API Rooms GET] Found ${rooms.length} rooms in DB, ${memoryRooms.length} in memory. includeDemo=${includeDemo}`);

    // If we have ANY real data (DB or Memory), we should NOT show the demo seed data
    // unless the user specifically requested ONLY demo data.
    const hasRealData = rooms.length > 0 || memoryRooms.length > 0;
    
    const sourceRooms = mergeRooms(
      (hasRealData || !includeDemo) ? rooms : getDemoSeedData().rooms,
      memoryRooms
    );

    console.log(`[API Rooms GET] Returning ${sourceRooms.length} total rooms.`);

    return NextResponse.json({
      success: true,
      rooms: sourceRooms.map(mapRoomForAdmin),
    });
  } catch (error: any) {
    console.error("Error fetching rooms:", error);

    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch rooms from database.",
        details: error.message || String(error),
        rooms: memoryRooms.map(mapRoomForAdmin) 
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { number, floor, type, status } = await req.json();

    const roomNumber = parseRoomNumber(number);
    const roomFloor = parseFloor(floor);
    const roomType = parseRoomType(type);
    const roomStatus = status ? parseRoomStatus(status) : "vacant";

    if (!roomNumber || roomFloor === null || !roomType || !roomStatus) {
      return NextResponse.json(
        { success: false, error: "number, floor, type, and a valid status are required" },
        { status: 400 }
      );
    }

    if (getMemoryStore().some((room) => room.number === roomNumber)) {
      return NextResponse.json(
        { success: false, error: "Room number already exists." },
        { status: 409 }
      );
    }

    let room: RoomLike;

    try {
      const dc = getDataConnectInstance();
      const res = await createRoom(dc, {
        number: roomNumber,
        floor: roomFloor,
        type: roomType,
        status: roomStatus,
      });

      console.log(`[API Rooms POST] Created room in DB: ${roomNumber}`);

      room = { 
        id: res.data.room_insert.id, 
        number: roomNumber,
        floor: roomFloor,
        type: roomType,
        status: roomStatus,
        guests: [] 
      };
    } catch (error: any) {
      console.warn(`[API Rooms POST] DB creation failed for ${roomNumber}, falling back to memory:`, error);
      
      if (isDuplicateRoomError(error)) {
        return NextResponse.json({ success: false, error: "Room number already exists." }, { status: 409 });
      }

      room = createMemoryRoom({
        number: roomNumber,
        floor: roomFloor,
        type: roomType,
        status: roomStatus,
      });
      
      console.log(`[API Rooms POST] Created room in memory: ${roomNumber}`);
      return NextResponse.json({ success: true, room: mapRoomForAdmin(room), debugError: String(error) }, { status: 201 });
    }

    return NextResponse.json(
      {
        success: true,
        room: mapRoomForAdmin(room),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating room:", error);
    return NextResponse.json(
      { success: false, error: getErrorMessage(error, "Failed to create room.") },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { action, roomId, guestId, status, number, floor, type } = await req.json();

    if (!action || !roomId) {
      return NextResponse.json(
        { success: false, error: "action and roomId are required" },
        { status: 400 }
      );
    }

    if (action === "assignGuest") {
      if (!guestId) {
        return NextResponse.json(
          { success: false, error: "guestId is required for assignment" },
          { status: 400 }
        );
      }

      const memoryRoom = findMemoryRoom(roomId);

      if (memoryRoom) {
        const guest = getDemoSeedData().guests.find((item) => item.id === guestId);

        if (!guest) {
          return NextResponse.json(
            { success: false, error: "Guest not found" },
            { status: 404 }
          );
        }

        const updatedMemoryRoom = upsertMemoryRoom(roomId, (room) => ({
          ...room,
          status: "occupied",
          guests: [
            {
              id: guest.id,
              name: guest.name,
              status: guest.status,
              checkIn: guest.checkIn as any,
              checkOut: guest.checkOut as any,
              createdAt: guest.createdAt as any,
            },
          ],
        }));

        return NextResponse.json({
          success: true,
          room: updatedMemoryRoom ? mapRoomForAdmin(updatedMemoryRoom) : null,
        });
      }

      let updatedRoom;
      try {
        const dc = getDataConnectInstance();
        const roomRes = await getRoomById(dc, { id: roomId });
        const room = roomRes.data.room;

        if (!room) throw new Error("Room not found");
        if (parseRoomStatus(room.status) !== "vacant") throw new Error("Only vacant rooms can receive a guest");

        const guestsRes = await listGuests(dc);
        const guest = guestsRes.data.guests.find((g) => g.id === guestId);

        if (!guest) throw new Error("Guest not found");
        if ((guest.status || '').toLowerCase() === "checked out") throw new Error("Checked-out guests cannot be assigned.");

        if (guest.room?.id && guest.room.id !== roomId) {
          const remainingAssignments = guestsRes.data.guests.filter((g) => g.room?.id === guest.room?.id && g.id !== guest.id).length;

          if (remainingAssignments === 0) {
            await updateRoom(dc, { id: guest.room.id, status: "vacant" });
          }
        }

        await updateGuest(dc, {
          id: guest.id,
          roomId,
          roomNumber: room.number,
          status: "In Room",
        });

        await updateRoom(dc, {
          id: roomId,
          status: "occupied",
        });

        const newRoomRes = await getRoomById(dc, { id: roomId });
        updatedRoom = newRoomRes.data.room;
      } catch (err) {
        console.error("Tx assignGuest failure: ", err);
        throw err;
      }

      return NextResponse.json({
        success: true,
        room: updatedRoom ? mapRoomForAdmin(updatedRoom as any) : null,
      });
    }

    if (action === "updateStatus") {
      const nextStatus = parseRoomStatus(status);

      if (!nextStatus) {
        return NextResponse.json(
          { success: false, error: "A valid status is required for updateStatus" },
          { status: 400 }
        );
      }

      const memoryRoom = findMemoryRoom(roomId);

      if (memoryRoom) {
        if (nextStatus === "occupied" && (!memoryRoom.guests || memoryRoom.guests.length === 0)) {
          return NextResponse.json(
            { success: false, error: "Assign a guest before marking a room occupied." },
            { status: 400 }
          );
        }

        const updatedMemoryRoom = upsertMemoryRoom(roomId, (room) => ({
          ...room,
          status: nextStatus,
          guests: nextStatus === "occupied" ? room.guests ?? [] : [],
        }));

        return NextResponse.json({
          success: true,
          room: updatedMemoryRoom ? mapRoomForAdmin(updatedMemoryRoom) : null,
        });
      }

      let updatedRoom;
      try {
        const dc = getDataConnectInstance();
        const roomRes = await getRoomById(dc, { id: roomId });
        const room = roomRes.data.room;

        if (!room) throw new Error("Room not found");
        
        const guestsRes = await listGuests(dc);
        const currentGuest = guestsRes.data.guests.find((g) => g.room?.id === roomId);

        if (nextStatus === "occupied" && !currentGuest) {
          throw new Error("Assign a guest before marking a room occupied.");
        }

        if (currentGuest && nextStatus !== "occupied") {
          await updateGuest(dc, {
            id: currentGuest.id,
            roomId: null,
            roomNumber: room.number,
            status: "Checked Out"
          });
        }

        await updateRoom(dc, { id: roomId, status: nextStatus });

        const newRoomRes = await getRoomById(dc, { id: roomId });
        updatedRoom = newRoomRes.data.room;
      } catch (err) {
         console.error("Tx updateStatus failure: ", err);
         throw err;
      }

      return NextResponse.json({
        success: true,
        room: updatedRoom ? mapRoomForAdmin(updatedRoom as any) : null,
      });
    }

    if (action === "updateDetails") {
      const roomNumber = parseRoomNumber(number);
      const roomFloor = parseFloor(floor);
      const roomType = parseRoomType(type);

      if (!roomNumber || roomFloor === null || !roomType) {
        return NextResponse.json(
          { success: false, error: "number, floor, and type are required for updateDetails" },
          { status: 400 }
        );
      }

      const duplicateMemoryRoom = getMemoryStore().find(
        (room) => room.id !== roomId && room.number === roomNumber
      );

      if (duplicateMemoryRoom) {
        return NextResponse.json(
          { success: false, error: "Room number already exists." },
          { status: 409 }
        );
      }

      const memoryRoom = findMemoryRoom(roomId);

      if (memoryRoom) {
        const updatedMemoryRoom = upsertMemoryRoom(roomId, (room) => ({
          ...room,
          number: roomNumber,
          floor: roomFloor,
          type: roomType,
        }));

        return NextResponse.json({
          success: true,
          room: updatedMemoryRoom ? mapRoomForAdmin(updatedMemoryRoom) : null,
        });
      }

      let updatedRoom;
      try {
        const dc = getDataConnectInstance();
        const roomRes = await getRoomById(dc, { id: roomId });
        const room = roomRes.data.room;

        if (!room) throw new Error("Room not found");

        const guestsRes = await listGuests(dc);
        const currentGuest = guestsRes.data.guests.find((g) => g.room?.id === roomId);

        await updateRoom(dc, {
          id: roomId,
          number: roomNumber,
          floor: roomFloor,
          type: roomType,
        });

        if (currentGuest) {
          await updateGuest(dc, {
            id: currentGuest.id,
            roomNumber: roomNumber,
          });
        }

        const newRoomRes = await getRoomById(dc, { id: roomId });
        updatedRoom = newRoomRes.data.room;
      } catch (err) {
        console.error("Tx updateDetails failure: ", err);
        throw err;
      }

      return NextResponse.json({
        success: true,
        room: updatedRoom ? mapRoomForAdmin(updatedRoom as any) : null,
      });
    }

    return NextResponse.json(
      { success: false, error: "Unsupported action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error updating room:", error);
    return NextResponse.json(
      { success: false, error: getErrorMessage(error, "Failed to update room state") },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const roomId = req.nextUrl.searchParams.get("roomId");

    if (!roomId) {
      return NextResponse.json(
        { success: false, error: "roomId query parameter is required" },
        { status: 400 }
      );
    }

    if (findMemoryRoom(roomId)) {
      const memoryRoom = findMemoryRoom(roomId);

      if (!memoryRoom) {
        return NextResponse.json(
          { success: false, error: "Room not found" },
          { status: 404 }
        );
      }

      if ((memoryRoom.guests && memoryRoom.guests.length > 0) || parseRoomStatus(memoryRoom.status) === "occupied") {
        return NextResponse.json(
          { success: false, error: "Remove the active guest assignment before deleting this room." },
          { status: 400 }
        );
      }

      removeMemoryRoom(roomId);

      return NextResponse.json({
        success: true,
        roomId,
      });
    }

    try {
      const dc = getDataConnectInstance();
      const res = await getRoomById(dc, { id: roomId });
      const room = res.data.room;

      if (room) {
        const guestsRes = await listGuests(dc);
        const guests = guestsRes.data.guests.filter((g) => g.room?.id === roomId);

        if (guests.length > 0 || parseRoomStatus(room.status) === "occupied") {
          return NextResponse.json(
            { success: false, error: "Remove the active guest assignment before deleting this room." },
            { status: 400 }
          );
        }

        await deleteRoom(dc, { id: roomId });
        console.log(`[API Rooms DELETE] Deleted room from DB: ${roomId}`);
      }
    } catch (error) {
      console.warn(`[API Rooms DELETE] DB operation failed for ${roomId}, checking memory:`, error);
      const index = getMemoryStore().findIndex((r) => r.id === roomId);
      if (index !== -1) {
        getMemoryStore().splice(index, 1);
        console.log(`[API Rooms DELETE] Deleted room from memory: ${roomId}`);
      } else {
        // If it's not in DB and not in memory, it might be a seed room or a genuine failure
        return NextResponse.json(
          { success: false, error: "Failed to delete room. The database might be offline." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      roomId,
    });
  } catch (error) {
    console.error("Error deleting room:", error);
    return NextResponse.json(
      { success: false, error: getErrorMessage(error, "Failed to delete room.") },
      { status: 500 }
    );
  }
}
