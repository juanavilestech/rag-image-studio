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
  Compass,
  Maximize2,
  Share2,
  Layers,
  Camera,
  Cpu,
  ChevronRight,
} from 'lucide-react';
import { RAGResponse, KnowledgeChunk } from '@/types';

interface GeneratorTabProps {
  onGenerationComplete: () => void;
}

const SAMPLE_PROMPTS = [
  { text: 'Un gato astronauta flotando entre nebulosas cósmicas', tag: 'Sci-Fi' },
  { text: 'Calle Tokio bajo lluvia nocturna con reflejos de autos y luces de neón', tag: 'Cyberpunk' },
  { text: 'Retrato de un anciano sabio con luz natural suave y mirada penetrante', tag: 'Retrato' },
  { text: 'Castillo flotante en el cielo rodeado de nubes y praderas verdes', tag: 'Ghibli' },
  { text: 'Gota de rocío matutina sobre pétalo de flor con refracción de prisma', tag: 'Macro' },
  { text: 'Diorama en miniatura con textura de arcilla de una acogedora cafetería', tag: '3D Clay' },
];

export function GeneratorTab({ onGenerationComplete }: GeneratorTabProps) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RAGResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // RAG Configuration
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  const [topK, setTopK] = useState<number>(2);
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '9:16'>('1:1');
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
    setActiveStepIndex(1); // Embedding

    const t1 = setTimeout(() => setActiveStepIndex(2), 800); // Retrieval
    const t2 = setTimeout(() => setActiveStepIndex(3), 1600); // Augment
    const t3 = setTimeout(() => setActiveStepIndex(4), 2500); // Diffusion

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
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      setLoading(false);
      setActiveStepIndex(0);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Top Hero Pipeline Flow Visualization */}
      <div className="relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-8 border border-white/10">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <BrainCircuit className="h-3.5 w-3.5" />
            <span>Pipeline RAG de Doble Sentido</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Generador Visual con <span className="text-gradient">Enriquecimiento Vectorial</span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-300 max-w-2xl leading-relaxed">
            Escribe una idea en lenguaje coloquial. El sistema calcula su vector de características,
            recupera directivas ópticas y de iluminación afines de la base de conocimiento y sintetiza un
            prompt fotográfico maestro antes de la difusión.
          </p>

          {/* Interactive Pipeline Node Diagram */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className={`p-3 rounded-2xl border transition-all duration-300 ${
              activeStepIndex === 1
                ? 'bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-500/20'
                : 'bg-zinc-950/60 border-white/[0.06]'
            }`}>
              <div className="flex items-center justify-between font-bold text-zinc-300 mb-1">
                <span>1. Embeddings</span>
                <span className="text-[10px] font-mono text-indigo-400">768-D</span>
              </div>
              <p className="text-[11px] text-zinc-400">Proyección matemática del texto a espacio vectorial.</p>
            </div>

            <div className={`p-3 rounded-2xl border transition-all duration-300 ${
              activeStepIndex === 2
                ? 'bg-purple-600/20 border-purple-500 shadow-lg shadow-purple-500/20'
                : 'bg-zinc-950/60 border-white/[0.06]'
            }`}>
              <div className="flex items-center justify-between font-bold text-zinc-300 mb-1">
                <span>2. Retrieval</span>
                <span className="text-[10px] font-mono text-purple-400">Cosine</span>
              </div>
              <p className="text-[11px] text-zinc-400">Búsqueda de los Top-K estilos con mayor similitud.</p>
            </div>

            <div className={`p-3 rounded-2xl border transition-all duration-300 ${
              activeStepIndex === 3
                ? 'bg-pink-600/20 border-pink-500 shadow-lg shadow-pink-500/20'
                : 'bg-zinc-950/60 border-white/[0.06]'
            }`}>
              <div className="flex items-center justify-between font-bold text-zinc-300 mb-1">
                <span>3. Augmentation</span>
                <span className="text-[10px] font-mono text-pink-400">LLM Master</span>
              </div>
              <p className="text-[11px] text-zinc-400">Fusión de la idea con cámaras, luces y composición.</p>
            </div>

            <div className={`p-3 rounded-2xl border transition-all duration-300 ${
              activeStepIndex === 4
                ? 'bg-emerald-600/20 border-emerald-500 shadow-lg shadow-emerald-500/20'
                : 'bg-zinc-950/60 border-white/[0.06]'
            }`}>
              <div className="flex items-center justify-between font-bold text-zinc-300 mb-1">
                <span>4. Generación</span>
                <span className="text-[10px] font-mono text-emerald-400">Flux / Imagen</span>
              </div>
              <p className="text-[11px] text-zinc-400">Renderizado de imagen y guardado en galería.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Wand2 className="h-4 w-4 text-indigo-400" />
                <span>Describe tu Imagen</span>
              </h2>
              <span className="text-[11px] text-zinc-400 font-medium">Español o Inglés</span>
            </div>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <textarea
                  rows={4}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ej: Un zorro místico con pelaje brillante paseando bajo la lluvia de cerezos..."
                  className="w-full bg-zinc-950/90 border border-white/[0.08] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-2xl p-4 text-white text-sm placeholder:text-zinc-600 resize-none outline-none transition duration-200 leading-relaxed shadow-inner"
                  disabled={loading}
                />
              </div>

              {/* Inspiration Chips */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-zinc-400 flex items-center gap-1">
                    <Compass className="h-3.5 w-3.5 text-zinc-500" />
                    Inspiración rápida:
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {SAMPLE_PROMPTS.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPrompt(item.text)}
                      disabled={loading}
                      className="text-left text-xs bg-zinc-950/70 hover:bg-zinc-800/80 border border-white/[0.06] hover:border-indigo-500/40 p-2.5 rounded-xl transition duration-150 group flex flex-col justify-between"
                    >
                      <span className="text-zinc-300 group-hover:text-white line-clamp-1">
                        {item.text}
                      </span>
                      <span className="text-[10px] text-indigo-400 font-mono font-semibold mt-1">
                        #{item.tag}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* RAG Controls */}
              <div className="pt-4 border-t border-white/[0.06] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                    <Sliders className="h-3.5 w-3.5 text-indigo-400" />
                    Modo RAG:
                  </span>
                  <div className="flex bg-zinc-950 p-1 rounded-xl border border-white/[0.08] text-xs">
                    <button
                      type="button"
                      onClick={() => setMode('auto')}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                        mode === 'auto'
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Auto-Vectorial
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode('manual')}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                        mode === 'manual'
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Fijar Estilo
                    </button>
                  </div>
                </div>

                {mode === 'auto' ? (
                  <div className="flex items-center justify-between text-xs text-zinc-400 bg-zinc-950/80 p-3 rounded-2xl border border-white/[0.06]">
                    <span>Fusión de directivas (Top-K):</span>
                    <select
                      value={topK}
                      onChange={(e) => setTopK(Number(e.target.value))}
                      className="bg-zinc-900 text-white border border-white/10 rounded-xl px-2.5 py-1.5 outline-none text-xs font-semibold"
                      disabled={loading}
                    >
                      <option value={1}>1 Estilo Principal</option>
                      <option value={2}>2 Estilos (Híbrido óptico)</option>
                      <option value={3}>3 Estilos (Profundo)</option>
                    </select>
                  </div>
                ) : (
                  <div className="space-y-1.5 bg-zinc-950/80 p-3 rounded-2xl border border-white/[0.06]">
                    <label className="text-xs text-zinc-300 block font-medium">
                      Estilo específico de la base de conocimiento:
                    </label>
                    <select
                      value={selectedStyleId}
                      onChange={(e) => setSelectedStyleId(e.target.value)}
                      className="w-full bg-zinc-900 text-white border border-white/10 rounded-xl px-3 py-2 text-xs outline-none font-semibold"
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

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="w-full mt-2 py-4 px-5 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:from-indigo-600 hover:to-pink-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-2xl shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2.5 transition duration-200 group text-sm"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin text-white" />
                    <span>Ejecutando RAG Pipeline...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 group-hover:rotate-12 transition duration-200" />
                    <span>Generar Imagen con RAG</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition duration-200" />
                  </>
                )}
              </button>
            </form>

            {error && (
              <div className="p-4 bg-red-950/40 border border-red-800/60 rounded-2xl flex items-start gap-3 text-xs text-red-200">
                <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Visual Result & Real-Time RAG Inspector */}
        <div className="lg:col-span-7 space-y-6">
          {result ? (
            <div className="glass-panel rounded-3xl overflow-hidden shadow-2xl border border-white/10">
              {/* Image Preview Container */}
              <div className="relative aspect-square sm:aspect-[4/3] bg-zinc-950 flex items-center justify-center overflow-hidden group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={result.imageUrl}
                  alt={result.originalPrompt}
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-[1.02]"
                />

                {/* Floating overlay actions */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-white border border-white/10 uppercase tracking-wider shadow-lg">
                    {result.engine}
                  </span>
                  <button
                    onClick={() => setLightboxOpen(true)}
                    className="p-2.5 rounded-xl bg-black/70 hover:bg-black/90 backdrop-blur-md text-white border border-white/10 transition shadow-lg"
                    title="Ampliar imagen"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </button>
                  <a
                    href={result.imageUrl}
                    target="_blank"
                    rel="noreferrer"
                    download
                    className="p-2.5 rounded-xl bg-black/70 hover:bg-black/90 backdrop-blur-md text-white border border-white/10 transition shadow-lg"
                    title="Descargar imagen"
                  >
                    <Download className="h-4 w-4" />
                  </a>
                </div>
              </div>

              {/* RAG Inspector Panel */}
              <div className="p-6 sm:p-7 space-y-6">
                {/* Retrieved styles */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                      <BrainCircuit className="h-4 w-4" />
                      Directivas RAG Recuperadas por Similitud Coseno
                    </h3>
                    <span className="text-[10px] text-zinc-500 font-mono">Top Matches</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {result.retrievedStyles.map((style, idx) => (
                      <div
                        key={idx}
                        className="bg-zinc-950/80 border border-white/[0.08] rounded-2xl p-4 space-y-2 relative overflow-hidden"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">
                            {style.name}
                          </span>
                          <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                            {(style.similarity * 100).toFixed(1)}% Similitud
                          </span>
                        </div>

                        {/* Progress Bar of Similarity */}
                        <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-emerald-500 to-indigo-500 h-full rounded-full"
                            style={{ width: `${Math.min(100, Math.max(10, style.similarity * 100))}%` }}
                          ></div>
                        </div>

                        <p className="text-[11px] text-zinc-400 line-clamp-2 italic leading-relaxed">
                          {style.modifiers}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Explanation */}
                {result.explanation && (
                  <div className="bg-indigo-950/30 border border-indigo-500/25 rounded-2xl p-4 text-xs text-indigo-200 leading-relaxed flex items-start gap-2.5">
                    <Sparkles className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-indigo-300 font-semibold block mb-0.5">
                        Síntesis de Augmentation:
                      </strong>
                      {result.explanation}
                    </div>
                  </div>
                )}

                {/* Comparison Original vs Enriched Prompt */}
                <div className="space-y-4 pt-4 border-t border-white/[0.06] text-xs">
                  <div>
                    <span className="text-zinc-500 font-medium block mb-1">
                      1. Prompt del Usuario:
                    </span>
                    <p className="text-zinc-300 bg-zinc-950/80 p-3 rounded-xl border border-white/[0.06]">
                      &quot;{result.originalPrompt}&quot;
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-indigo-400 font-bold flex items-center gap-1.5">
                        <Wand2 className="h-3.5 w-3.5" />
                        2. Master Prompt Enriquecido por IA (Para el modelo de difusión):
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(result.augmentedPrompt)}
                        className="text-zinc-400 hover:text-white flex items-center gap-1 text-[11px] font-medium transition"
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

                    <div className="text-zinc-200 bg-zinc-950/90 p-4 rounded-xl border border-indigo-500/30 font-mono text-[11px] leading-relaxed select-all">
                      {result.augmentedPrompt}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="h-full min-h-[480px] border-2 border-dashed border-white/[0.08] rounded-3xl flex flex-col items-center justify-center p-8 text-center bg-zinc-900/15 backdrop-blur-sm">
              <div className="h-20 w-20 rounded-3xl bg-zinc-900/80 border border-white/[0.08] flex items-center justify-center text-zinc-500 mb-4 shadow-xl shadow-black/40">
                <Eye className="h-9 w-9 text-indigo-400/60" />
              </div>
              <h3 className="text-lg font-bold text-white">
                El resultado del RAG aparecerá aquí
              </h3>
              <p className="text-xs text-zinc-400 max-w-md mt-2 leading-relaxed">
                Ingresa una frase en el panel izquierdo y presiona &quot;Generar Imagen con RAG&quot;
                para observar en tiempo real la recuperación de conocimientos y la creación visual.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && result && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden bg-zinc-950 border border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={result.imageUrl}
              alt={result.originalPrompt}
              className="w-full h-full object-contain max-h-[85vh]"
            />
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 h-9 w-9 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center text-sm font-bold border border-white/10"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
