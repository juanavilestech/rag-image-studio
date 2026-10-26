import { NextRequest, NextResponse } from 'next/server';
import { getConfig, saveConfig } from '@/lib/storage';

export async function GET() {
  try {
    const config = getConfig();
    const hasKey = Boolean(config.geminiApiKey && config.geminiApiKey.length > 5);
    const maskedKey = hasKey
      ? `${config.geminiApiKey!.slice(0, 4)}...${config.geminiApiKey!.slice(-4)}`
      : '';

    return NextResponse.json({
      hasApiKey: hasKey,
      maskedApiKey: maskedKey,
      defaultEngine: config.defaultEngine,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al obtener configuración';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { geminiApiKey, defaultEngine } = body;

    const updates: Record<string, unknown> = {};
    if (geminiApiKey !== undefined) {
      updates.geminiApiKey = geminiApiKey.trim();
    }
    if (defaultEngine !== undefined) {
      updates.defaultEngine = defaultEngine;
    }

    const updated = saveConfig(updates);
    const hasKey = Boolean(updated.geminiApiKey && updated.geminiApiKey.length > 5);

    return NextResponse.json({
      success: true,
      hasApiKey: hasKey,
      defaultEngine: updated.defaultEngine,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al guardar configuración';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
