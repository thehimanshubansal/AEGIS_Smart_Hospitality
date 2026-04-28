export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import "@/lib/firebase";
import {
  upsertUserLogin,
  getGuestByUid,
  getGuestByEmail,
  createGuest,
  updateGuest,
  getStaffByUid,
  getStaffByEmail,
  createStaff,
  updateStaff,
  getUserLogin
} from "@/dataconnect-generated";

interface SaveUserRequest {
  uid: string;
  name: string;
  email: string;
  role?: "guest" | "staff" | "admin";
}

function generateFallbackName(email: string | null): string {
  if (!email) return "Guest";
  return email.split("@")[0].split(/[._-]/).map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()).join(" ");
}

function generateRoomNumber(): string {
  return `G${Math.floor(Math.random() * 900) + 100}`;
}

export async function POST(req: NextRequest) {
  try {
    const { uid, name, email, role = "guest" }: SaveUserRequest = await req.json();

    if (!uid || !email) {
      return NextResponse.json({ success: false, error: "uid and email are required" }, { status: 400 });
    }

    const normalizedRole = role === "staff" || role === "admin" ? role : "guest";
    const finalName = name?.trim() || generateFallbackName(email);

    // Prevent role regression: if the user already has a non-guest role, keep it
    let finalRole = normalizedRole;
    const existingLoginRes = await getUserLogin({ firebaseUid: uid });
    const existingLogin = existingLoginRes.data.userLogin;
    if (existingLogin && existingLogin.role !== "guest" && normalizedRole === "guest") {
      finalRole = existingLogin.role as "staff" | "admin";
    }

    // 1. SAVE TO UserLogin TABLE (Centralized Login Tracking)
    await upsertUserLogin({
      firebaseUid: uid,
      email: email,
      displayName: finalName,
      role: finalRole
    });

    // 2. SAVE TO ROLE-SPECIFIC TABLES
    if (finalRole === "guest") {
      let existingGuest = null;
      let uidRes = await getGuestByUid({ uid });
      if (uidRes.data.guests.length > 0) existingGuest = uidRes.data.guests[0];
      
      if (!existingGuest) {
        let emailRes = await getGuestByEmail({ email });
        if (emailRes.data.guests.length > 0) existingGuest = emailRes.data.guests[0];
      }

      if (existingGuest) {
        await updateGuest({
          id: existingGuest.id,
          firebaseUid: uid,
          email,
          name: existingGuest.name || finalName,
        });
        return NextResponse.json({ success: true, user: { ...existingGuest, role: "guest" } });
      }

      // CheckOut date needs to be converted to ISO string since it's Timestamp
      const checkOutDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      const newGuestRes = await createGuest({
        firebaseUid: uid,
        email,
        name: finalName,
        roomNumber: generateRoomNumber(),
        status: "active",
        checkOut: checkOutDate,
      });
      return NextResponse.json({ success: true, user: { id: newGuestRes.data.guest_insert.id, role: "guest" } });
    }

    // Handle Staff & Admin
    if (finalRole === "staff" || finalRole === "admin") {
      let existingStaff = null;
      let uidRes = await getStaffByUid({ uid });
      if (uidRes.data.staffs.length > 0) existingStaff = uidRes.data.staffs[0];
      
      if (!existingStaff) {
        let emailRes = await getStaffByEmail({ email });
        if (emailRes.data.staffs.length > 0) existingStaff = emailRes.data.staffs[0];
      }

      if (existingStaff) {
        await updateStaff({
          id: existingStaff.id,
          firebaseUid: uid,
          email,
          name: existingStaff.name || finalName,
          role: existingStaff.role || finalRole,
        });
        return NextResponse.json({ success: true, user: { ...existingStaff, role: finalRole } });
      }

      const newStaffRes = await createStaff({
        firebaseUid: uid, 
        email, 
        name: finalName, 
        role: finalRole, 
        status: "active"
      });
      return NextResponse.json({ success: true, user: { id: newStaffRes.data.staff_insert.id, role: finalRole } });
    }

    return NextResponse.json({ success: false, error: "Invalid role" }, { status: 400 });
  } catch (error) {
    console.error("Error saving user:", error);
    return NextResponse.json({ success: false, error: "Failed to save user data" }, { status: 500 });
  }
}

// NEW GET HANDLER TO FIX 405 ERROR
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const firebaseUid = searchParams.get('uid');

    if (!firebaseUid) {
      return NextResponse.json({ success: false, error: 'uid query parameter is required' }, { status: 400 });
    }

    // Find the central user login record first
    const loginRes = await getUserLogin({ firebaseUid });
    const userLogin = loginRes.data.userLogin;

    if (!userLogin) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    let userProfile = null;
    if (userLogin.role === 'guest') {
      let guestRes = await getGuestByUid({ uid: firebaseUid });
      if (guestRes.data.guests.length > 0) userProfile = guestRes.data.guests[0];
    } else if (userLogin.role === 'staff' || userLogin.role === 'admin') {
      let staffRes = await getStaffByUid({ uid: firebaseUid });
      if (staffRes.data.staffs.length > 0) userProfile = staffRes.data.staffs[0];
    }

    return NextResponse.json({ success: true, user: { ...userLogin, ...userProfile } });

  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch user data" }, { status: 500 });
  }
}
