import { NextRequest, NextResponse } from "next/server";
import "@/lib/firebase";
import { GuestLike, IncidentLike, RoomLike, StaffLike } from "@/lib/admin-data";
import {
  buildAdminHeaderNotifications,
  buildGuestHeaderNotifications,
  buildPendingProfileNotification,
  buildStaffHeaderNotifications,
} from "@/lib/header-notifications";
import {
  getUserLogin,
  getGuestByUid,
  getGuestByEmail,
  getStaffByUid,
  getStaffByEmail,
  listActiveIncidents,
  listGuests,
  listStaff,
  listRooms
} from "@/dataconnect-generated";
import { getDataConnectInstance } from "@/lib/firebase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type SupportedRole = "admin" | "staff" | "guest";

function normalizeRole(value: string | null): SupportedRole {
  if (value === "admin" || value === "staff") return value;
  return "guest";
}

async function getLinkedProfiles(firebaseUid: string) {
  const dc = getDataConnectInstance();
  const loginRes = await getUserLogin(dc, { firebaseUid });
  const userLogin = loginRes.data.userLogin;

  if (!userLogin) {
    return { userLogin: null, guest: null, staff: null };
  }

  let guest = null;
  let staff = null;

  let guestUidRes = await getGuestByUid(dc, { uid: firebaseUid });
  if (guestUidRes.data.guests.length > 0) guest = guestUidRes.data.guests[0];
  if (!guest && userLogin.email) {
    let guestEmailRes = await getGuestByEmail(dc, { email: userLogin.email });
    if (guestEmailRes.data.guests.length > 0) guest = guestEmailRes.data.guests[0];
  }

  let staffUidRes = await getStaffByUid(dc, { uid: firebaseUid });
  if (staffUidRes.data.staffs.length > 0) staff = staffUidRes.data.staffs[0];
  if (!staff && userLogin.email) {
    let staffEmailRes = await getStaffByEmail(dc, { email: userLogin.email });
    if (staffEmailRes.data.staffs.length > 0) staff = staffEmailRes.data.staffs[0];
  }

  return {
    userLogin,
    guest,
    staff,
  };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const role = normalizeRole(searchParams.get("role"));
    const uid = searchParams.get("uid");

    if (role === "admin") {
      const dc = getDataConnectInstance();
      const [rawIncidents, rawGuests, rawStaff, rawRooms] = await Promise.all([
        listActiveIncidents(dc),
        listGuests(dc),
        listStaff(dc),
        listRooms(dc),
      ]);

      return NextResponse.json({
        success: true,
        notifications: buildAdminHeaderNotifications({
          incidents: rawIncidents.data.incidents as any[],
          guests: rawGuests.data.guests as any[],
          staff: rawStaff.data.staffs as any[],
          rooms: rawRooms.data.rooms as any[],
        }),
      });
    }

    if (!uid) {
      return NextResponse.json(
        { success: false, error: "uid is required for guest and staff notifications" },
        { status: 400 }
      );
    }

    const { userLogin, guest, staff } = await getLinkedProfiles(uid);

    if (!userLogin) {
      return NextResponse.json(
        { success: false, error: "User login not found" },
        { status: 404 }
      );
    }

    const dc = getDataConnectInstance();
    const incidentsRes = await listActiveIncidents(dc);
    const incidents = incidentsRes.data.incidents as any[];

    if (role === "staff") {
      if (!staff) {
        return NextResponse.json({
          success: true,
          notifications: buildPendingProfileNotification({
            id: userLogin.firebaseUid,
            role: "staff",
            email: userLogin.email || "unknown@system.local",
            displayName: userLogin.displayName || "Staff Pending",
            createdAt: (userLogin as any).createdAt || new Date().toISOString(),
          }),
        });
      }

      // Count logic via array filter locally
      let activeDepartmentCount = 0;
      if (staff.department) {
        const staffRes = await listStaff(dc);
        activeDepartmentCount = staffRes.data.staffs.filter((s) => s.department === staff.department && (s.status || '').toLowerCase() !== "inactive").length;
      }

      return NextResponse.json({
        success: true,
        notifications: buildStaffHeaderNotifications({
          staff: staff as any,
          activeDepartmentCount,
          incidents,
        }),
      });
    }

    if (!guest) {
      return NextResponse.json({
        success: true,
        notifications: buildPendingProfileNotification({
          id: userLogin.firebaseUid,
          role: "guest",
          email: userLogin.email || "unknown@system.local",
          displayName: userLogin.displayName || "Guest Pending",
          createdAt: (userLogin as any).createdAt || new Date().toISOString(),
        }),
      });
    }

    return NextResponse.json({
      success: true,
      notifications: buildGuestHeaderNotifications({
        guest: guest as any,
        incidents,
      }),
    });
  } catch (error) {
    console.error("Failed to load header notifications:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load notifications" },
      { status: 500 }
    );
  }
}
