import fs from 'fs';
import path from 'path';
import { KnowledgeChunk, GenerationRecord } from '@/types';
import { getInitializedKnowledgeBase } from './knowledge-seed';

const DATA_DIR = path.join(process.cwd(), 'data');
const KNOWLEDGE_FILE = path.join(DATA_DIR, 'knowledge_base.json');
const CREATIONS_FILE = path.join(DATA_DIR, 'creations.json');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// ------------------- KNOWLEDGE BASE -------------------

export function getKnowledgeBase(): KnowledgeChunk[] {
  ensureDataDir();
  if (!fs.existsSync(KNOWLEDGE_FILE)) {
    const initial = getInitializedKnowledgeBase();
    saveKnowledgeBase(initial);
    return initial;
  }
  try {
    const raw = fs.readFileSync(KNOWLEDGE_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return getInitializedKnowledgeBase();
  }
}

export function saveKnowledgeBase(chunks: KnowledgeChunk[]): void {
  ensureDataDir();
  fs.writeFileSync(KNOWLEDGE_FILE, JSON.stringify(chunks, null, 2), 'utf-8');
}

export function addKnowledgeChunk(chunk: KnowledgeChunk): KnowledgeChunk[] {
  const current = getKnowledgeBase();
  const updated = [chunk, ...current];
  saveKnowledgeBase(updated);
  return updated;
}

export function deleteKnowledgeChunk(id: string): KnowledgeChunk[] {
  const current = getKnowledgeBase();
  const updated = current.filter((c) => c.id !== id);
  saveKnowledgeBase(updated);
  return updated;
}

// ------------------- CREATIONS (GALLERY) -------------------

export function getCreations(): GenerationRecord[] {
  ensureDataDir();
  if (!fs.existsSync(CREATIONS_FILE)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(CREATIONS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveCreation(record: GenerationRecord): GenerationRecord[] {
  const current = getCreations();
  const updated = [record, ...current];
  ensureDataDir();
  fs.writeFileSync(CREATIONS_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  return updated;
}

export function deleteCreation(id: string): GenerationRecord[] {
  const current = getCreations();
  const updated = current.filter((c) => c.id !== id);
  ensureDataDir();
  fs.writeFileSync(CREATIONS_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  return updated;
}

// ------------------- CONFIGURATION -------------------

export interface AppConfig {
  geminiApiKey?: string;
  defaultEngine: 'auto' | 'imagen-3' | 'pollinations-flux' | 'pollinations-turbo';
}

export function getConfig(): AppConfig {
  ensureDataDir();
  if (!fs.existsSync(CONFIG_FILE)) {
    return {
      geminiApiKey: process.env.GEMINI_API_KEY || '',
      defaultEngine: 'auto',
    };
  }
  try {
    const raw = fs.readFileSync(CONFIG_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return {
      geminiApiKey: parsed.geminiApiKey || process.env.GEMINI_API_KEY || '',
      defaultEngine: parsed.defaultEngine || 'auto',
    };
  } catch {
    return {
      geminiApiKey: process.env.GEMINI_API_KEY || '',
      defaultEngine: 'auto',
    };
  }
}

export function saveConfig(config: Partial<AppConfig>): AppConfig {
  const current = getConfig();
  const updated = { ...current, ...config };
  ensureDataDir();
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  return updated;
}
