import { NextResponse } from "next/server";
import "@/lib/firebase";
import { getDataConnectInstance } from "@/lib/firebase";
import { getDemoSeedData, mapGuestForAdmin } from "@/lib/admin-data";
import { listGuests, deleteGuest, updateRoom, getGuestById } from "@/dataconnect-generated";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export async function GET() {
  try {
    const dc = getDataConnectInstance();
    const res = await listGuests(dc);
    const guests = res.data.guests;
    const sourceGuests = guests.length > 0 ? guests : getDemoSeedData().guests;

    return NextResponse.json({
      success: true,
      guests: sourceGuests.map((g) => ({
        ...mapGuestForAdmin(g as any),
        idNumber: (g as { idNumber?: string | null }).idNumber ?? null,
        contact: (g as { contact?: string | null }).contact ?? null,
        address: (g as { address?: string | null }).address ?? null,
        loginEmail: (g as { loginEmail?: string | null }).loginEmail ?? null,
        loginPassword: (g as { loginPassword?: string | null }).loginPassword ?? null,
        qrPayload: (g as { qrPayload?: string | null }).qrPayload ?? null,
        roomId: (g as { room?: { id?: string } | null }).room?.id ?? null,
      })),
    });
  } catch (error) {
    console.error("Error fetching guests:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch guests" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Guest ID is required" }, { status: 400 });
    }

    // 1. Get the guest to find their roomId
    const guestRes = await getGuestById({ id });
    const guest = guestRes.data.guest;

    if (guest && guest.room?.id) {
      // 2. Set the room back to vacant
      await updateRoom({
        id: guest.room.id,
        status: 'vacant'
      });
    }

    // 3. Delete the guest
    await deleteGuest({ id });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting guest:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete guest" },
      { status: 500 }
    );
  }
}
