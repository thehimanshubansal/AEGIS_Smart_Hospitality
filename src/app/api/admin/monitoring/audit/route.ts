// src/app/api/admin/monitoring/audit/route.ts
import { NextResponse } from "next/server";
import { auditSecurityInsight } from "@/lib/agents/audit-agent";

export async function POST(req: Request) {
  try {
    const { insight } = await req.json();

    if (!insight) {
      return NextResponse.json({ error: "Insight data required" }, { status: 400 });
    }

    const auditRes = await auditSecurityInsight(insight);

    return NextResponse.json(auditRes);
  } catch (error: any) {
    console.error("[Audit API Error]:", error);
    return NextResponse.json({ 
      status: "error", 
      reasoning: "Cognitive processor failure in secondary audit.",
      isThreat: false
    }, { status: 500 });
  }
}
