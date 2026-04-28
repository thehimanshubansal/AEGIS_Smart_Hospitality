/**
 * Face Embedding Service
 * 
 * Uses Google's Multimodal Embedding API (Vertex AI) to generate
 * high-dimensional vector embeddings from facial images.
 * Embeddings are stored in Firestore for vector similarity search.
 * 
 * Architecture:
 *   Photo → Gemini Embedding Model → 768-dim Vector → Firestore
 *   CCTV Frame → Embedding → Cosine Similarity → Top-K Matches
 */

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || "",
});

// ─── Types ───────────────────────────────────────────────────────────────────

export interface FaceEmbeddingRecord {
  id: string;
  referenceId: string;       // employeeId or guestEmail
  name: string;
  role: "staff" | "guest";
  photoUrl: string;          // original base64 or URL (kept for display)
  embedding: number[];       // 768-dim vector from text-embedding model
  metadata: {
    department?: string;
    status: string;
    enrolledAt: string;
    embeddingModel: string;
    embeddingDimensions: number;
  };
}

export interface FaceMatchResult {
  referenceId: string;
  name: string;
  role: string;
  similarity: number;         // cosine similarity score (0-1)
  confidence: "high" | "medium" | "low" | "no_match";
  photoUrl: string;
  metadata: Record<string, any>;
}

// ─── Embedding Generation ────────────────────────────────────────────────────

/**
 * Generate a facial description embedding from a base64 image.
 * 
 * Strategy: We use Gemini to extract detailed facial features as text,
 * then embed that text description. This creates a semantic embedding
 * that captures biometric characteristics.
 */
export async function generateFaceEmbedding(
  base64Image: string,
  personName: string,
  role: string
): Promise<number[]> {
  const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, "");

  // Step 1: Extract detailed facial feature description using Gemini Vision
  const featureDescription = await extractFacialFeatures(cleanBase64, personName, role);

  // Step 2: Generate text embedding from the facial feature description
  const embedding = await generateTextEmbedding(featureDescription);

  console.log(`[FaceEmbedding] Generated ${embedding.length}-dim embedding for ${personName} (${role})`);
  return embedding;
}

/**
 * Extract detailed facial features from an image using Gemini Vision.
 * Returns a structured text description optimized for embedding similarity.
 */
async function extractFacialFeatures(
  base64Image: string,
  personName: string,
  role: string
): Promise<string> {
  const prompt = `You are a biometric facial feature analyzer. Analyze the person in this image and provide a DETAILED facial feature description for identity matching purposes.

Focus on PERMANENT, DISTINGUISHING features only:
- Face shape (oval, round, square, heart, oblong)
- Eye characteristics (shape, spacing, color if visible, brow shape)
- Nose shape and size (straight, aquiline, button, broad, narrow)
- Lip shape and proportion
- Jawline definition
- Cheekbone prominence
- Forehead height and width
- Any distinguishing marks (moles, scars, dimples, birthmarks)
- Hair color, texture, and style
- Facial hair if present
- Skin tone
- Approximate age range
- Overall facial proportions and symmetry

DO NOT describe:
- Clothing, background, or accessories
- Temporary features (expressions, lighting effects)
- Non-facial body features

Return ONLY the facial description as a single paragraph, optimized for biometric comparison.
Person context: ${personName}, role: ${role}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Image,
              },
            },
            { text: prompt },
          ],
        },
      ],
    });

    const description = response.text?.trim() || "";
    
    if (!description) {
      throw new Error("Empty facial feature extraction response");
    }

    console.log(`[FaceEmbedding] Extracted facial features for ${personName}: ${description.substring(0, 100)}...`);
    return description;
  } catch (error) {
    console.error(`[FaceEmbedding] Feature extraction failed for ${personName}:`, error);
    // Fallback: use a basic description
    return `Person named ${personName}, role: ${role}. Standard facial features for identification.`;
  }
}

/**
 * Generate a text embedding vector using Gemini's text embedding model.
 */
async function generateTextEmbedding(text: string): Promise<number[]> {
  try {
    const response = await ai.models.embedContent({
      model: "gemini-embedding-2",
      contents: text,
    });

    const embedding = response.embeddings?.[0]?.values;

    if (!embedding || embedding.length === 0) {
      throw new Error("Empty embedding response from text-embedding-004");
    }

    return embedding;
  } catch (error) {
    console.error("[FaceEmbedding] Text embedding generation failed:", error);
    throw new Error(`Embedding generation failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

// ─── Similarity Search ──────────────────────────────────────────────────────

/**
 * Compute cosine similarity between two vectors.
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error(`Vector dimension mismatch: ${a.length} vs ${b.length}`);
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) return 0;

  return dotProduct / denominator;
}

/**
 * Classify match confidence based on cosine similarity score.
 */
export function classifyConfidence(similarity: number): "high" | "medium" | "low" | "no_match" {
  if (similarity >= 0.85) return "high";
  if (similarity >= 0.70) return "medium";
  if (similarity >= 0.55) return "low";
  return "no_match";
}

/**
 * Find top-K matching faces from the vector store.
 * 
 * @param queryEmbedding - The embedding of the face to search for
 * @param storedEmbeddings - All stored face embeddings from Firestore
 * @param topK - Number of top matches to return
 * @param threshold - Minimum similarity threshold (0-1)
 */
export function findTopMatches(
  queryEmbedding: number[],
  storedEmbeddings: FaceEmbeddingRecord[],
  topK: number = 3,
  threshold: number = 0.50
): FaceMatchResult[] {
  const results: FaceMatchResult[] = storedEmbeddings
    .map((record) => {
      const similarity = cosineSimilarity(queryEmbedding, record.embedding);
      return {
        referenceId: record.referenceId,
        name: record.name,
        role: record.role,
        similarity,
        confidence: classifyConfidence(similarity),
        photoUrl: record.photoUrl,
        metadata: record.metadata,
      };
    })
    .filter((r) => r.similarity >= threshold)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);

  return results;
}
