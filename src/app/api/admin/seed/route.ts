import { NextResponse } from 'next/server';
import "@/lib/firebase";
import { createIncident, createGuestFull, createRoom } from '@/dataconnect-generated';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Note: With Firebase Data Connect, bulk deleting requires more complex logic or manual deletion.
    // We will just seed new mock data for demonstration purposes.

    // Seed Incidents
    await createIncident({ title: "Smoke pattern detected in Server Room B", severity: "Urgent" });
    await createIncident({ title: "Unauthorized access — Rear Loading Dock", severity: "Review" });

    // Seed Guests
    await createGuestFull({
      name: "Arthur Sterling",
      roomNumber: "402",
      status: "In Room",
      checkOut: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString() as any,
    });
    
    await createGuestFull({
      name: "Victoria Chen",
      roomNumber: "305",
      status: "Lobby",
      checkOut: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString() as any,
    });

    await createGuestFull({
      name: "John Doe",
      roomNumber: "215",
      status: "In Room",
      checkOut: new Date(new Date().setDate(new Date().getDate() + 4)).toISOString() as any,
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully seeded Firebase Data Connect with initial mock data!'
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error seeding data:', error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}