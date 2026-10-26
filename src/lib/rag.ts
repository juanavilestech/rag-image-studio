import { KnowledgeChunk, RetrievedChunk, RAGResponse } from '@/types';
import { cosineSimilarity } from './vector';
import { getEmbedding, augmentPrompt } from './gemini';
import { generateStudioImage } from './image-generator';
import { getKnowledgeBase, saveCreation, getConfig } from './storage';

export async function executeRAGPipeline(
  userPrompt: string,
  topK = 2,
  manualChunkId?: string
): Promise<RAGResponse> {
  const config = getConfig();
  const apiKey = config.geminiApiKey;
  const knowledgeBase = getKnowledgeBase();

  // Step 1: Embedding of the user query
  const queryEmbedding = await getEmbedding(userPrompt, apiKey);

  let selectedChunks: RetrievedChunk[] = [];

  if (manualChunkId) {
    const manual = knowledgeBase.find((k) => k.id === manualChunkId);
    if (manual) {
      selectedChunks = [{ chunk: manual, similarity: 1.0 }];
    }
  }

  if (selectedChunks.length === 0) {
    // Step 2: Retrieval - Compute Cosine Similarity across Knowledge Base
    const scoredChunks: RetrievedChunk[] = knowledgeBase.map((chunk) => {
      const chunkEmbedding = chunk.embedding && chunk.embedding.length > 0
        ? chunk.embedding
        : [];
      
      const similarity = chunkEmbedding.length > 0
        ? cosineSimilarity(queryEmbedding, chunkEmbedding)
        : 0;

      return { chunk, similarity };
    });

    // Sort by cosine similarity descending
    scoredChunks.sort((a, b) => b.similarity - a.similarity);

    // Filter top K results (or fallback to top 1 if similarity is low)
    selectedChunks = scoredChunks.slice(0, Math.max(1, topK));
  }

  const retrievedStyles = selectedChunks.map((item) => ({
    id: item.chunk.id,
    name: item.chunk.name,
    similarity: Number(item.similarity.toFixed(4)),
    modifiers: item.chunk.modifiers,
  }));

  // Step 3: Augmentation - Enrich prompt with LLM / Synthesizer
  const { augmentedPrompt, explanation } = await augmentPrompt(
    userPrompt,
    retrievedStyles,
    apiKey
  );

  // Step 4: Generation - Generate image
  const { imageUrl, engine } = await generateStudioImage(
    augmentedPrompt,
    apiKey,
    config.defaultEngine
  );

  const id = `gen_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const createdAt = new Date().toISOString();

  // Step 5: Store in Gallery with vector embedding for semantic search
  saveCreation({
    id,
    originalPrompt: userPrompt,
    augmentedPrompt,
    retrievedStyles,
    imageUrl,
    engine,
    embedding: queryEmbedding,
    createdAt,
  });

  return {
    id,
    originalPrompt: userPrompt,
    augmentedPrompt,
    retrievedStyles,
    imageUrl,
    engine,
    explanation,
    createdAt,
  };
}

/**
 * Semantic Search over saved creations gallery
 */
export async function searchCreationsSemantically(
  query: string,
  minSimilarity = 0.3
): Promise<Array<{ id: string; similarity: number }>> {
  const config = getConfig();
  const queryEmbedding = await getEmbedding(query, config.geminiApiKey);
  const { getCreations } = await import('./storage');
  const creations = getCreations();

  const results = creations.map((c) => {
    const similarity = cosineSimilarity(queryEmbedding, c.embedding || []);
    return {
      id: c.id,
      similarity: Number(similarity.toFixed(4)),
    };
  });

  return results
    .filter((r) => r.similarity >= minSimilarity)
    .sort((a, b) => b.similarity - a.similarity);
}
