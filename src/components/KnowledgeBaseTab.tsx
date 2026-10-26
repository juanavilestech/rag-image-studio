'use client';

import React, { useState, useEffect } from 'react';
import {
  Database,
  Plus,
  Trash2,
  Sparkles,
  Layers,
  Camera,
  Palette,
  Lightbulb,
  Search,
  CheckCircle2,
  BrainCircuit,
  Filter,
} from 'lucide-react';
import { KnowledgeChunk } from '@/types';
import { cosineSimilarity, generateLocalEmbedding } from '@/lib/vector';

export function KnowledgeBaseTab() {
  const [chunks, setChunks] = useState<KnowledgeChunk[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [testQuery, setTestQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [notification, setNotification] = useState<string | null>(null);

  // New Chunk Form
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'fotografia' | 'arte' | 'iluminacion' | 'lentes' | 'estetica' | 'fantasia' | 'custom'>('estetica');
  const [description, setDescription] = useState('');
  const [modifiers, setModifiers] = useState('');
  const [keywords, setKeywords] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchKnowledge();
  }, []);

  const fetchKnowledge = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/knowledge');
      const data = await res.json();
      setChunks(data.chunks || []);
    } catch (err) {
      console.warn('Error loading knowledge chunks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !modifiers.trim()) return;

    setSaving(true);
    try {
      const res = await fetch('/api/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          category,
          description: description.trim(),
          modifiers: modifiers.trim(),
          keywords: keywords.split(',').map((k) => k.trim()).filter(Boolean),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setNotification(`¡Estilo '${name}' vectorizado y añadido a la base vectorial!`);
      setTimeout(() => setNotification(null), 3000);

      // Reset
      setName('');
      setDescription('');
      setModifiers('');
      setKeywords('');
      setShowAddForm(false);
      fetchKnowledge();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al guardar';
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Deseas eliminar este estilo de la base vectorial?')) return;
    try {
      await fetch(`/api/knowledge?id=${id}`, { method: 'DELETE' });
      setChunks((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error('Error deleting chunk:', err);
    }
  };

  const testEmbedding = testQuery.trim() ? generateLocalEmbedding(testQuery.trim()) : null;

  const rankedChunks = chunks
    .map((chunk) => {
      let similarity = 0;
      if (testEmbedding && chunk.embedding && chunk.embedding.length > 0) {
        similarity = cosineSimilarity(testEmbedding, chunk.embedding);
      }
      return { ...chunk, liveSimilarity: similarity };
    })
    .filter((chunk) => activeCategory === 'all' || chunk.category === activeCategory)
    .sort((a, b) => (b.liveSimilarity || 0) - (a.liveSimilarity || 0));

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'fotografia':
        return <Camera className="h-4 w-4 text-sky-400" />;
      case 'arte':
        return <Palette className="h-4 w-4 text-pink-400" />;
      case 'iluminacion':
        return <Lightbulb className="h-4 w-4 text-amber-400" />;
      default:
        return <Layers className="h-4 w-4 text-purple-400" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>

        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Database className="h-3.5 w-3.5" />
            <span>Base de Conocimiento Vectorial</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Directivas Ópticas y <span className="text-gradient">Estilos RAG</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            Cada fragmento almacena fórmulas técnicas de iluminación, lentes y texturas junto con su
            vector de incrustación. Cuando el usuario envía una frase, se evalúa su distancia coseno para
            recuperar los estilos idóneos.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-zinc-950 font-extrabold rounded-2xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shrink-0 shadow-xl shadow-amber-500/20"
        >
          <Plus className="h-4 w-4" />
          <span>{showAddForm ? 'Cerrar Formulario' : 'Añadir Nuevo Estilo'}</span>
        </button>
      </div>

      {notification && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-2xl flex items-center gap-3 text-xs text-emerald-300 shadow-lg">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Add New Chunk Form */}
      {showAddForm && (
        <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-amber-500/30 shadow-2xl space-y-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>Nuevo Fragmento de Conocimiento Vectorial</span>
          </h3>

          <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                Nombre del Estilo / Técnica:
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Pixel Art 16-Bit Retro"
                className="w-full bg-zinc-950/90 border border-white/[0.08] focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5">Categoría:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-zinc-950/90 border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-semibold"
              >
                <option value="estetica">Estética Visual</option>
                <option value="fotografia">Fotografía & Cine</option>
                <option value="arte">Técnicas de Arte</option>
                <option value="iluminacion">Esquemas de Iluminación</option>
                <option value="lentes">Lentes & Óptica</option>
                <option value="fantasia">Fantasía & Ficción</option>
                <option value="custom">Personalizado</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                Descripción conceptual:
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ej: Gráficos de videojuegos de la era 16 bits con paletas nostálgicas..."
                className="w-full bg-zinc-950/90 border border-white/[0.08] focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                Modificadores Visuales (Prompt Tokens Técnicos):
              </label>
              <textarea
                rows={2}
                required
                value={modifiers}
                onChange={(e) => setModifiers(e.target.value)}
                placeholder="Ej: 16-bit pixel art, snes aesthetic, sharp pixel edges, vibrant color palette, nostalgic game screenshot"
                className="w-full bg-zinc-950/90 border border-white/[0.08] focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                Palabras Clave (separadas por coma):
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="pixel, juego, retro, snes, arcade, 16bit"
                className="w-full bg-zinc-950/90 border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2.5 bg-zinc-800 text-zinc-300 rounded-xl text-xs font-semibold hover:bg-zinc-700 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-zinc-950 font-extrabold rounded-xl text-xs transition shadow-lg shadow-amber-500/20"
              >
                {saving ? 'Vectorizando...' : 'Guardar y Vectorizar'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Simulator & Category Filters */}
      <div className="space-y-4">
        {/* Live Vector Simulator Bar */}
        <div className="glass-panel p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-3 border border-white/[0.08]">
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-200 shrink-0">
            <BrainCircuit className="h-4 w-4 text-indigo-400" />
            <span>Simulador Vectorial en Tiempo Real:</span>
          </div>
          <div className="relative flex-1 w-full">
            <Search className="h-3.5 w-3.5 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={testQuery}
              onChange={(e) => setTestQuery(e.target.value)}
              placeholder="Prueba cualquier frase para ver la similitud matemática con cada directiva..."
              className="w-full bg-zinc-950/90 border border-white/[0.08] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-zinc-600 outline-none focus:border-indigo-500 transition"
            />
          </div>
          {testQuery && (
            <button
              onClick={() => setTestQuery('')}
              className="text-xs text-zinc-400 hover:text-white px-3 py-1 font-semibold"
            >
              Reset
            </button>
          )}
        </div>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: 'Todos los Estilos' },
            { id: 'estetica', label: 'Estética Visual' },
            { id: 'fotografia', label: 'Fotografía & Cine' },
            { id: 'arte', label: 'Técnicas de Arte' },
            { id: 'iluminacion', label: 'Iluminación' },
            { id: 'fantasia', label: 'Fantasía & Sci-Fi' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeCategory === cat.id
                  ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                  : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/[0.06]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {rankedChunks.map((chunk) => (
          <div
            key={chunk.id}
            className="glass-panel rounded-3xl p-6 border border-white/[0.08] hover:border-amber-500/40 shadow-xl flex flex-col justify-between space-y-4 transition duration-300 hover:-translate-y-1"
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="flex items-center gap-2 text-xs sm:text-sm font-bold text-white">
                  {getCategoryIcon(chunk.category)}
                  {chunk.name}
                </span>

                {testQuery && (
                  <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {((chunk.liveSimilarity || 0) * 100).toFixed(1)}% Similitud
                  </span>
                )}
              </div>

              {testQuery && (
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden mb-3">
                  <div
                    className="bg-gradient-to-r from-amber-400 to-indigo-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(5, (chunk.liveSimilarity || 0) * 100))}%` }}
                  ></div>
                </div>
              )}

              <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                {chunk.description}
              </p>
            </div>

            <div className="space-y-3 pt-3 border-t border-white/[0.06]">
              <div>
                <span className="text-[10px] font-mono text-zinc-500 block mb-1 font-semibold">
                  Modificadores Técnicos:
                </span>
                <p className="text-[11px] text-zinc-300 font-mono bg-zinc-950/80 p-2.5 rounded-xl border border-white/[0.06] line-clamp-3 leading-relaxed">
                  {chunk.modifiers}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex flex-wrap gap-1">
                  {chunk.keywords?.slice(0, 3).map((kw, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-zinc-950 text-zinc-400 px-2 py-0.5 rounded-md border border-white/[0.06]"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => handleDelete(chunk.id)}
                  className="text-zinc-500 hover:text-red-400 p-1.5 rounded-lg transition"
                  title="Eliminar de la base vectorial"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
