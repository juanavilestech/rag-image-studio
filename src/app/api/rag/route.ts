import { NextRequest, NextResponse } from 'next/server';
import { executeRAGPipeline } from '@/lib/rag';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, topK = 2, manualStyleId } = body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'El texto o frase es obligatorio.' },
        { status: 400 }
      );
    }

    const result = await executeRAGPipeline(prompt.trim(), Number(topK) || 2, manualStyleId);
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error('Error in /api/rag:', error);
    const message = error instanceof Error ? error.message : 'Error interno al procesar RAG';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
