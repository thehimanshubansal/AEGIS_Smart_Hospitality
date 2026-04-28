import { NextRequest, NextResponse } from "next/server";
import { searchFaces } from "@/lib/face-vector-store";
import { getDataConnectInstance } from "@/lib/firebase";
import { listSecurityProfiles, getStaffByEmployeeId, listGuests } from "@/dataconnect-generated";

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    console.log("[Compare API] Starting manual biometric search...");

    // 1. Perform Vector search against Firestore
    const vectorMatches = await searchFaces(image, 1);
    
    if (vectorMatches.length === 0) {
      console.log("[Compare API] No vector matches found.");
      return NextResponse.json({ 
        matchName: "Unknown Subject", 
        confidence: 0,
        matchedProfileUrl: null 
      });
    }

    const bestMatch = vectorMatches[0];
    const dc = getDataConnectInstance();
    let matchedProfileUrl: string | null = null;

    console.log(`[Compare API] Best vector match: ${bestMatch.name} (${bestMatch.similarity.toFixed(2)})`);

    // 2. Resolve High-Resolution Reference Image from Data Connect (Postgres)
    // We try multiple tables to find the best quality photo.
    
    // Priority 1: SecurityProfiles (dedicated biometric table)
    try {
      const securityRes = await listSecurityProfiles(dc);
      const matchedProfile = securityRes.data.securityProfiles.find(
        (p) => p.name.toLowerCase() === bestMatch.name.toLowerCase() || 
               p.referenceId === bestMatch.referenceId
      );
      if (matchedProfile?.photoUrl) {
        matchedProfileUrl = matchedProfile.photoUrl;
        console.log(`[Compare API] ✓ Found reference in SecurityProfiles`);
      }
    } catch (e) {
      console.warn("[Compare API] SecurityProfile lookup error", e);
    }

    // Priority 2: Staff Table
    if (!matchedProfileUrl && bestMatch.role === "staff") {
      try {
        const staffRes = await getStaffByEmployeeId(dc, { employeeId: bestMatch.referenceId });
        const staffMatch = staffRes.data.staffs[0];
        if (staffMatch?.photoUrl) {
          matchedProfileUrl = staffMatch.photoUrl;
          console.log(`[Compare API] ✓ Found reference in Staff table`);
        }
      } catch (e) {}
    }

    // Priority 3: Guest Table
    if (!matchedProfileUrl && bestMatch.role === "guest") {
      try {
        const guestRes = await listGuests(dc);
        const guestMatch = guestRes.data.guests.find((g) => g.email === bestMatch.referenceId);
        if (guestMatch?.photoUrl) {
          matchedProfileUrl = guestMatch.photoUrl;
          console.log(`[Compare API] ✓ Found reference in Guest table`);
        }
      } catch (e) {}
    }

    // 3. Return enriched result
    return NextResponse.json({
      matchName: bestMatch.name,
      confidence: Math.round(bestMatch.similarity * 100),
      matchedProfileUrl: matchedProfileUrl,
      role: bestMatch.role,
      referenceId: bestMatch.referenceId
    });

  } catch (error) {
    console.error("[Compare API] Fatal Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
