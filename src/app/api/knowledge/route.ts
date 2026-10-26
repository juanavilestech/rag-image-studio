import { NextRequest, NextResponse } from 'next/server';
import { getKnowledgeBase, addKnowledgeChunk, deleteKnowledgeChunk } from '@/lib/storage';
import { generateLocalEmbedding } from '@/lib/vector';
import { getEmbedding } from '@/lib/gemini';
import { getConfig } from '@/lib/storage';
import { KnowledgeChunk } from '@/types';

export async function GET() {
  try {
    const chunks = getKnowledgeBase();
    return NextResponse.json({ chunks });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al obtener base de conocimiento';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, category, description, modifiers, keywords } = body;

    if (!name || !modifiers) {
      return NextResponse.json(
        { error: 'El nombre y los modificadores visuales son obligatorios.' },
        { status: 400 }
      );
    }

    const config = getConfig();
    const textToEmbed = `${name} ${description || ''} ${(keywords || []).join(' ')} ${modifiers}`;
    const embedding = await getEmbedding(textToEmbed, config.geminiApiKey);

    const newChunk: KnowledgeChunk = {
      id: `chunk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      category: category || 'custom',
      description: (description || '').trim(),
      modifiers: modifiers.trim(),
      keywords: Array.isArray(keywords)
        ? keywords.map((k: string) => k.trim())
        : (keywords || '').split(',').map((k: string) => k.trim()).filter(Boolean),
      embedding: embedding && embedding.length > 0 ? embedding : generateLocalEmbedding(textToEmbed),
      createdAt: new Date().toISOString(),
    };

    const updated = addKnowledgeChunk(newChunk);
    return NextResponse.json({ success: true, chunk: newChunk, total: updated.length });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al guardar nuevo conocimiento';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID es requerido' }, { status: 400 });
    }

    const updated = deleteKnowledgeChunk(id);
    return NextResponse.json({ success: true, count: updated.length });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al eliminar conocimiento';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
