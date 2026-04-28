import { NextRequest, NextResponse } from 'next/server';
import '@/lib/firebase';
import {
  getUserLogin,
  getGuestByUid,
  getGuestByEmail,
  getStaffByUid,
  getStaffByEmail,
  upsertUserLogin,
  createGuest,
  updateGuest,
  createStaff,
  updateStaff,
} from '@/dataconnect-generated';
import { getDataConnectInstance } from '@/lib/firebase';

export const dynamic = 'force-dynamic';

type UserRole = 'admin' | 'staff' | 'guest';

const getFallbackName = (displayName?: string | null, email?: string | null) =>
  displayName?.trim() || email?.split('@')[0] || 'User';

async function findProfiles(firebaseUid: string, email?: string | null) {
  let guest = null;
  let staff = null;
  const dc = getDataConnectInstance();

  if (firebaseUid) {
    const guestRes = await getGuestByUid(dc, { uid: firebaseUid });
    if (guestRes.data.guests.length > 0) guest = guestRes.data.guests[0];

    const staffRes = await getStaffByUid(dc, { uid: firebaseUid });
    if (staffRes.data.staffs.length > 0) staff = staffRes.data.staffs[0];
  }

  if (!guest && email) {
    const guestRes = await getGuestByEmail(dc, { email });
    if (guestRes.data.guests.length > 0) guest = guestRes.data.guests[0];
  }

  if (!staff && email) {
    const staffRes = await getStaffByEmail(dc, { email });
    if (staffRes.data.staffs.length > 0) staff = staffRes.data.staffs[0];
  }

  return { guest, staff };
}

function buildUserResponse(params: {
  userLogin: any;
  guest: any | null;
  staff: any | null;
}) {
  const { userLogin, guest, staff } = params;
  const derivedName =
    guest?.name ??
    staff?.name ??
    userLogin.displayName ??
    userLogin.email.split('@')[0];

  return {
    id: guest?.id ?? staff?.id ?? userLogin.firebaseUid,
    loginId: userLogin.firebaseUid,
    profileId: guest?.id ?? staff?.id ?? userLogin.firebaseUid,
    firebaseUid: userLogin.firebaseUid,
    email: userLogin.email,
    displayName: userLogin.displayName,
    role: userLogin.role,
    name: derivedName,
    roomNumber: guest?.roomNumber ?? null,
    checkOut: guest?.checkOut instanceof Date ? guest.checkOut.toISOString() : guest?.checkOut ?? null,
    guestCreatedAt: guest?.createdAt instanceof Date ? guest.createdAt.toISOString() : guest?.createdAt ?? null,
    department: staff?.department ?? null,
    status: guest?.status ?? staff?.status ?? null,
    staffRole: staff?.role ?? null,
    employeeId: staff?.employeeId ?? null,
    phone: staff?.phone ?? null,
    emergencyContact: staff?.emergencyContact ?? null,
    bloodGroup: staff?.bloodGroup ?? null,
    joiningDate: staff?.joiningDate instanceof Date ? staff.joiningDate.toISOString() : staff?.joiningDate ?? null,
    validTill: staff?.validTill instanceof Date ? staff.validTill.toISOString() : staff?.validTill ?? null,
    photoUrl: staff?.photoUrl ?? null,
    profileType: guest ? 'guest' : staff ? 'staff' : 'login',
    lastLogin: (userLogin as any).lastLogin instanceof Date ? (userLogin as any).lastLogin.toISOString() : (userLogin as any).lastLogin ?? new Date().toISOString(),
    createdAt: (userLogin as any).createdAt instanceof Date ? (userLogin as any).createdAt.toISOString() : (userLogin as any).createdAt ?? new Date().toISOString(),
  };
}

