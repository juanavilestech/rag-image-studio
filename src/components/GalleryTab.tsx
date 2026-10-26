'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Trash2,
  Download,
  Sparkles,
  ExternalLink,
  Layers,
  Calendar,
  RefreshCw,
  SearchX,
  BrainCircuit,
} from 'lucide-react';
import { GenerationRecord } from '@/types';

interface GalleryRecord extends GenerationRecord {
  searchSimilarity?: number;
}

export function GalleryTab() {
  const [creations, setCreations] = useState<GalleryRecord[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedCreation, setSelectedCreation] = useState<GalleryRecord | null>(null);
  const [isSemantic, setIsSemantic] = useState(false);

  const fetchCreations = useCallback(async (query = '') => {
    setLoading(true);
    try {
      const url = query.trim()
        ? `/api/creations?search=${encodeURIComponent(query.trim())}`
        : '/api/creations';
      const res = await fetch(url);
      const data = await res.json();
      setCreations(data.creations || []);
      setIsSemantic(Boolean(data.isSemanticSearch));
    } catch (err) {
      console.warn('Error loading creations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCreations();
  }, [fetchCreations]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCreations(search);
  };

  const handleClearSearch = () => {
    setSearch('');
    fetchCreations('');
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('¿Deseas eliminar esta creación?')) return;

    try {
      await fetch(`/api/creations?id=${id}`, { method: 'DELETE' });
      setCreations((prev) => prev.filter((c) => c.id !== id));
      if (selectedCreation?.id === id) {
        setSelectedCreation(null);
      }
    } catch (err) {
      console.error('Error deleting creation:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Header Banner */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 shadow-lg">
        <div className="max-w-3xl space-y-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <BrainCircuit className="h-3.5 w-3.5" />
              Búsqueda Vectorial por Significado
            </div>
            <h2 className="text-xl font-bold text-white">Galería con Búsqueda Semántica</h2>
            <p className="text-xs text-zinc-400 mt-1">
              Las frases e imágenes se guardan con su vector de características. Puedes buscar por
              concepto o sentimiento (ej: &quot;máquinas veloces&quot; o &quot;soledad y frío&quot;) y el
              sistema recuperará las creaciones más afines aunque no compartan las mismas palabras exactas.
            </p>
          </div>

          {/* Search Input Bar */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="h-4 w-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Busca por significado semántico (ej: 'animales espaciales' o 'ciudad lluviosa')..."
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-purple-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-zinc-600 outline-none transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-md shadow-purple-600/20"
            >
              {loading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
              <span>Buscar</span>
            </button>
            {search && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="px-3 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-medium transition"
              >
                Limpiar
              </button>
            )}
          </form>

          {isSemantic && (
            <div className="text-xs text-purple-400 flex items-center gap-1 font-medium">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Resultados ordenados por Similitud Coseno respecto a tu búsqueda.</span>
            </div>
          )}
        </div>
      </div>

      {/* Grid of Creations */}
      {creations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {creations.map((creation) => (
            <div
              key={creation.id}
              onClick={() => setSelectedCreation(creation)}
              className="group cursor-pointer bg-zinc-900 border border-zinc-800 hover:border-purple-500/50 rounded-2xl overflow-hidden transition duration-200 shadow-lg flex flex-col"
            >
              {/* Image Thumbnail */}
              <div className="relative aspect-square bg-zinc-950 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={creation.imageUrl}
                  alt={creation.originalPrompt}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  loading="lazy"
                />

                {/* Similarity score badge (if semantic search active) */}
                {creation.searchSimilarity !== undefined && (
                  <div className="absolute top-2.5 left-2.5">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/90 text-white shadow-md">
                      {(creation.searchSimilarity * 100).toFixed(0)}% afín
                    </span>
                  </div>
                )}

                {/* Engine badge */}
                <div className="absolute top-2.5 right-2.5">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-zinc-300 border border-white/10 uppercase">
                    {creation.engine}
                  </span>
                </div>

                {/* Delete button */}
                <button
                  type="button"
                  onClick={(e) => handleDelete(creation.id, e)}
                  className="absolute bottom-2.5 right-2.5 p-2 rounded-lg bg-black/70 text-zinc-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition backdrop-blur-sm"
                  title="Eliminar creación"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Card Meta Content */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <p className="text-xs font-semibold text-white line-clamp-2 leading-snug">
                    &quot;{creation.originalPrompt}&quot;
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {creation.retrievedStyles?.slice(0, 2).map((s, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-md"
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[10px] text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(creation.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-indigo-400 font-medium group-hover:underline flex items-center gap-0.5">
                    Inspeccionar <ExternalLink className="h-2.5 w-2.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border-2 border-dashed border-zinc-800 rounded-2xl p-12 text-center bg-zinc-900/20">
          <div className="h-14 w-14 rounded-2xl bg-zinc-800 flex items-center justify-center mx-auto text-zinc-500 mb-3">
            <SearchX className="h-7 w-7 text-zinc-600" />
          </div>
          <h3 className="text-base font-semibold text-zinc-300">
            {search ? 'Sin coincidencias semánticas' : 'Tu galería está vacía'}
          </h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1">
            {search
              ? 'Prueba con otra palabra clave conceptual o limpia la búsqueda.'
              : 'Genera tu primera imagen con RAG desde la pestaña Generador para guardarla en la base vectorial.'}
          </p>
        </div>
      )}

      {/* Detail Modal */}
      {selectedCreation && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            <div className="relative aspect-video sm:aspect-[16/10] bg-zinc-950 overflow-hidden shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedCreation.imageUrl}
                alt={selectedCreation.originalPrompt}
                className="w-full h-full object-contain"
              />
              <button
                type="button"
                onClick={() => setSelectedCreation(null)}
                className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Idea Original (Usuario):
                </h3>
                <p className="text-sm font-bold text-white mt-0.5">
                  &quot;{selectedCreation.originalPrompt}&quot;
                </p>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                  <Layers className="h-3.5 w-3.5" />
                  Estilos RAG Recuperados:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1.5">
                  {selectedCreation.retrievedStyles?.map((s, i) => (
                    <div key={i} className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 text-xs">
                      <div className="flex items-center justify-between font-semibold text-white">
                        <span>{s.name}</span>
                        <span className="text-emerald-400 font-mono text-[10px]">
                          {(s.similarity * 100).toFixed(1)}%
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-400 mt-1 italic">{s.modifiers}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Prompt Maestro Enriquecido:
                </h3>
                <p className="text-xs text-zinc-300 font-mono bg-zinc-950 p-3 rounded-lg border border-zinc-800 mt-1 leading-relaxed">
                  {selectedCreation.augmentedPrompt}
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <a
                  href={selectedCreation.imageUrl}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Descargar Imagen</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
