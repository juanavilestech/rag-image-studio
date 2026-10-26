export interface KnowledgeChunk {
  id: string;
  name: string;
  category: 'fotografia' | 'arte' | 'iluminacion' | 'lentes' | 'estetica' | 'fantasia' | 'custom';
  description: string;
  modifiers: string; // The specific technical tokens (e.g., "35mm Panavision, Kodak Portra 400, f/1.4")
  keywords: string[];
  embedding?: number[]; // Vector embedding
  createdAt: string;
}

export interface RetrievedChunk {
  chunk: KnowledgeChunk;
  similarity: number; // Cosine similarity between 0 and 1
}

export interface GenerationRecord {
  id: string;
  originalPrompt: string;
  augmentedPrompt: string;
  retrievedStyles: Array<{
    id: string;
    name: string;
    similarity: number;
    modifiers: string;
  }>;
  imageUrl: string;
  engine: 'imagen-3' | 'pollinations-flux' | 'pollinations-turbo';
  embedding: number[];
  createdAt: string;
}

export interface RAGResponse {
  id: string;
  originalPrompt: string;
  augmentedPrompt: string;
  retrievedStyles: Array<{
    id: string;
    name: string;
    similarity: number;
    modifiers: string;
  }>;
  imageUrl: string;
  engine: string;
  explanation: string;
  createdAt: string;
}
