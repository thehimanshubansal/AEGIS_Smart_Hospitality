// src/app/api/admin/emergency/report/route.ts
import { NextResponse } from "next/server";
import { generateSOSIncidentReport } from "@/lib/agents/sos-monitor-agent";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { incidentId, callerName, location, transport, metadata, transcript } = data;

    if (!incidentId) {
      return NextResponse.json({ error: "Incident ID required" }, { status: 400 });
    }

    const report = await generateSOSIncidentReport({
      incidentId,
      callerName,
      location,
      transport,
      metadata,
      transcript
    });

    // Persist to RTDB for Monitoring Panel and Chat retrieval
    try {
      const { getRtdb } = await import("@/lib/firebase");
      const { ref, set } = await import("firebase/database");
      const db = getRtdb();
      await set(ref(db, `incident-reports/${incidentId}`), report);
    } catch (dbErr) {
      console.error("[Incident Report API] Failed to persist report:", dbErr);
    }

    return NextResponse.json({ success: true, report });
  } catch (error: any) {
    console.error("[Incident Report API Error]:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
