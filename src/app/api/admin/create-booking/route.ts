export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;
import "@/lib/firebase";
import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { createFirebaseEmailPasswordUser } from '@/lib/firebase-auth-rest';
import {
  buildGuestAccessPayload,
  generateGuestPassword,
  serializeGuestAccessPayload,
} from '@/lib/guest-access';
import {
  getRoomById,
  createGuestFull,
  updateGuest,
  upsertUserLogin,
  updateRoom,
  listGuests
} from '@/dataconnect-generated';
import { getDataConnectInstance } from '@/lib/firebase';

function parseNights(value: unknown) {
  const parsed = Number.parseInt(String(value), 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function generateRandomId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
}

async function provisionGuestCredentials(guestName: string, guestEmail: string, customPassword?: string) {
  const password = customPassword || generateGuestPassword();
  const loginId = generateRandomId("GS");
  const systemEmail = `${loginId.toLowerCase()}@hotel.local`;

  try {
    const firebaseUser = await createFirebaseEmailPasswordUser({
      email: systemEmail,
      password,
      displayName: guestName,
    });

    return {
      firebaseUid: firebaseUser.uid,
      loginId: loginId,
      password,
      systemEmail
    };
  } catch (error) {
    if (error instanceof Error && error.message.includes('EMAIL_EXISTS')) {
      // If by some miracle the random ID exists, try once more
      return provisionGuestCredentials(guestName, guestEmail, customPassword);
    }
    throw error;
  }
}



function getFirebaseWebApiKey() {
  return process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "";
}

export async function POST(req: Request) {
  try {
    const { roomId, roomNumber, guestName, email, idNumber, contactNumber, address, nights, customPassword, photoUrl } = await req.json();
    const normalizedGuestName = typeof guestName === 'string' ? guestName.trim() : '';
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const normalizedIdNumber = typeof idNumber === 'string' ? idNumber.trim() : '';
    const normalizedContact = typeof contactNumber === 'string' ? contactNumber.trim() : null;
    const normalizedAddress = typeof address === 'string' ? address.trim() : null;
    const stayNights = parseNights(nights);

    if (
      !roomId ||
      !roomNumber ||
      !normalizedGuestName ||
      !normalizedEmail ||
      !normalizedIdNumber ||
      stayNights === null
    ) {
      return NextResponse.json({ success: false, error: 'Missing required fields.' }, { status: 400 });
    }

    if (!isValidEmail(normalizedEmail)) {
      return NextResponse.json({ success: false, error: 'Please enter a valid guest email.' }, { status: 400 });
    }

    const loginToken = randomBytes(32).toString('hex');
    const credentials = await provisionGuestCredentials(normalizedGuestName, normalizedEmail, customPassword);

    const dc = getDataConnectInstance();
    const roomRes = await getRoomById(dc, { id: roomId });
    const room = roomRes.data.room;

    if (room?.status !== 'vacant') {
      throw new Error(`Room ${roomNumber} is not available. Its status is: ${room?.status || "unknown"}.`);
    }

    const checkOutDate = new Date(Date.now() + stayNights * 24 * 60 * 60 * 1000);

    // 1. Check if guest already exists in DB by email
    const allGuestsRes = await listGuests(dc);
    const existingGuest = allGuestsRes.data.guests.find(g => g.email === normalizedEmail);
    
    let guestId: string;
    
    if (existingGuest) {
      console.log(`[Booking] Guest ${normalizedEmail} found in DB. Updating record...`);
      guestId = existingGuest.id;
      
      await (updateGuest as any)(dc, {
        id: guestId,
        name: normalizedGuestName,
        roomNumber,
        roomId,
        idNumber: normalizedIdNumber,
        contact: normalizedContact,
        address: normalizedAddress,
        status: 'Booked',
        checkOut: checkOutDate.toISOString() as any,
        loginToken,
        loginEmail: credentials.loginId,
        loginPassword: credentials.password,
        firebaseUid: credentials.firebaseUid,
        photoUrl: photoUrl || "",
      });
    } else {
      console.log(`[Booking] Creating new guest record for ${normalizedEmail}...`);
      const newGuestRes = await createGuestFull(dc, {
        name: normalizedGuestName,
        roomNumber,
        roomId,
        idNumber: normalizedIdNumber,
        contact: normalizedContact,
        address: normalizedAddress,
        status: 'Booked',
        checkOut: checkOutDate.toISOString() as any,
        loginToken,
        email: normalizedEmail,
        loginEmail: credentials.loginId,
        loginPassword: credentials.password,
        firebaseUid: credentials.firebaseUid,
        photoUrl: photoUrl || "",
      });
      guestId = newGuestRes.data.guest_insert.id;
    }

    const qrPayload = serializeGuestAccessPayload(
      buildGuestAccessPayload({
        bookingId: guestId,
        token: loginToken,
        guestName: normalizedGuestName,
        roomNumber,
        loginId: credentials.loginId,
        password: credentials.password,
        email: normalizedEmail,
        idNumber: normalizedIdNumber,
        contact: normalizedContact,
        address: normalizedAddress,
      })
    );

    await (updateGuest as any)(dc, {
      id: guestId,
      qrPayload: qrPayload
    });

    await upsertUserLogin(dc, {
      firebaseUid: credentials.firebaseUid,
      email: credentials.loginId,
      displayName: normalizedGuestName,
      role: 'guest',
    });

    // Automatically enroll guest in security profile for face recognition if photo is provided
    if (photoUrl) {
      try {
        const { createSecurityProfile } = await import("@/dataconnect-generated");
        await createSecurityProfile(dc, {
          referenceId: normalizedEmail,
          name: normalizedGuestName,
          role: "guest",
          photoUrl: photoUrl,
          facialFeatures: null
        });
        console.log(`[API Booking POST] Automatically enrolled guest ${normalizedGuestName} in SecurityProfile.`);
      } catch (secError) {
        console.warn(`[API Booking POST] SecurityProfile enrollment failed (non-fatal):`, secError);
      }

      // ── Vector Face Enrollment ──
      // Generate facial embedding and store in Firestore vector store for RAG-based face matching
      try {
        const { enrollFace } = await import("@/lib/face-vector-store");
        const vectorRecord = await enrollFace(
          normalizedEmail,
          normalizedGuestName,
          "guest",
          photoUrl,
          { status: "active" }
        );
        console.log(`[API Booking POST] ✓ Vector face enrolled: ${normalizedGuestName} (${vectorRecord.embedding.length}-dim)`);
      } catch (vectorError) {
        console.warn(`[API Booking POST] Vector face enrollment failed (non-fatal):`, vectorError);
      }
    }

    await updateRoom(dc, {
      id: roomId,
      status: 'occupied',
    });

    const newBooking = {
      id: guestId,
      name: normalizedGuestName,
      roomNumber,
      loginToken,
      loginId: credentials.loginId,
      password: credentials.password,
      email: normalizedEmail,
      qrPayload,
      idNumber: normalizedIdNumber,
      contact: normalizedContact,
      address: normalizedAddress,
      checkOut: checkOutDate.toISOString(),
    };

    return NextResponse.json({ success: true, booking: newBooking });

  } catch (error) {
    console.error('Booking error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, error: 'Failed to create booking.', details: errorMessage }, { status: 500 });
  }
}
