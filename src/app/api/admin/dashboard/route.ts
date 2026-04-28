import { NextResponse } from "next/server";
import "@/lib/firebase";
import {
  buildDashboardNotifications,
  GuestLike,
  getDemoSeedData,
  IncidentLike,
  mapGuestForAdmin,
  mapIncidentForAdmin,
  mapPendingGuest,
  mapRoomForAdmin,
  mapStaffForAdmin,
  RoomLike,
  StaffLike,
} from "@/lib/admin-data";
import {
  listIncidents,
  listGuests,
  listStaff,
  listRooms
} from "@/dataconnect-generated";
import { getDataConnectInstance } from "@/lib/firebase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const dc = getDataConnectInstance();
    const [incidentsRes, guestsRes, staffRes, roomsRes] = await Promise.all([
      listIncidents(dc),
      listGuests(dc),
      listStaff(dc),
      listRooms(dc)
    ]);

    const incidents = incidentsRes.data.incidents as unknown as IncidentLike[];
    const guests = guestsRes.data.guests as unknown as GuestLike[];
    const staff = staffRes.data.staffs as unknown as StaffLike[];
    const rooms = roomsRes.data.rooms as unknown as RoomLike[];

    const demo = getDemoSeedData();
    const sourceIncidents = incidents.length > 0 ? incidents : demo.incidents;
    const sourceGuests = guests.length > 0 ? guests : demo.guests;
    const sourceStaff = staff.length > 0 ? staff : demo.staff;
    const sourceRooms = rooms.length > 0 ? rooms : demo.rooms;

    const mappedIncidents = sourceIncidents.map(mapIncidentForAdmin);
    const mappedGuests = sourceGuests.map(mapGuestForAdmin);
    const mappedStaff = sourceStaff.map(mapStaffForAdmin);
    const mappedRooms = sourceRooms.map(mapRoomForAdmin);
    const pendingGuests = sourceGuests
      .filter((guest) => !guest.roomId && guest.status.toLowerCase() !== "checked out")
      .map(mapPendingGuest);
    const activeIncidentCount = sourceIncidents.filter(
      (incident) => incident.status.toLowerCase() !== "resolved"
    ).length;
    const vacantRoomCount = sourceRooms.filter((room) => room.status === "vacant").length;
    const occupiedRoomCount = sourceRooms.filter((room) => room.status === "occupied").length;

    return NextResponse.json({
      success: true,
      data: {
        incidents: mappedIncidents,
        guests: mappedGuests,
        pendingGuests,
        staff: mappedStaff,
        rooms: mappedRooms,
        summary: {
          totalGuests: sourceGuests.length,
          activeStaff: sourceStaff.filter(
            (member) => member.status.toLowerCase() !== "inactive"
          ).length,
          roomsAvailable: vacantRoomCount,
          systemAlerts: activeIncidentCount,
          totalRooms: sourceRooms.length,
          occupiedRooms: occupiedRoomCount,
          occupancyRate:
            sourceRooms.length > 0
              ? Math.round((occupiedRoomCount / sourceRooms.length) * 100)
              : 0,
        },
        notifications: buildDashboardNotifications({
          incidents: sourceIncidents,
          guests: sourceGuests,
          rooms: sourceRooms,
          staff: sourceStaff,
        }),
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
