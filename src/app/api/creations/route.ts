import { NextRequest, NextResponse } from 'next/server';
import { getCreations, deleteCreation } from '@/lib/storage';
import { searchCreationsSemantically } from '@/lib/rag';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const searchQuery = searchParams.get('search');
    const creations = getCreations();

    if (!searchQuery || searchQuery.trim().length === 0) {
      return NextResponse.json({ creations });
    }

    // Semantic search query
    const rankedMatches = await searchCreationsSemantically(searchQuery.trim());
    const scoreMap = new Map(rankedMatches.map((m) => [m.id, m.similarity]));

    // Filter and attach similarity
    const filtered = creations
      .filter((c) => scoreMap.has(c.id))
      .map((c) => ({
        ...c,
        searchSimilarity: scoreMap.get(c.id) || 0,
      }))
      .sort((a, b) => (b.searchSimilarity || 0) - (a.searchSimilarity || 0));

    return NextResponse.json({ creations: filtered, isSemanticSearch: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al obtener creaciones';
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

    const updated = deleteCreation(id);
    return NextResponse.json({ success: true, count: updated.length });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al eliminar creación';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
