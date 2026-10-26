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
  AlertCircle,
  BrainCircuit,
} from 'lucide-react';
import { KnowledgeChunk } from '@/types';
import { cosineSimilarity, generateLocalEmbedding } from '@/lib/vector';

export function KnowledgeBaseTab() {
  const [chunks, setChunks] = useState<KnowledgeChunk[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [testQuery, setTestQuery] = useState('');
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

      setNotification(`¡Estilo '${name}' vectorizado y añadido a la base de conocimiento!`);
      setTimeout(() => setNotification(null), 3000);

      // Reset form
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
    if (!confirm('¿Deseas eliminar este conocimiento de la base vectorial?')) return;
    try {
      await fetch(`/api/knowledge?id=${id}`, { method: 'DELETE' });
      setChunks((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error('Error deleting chunk:', err);
    }
  };

  // Compute live test similarity if test query exists
  const testEmbedding = testQuery.trim() ? generateLocalEmbedding(testQuery.trim()) : null;

  const rankedChunks = chunks.map((chunk) => {
    let similarity = 0;
    if (testEmbedding && chunk.embedding && chunk.embedding.length > 0) {
      similarity = cosineSimilarity(testEmbedding, chunk.embedding);
    }
    return { ...chunk, liveSimilarity: similarity };
  }).sort((a, b) => (b.liveSimilarity || 0) - (a.liveSimilarity || 0));

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
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Database className="h-3.5 w-3.5" />
            Base de Conocimiento Vectorial
          </div>
          <h2 className="text-xl font-bold text-white">Directivas Estéticas y Ópticas para el RAG</h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
            Cada elemento representa un fragmento de conocimiento experto (cámaras, iluminación, arte).
            Al introducir un prompt, el RAG busca el más cercano en el espacio vectorial para enriquecer tu imagen.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 shrink-0 shadow-lg shadow-amber-500/20"
        >
          <Plus className="h-4 w-4" />
          <span>{showAddForm ? 'Cerrar Formulario' : 'Añadir Nuevo Estilo'}</span>
        </button>
      </div>

      {notification && (
        <div className="p-3.5 bg-emerald-950/40 border border-emerald-800/60 rounded-xl flex items-center gap-2 text-xs text-emerald-300">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Add New Chunk Form */}
      {showAddForm && (
        <div className="bg-zinc-900 border border-amber-500/30 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-400" />
            Nuevo Fragmento de Conocimiento Vectorial
          </h3>

          <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Nombre del Estilo / Técnica:
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Pixel Art 16-Bit Retro"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Categoría:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none"
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
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Descripción conceptual:
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ej: Gráficos de videojuegos de la era Super Nintendo con paleta de color vibrante y sprites nostálgicos."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Modificadores Visuales (Prompt Tokens Técnicos):
              </label>
              <textarea
                rows={2}
                required
                value={modifiers}
                onChange={(e) => setModifiers(e.target.value)}
                placeholder="Ej: 16-bit pixel art, snes aesthetic, sharp pixel edges, vibrant color palette, nostalgic game screenshot"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Palabras Clave (separadas por coma):
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="pixel, juego, retro, snes, arcade, 16bit"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none"
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-xl text-xs font-medium hover:bg-zinc-700 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold rounded-xl text-xs transition"
              >
                {saving ? 'Vectorizando...' : 'Guardar y Vectorizar'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Live Similarity Simulator */}
      <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300 shrink-0">
          <BrainCircuit className="h-4 w-4 text-indigo-400" />
          <span>Simulador Vectorial en Vivo:</span>
        </div>
        <div className="relative flex-1 w-full">
          <Search className="h-3.5 w-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={testQuery}
            onChange={(e) => setTestQuery(e.target.value)}
            placeholder="Escribe cualquier frase para ver la similitud matemática con cada estilo..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-zinc-600 outline-none focus:border-indigo-500 transition"
          />
        </div>
        {testQuery && (
          <button
            onClick={() => setTestQuery('')}
            className="text-xs text-zinc-400 hover:text-white px-2 py-1"
          >
            Reset
          </button>
        )}
      </div>

      {/* Knowledge Chunks Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rankedChunks.map((chunk) => (
          <div
            key={chunk.id}
            className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-3 transition"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-white">
                  {getCategoryIcon(chunk.category)}
                  {chunk.name}
                </span>

                {testQuery && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {((chunk.liveSimilarity || 0) * 100).toFixed(1)}% Similitud
                  </span>
                )}
              </div>

              <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                {chunk.description}
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-zinc-800/80">
              <div>
                <span className="text-[10px] font-mono text-zinc-500 block mb-1">
                  Modificadores Prompt:
                </span>
                <p className="text-[11px] text-zinc-300 font-mono bg-zinc-950 p-2 rounded-lg border border-zinc-850 line-clamp-3">
                  {chunk.modifiers}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex flex-wrap gap-1">
                  {chunk.keywords?.slice(0, 3).map((kw, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => handleDelete(chunk.id)}
                  className="text-zinc-500 hover:text-red-400 p-1 rounded transition"
                  title="Eliminar estilo"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
