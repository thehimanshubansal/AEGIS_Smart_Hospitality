import { NextRequest, NextResponse } from "next/server";
import "@/lib/firebase";
import {
  getUserLogin,
  getGuestByEmail,
  getGuestByUid,
  getStaffByEmail,
  getStaffByUid,
  updateGuestPassword,
  updateStaffPassword,
} from "@/dataconnect-generated";

export const dynamic = "force-dynamic";

type SupportedRole = "guest" | "staff";

async function findUserWithProfile(firebaseUid: string) {
  const userLoginRes = await getUserLogin({ firebaseUid });
  const userLoginUser = userLoginRes.data.userLogin;

  if (!userLoginUser) {
    return { userLogin: null, guest: null, staff: null };
  }

  let guest = null;
  let staff = null;

  const guestRes1 = await getGuestByUid({ uid: firebaseUid });
  if (guestRes1.data.guests.length > 0) guest = guestRes1.data.guests[0];
  
  if (!guest && userLoginUser.email) {
    const guestRes2 = await getGuestByEmail({ email: userLoginUser.email });
    if (guestRes2.data.guests.length > 0) guest = guestRes2.data.guests[0];
  }

  const staffRes1 = await getStaffByUid({ uid: firebaseUid });
  if (staffRes1.data.staffs.length > 0) staff = staffRes1.data.staffs[0];

  if (!staff && userLoginUser.email) {
    const staffRes2 = await getStaffByEmail({ email: userLoginUser.email });
    if (staffRes2.data.staffs.length > 0) staff = staffRes2.data.staffs[0];
  }

  return { userLogin: userLoginUser, guest, staff };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const firebaseUid = searchParams.get("uid");

    if (!firebaseUid) {
      return NextResponse.json(
        { success: false, error: "uid is required" },
        { status: 400 }
      );
    }

    const { userLogin, guest, staff } = await findUserWithProfile(firebaseUid);

    if (!userLogin) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const role =
      userLogin.role === "staff"
        ? "staff"
        : userLogin.role === "guest"
          ? "guest"
          : null;
    const profile = role === "staff" ? staff : role === "guest" ? guest : null;

    return NextResponse.json({
      success: true,
      role,
      requiresPasswordReset: Boolean((profile as any)?.loginPassword),
    });
  } catch (error) {
    console.error("Error checking password reset status:", error);
    return NextResponse.json(
      { success: false, error: "Failed to check password reset status" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { uid, role } = (await req.json()) as {
      uid?: string;
      role?: SupportedRole;
    };

    if (!uid || (role !== "guest" && role !== "staff")) {
      return NextResponse.json(
        { success: false, error: "uid and valid role are required" },
        { status: 400 }
      );
    }

    const { userLogin, guest, staff } = await findUserWithProfile(uid);
    if (!userLogin) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    if (role === "guest" && guest) {
      await updateGuestPassword({ id: guest.id, loginPassword: null });
    }

    if (role === "staff" && staff) {
      await updateStaffPassword({ id: staff.id, loginPassword: null });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error completing password reset:", error);
    return NextResponse.json(
      { success: false, error: "Failed to complete password reset" },
      { status: 500 }
    );
  }
}
