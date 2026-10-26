'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  Sliders,
  CheckCircle2,
  Copy,
  Download,
  AlertCircle,
  Wand2,
  BrainCircuit,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { RAGResponse, KnowledgeChunk } from '@/types';

interface GeneratorTabProps {
  onGenerationComplete: () => void;
}

const SAMPLE_PROMPTS = [
  'Un gato astronauta flotando entre nebulosas de colores cósmicos',
  'Calle nocturna futurista bajo una densa lluvia con reflejos de autos',
  'Retrato de una anciana sabia con mirada penetrante e iluminación natural',
  'Castillo flotante en el cielo rodeado de nubes y praderas verdes',
  'Gota de rocío matutina sobre el pétalo de una flor con reflejos de prisma',
  'Diorama en miniatura de una acogedora cafetería de noche',
];

export function GeneratorTab({ onGenerationComplete }: GeneratorTabProps) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RAGResponse | null>(null);
  const [copied, setCopied] = useState(false);

  // RAG Configuration
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  const [topK, setTopK] = useState<number>(2);
  const [knowledgeList, setKnowledgeList] = useState<KnowledgeChunk[]>([]);
  const [selectedStyleId, setSelectedStyleId] = useState<string>('');

  useEffect(() => {
    fetch('/api/knowledge')
      .then((res) => res.json())
      .then((data) => {
        if (data.chunks) {
          setKnowledgeList(data.chunks);
          if (data.chunks.length > 0) {
            setSelectedStyleId(data.chunks[0].id);
          }
        }
      })
      .catch((err) => console.warn('Error loading knowledge:', err));
  }, []);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || loading) return;

    setError(null);
    setLoading(true);
    setCurrentStep('1/4: Generando vector matemático (Embeddings)...');

    const stepTimer1 = setTimeout(() => {
      setCurrentStep('2/4: Recuperando conocimientos afines por similitud coseno...');
    }, 900);

    const stepTimer2 = setTimeout(() => {
      setCurrentStep('3/4: Enriqueciendo prompt con directivas visuales (Augmentation)...');
    }, 1800);

    const stepTimer3 = setTimeout(() => {
      setCurrentStep('4/4: Sintetizando imagen con motor de difusión...');
    }, 2800);

    try {
      const response = await fetch('/api/rag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          topK: mode === 'auto' ? topK : 1,
          manualStyleId: mode === 'manual' ? selectedStyleId : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al procesar la solicitud.');
      }

      setResult(data);
      onGenerationComplete();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al conectar con el servidor.';
      setError(msg);
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);
      setLoading(false);
      setCurrentStep('');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Top Description Banner */}
      <div className="bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-zinc-900 border border-indigo-900/40 rounded-2xl p-6 sm:p-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <BrainCircuit className="h-3.5 w-3.5" />
            Flujo RAG de Dos Vías
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Generador de Imágenes con Enriquecimiento Vectorial
          </h1>
          <p className="mt-2 text-sm sm:text-base text-zinc-300 leading-relaxed">
            Escribe una frase sencilla en español. El sistema la convierte a un vector de características,
            busca en la base de conocimiento los estilos, lentes y paletas más acordes y sintetiza un
            prompt maestro para generar la imagen final.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form & Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Wand2 className="h-5 w-5 text-indigo-400" />
              1. Tu Idea o Frase
            </h2>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  Describe qué deseas ver (en lenguaje natural):
                </label>
                <textarea
                  rows={4}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ej: Un zorro místico con pelaje brillante en un bosque de cerezos..."
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl p-3.5 text-white text-sm placeholder:text-zinc-600 resize-none outline-none transition"
                  disabled={loading}
                />
              </div>

              {/* Sample Prompts */}
              <div>
                <span className="text-xs text-zinc-500 block mb-2 font-medium">
                  O prueba con estos ejemplos:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {SAMPLE_PROMPTS.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPrompt(sample)}
                      disabled={loading}
                      className="text-xs bg-zinc-800/80 hover:bg-zinc-750 hover:text-white text-zinc-400 px-2.5 py-1.5 rounded-lg border border-zinc-750 transition text-left truncate max-w-full"
                    >
                      {sample}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mode & RAG Settings */}
              <div className="pt-2 border-t border-zinc-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                    <Sliders className="h-3.5 w-3.5 text-zinc-400" />
                    Modo de Recuperación RAG:
                  </span>
                  <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-800 text-xs">
                    <button
                      type="button"
                      onClick={() => setMode('auto')}
                      className={`px-2.5 py-1 rounded-md font-medium transition ${
                        mode === 'auto'
                          ? 'bg-indigo-600 text-white shadow'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Automático (Vectorial)
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode('manual')}
                      className={`px-2.5 py-1 rounded-md font-medium transition ${
                        mode === 'manual'
                          ? 'bg-indigo-600 text-white shadow'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Fijar Estilo
                    </button>
                  </div>
                </div>

                {mode === 'auto' ? (
                  <div className="flex items-center justify-between text-xs text-zinc-400 bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-850">
                    <span>Nº de estilos a recuperar (Top-K):</span>
                    <select
                      value={topK}
                      onChange={(e) => setTopK(Number(e.target.value))}
                      className="bg-zinc-800 text-white border border-zinc-700 rounded-md px-2 py-1 outline-none text-xs"
                      disabled={loading}
                    >
                      <option value={1}>Top 1 (Más afín)</option>
                      <option value={2}>Top 2 (Fusión de estilos)</option>
                      <option value={3}>Top 3 (Enriquecimiento profundo)</option>
                    </select>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <label className="text-xs text-zinc-400 block">
                      Selecciona el estilo de la base de conocimiento:
                    </label>
                    <select
                      value={selectedStyleId}
                      onChange={(e) => setSelectedStyleId(e.target.value)}
                      className="w-full bg-zinc-950 text-white border border-zinc-800 rounded-xl px-3 py-2 text-xs outline-none"
                      disabled={loading}
                    >
                      {knowledgeList.map((k) => (
                        <option key={k.id} value={k.id}>
                          {k.name} ({k.category})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="w-full mt-3 py-3.5 px-4 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 hover:from-indigo-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition duration-200"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin text-white" />
                    <span>Procesando RAG...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Generar con RAG</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Error Message */}
            {error && (
              <div className="p-3.5 bg-red-950/40 border border-red-800/60 rounded-xl flex items-start gap-2.5 text-xs text-red-300">
                <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Loading Indicator */}
            {loading && (
              <div className="p-4 bg-zinc-950 border border-indigo-900/40 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-indigo-400">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-indigo-400 animate-ping"></span>
                    Pipeline RAG en Ejecución
                  </span>
                </div>
                <p className="text-xs text-zinc-300 font-mono">{currentStep}</p>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-pink-500 h-full w-2/3 animate-pulse"></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Visual Result & RAG Inspection */}
        <div className="lg:col-span-7 space-y-6">
          {result ? (
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
              {/* Image Preview Container */}
              <div className="relative aspect-square sm:aspect-[4/3] bg-zinc-950 flex items-center justify-center overflow-hidden group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={result.imageUrl}
                  alt={result.originalPrompt}
                  className="w-full h-full object-cover transition duration-300"
                />

                {/* Overlay actions */}
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/10 uppercase tracking-wider">
                    {result.engine}
                  </span>
                  <a
                    href={result.imageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-black/60 hover:bg-black/90 backdrop-blur-md text-white border border-white/10 transition"
                    title="Abrir en tamaño completo"
                  >
                    <Download className="h-4 w-4" />
                  </a>
                </div>
              </div>

              {/* RAG Inspector Breakdown */}
              <div className="p-6 space-y-5">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5 mb-2">
                    <BrainCircuit className="h-3.5 w-3.5" />
                    2. Conocimiento RAG Recuperado (Retrieval)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {result.retrievedStyles.map((style, idx) => (
                      <div
                        key={idx}
                        className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white truncate">
                            {style.name}
                          </span>
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                            {(style.similarity * 100).toFixed(1)}% Similitud
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 line-clamp-2 italic">
                          {style.modifiers}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Explanation */}
                {result.explanation && (
                  <div className="bg-indigo-950/20 border border-indigo-900/30 rounded-xl p-3 text-xs text-indigo-300">
                    <strong className="text-indigo-200">Explicación del Enriquecimiento: </strong>
                    {result.explanation}
                  </div>
                )}

                {/* Comparison Original vs Augmented */}
                <div className="space-y-3 pt-3 border-t border-zinc-800 text-xs">
                  <div>
                    <span className="text-zinc-500 font-medium block mb-1">
                      Texto Original (Usuario):
                    </span>
                    <p className="text-zinc-300 bg-zinc-950 p-2.5 rounded-lg border border-zinc-850">
                      &quot;{result.originalPrompt}&quot;
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-indigo-400 font-semibold flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        Prompt Maestro Enriquecido (RAG Augmentation):
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(result.augmentedPrompt)}
                        className="text-zinc-400 hover:text-white flex items-center gap-1 transition"
                      >
                        {copied ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>Copiar</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-zinc-200 bg-zinc-950 p-3 rounded-lg border border-indigo-900/40 font-mono text-[11px] leading-relaxed select-all">
                      {result.augmentedPrompt}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Empty State Placeholder */
            <div className="h-full min-h-[460px] border-2 border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center p-8 text-center bg-zinc-900/20">
              <div className="h-16 w-16 rounded-2xl bg-zinc-800/60 flex items-center justify-center text-zinc-500 mb-4">
                <Eye className="h-8 w-8 text-zinc-600" />
              </div>
              <h3 className="text-base font-semibold text-zinc-300">
                Tu resultado se mostrará aquí
              </h3>
              <p className="text-xs text-zinc-500 max-w-sm mt-1">
                Escribe una idea en el panel izquierdo y haz clic en &quot;Generar con RAG&quot; para
                observar el cálculo de similitud vectorial y la imagen resultante.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
