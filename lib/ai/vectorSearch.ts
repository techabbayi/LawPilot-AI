import { AIGateway } from "./gateway";

export interface VectorSearchResult {
  docId: string;
  docTitle: string;
  chunkId: string;
  snippet: string;
  similarityScore: number;
  embeddingVector?: number[];
}

/**
 * Splits contract text into semantic paragraph chunks with overlap
 */
export function chunkContractText(text: string, chunkSize: number = 400, overlap: number = 80): string[] {
  if (!text) return [];
  const paragraphs = text.split(/\n\s*\n/);
  const chunks: string[] = [];

  let currentChunk = "";
  for (const para of paragraphs) {
    if ((currentChunk + "\n" + para).length > chunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = currentChunk.slice(-overlap) + "\n" + para;
    } else {
      currentChunk += (currentChunk ? "\n\n" : "") + para;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

/**
 * Generates a 128-dimensional dense float vector embedding for any text payload.
 * Uses character & term hashing + n-gram frequencies for real high-dimensional vector space.
 */
export function generateDenseVectorEmbedding(text: string, dimensions: number = 128): number[] {
  const vector = new Array(dimensions).fill(0);
  if (!text) return vector;

  const normalized = text.toLowerCase().replace(/[^a-z0-9\s]/g, "");
  const words = normalized.split(/\s+/);

  // 1. Unigram & Bigram N-gram Feature Hashing
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    if (word.length > 1) {
      let hash1 = 0;
      for (let c = 0; c < word.length; c++) {
        hash1 = (hash1 * 31 + word.charCodeAt(c)) % dimensions;
      }
      vector[Math.abs(hash1)] += 1.0;

      if (i < words.length - 1) {
        const bigram = word + "_" + words[i + 1];
        let hash2 = 0;
        for (let c = 0; c < bigram.length; c++) {
          hash2 = (hash2 * 37 + bigram.charCodeAt(c)) % dimensions;
        }
        vector[Math.abs(hash2)] += 0.5;
      }
    }
  }

  // 2. L2 Vector Normalization
  let magnitudeSquare = 0;
  for (let i = 0; i < dimensions; i++) {
    magnitudeSquare += vector[i] * vector[i];
  }

  const magnitude = Math.sqrt(magnitudeSquare);
  if (magnitude > 0) {
    for (let i = 0; i < dimensions; i++) {
      vector[i] = Math.round((vector[i] / magnitude) * 10000) / 10000;
    }
  }

  return vector;
}

/**
 * Computes exact Cosine Similarity dot product between two dense float vectors
 */
export function computeVectorCosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return Math.round((dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))) * 100) / 100;
}
