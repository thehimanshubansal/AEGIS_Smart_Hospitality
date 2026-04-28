/**
 * Face Search API
 * 
 * POST /api/admin/face-search
 * - Searches the vector store for matching faces in a CCTV frame
 * - Used by the monitoring/analysis pipeline
 */

import { NextRequest, NextResponse } from "next/server";
import { searchFaces } from "@/lib/face-vector-store";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { image, topK = 5 } = await req.json();

    if (!image) {
      return NextResponse.json(
        { success: false, error: "No image provided" },
        { status: 400 }
      );
    }

    console.log(`[Face Search API] Searching for face matches (topK=${topK})...`);

    const matches = await searchFaces(image, topK);

    return NextResponse.json({
      success: true,
      matchCount: matches.length,
      matches,
      bestMatch: matches.length > 0
        ? {
            name: matches[0].name,
            role: matches[0].role,
            similarity: matches[0].similarity,
            confidence: matches[0].confidence,
          }
        : null,
    });
  } catch (error) {
    console.error("[Face Search API] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Face search failed",
      },
      { status: 500 }
    );
  }
}
