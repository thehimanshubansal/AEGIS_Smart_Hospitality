/**
 * Face Enrollment API
 * 
 * POST /api/admin/face-enroll
 * - Enrolls a face into the vector store
 * - Called during staff/guest registration
 * 
 * GET /api/admin/face-enroll
 * - Returns vector store statistics
 * 
 * DELETE /api/admin/face-enroll?referenceId=xxx
 * - Removes a face embedding
 */

import { NextRequest, NextResponse } from "next/server";
import { enrollFace, getVectorStoreStats, deleteFaceEmbedding } from "@/lib/face-vector-store";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { referenceId, name, role, photoBase64, department } = await req.json();

    if (!referenceId || !name || !role || !photoBase64) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: referenceId, name, role, photoBase64" },
        { status: 400 }
      );
    }

    // Validate photo is base64
    if (!photoBase64.includes("base64") && photoBase64.length < 100) {
      return NextResponse.json(
        { success: false, error: "photoBase64 must be a valid base64-encoded image" },
        { status: 400 }
      );
    }

    console.log(`[Face Enroll API] Enrolling ${name} (${referenceId}) as ${role}...`);

    const record = await enrollFace(referenceId, name, role, photoBase64, {
      department,
      status: "active",
    });

    return NextResponse.json({
      success: true,
      enrollment: {
        id: record.id,
        referenceId: record.referenceId,
        name: record.name,
        role: record.role,
        embeddingDimensions: record.embedding.length,
        enrolledAt: record.metadata.enrolledAt,
        model: record.metadata.embeddingModel,
      },
    });
  } catch (error) {
    console.error("[Face Enroll API] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Face enrollment failed",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const stats = await getVectorStoreStats();
    return NextResponse.json({ success: true, stats });
  } catch (error) {
    console.error("[Face Enroll API] Stats error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve vector store stats" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const referenceId = searchParams.get("referenceId");

    if (!referenceId) {
      return NextResponse.json(
        { success: false, error: "referenceId query parameter is required" },
        { status: 400 }
      );
    }

    await deleteFaceEmbedding(referenceId);

    return NextResponse.json({
      success: true,
      message: `Face embedding for ${referenceId} deleted`,
    });
  } catch (error) {
    console.error("[Face Enroll API] Delete error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete face embedding" },
      { status: 500 }
    );
  }
}