export async function POST(req: NextRequest) {
  try {
    const { firebaseUid, email, displayName, role } = (await req.json()) as {
      firebaseUid?: string;
      email?: string;
      displayName?: string | null;
      role?: UserRole;
    };

    if (!firebaseUid || !email) {
      return NextResponse.json(
        { success: false, error: 'firebaseUid and email are required' },
        { status: 400 }
      );
    }

    const normalizedRole: UserRole = role === 'admin' || role === 'staff' ? role : 'guest';
    const fallbackName = getFallbackName(displayName, email);

    const dc = getDataConnectInstance();
    
    // Check for existing user login to prevent role regression (e.g. admin -> guest)
    const existingLoginRes = await getUserLogin(dc, { firebaseUid });
    const existingLogin = existingLoginRes.data.userLogin;
    
    let finalRole = normalizedRole;
    if (existingLogin && existingLogin.role !== 'guest' && normalizedRole === 'guest') {
      console.log(`[AuthSync] Preserving existing role '${existingLogin.role}' for ${firebaseUid} (preventing regression to guest)`);
      finalRole = existingLogin.role as UserRole;
    }

    console.log(`[AuthSync] Upserting user login for ${firebaseUid} (${email}) with role: ${finalRole}`);
    const upsertRes = await upsertUserLogin(dc, {
      firebaseUid,
      email,
      displayName: displayName ?? null,
      role: finalRole,
    });
    console.log(`[AuthSync] Upsert result:`, upsertRes);
    
    console.log(`[AuthSync] Fetching user login after upsert for ${firebaseUid}`);
    let userLogin = null;
    for (let i = 0; i < 3; i++) {
      const userLoginRes = await getUserLogin(dc, { firebaseUid });
      userLogin = userLoginRes.data.userLogin;
      if (userLogin) break;
      console.log(`[AuthSync] UserLogin not found, retrying in 500ms... (attempt ${i + 1}/3)`);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    if (!userLogin) {
      console.error(`[AuthSync] UserLogin record NOT FOUND after upsert for ${firebaseUid}`);
      // Log more info to help debugging
      console.log(`[AuthSync] Final upsertRes was:`, upsertRes);
      return NextResponse.json({ 
        success: false, 
        error: 'Sync verification failed',
        debug: { firebaseUid, upserted: true }
      }, { status: 500 });
    }

    let guestProfile = null;
    let staffProfile = null;

    if (normalizedRole === 'guest') {
      const { guest: existingGuest } = await findProfiles(firebaseUid, email);

      if (existingGuest) {
        await updateGuest(dc, {
          id: existingGuest.id,
          firebaseUid,
          email,
          name: existingGuest.name || fallbackName,
        });
        
        guestProfile = { ...existingGuest, firebaseUid, email, name: existingGuest.name || fallbackName };
      } else {
        // Create new guest profile for new registrations
        const res = await createGuest(dc, {
          firebaseUid,
          email,
          name: fallbackName,
          roomNumber: `G${Math.floor(Math.random() * 900) + 100}`, // Generate random room
          status: 'active',
          checkOut: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() as any, // 7 days from now
        });
        guestProfile = {
          id: res.data.guest_insert.id,
          firebaseUid,
          email,
          name: fallbackName,
          roomNumber: `G${Math.floor(Math.random() * 900) + 100}`,
          status: 'active',
          checkOut: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString()
        };
      }
    }

    if (normalizedRole === 'staff') {
      const { staff: existingStaff } = await findProfiles(firebaseUid, email);

      if (existingStaff) {
        await updateStaff(dc, {
          id: existingStaff.id,
          firebaseUid,
          email,
          name: existingStaff.name || fallbackName,
        });
        staffProfile = { ...existingStaff, firebaseUid, email, name: existingStaff.name || fallbackName };
      } else {
        const res = await createStaff(dc, {
          firebaseUid,
          email,
          name: fallbackName,
          role: "Staff",
          status: "Active"
        });
        staffProfile = {
          id: res.data.staff_insert.id,
          firebaseUid,
          email,
          name: fallbackName,
          role: "Staff",
          status: "Active",
          createdAt: new Date().toISOString()
        };
      }
    }

    const resolvedProfiles =
      guestProfile || staffProfile
        ? { guest: guestProfile, staff: staffProfile }
        : await findProfiles(firebaseUid, email);

    return NextResponse.json({
      success: true,
      user: buildUserResponse({
        userLogin,
        guest: resolvedProfiles.guest,
        staff: resolvedProfiles.staff,
      }),
    });
  } catch (error) {
    console.error('Error syncing user to DB:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to sync user data' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const firebaseUid = searchParams.get('uid');

    if (!firebaseUid) {
      return NextResponse.json({ success: false, error: 'uid required' }, { status: 400 });
    }

    const dc = getDataConnectInstance();
    const userLoginRes = await getUserLogin(dc, { firebaseUid });
    const userLogin = userLoginRes.data.userLogin;

    if (!userLogin) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const { guest, staff } = await findProfiles(firebaseUid, userLogin.email);

    return NextResponse.json({
      success: true,
      user: buildUserResponse({ userLogin, guest, staff }),
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch user' }, { status: 500 });
  }
}
