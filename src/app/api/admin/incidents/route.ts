import { NextRequest, NextResponse } from "next/server";
import "@/lib/firebase";
import { getDemoSeedData, mapIncidentForAdmin } from "@/lib/admin-data";
import { listIncidents, createIncident, updateIncident } from "@/dataconnect-generated";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export async function GET() {
  try {
    const res = await listIncidents();
    const sourceIncidents = res.data.incidents;

    return NextResponse.json({
      success: true,
      incidents: sourceIncidents.map(mapIncidentForAdmin as any), 
    });
  } catch (error) {
    console.error("Error fetching incidents:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch incidents" },
      { status: 500 }
    );
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

    const res = await createIncident({
      title,
      description: description ?? null,
      severity,
      roomId: roomId ?? null,
      status: status ?? "Active",
    });
    
    // We construct the response object here
    const incidentMock = {
      id: res.data.incident_insert.id,
      title,
      severity,
      status: status ?? "Active",
      timestamp: new Date().toISOString(),
      roomId: roomId ?? null,
      description: description ?? null,
    };

    return NextResponse.json({
      success: true,
      incident: mapIncidentForAdmin(incidentMock as any),
    });
  } catch (error) {
    console.error("Error creating incident:", error);
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
    
    const incidentMock = {
      id,
      status
    };

    return NextResponse.json({
      success: true,
      incident: incidentMock,
    });
  } catch (error) {
    console.error("Error updating incident:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update incident" },
      { status: 500 }
    );
  }
}
