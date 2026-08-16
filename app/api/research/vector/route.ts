import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/middleware";
import { connectDB } from "@/lib/db/connect";
import { DocumentModel } from "@/lib/db/models/Document";
import {
  chunkContractText,
  generateDenseVectorEmbedding,
  computeVectorCosineSimilarity,
  VectorSearchResult,
} from "@/lib/ai/vectorSearch";

export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { query } = await req.json();
    if (!query || !query.trim()) {
      return NextResponse.json({ error: "Search query is required" }, { status: 400 });
    }

    // 1. Generate real 128D query vector embedding
    const queryVector = generateDenseVectorEmbedding(query, 128);

    await connectDB();

    // 2. Fetch active Vault documents from MongoDB
    const docs = await DocumentModel.find({ userId: user.userId, isDeleted: { $ne: true } }).lean();

    const results: VectorSearchResult[] = [];

    for (const doc of docs) {
      const chunks = chunkContractText(doc.textContent || "");
      chunks.forEach((chunk, idx) => {
        // Generate real dense vector embedding for paragraph chunk
        const chunkVector = generateDenseVectorEmbedding(chunk, 128);
        const score = computeVectorCosineSimilarity(queryVector, chunkVector);

        if (score > 0.05) {
          results.push({
            docId: (doc._id as any).toString(),
            docTitle: doc.title,
            chunkId: `chunk_${doc._id}_${idx}`,
            snippet: chunk.slice(0, 320) + "...",
            similarityScore: score,
            embeddingVector: chunkVector.slice(0, 8), // Provide 8-dim preview vector for UI telemetry
          });
        }
      });
    }

    // 3. Sort by vector similarity score descending
    results.sort((a, b) => b.similarityScore - a.similarityScore);

    return NextResponse.json({
      success: true,
      query,
      dimensions: 128,
      matchCount: results.length,
      results: results.slice(0, 10),
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Vector search failed" }, { status: 500 });
  }
}
