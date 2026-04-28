import { GoogleGenAI } from "@google/genai";
import type { FaceMatchResult } from "@/lib/face-embedding";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || "",
});

export type AnalysisResult = {
  observation: string;
  analysis: string;
  decision: string;
  severity: "info" | "warning" | "critical";
  isIntruder?: boolean;
  identifiedAs?: string;
  vectorMatch?: {
    name: string;
    role: string;
    similarity: number;
    confidence: string;
  } | null;
  metadata?: any;
};

/**
 * Analyze a CCTV frame using a hybrid approach:
 * 1. Vector RAG: Search the face embedding store for matching identities
 * 2. Gemini Vision: Perform full security analysis with match context injected
 * 
 * This replaces the brute-force approach of sending ALL reference photos to
 * Gemini, which hit payload size limits and was unreliable.
 */
export async function analyzeCameraFrame(
  base64Image: string,
  vectorMatches: FaceMatchResult[] = [],
  referenceProfiles: Array<{ name: string; photoUrl: string }> = []
): Promise<AnalysisResult> {

  // ── Build context from vector matches ──
  let personnelContext: string;

  if (vectorMatches.length > 0) {
    const matchSummary = vectorMatches
      .map((m, i) => {
        const pct = (m.similarity * 100).toFixed(1);
        return `  ${i + 1}. ${m.name} (${m.role}) — Similarity: ${pct}% [${m.confidence}]`;
      })
      .join("\n");

    const bestMatch = vectorMatches[0];
    const isConfident = bestMatch.confidence === "high" || bestMatch.confidence === "medium";

    personnelContext = `FACE RECOGNITION RESULTS (Vector Database):
${matchSummary}

${isConfident
  ? `The person in the frame has been identified as "${bestMatch.name}" (${bestMatch.role}) with ${(bestMatch.similarity * 100).toFixed(1)}% confidence.`
  : `No confident match found. Best candidate is "${bestMatch.name}" at ${(bestMatch.similarity * 100).toFixed(1)}% — treat as UNCONFIRMED.`
}

Use these results to inform your security assessment. If the match is HIGH confidence, treat the person as identified. If LOW or no_match, flag as UNKNOWN/POTENTIAL_INTRUDER.`;
  } else if (referenceProfiles.length > 0) {
    // Fallback: legacy mode with reference photos
    personnelContext = `AUTHORIZED PERSONNEL PROFILES (Legacy Mode):
${referenceProfiles.map(p => `- ${p.name}: [Reference image attached]`).join('\n')}

Compare every person in the CCTV frame against these reference images. 
If a person does NOT match any profile, mark them as 'UNKNOWN/INTRUDER'.`;
  } else {
    personnelContext = `No reference profiles or vector matches available. Identify all persons as 'UNKNOWN'.`;
  }

  const prompt = `
    You are the "Eye of Aegis", a high-end AI security and protocol auditor for a luxury hospitality establishment.
    
    ${personnelContext}

    Analyze this CCTV camera frame and provide a structured report.
    Focus on:
    1. Identity Verification: Cross-reference against the face recognition results above.
    2. Security threats: suspicious behavior, unauthorized entry, tailgating.
    3. Protocol compliance: Staff uniform, cleanliness, operational standards.
    4. Environmental hazards: spills, obstructions, fire risks.

    Return ONLY a JSON object:
    {
      "observation": "Summary of observations",
      "analysis": "Detailed security reasoning",
      "isIntruder": boolean (true if unknown person detected in sensitive area),
      "identifiedAs": "Name of matched person or 'Unknown'",
      "decision": "Action (e.g. 'Lock Sector A', 'Clear', 'Investigate')",
      "severity": "info" | "warning" | "critical",
      "metadata": { ... }
    }
  `;

  const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, "");

  try {
    const parts: any[] = [];

    // In legacy mode, add reference photos (limited to top 3 to avoid payload bloat)
    if (vectorMatches.length === 0 && referenceProfiles.length > 0) {
      const limitedProfiles = referenceProfiles.slice(0, 3);
      limitedProfiles.forEach((profile) => {
        const cleanRef = profile.photoUrl.replace(/^data:image\/\w+;base64,/, "");
        // Only include if it looks like base64 and isn't too large
        if (cleanRef.length > 100 && cleanRef.length < 500_000) {
          parts.push({
            inlineData: {
              mimeType: "image/jpeg",
              data: cleanRef,
            },
          });
        }
      });
    }

    // Add CCTV frame
    parts.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: cleanBase64,
      },
    });

    // Add Prompt
    parts.push({ text: prompt });

    // Diagnostic Log
    const totalImageSize = parts.reduce((acc, p) => acc + (p.inlineData?.data?.length || 0), 0);
    const mode = vectorMatches.length > 0 ? "VECTOR_RAG" : (referenceProfiles.length > 0 ? "LEGACY" : "BLIND");
    console.log(`[AI Analysis] Mode: ${mode} | ${parts.length - 1} images | Payload: ${(totalImageSize / 1024).toFixed(2)}KB`);

    if (totalImageSize > 15 * 1024 * 1024) {
      console.warn("[AI Analysis] Payload exceeds 15MB. Analysis may fail due to size limits.");
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: parts,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "";

    if (!text) throw new Error("Empty response");

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]) as AnalysisResult;
      
      // Inject vector match metadata
      if (vectorMatches.length > 0) {
        result.vectorMatch = {
          name: vectorMatches[0].name,
          role: vectorMatches[0].role,
          similarity: vectorMatches[0].similarity,
          confidence: vectorMatches[0].confidence,
        };
      }
      
      return result;
    }

    console.error("[AI Analysis] Failed to parse JSON from response:", text);
    throw new Error("JSON Parse Error");
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return {
      observation: "Scanning failed",
      analysis: "Neural mismatch or API timeout.",
      decision: "Retry scan",
      severity: "warning",
    };
  }
}
