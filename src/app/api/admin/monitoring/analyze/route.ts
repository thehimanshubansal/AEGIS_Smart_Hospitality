import { NextRequest, NextResponse } from "next/server";
import { analyzeCameraFrame } from "@/lib/agents/analysis-agent";
import { getDataConnectInstance } from "@/lib/firebase";
import { listStaff, listGuests, listSecurityProfiles, getStaffByEmployeeId } from "@/dataconnect-generated";
import { searchFaces } from "@/lib/face-vector-store";
import { pushAegisAlert } from "@/lib/realtime-alerts";

export async function POST(req: NextRequest) {
  try {
    const { image, cameraId } = await req.json();

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const dc = getDataConnectInstance();
    
    // ── Phase 1: Vector Face Search (RAG Retrieval) ──
    // Search the Firestore vector store for matching face embeddings.
    // This replaces sending ALL reference photos to Gemini.
    let vectorMatches: Awaited<ReturnType<typeof searchFaces>> = [];
    
    try {
      vectorMatches = await searchFaces(image, 5);
      console.log(
        `[Monitoring API] Vector search: ${vectorMatches.length} matches found` +
        (vectorMatches.length > 0 ? ` (best: ${vectorMatches[0].name} @ ${(vectorMatches[0].similarity * 100).toFixed(1)}%)` : "")
      );
    } catch (vectorError) {
      console.warn("[Monitoring API] Vector search failed, falling back to legacy mode:", vectorError);
    }

    // ── Phase 2: Legacy Fallback (only if vector search returned nothing) ──
    // Load reference profiles from DB as a fallback. Limited to top 3 to avoid payload bloat.
    let legacyProfiles: Array<{ name: string; photoUrl: string }> = [];
    
    if (vectorMatches.length === 0) {
      console.log("[Monitoring API] No vector matches — falling back to legacy profile comparison");
      
      const [staffRes, guestRes, securityRes] = await Promise.all([
        listStaff(dc),
        listGuests(dc),
        listSecurityProfiles(dc)
      ]);

      legacyProfiles = [
        ...staffRes.data.staffs.filter((s: any) => s.photoUrl).map((s: any) => ({
          name: s.name,
          photoUrl: s.photoUrl!
        })),
        ...guestRes.data.guests.filter((g: any) => g.photoUrl).map((g: any) => ({
          name: g.name,
          photoUrl: g.photoUrl!
        })),
        ...securityRes.data.securityProfiles.filter((p: any) => p.photoUrl).map((p: any) => ({
          name: p.name,
          photoUrl: p.photoUrl
        }))
      ].slice(0, 3); // Hard limit to prevent payload explosion
      
      console.log(`[Monitoring API] Legacy fallback: ${legacyProfiles.length} profiles loaded`);
    }

    // ── Phase 3: Gemini Vision Analysis (with vector context injection) ──
    const result = await analyzeCameraFrame(image, vectorMatches, legacyProfiles);

    // Enrich result with vector match metadata + reference photo URL
    if (vectorMatches.length > 0 && result.identifiedAs && result.identifiedAs !== "Unknown") {
      const bestVector = vectorMatches.find(m => 
        m.name.toLowerCase() === result.identifiedAs?.toLowerCase()
      ) || vectorMatches[0]; // Fall back to highest-similarity match

      if (bestVector) {
        // Look up the full reference photo from SecurityProfiles (stores complete base64 data URIs)
        let matchedProfileUrl: string | null = null;
        try {
          const securityRes = await listSecurityProfiles(dc);
          const matchedProfile = securityRes.data.securityProfiles.find(
            (p: any) => p.name.toLowerCase() === bestVector.name.toLowerCase() || 
                        p.referenceId === bestVector.referenceId
          );
          if (matchedProfile?.photoUrl) {
            matchedProfileUrl = matchedProfile.photoUrl;
            console.log(`[Monitoring API] ✓ Reference photo resolved for ${bestVector.name} from SecurityProfiles`);
          }
        } catch (profileError) {
          console.warn("[Monitoring API] SecurityProfile photo lookup failed:", profileError);
        }

        // Fallback: try staff table if security profile didn't have it
        if (!matchedProfileUrl && bestVector.role === "staff") {
          try {
            const staffRes = await getStaffByEmployeeId(dc, { employeeId: bestVector.referenceId });
            const staffMatch = staffRes.data.staffs[0];
            if (staffMatch?.photoUrl) {
              matchedProfileUrl = staffMatch.photoUrl;
              console.log(`[Monitoring API] ✓ Reference photo resolved for ${bestVector.name} from Staff table`);
            }
          } catch (staffError) {
            console.warn("[Monitoring API] Staff photo lookup failed:", staffError);
          }
        }

        result.metadata = {
          ...result.metadata,
          vectorMatchConfidence: bestVector.confidence,
          vectorSimilarity: bestVector.similarity,
          confidence: Math.round(bestVector.similarity * 100),
          matchName: bestVector.name,
          matchRole: bestVector.role,
          matchedProfileUrl: matchedProfileUrl || null,
          searchMode: "VECTOR_RAG"
        };
      }
    } else if (legacyProfiles.length > 0) {
      result.metadata = {
        ...result.metadata,
        searchMode: "LEGACY_FALLBACK"
      };
    }

    // HYBRID: Push to Realtime DB if threat detected
    /* 
    if (result.severity === "critical" || result.severity === "warning" || result.isIntruder) {
      await pushAegisAlert({
        type: "security",
        title: result.isIntruder ? "Intruder Detected" : "Security Threat",
        message: result.observation,
        severity: result.severity,
      });
    }
    */

    return NextResponse.json(result);
  } catch (error) {
    console.error("Monitoring API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
