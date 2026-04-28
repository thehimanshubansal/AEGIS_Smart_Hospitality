import { NextRequest, NextResponse } from "next/server";
import "@/lib/firebase";
import { formatRelativeTime, getDemoSeedData } from "@/lib/admin-data";
import { listIncidents, listGuests, createIncident, updateIncident } from "@/dataconnect-generated";

export const dynamic = "force-dynamic";

type IncidentRecord = {
  id: string;
  title: string;
  severity: string;
  status: string;
  timestamp: any;
  roomId: string | null;
  description: string | null;
};

const normalizeRoom = (value?: string | null) => value?.trim().toLowerCase() ?? "";

const isRoomMatch = (incidentRoom: string | null, requestedRoom?: string | null) => {
  if (!requestedRoom) return true;
  return normalizeRoom(incidentRoom) === normalizeRoom(requestedRoom);
};

const buildGuestNameLookup = (entries: Array<{ roomNumber: string | null; name: string }>) => {
  const lookup = new Map<string, string>();

  for (const entry of entries) {
    const roomKey = normalizeRoom(entry.roomNumber);
    if (!roomKey) continue;
    lookup.set(roomKey, entry.name);
  }

  return lookup;
};

const mapIncident = (incident: IncidentRecord, guestNameLookup: Map<string, string>) => ({
  id: incident.id,
  title: incident.title,
  description: incident.description ?? incident.title,
  severity: incident.severity,
  status: incident.status,
  timestamp: new Date(incident.timestamp).toISOString(),
  roomId: incident.roomId ?? null,
  guestName: guestNameLookup.get(normalizeRoom(incident.roomId)) ?? null,
  timeAgo: formatRelativeTime(new Date(incident.timestamp)),
});

async function resolveGuestNameLookup() {
  const guestsRes = await listGuests();
  const guests = guestsRes.data.guests;

  return buildGuestNameLookup(guests.map(g => ({
    name: g.name,
    roomNumber: g.roomNumber ?? null
  })));
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const room = searchParams.get("room");

  try {
    const [incidentsRes, guestNameLookup] = await Promise.all([
      listIncidents(),
      resolveGuestNameLookup(),
    ]);
    const incidents = incidentsRes.data.incidents;

    const demo = getDemoSeedData();
    const sourceIncidents = incidents.length > 0 ? incidents : demo.incidents;
    const activeGuestLookup =
      incidents.length > 0
        ? guestNameLookup
        : buildGuestNameLookup(
            demo.guests.map((guest) => ({
              roomNumber: guest.roomNumber,
              name: guest.name,
            }))
          );

    return NextResponse.json({
      success: true,
      incidents: sourceIncidents
        .filter((incident: any) => isRoomMatch(incident.roomId, room))
        .map((incident: any) => mapIncident(incident, activeGuestLookup)),
    });
  } catch (error) {
    console.error("Error fetching guest incidents:", error);

    const demo = getDemoSeedData();
    const demoGuestLookup = buildGuestNameLookup(
      demo.guests.map((guest) => ({
        roomNumber: guest.roomNumber,
        name: guest.name,
      }))
    );

    return NextResponse.json({
      success: true,
      incidents: demo.incidents
        .filter((incident) => isRoomMatch(incident.roomId, room))
        .map((incident) => mapIncident(incident as any, demoGuestLookup)),
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, description, severity, roomId, status } = await req.json();

    if (!title || !severity) {
      return NextResponse.json(
        { success: false, error: "title and severity are required" },
        { status: 400 }
      );
    }

    const newIncidentRes = await createIncident({
      title,
      description: description ?? null,
      severity,
      roomId: roomId ?? null,
      status: status ?? "Active",
    });
    
    // createIncident only returns the id via incident_insert
    // we return a mock object mirroring the db record for immediate UI feedback
    const incidentMock = {
      id: newIncidentRes.data.incident_insert.id,
      title,
      severity,
      status: status ?? "Active",
      timestamp: new Date().toISOString(),
      roomId: roomId ?? null,
      description: description ?? null,
    };

    const guestNameLookup = await resolveGuestNameLookup();

    return NextResponse.json({
      success: true,
      incident: mapIncident(incidentMock, guestNameLookup),
    });
  } catch (error) {
    console.error("Error creating guest incident:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create incident" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "id and status are required" },
        { status: 400 }
      );
    }

    await updateIncident({
      id,
      status,
    });

    return NextResponse.json({
      success: true,
      incident: {
        id,
        status
      },
    });
  } catch (error) {
    console.error("Error updating guest incident:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update incident" },
      { status: 500 }
    );
  }
}
