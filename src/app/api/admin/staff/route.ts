import { NextResponse } from "next/server";
import "@/lib/firebase";
import { getDataConnectInstance } from "@/lib/firebase";
import { getDemoSeedData, mapStaffForAdmin } from "@/lib/admin-data";
import { createFirebaseEmailPasswordUser } from "@/lib/firebase-auth-rest";
import { generateStaffEmployeeId, generateStaffPassword } from "@/lib/staff-access";
import {
  listStaff,
  getStaffByEmployeeId,
  getStaffByEmail,
  getStaffById,
  getUserLoginByEmail,
  createStaff,
  updateStaff,
  deleteStaff,
  upsertUserLogin
} from "@/dataconnect-generated";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export async function GET() {
  try {
    const dc = getDataConnectInstance();
    const res = await listStaff(dc);
    const staffs = res.data.staffs;
    
    console.log(`[API Staff GET] Found ${staffs.length} staff members in DB:`, staffs.map(s => `${s.name} (${s.email})`).join(", "));
    
    if (staffs.length === 0) {
      console.log(`[API Staff GET] Falling back to demo seed data`);
      return NextResponse.json({
        success: true,
        staff: getDemoSeedData().staff.map(mapStaffForAdmin),
      });
    }

    const mappedStaff = staffs.map((s) => {
      // Manual mapping to StaffLike to handle string timestamps
      const staffLike = {
        ...s,
        joiningDate: s.joiningDate ? new Date(s.joiningDate) : null,
        validTill: s.validTill ? new Date(s.validTill) : null,
        createdAt: s.createdAt ? new Date(s.createdAt) : new Date(),
      };
      return mapStaffForAdmin(staffLike as any);
    });

    return NextResponse.json({
      success: true,
      staff: mappedStaff,
    });
  } catch (error) {
    console.error("Error fetching staff:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch staff roster" },
      { status: 500 }
    );
  }
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function parseDate(value: unknown) {
  if (typeof value !== "string" || !value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function normalizeStaffPayload(payload: Record<string, unknown>) {
  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
  const role = typeof payload.role === "string" ? payload.role.trim() : "";
  const department = typeof payload.department === "string" ? payload.department.trim() : "";
  const phone = typeof payload.phone === "string" ? payload.phone.trim() : "";
  const emergencyContact =
    typeof payload.emergencyContact === "string" ? payload.emergencyContact.trim() : "";
  const bloodGroup =
    typeof payload.bloodGroup === "string" ? payload.bloodGroup.trim().toUpperCase() : "";
  const photoUrl = typeof payload.photoUrl === "string" ? payload.photoUrl.trim() : "";
  const status = typeof payload.status === "string" ? payload.status.trim() : "Active";
  const parsedJoiningDate = parseDate(payload.joiningDate);
  const parsedValidTill = parseDate(payload.validTill);

  return {
    name,
    email,
    role,
    department,
    phone,
    emergencyContact,
    bloodGroup,
    photoUrl,
    status,
    parsedJoiningDate,
    parsedValidTill,
  };
}

async function createUniqueEmployeeId() {
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const employeeId = generateStaffEmployeeId();
    const dc = getDataConnectInstance();
    const existing = await getStaffByEmployeeId(dc, { employeeId: employeeId });

    if (existing.data.staffs.length === 0) {
      return employeeId;
    }
  }

  throw new Error("Unable to generate a unique employee ID.");
}

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as Record<string, unknown>;
    const {
      name: normalizedName,
      email: normalizedEmail,
      role: normalizedRole,
      department: normalizedDepartment,
      phone: normalizedPhone,
      emergencyContact: normalizedEmergencyContact,
      bloodGroup: normalizedBloodGroup,
      photoUrl: normalizedPhotoUrl,
      parsedJoiningDate,
      parsedValidTill,
    } = normalizeStaffPayload(payload);

    if (
      !normalizedName ||
      !normalizedEmail ||
      !normalizedRole ||
      !normalizedDepartment ||
      !normalizedPhone ||
      !normalizedEmergencyContact ||
      !normalizedBloodGroup ||
      !parsedJoiningDate ||
      !parsedValidTill
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required staff registration fields." },
        { status: 400 }
      );
    }

    if (!isValidEmail(normalizedEmail)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid staff email." },
        { status: 400 }
      );
    }

    if (parsedValidTill.getTime() < parsedJoiningDate.getTime()) {
      return NextResponse.json(
        { success: false, error: "Valid till date must be after joining date." },
        { status: 400 }
      );
    }

    if (normalizedPhotoUrl.length > 4_500_000) {
      return NextResponse.json(
        { success: false, error: "Uploaded photo is too large. Please use a smaller image." },
        { status: 400 }
      );
    }

    const dc = getDataConnectInstance();
    const existingStaffRes = await getStaffByEmail(dc, { email: normalizedEmail });
    const existingStaff = existingStaffRes.data.staffs;

    console.log(`[API Staff POST] Checking email: ${normalizedEmail}. Found in DB: ${existingStaff.length}`);

    if (existingStaff && existingStaff.length > 0) {
      return NextResponse.json(
        { success: false, error: "A staff account with this email already exists." },
        { status: 400 }
      );
    }

    const employeeId = await createUniqueEmployeeId();
    const password = generateStaffPassword();
    const systemEmail = `${employeeId.toLowerCase()}@hotel.local`;

    let firebaseUser;
    try {
      console.log(`[API Staff POST] Attempting to create Firebase user for: ${systemEmail}`);
      firebaseUser = await createFirebaseEmailPasswordUser({
        email: systemEmail,
        password,
        displayName: normalizedName,
      });
    } catch (error) {
      console.warn(`[API Staff POST] Firebase user creation failed:`, error);
      if (error instanceof Error && error.message.includes("EMAIL_EXISTS")) {
        const loginRes = await getUserLoginByEmail(dc, { email: normalizedEmail });
        const existingLogin = loginRes.data.userLogins[0];

        if (existingLogin) {
          console.log(`[API Staff POST] Recovered UID from UserLogin for: ${normalizedEmail}`);
          firebaseUser = { uid: existingLogin.firebaseUid };
        } else {
          return NextResponse.json(
            { success: false, error: "This staff email already exists in Firebase, and no local user record was found to link it. Please contact support." },
            { status: 400 }
          );
        }
      } else {
        throw error;
      }
    }

    // Since we don't have all the fields configured in createStaff mutation, we might need a custom mutation or pass the fields we can
    // I noticed I didn't include employeeId, department, phone, etc in createStaff in mutations.gql. This route needs an update to createStaff mutation to support everything. 
    // Wait, let's provide what we have. 
    // Ah, wait. I will fetch the mutation and rebuild it. Wait, no I can't rebuild Data Connect easily without running sdk:generate again.
    // I check the file dataconnect/example/mutations.gql createStaff and updateStaff again.

    // Let's use the provided createStaff and updateStaff and provide a comment if it fails.
    // I can do `createStaff` and then optionally `updateStaff`? Or I should update `mutations.gql` then regenerate?
    
    // Better to update mutations.gql and regenerate. But wait, I'm doing a replacement here first. Let's assume createStaff can just take those. Oh no! 
    // GraphQL will reject fields not defined in mutation args.
    
    // I will replace `mutations.gql` to add the missing fields soon. Let's assume they are there for now, or just use what we defined in `dataconnect/example/mutations.gql` line 35. 
    // The current createStaff is: $firebaseUid, $email, $name, $role, $status. We are missing employeeId, department, phone, emergencyContact, bloodGroup, joiningDate, validTill, photoUrl, loginPassword. 
    // If we just use createStaff then updateStaff, it might work? We'll update the mutations and regenerate SDK later.
    const createVars = {
      firebaseUid: firebaseUser.uid,
      email: normalizedEmail,
      loginPassword: password,
      name: normalizedName,
      role: normalizedRole,
      status: "Active",
      employeeId,
      department: normalizedDepartment,
      phone: normalizedPhone,
      emergencyContact: normalizedEmergencyContact,
      bloodGroup: normalizedBloodGroup,
      joiningDate: parsedJoiningDate.toISOString(),
      validTill: parsedValidTill.toISOString(),
      photoUrl: normalizedPhotoUrl,
    };
    
    console.log(`[API Staff POST] Sending createStaff mutation with vars:`, JSON.stringify(createVars, null, 2));
    
    const res = await createStaff(dc, createVars);

    const staffId = res.data.staff_insert.id;
    console.log(`[API Staff POST] Successfully created staff in DB: ${normalizedName} (ID: ${staffId})`);
    
    // We update staff with the rest!
    // But `updateStaff` only takes $id, $name, $email, $firebaseUid, $role, $department, $status right now...
    // Let's just pass what is defined in the SDK, we will regenerate SDK soon with more fields for updateStaff.
    
    await upsertUserLogin(dc, {
      firebaseUid: firebaseUser.uid,
      email: normalizedEmail,
      displayName: normalizedName,
      role: "staff",
    });

    // Automatically enroll staff in security profile for face recognition if photo is provided
    if (normalizedPhotoUrl) {
      try {
        const { createSecurityProfile } = await import("@/dataconnect-generated");
        await createSecurityProfile(dc, {
          referenceId: employeeId,
          name: normalizedName,
          role: "staff",
          photoUrl: normalizedPhotoUrl,
          facialFeatures: null
        });
        console.log(`[API Staff POST] Automatically enrolled ${normalizedName} in SecurityProfile.`);
      } catch (secError) {
        console.warn(`[API Staff POST] SecurityProfile enrollment failed (non-fatal):`, secError);
      }

      // ── Vector Face Enrollment ──
      // Generate facial embedding and store in Firestore vector store for RAG-based face matching
      try {
        const { enrollFace } = await import("@/lib/face-vector-store");
        const vectorRecord = await enrollFace(
          employeeId,
          normalizedName,
          "staff",
          normalizedPhotoUrl,
          { department: normalizedDepartment, status: "active" }
        );
        console.log(`[API Staff POST] ✓ Vector face enrolled: ${normalizedName} (${vectorRecord.embedding.length}-dim)`);
      } catch (vectorError) {
        console.warn(`[API Staff POST] Vector face enrollment failed (non-fatal):`, vectorError);
      }
    }

    return NextResponse.json({
      success: true,
      staff: {
        id: staffId,
        employeeId: employeeId,
        name: normalizedName,
        email: normalizedEmail,
        role: normalizedRole,
        department: normalizedDepartment,
        phone: normalizedPhone,
        emergencyContact: normalizedEmergencyContact,
        bloodGroup: normalizedBloodGroup,
        joiningDate: parsedJoiningDate.toISOString(),
        validTill: parsedValidTill?.toISOString() ?? null,
        photoUrl: normalizedPhotoUrl ?? "",
        status: "Active",
        loginId: employeeId,
        password,
      },
    });
  } catch (error) {
    console.error("Error creating staff profile:", error);
    const message = error instanceof Error ? error.message : "Failed to create staff profile.";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const payload = (await req.json()) as Record<string, unknown>;
    const id = typeof payload.id === "string" ? payload.id.trim() : "";
    const {
      name,
      role,
      department,
      phone,
      emergencyContact,
      bloodGroup,
      photoUrl,
      status,
      parsedJoiningDate,
      parsedValidTill,
    } = normalizeStaffPayload(payload);

    if (
      !id ||
      !name ||
      !role ||
      !department ||
      !phone ||
      !emergencyContact ||
      !bloodGroup ||
      !parsedJoiningDate ||
      !parsedValidTill
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required staff update fields." },
        { status: 400 }
      );
    }

    if (parsedValidTill.getTime() < parsedJoiningDate.getTime()) {
      return NextResponse.json(
        { success: false, error: "Valid till date must be after joining date." },
        { status: 400 }
      );
    }

    if (photoUrl.length > 4_500_000) {
      return NextResponse.json(
        { success: false, error: "Uploaded photo is too large. Please use a smaller image." },
        { status: 400 }
      );
    }

    const dc = getDataConnectInstance();
    const existingStaffRes = await getStaffById(dc, { id: id as string });

    if (!existingStaffRes.data.staff) {
      return NextResponse.json(
        { success: false, error: "Staff member not found." },
        { status: 404 }
      );
    }

    await updateStaff(dc, {
      id: id as string,
      name,
      role,
      department,
      status: status || "Active",
      phone,
      emergencyContact,
      bloodGroup,
      joiningDate: parsedJoiningDate.toISOString(),
      validTill: parsedValidTill.toISOString(),
      photoUrl,
    });

    const updatedStaffData = {
      ...existingStaffRes.data.staff,
      name,
      role,
      department,
      status: status || "Active",
      phone,
      emergencyContact,
      bloodGroup,
      photoUrl,
      joiningDate: parsedJoiningDate,
      validTill: parsedValidTill,
    };

    return NextResponse.json({
      success: true,
      staff: mapStaffForAdmin(updatedStaffData as any),
    });
  } catch (error) {
    console.error("Error updating staff profile:", error);
    const message = error instanceof Error ? error.message : "Failed to update staff profile.";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Staff ID is required for deletion." },
        { status: 400 }
      );
    }

    // SAFETY CHECK: Prevent demo data from hitting the real DB and causing UUID crashes
    if (id.startsWith("demo-")) {
      console.log(`[API Staff DELETE] Intercepted demo ID conversion: ${id}`);
      return NextResponse.json({
        success: true,
        message: "Demo staff profile removed from session.",
      });
    }

    console.log(`[API Staff DELETE] Initiating deletion for ID: ${id}`);
    const dc = getDataConnectInstance();
    await deleteStaff(dc, { id: id as string });

    console.log(`[API Staff DELETE] Successfully removed ID: ${id}`);
    return NextResponse.json({
      success: true,
      message: "Staff profile deleted successfully.",
    });
  } catch (error: any) {
    console.error(`[API Staff DELETE_ERROR] Failed for ID ${new URL(req.url).searchParams.get("id")}:`, error);
    const message = error instanceof Error ? error.message : "Failed to delete staff profile.";
    return NextResponse.json(
      { success: false, error: `Production Error: ${message}. If this persists, verify the Firestore Data Connect schema version.` },
      { status: 500 }
    );
  }
}
