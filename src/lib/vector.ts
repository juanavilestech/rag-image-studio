/**
 * Vector Mathematics & Semantic Embeddings Utility
 */

export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length === 0 || vecB.length === 0) return 0;
  
  // Use minimum length if dimensions differ
  const len = Math.min(vecA.length, vecB.length);
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < len; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  if (normA === 0 || normB === 0) return 0;
  const similarity = dotProduct / (normA * normB);
  
  // Normalize to 0 .. 1 range for clarity
  return Math.max(0, Math.min(1, (similarity + 1) / 2));
}

export function normalizeVector(vec: number[]): number[] {
  let norm = 0;
  for (const v of vec) norm += v * v;
  norm = Math.sqrt(norm);
  if (norm === 0) return vec;
  return vec.map((v) => v / norm);
}

/**
 * Local Semantic Vectorizer (Dimension: 128)
 * Generates dense semantic representations using character n-grams,
 * word stems, and hashed feature projection.
 * Guarantees zero external dependency fallback.
 */
export function generateLocalEmbedding(text: string, dimensions = 128): number[] {
  const vector = new Array<number>(dimensions).fill(0);
  const normalized = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const tokens = normalized.split(/\W+/).filter(Boolean);

  if (tokens.length === 0) return vector;

  // Process whole tokens
  for (const token of tokens) {
    const hash = hashString(token);
    const index = Math.abs(hash) % dimensions;
    vector[index] += 1.5;

    // Character 3-grams for morphological similarity
    for (let i = 0; i <= token.length - 3; i++) {
      const tri = token.slice(i, i + 3);
      const triHash = hashString(tri);
      const triIndex = Math.abs(triHash) % dimensions;
      vector[triIndex] += 0.5;
    }
  }

  // Token pair bigrams for contextual association
  for (let i = 0; i < tokens.length - 1; i++) {
    const bigram = `${tokens[i]}_${tokens[i + 1]}`;
    const biHash = hashString(bigram);
    const biIndex = Math.abs(biHash) % dimensions;
    vector[biIndex] += 1.0;
  }

  return normalizeVector(vector);
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}
