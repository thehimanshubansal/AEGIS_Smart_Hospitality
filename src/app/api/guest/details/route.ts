import { NextRequest, NextResponse } from "next/server";
import "@/lib/firebase";
import { getGuestById, getGuestByUid, getRoomById, updateGuest } from "@/dataconnect-generated";
import { randomBytes } from "crypto";
import { getDemoGuestById } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "id is required" },
        { status: 400 }
      );
    }

    let guestRes;
    try {
      guestRes = await getGuestById({ id });
    } catch (e) {
      // Catch empty or invalid id
      guestRes = { data: { guest: null } };
    }
    
    let guest = guestRes.data.guest;

    // If not found by UUID, try lookup by Firebase UID
    if (!guest) {
      try {
        const uidRes = await getGuestByUid({ uid: id });
        if (uidRes.data.guests && uidRes.data.guests.length > 0) {
          guest = uidRes.data.guests[0] as any;
        }
      } catch (e) {
        console.warn("[API Guest Details] Firebase UID lookup failed:", e);
      }
    }

    if (!guest) {
      const demoGuest = getDemoGuestById(id);

      if (!demoGuest) {
        return NextResponse.json(
          { success: false, error: "Guest not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        guest: {
          id: demoGuest.id,
          name: demoGuest.name,
          room: demoGuest.roomNumber ?? "",
          email: demoGuest.email ?? "",
          loginToken: demoGuest.loginToken ?? "",
          loginEmail: demoGuest.email ?? "",
          loginPassword: "",
          idNumber: null,
          contact: null,
          address: null,
          qrPayload: "",
        },
      });
    }

    const loginToken =
      guest.loginToken ??
      randomBytes(32).toString("hex");

    if (!guest.loginToken) {
      await updateGuest({
        id: guest.id,
        loginToken,
      });
    }

    let roomStatus = null;
    if (guest.roomId) {
      const roomRes = await getRoomById({ id: guest.roomId });
      if (roomRes.data.room) {
        roomStatus = roomRes.data.room.status;
      }
    }

    return NextResponse.json({
      success: true,
      guest: {
        id: guest.id,
        name: guest.name,
        room: guest.roomNumber ?? "",
        email: guest.email ?? guest.loginEmail ?? "",
        loginToken,
        loginEmail: guest.loginEmail ?? guest.email ?? "",
        loginPassword: guest.loginPassword ?? "",
        idNumber: guest.idNumber ?? null,
        contact: guest.contact ?? null,
        address: guest.address ?? null,
        qrPayload: guest.qrPayload ?? "",
        roomStatus,
      },
    });
  } catch (error) {
    console.error("Error fetching guest details:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch guest details" },
      { status: 500 }
    );
  }
}
