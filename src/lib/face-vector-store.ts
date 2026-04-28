/**
 * Face Vector Store
 * 
 * Firestore-backed persistence layer for facial embedding vectors.
 * Uses the Firestore MCP / REST API for vector storage since
 * Data Connect (PostgreSQL) doesn't natively support vector search.
 * 
 * Collection: `face_embeddings`
 * Document ID: referenceId (employeeId or guestEmail)
 */

import type { FaceEmbeddingRecord, FaceMatchResult } from "./face-embedding";
import {
  generateFaceEmbedding,
  findTopMatches,
} from "./face-embedding";

// ─── In-Memory Cache (for fast retrieval during analysis) ─────────────────

let embeddingCache: FaceEmbeddingRecord[] = [];
let cacheTimestamp: number = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// ─── Firestore REST API helpers ───────────────────────────────────────────

const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "hospitality-aegis-494217";
const FIRESTORE_BASE_URL = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents`;

/**
 * Get the API key for Firestore REST calls.
 */
function getApiKey(): string {
  return process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "";
}

/**
 * Convert a FaceEmbeddingRecord to Firestore document format.
 */
function toFirestoreDoc(record: FaceEmbeddingRecord) {
  return {
    fields: {
      id: { stringValue: record.id },
      referenceId: { stringValue: record.referenceId },
      name: { stringValue: record.name },
      role: { stringValue: record.role },
      photoUrl: { stringValue: record.photoUrl.substring(0, 500) }, // Truncate for storage, keep display ref
      embedding: {
        arrayValue: {
          values: record.embedding.map((v) => ({ doubleValue: v })),
        },
      },
      metadata: {
        mapValue: {
          fields: {
            department: { stringValue: record.metadata.department || "" },
            status: { stringValue: record.metadata.status },
            enrolledAt: { stringValue: record.metadata.enrolledAt },
            embeddingModel: { stringValue: record.metadata.embeddingModel },
            embeddingDimensions: { integerValue: String(record.metadata.embeddingDimensions) },
          },
        },
      },
    },
  };
}

/**
 * Convert a Firestore document to FaceEmbeddingRecord.
 */
function fromFirestoreDoc(doc: any): FaceEmbeddingRecord | null {
  try {
    const fields = doc.fields;
    if (!fields) return null;

    const embedding = fields.embedding?.arrayValue?.values?.map(
      (v: any) => v.doubleValue || parseFloat(v.integerValue || "0")
    ) || [];

    const metaFields = fields.metadata?.mapValue?.fields || {};

    return {
      id: fields.id?.stringValue || "",
      referenceId: fields.referenceId?.stringValue || "",
      name: fields.name?.stringValue || "",
      role: fields.role?.stringValue as "staff" | "guest",
      photoUrl: fields.photoUrl?.stringValue || "",
      embedding,
      metadata: {
        department: metaFields.department?.stringValue || undefined,
        status: metaFields.status?.stringValue || "active",
        enrolledAt: metaFields.enrolledAt?.stringValue || new Date().toISOString(),
        embeddingModel: metaFields.embeddingModel?.stringValue || "gemini-embedding-2",
        embeddingDimensions: parseInt(metaFields.embeddingDimensions?.integerValue || "768"),
      },
    };
  } catch (error) {
    console.error("[FaceVectorStore] Failed to parse Firestore document:", error);
    return null;
  }
}

// ─── CRUD Operations ─────────────────────────────────────────────────────────

/**
 * Enroll a new face into the vector store.
 * Generates the embedding and stores it in Firestore.
 */
export async function enrollFace(
  referenceId: string,
  name: string,
  role: "staff" | "guest",
  photoBase64: string,
  metadata: {
    department?: string;
    status?: string;
  } = {}
): Promise<FaceEmbeddingRecord> {
  console.log(`[FaceVectorStore] Enrolling face for ${name} (${referenceId})...`);

  // Generate embedding
  const embedding = await generateFaceEmbedding(photoBase64, name, role);

  const record: FaceEmbeddingRecord = {
    id: `face_${referenceId.replace(/[^a-zA-Z0-9]/g, "_")}`,
    referenceId,
    name,
    role,
    photoUrl: photoBase64.substring(0, 500), // Store truncated ref
    embedding,
    metadata: {
      department: metadata.department,
      status: metadata.status || "active",
      enrolledAt: new Date().toISOString(),
      embeddingModel: "gemini-embedding-2",
      embeddingDimensions: embedding.length,
    },
  };

  // Store in Firestore
  await upsertEmbeddingDocument(record);

  // Invalidate cache
  cacheTimestamp = 0;

  console.log(`[FaceVectorStore] ✓ Enrolled ${name} with ${embedding.length}-dim embedding`);
  return record;
}

/**
 * Store/update an embedding document in Firestore.
 */
async function upsertEmbeddingDocument(record: FaceEmbeddingRecord): Promise<void> {
  const apiKey = getApiKey();
  const docId = record.id;
  const url = `${FIRESTORE_BASE_URL}/face_embeddings/${docId}?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toFirestoreDoc(record)),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Firestore write failed (${response.status}): ${errorBody}`);
    }

    console.log(`[FaceVectorStore] Document ${docId} written to Firestore`);
  } catch (error) {
    console.error(`[FaceVectorStore] Firestore write error for ${docId}:`, error);
    throw error;
  }
}

/**
 * Fetch all face embeddings from Firestore.
 */
export async function getAllEmbeddings(): Promise<FaceEmbeddingRecord[]> {
  // Check cache
  if (embeddingCache.length > 0 && Date.now() - cacheTimestamp < CACHE_TTL_MS) {
    console.log(`[FaceVectorStore] Returning ${embeddingCache.length} cached embeddings`);
    return embeddingCache;
  }

  const apiKey = getApiKey();
  const url = `${FIRESTORE_BASE_URL}/face_embeddings?key=${apiKey}&pageSize=500`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.warn(`[FaceVectorStore] Firestore read failed (${response.status}): ${errorBody}`);
      return embeddingCache; // Return stale cache on failure
    }

    const data = await response.json();
    const documents = data.documents || [];

    embeddingCache = documents
      .map((doc: any) => fromFirestoreDoc(doc))
      .filter((r: FaceEmbeddingRecord | null): r is FaceEmbeddingRecord => r !== null && r.embedding.length > 0);

    cacheTimestamp = Date.now();

    console.log(`[FaceVectorStore] Loaded ${embeddingCache.length} embeddings from Firestore`);
    return embeddingCache;
  } catch (error) {
    console.error("[FaceVectorStore] Failed to fetch embeddings:", error);
    return embeddingCache; // Return stale cache on error
  }
}

/**
 * Delete a face embedding from the vector store.
 */
export async function deleteFaceEmbedding(referenceId: string): Promise<void> {
  const docId = `face_${referenceId.replace(/[^a-zA-Z0-9]/g, "_")}`;
  const apiKey = getApiKey();
  const url = `${FIRESTORE_BASE_URL}/face_embeddings/${docId}?key=${apiKey}`;

  try {
    const response = await fetch(url, { method: "DELETE" });
    if (!response.ok) {
      console.warn(`[FaceVectorStore] Delete failed for ${docId}: ${response.status}`);
    } else {
      console.log(`[FaceVectorStore] Deleted embedding for ${referenceId}`);
    }
    // Invalidate cache
    cacheTimestamp = 0;
  } catch (error) {
    console.error(`[FaceVectorStore] Delete error for ${docId}:`, error);
  }
}

// ─── Search Operations ───────────────────────────────────────────────────────

/**
 * Search the vector store for matching faces.
 * This is the main entry point for the analysis agent.
 * 
 * @param cctvFrameBase64 - Base64 encoded CCTV frame
 * @param topK - Number of top matches to return
 * @returns Array of match results sorted by similarity
 */
export async function searchFaces(
  cctvFrameBase64: string,
  topK: number = 5
): Promise<FaceMatchResult[]> {
  console.log("[FaceVectorStore] Starting face search...");

  // Step 1: Generate embedding for the CCTV frame
  const queryEmbedding = await generateFaceEmbedding(
    cctvFrameBase64,
    "Unknown Subject",
    "unknown"
  );

  // Step 2: Get all stored embeddings
  const storedEmbeddings = await getAllEmbeddings();

  if (storedEmbeddings.length === 0) {
    console.log("[FaceVectorStore] No enrolled faces found in vector store");
    return [];
  }

  // Step 3: Find top matches using cosine similarity
  const matches = findTopMatches(queryEmbedding, storedEmbeddings, topK, 0.50);

  console.log(
    `[FaceVectorStore] Search complete: ${matches.length} matches found ` +
    `(best: ${matches[0]?.name || "none"} @ ${(matches[0]?.similarity * 100 || 0).toFixed(1)}%)`
  );

  return matches;
}

/**
 * Get vector store statistics.
 */
export async function getVectorStoreStats(): Promise<{
  totalEmbeddings: number;
  staffCount: number;
  guestCount: number;
  embeddingDimensions: number;
  cacheAge: string;
}> {
  const embeddings = await getAllEmbeddings();
  const staffCount = embeddings.filter((e) => e.role === "staff").length;
  const guestCount = embeddings.filter((e) => e.role === "guest").length;

  return {
    totalEmbeddings: embeddings.length,
    staffCount,
    guestCount,
    embeddingDimensions: embeddings[0]?.embedding.length || 768,
    cacheAge: cacheTimestamp > 0
      ? `${Math.round((Date.now() - cacheTimestamp) / 1000)}s ago`
      : "cold",
  };
}
