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
  Maximize2,
  Clock,
  Compass,
} from 'lucide-react';
import { GenerationRecord } from '@/types';

interface GalleryRecord extends GenerationRecord {
  searchSimilarity?: number;
}

const QUICK_SEMANTIC_SEARCHES = [
  'Vehículos veloces de noche',
  'Soledad cósmica y estrellas',
  'Naturaleza mágica y rocío',
  'Retratos clásicos al óleo',
];

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

  const handleQuickSearch = (query: string) => {
    setSearch(query);
    fetchCreations(query);
  };

  const handleClearSearch = () => {
    setSearch('');
    fetchCreations('');
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('¿Deseas eliminar esta creación de la base de datos?')) return;

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
    <div className="space-y-8">
      {/* Search Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-5 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl pointer-events-none"></div>

        <div className="max-w-3xl space-y-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider mb-3">
              <BrainCircuit className="h-3.5 w-3.5" />
              <span>Búsqueda Vectorial por Significado</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Galería Persistente con <span className="text-gradient">Similitud Coseno</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 mt-1 leading-relaxed">
              Cada creación se guarda junto a su vector multidimensional. Escribe una idea o sentimiento
              (ej: &quot;máquinas veloces&quot; o &quot;soledad y frío&quot;) y el motor recuperará las obras
              más afines conceptualmente.
            </p>
          </div>

          {/* Search Input Bar */}
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="h-4 w-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Busca por concepto (ej: 'animales espaciales' o 'ciudad lluviosa')..."
                className="w-full bg-zinc-950/90 border border-white/[0.08] focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm text-white placeholder:text-zinc-600 outline-none transition shadow-inner"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-purple-600/25"
              >
                {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                <span>Buscar</span>
              </button>
              {search && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="px-4 py-3 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 rounded-2xl text-xs sm:text-sm font-semibold transition"
                >
                  Restablecer
                </button>
              )}
            </div>
          </form>

          {/* Quick Search Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] text-zinc-500 font-medium flex items-center gap-1">
              <Compass className="h-3 w-3" />
              Sugerencias:
            </span>
            {QUICK_SEMANTIC_SEARCHES.map((query, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleQuickSearch(query)}
                className="text-[11px] bg-zinc-950/70 hover:bg-zinc-800 border border-white/[0.06] text-zinc-400 hover:text-white px-3 py-1 rounded-full transition"
              >
                {query}
              </button>
            ))}
          </div>

          {isSemantic && (
            <div className="text-xs text-purple-300 flex items-center gap-2 font-medium bg-purple-950/30 border border-purple-500/20 p-2.5 rounded-xl">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span>Resultados ordenados por Similitud Coseno respecto a tu búsqueda conceptual.</span>
            </div>
          )}
        </div>
      </div>

      {/* Grid of Saved Creations */}
      {creations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {creations.map((creation) => (
            <div
              key={creation.id}
              onClick={() => setSelectedCreation(creation)}
              className="group cursor-pointer glass-panel rounded-3xl overflow-hidden transition-all duration-300 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1 flex flex-col justify-between"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-square bg-zinc-950 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={creation.imageUrl}
                  alt={creation.originalPrompt}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  loading="lazy"
                />

                {/* Similarity Badge */}
                {creation.searchSimilarity !== undefined && (
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-500/90 text-white shadow-lg backdrop-blur-md">
                      {(creation.searchSimilarity * 100).toFixed(0)}% afín
                    </span>
                  </div>
                )}

                {/* Engine Badge */}
                <div className="absolute top-3 right-3">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-zinc-300 border border-white/10 uppercase tracking-wider">
                    {creation.engine}
                  </span>
                </div>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={(e) => handleDelete(creation.id, e)}
                  className="absolute bottom-3 right-3 p-2.5 rounded-xl bg-black/80 text-zinc-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition backdrop-blur-md"
                  title="Eliminar de la galería"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Card Meta Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <p className="text-xs sm:text-sm font-bold text-white line-clamp-2 leading-snug">
                    &quot;{creation.originalPrompt}&quot;
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {creation.retrievedStyles?.slice(0, 2).map((s, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-zinc-950/80 border border-white/[0.06] text-zinc-400 px-2.5 py-0.5 rounded-lg font-medium"
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-zinc-500">
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="h-3 w-3" />
                    {new Date(creation.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-indigo-400 font-semibold group-hover:underline flex items-center gap-1">
                    Inspeccionar <ExternalLink className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border-2 border-dashed border-white/[0.08] rounded-3xl p-12 text-center bg-zinc-900/10">
          <div className="h-16 w-16 rounded-3xl bg-zinc-900 border border-white/[0.08] flex items-center justify-center mx-auto text-zinc-500 mb-3 shadow-xl">
            <SearchX className="h-8 w-8 text-indigo-400/50" />
          </div>
          <h3 className="text-lg font-bold text-white">
            {search ? 'Sin coincidencias semánticas' : 'Tu galería está vacía'}
          </h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto mt-1 leading-relaxed">
            {search
              ? 'Prueba con otra palabra clave conceptual o presiona restablecer.'
              : 'Genera tu primera imagen en el Generador RAG para almacenarla en la base de datos vectorial.'}
          </p>
        </div>
      )}

      {/* Inspect Modal */}
      {selectedCreation && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={() => setSelectedCreation(null)}
        >
          <div
            className="glass-panel rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-white/10 flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video bg-zinc-950 overflow-hidden shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedCreation.imageUrl}
                alt={selectedCreation.originalPrompt}
                className="w-full h-full object-contain"
              />
              <button
                type="button"
                onClick={() => setSelectedCreation(null)}
                className="absolute top-4 right-4 h-9 w-9 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center text-sm font-bold border border-white/10"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Idea Original (Usuario):
                </h3>
                <p className="text-sm font-bold text-white mt-1">
                  &quot;{selectedCreation.originalPrompt}&quot;
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5" />
                  Estilos RAG Recuperados:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2">
                  {selectedCreation.retrievedStyles?.map((s, i) => (
                    <div key={i} className="bg-zinc-950/80 p-3 rounded-2xl border border-white/[0.08] text-xs">
                      <div className="flex items-center justify-between font-bold text-white">
                        <span>{s.name}</span>
                        <span className="text-emerald-400 font-mono text-[10px] font-bold">
                          {(s.similarity * 100).toFixed(1)}%
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-1 italic line-clamp-2">{s.modifiers}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Prompt Maestro Enriquecido:
                </h3>
                <p className="text-xs text-zinc-300 font-mono bg-zinc-950/90 p-3.5 rounded-2xl border border-white/[0.08] mt-1.5 leading-relaxed select-all">
                  {selectedCreation.augmentedPrompt}
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <a
                  href={selectedCreation.imageUrl}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-indigo-600/20"
                >
                  <Download className="h-4 w-4" />
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
