import { NextRequest, NextResponse } from "next/server";
import { enrollFace } from "@/lib/face-vector-store";
import { getDataConnectInstance } from "@/lib/firebase";
import { createSecurityProfile } from "@/dataconnect-generated";

export async function POST(req: NextRequest) {
  try {
    const { image, name, role, referenceId } = await req.json();

    if (!image || !name) {
      return NextResponse.json({ error: "Image and Name are required" }, { status: 400 });
    }

    console.log(`[Enroll API] Starting identity enrollment for: ${name}...`);

    const dc = getDataConnectInstance();
    const finalReferenceId = referenceId || `manual_${Date.now()}`;

    // 1. Enroll in Vector Store (Firestore)
    // This generates the embedding and saves it for RAG-based search.
    try {
      await enrollFace(finalReferenceId, name, role || "unknown", image);
      console.log(`[Enroll API] ✓ Vector face enrolled in Firestore`);
    } catch (vError) {
      console.error("[Enroll API] Vector enrollment failed:", vError);
      throw vError;
    }

    // 2. Save High-Resolution Reference to SecurityProfiles (Data Connect/Postgres)
    // This is used for the "DB Reference" display in the comparison modal.
    try {
      await createSecurityProfile(dc, {
        referenceId: finalReferenceId,
        name,
        role: role || "unknown",
        photoUrl: image, // Store the full base64 for high-quality verification
        facialFeatures: `Manually enrolled via Surveillance Command Center on ${new Date().toLocaleString()}`
      });
      console.log(`[Enroll API] ✓ Security Profile created in Data Connect`);
    } catch (dcError) {
      console.error("[Enroll API] Data Connect enrollment failed:", dcError);
      throw dcError;
    }

    return NextResponse.json({ 
      success: true, 
      referenceId: finalReferenceId,
      message: `Identity for ${name} successfully secured.` 
    });

  } catch (error) {
    console.error("[Enroll API] Fatal Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
