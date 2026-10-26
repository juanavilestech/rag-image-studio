'use client';

import React, { useState, useEffect } from 'react';
import {
  Key,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Info,
  Server,
  Zap,
} from 'lucide-react';

export function SettingsTab() {
  const [apiKey, setApiKey] = useState('');
  const [hasApiKey, setHasApiKey] = useState(false);
  const [maskedKey, setMaskedKey] = useState('');
  const [defaultEngine, setDefaultEngine] = useState('auto');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/config')
      .then((res) => res.json())
      .then((data) => {
        setHasApiKey(data.hasApiKey);
        setMaskedKey(data.maskedApiKey || '');
        setDefaultEngine(data.defaultEngine || 'auto');
      })
      .catch((err) => console.warn('Error loading config:', err));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          geminiApiKey: apiKey ? apiKey.trim() : undefined,
          defaultEngine,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setHasApiKey(data.hasApiKey);
        setSavedSuccess(true);
        setApiKey('');
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Error saving config:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"></div>
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Cpu className="h-3.5 w-3.5" />
            <span>Configuración del Sistema</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Modelos de IA & <span className="text-gradient">Motores de Render</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            Personaliza las credenciales de Google Gemini y selecciona el motor de difusión preferido.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-2xl flex items-center gap-3 text-xs text-emerald-300 shadow-xl">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>¡Configuración actualizada y guardada con éxito!</span>
        </div>
      )}

      {/* API Key Form */}
      <form onSubmit={handleSave} className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-4">
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <Key className="h-4 w-4 text-amber-400" />
            <span>Google Gemini API Key (Opcional)</span>
          </h3>
          {hasApiKey ? (
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 flex items-center gap-1.5 w-fit">
              <ShieldCheck className="h-4 w-4" />
              API Key Activa ({maskedKey})
            </span>
          ) : (
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-zinc-800 text-zinc-400 border border-white/10 w-fit">
              Modo Local / Fallback Operativo
            </span>
          )}
        </div>

        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
          Si proporcionas una API Key de Google AI Studio, la app utilizará los modelos oficiales
          <strong className="text-white"> text-embedding-004</strong> (embeddings densos),
          <strong className="text-white"> gemini-2.5-flash</strong> (síntesis de prompt maestro) y
          <strong className="text-white"> Imagen 3</strong> (generación fotorrealista). Si no la tienes a mano, el
          sistema opera de manera 100% autónoma con su vectorizador denso local y el motor Flux.
        </p>

        <div className="space-y-2.5">
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={hasApiKey ? 'Ingresa una nueva API Key para reemplazar la actual...' : 'AIzaSy...'}
            className="w-full bg-zinc-950/90 border border-white/[0.08] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder:text-zinc-600 outline-none transition shadow-inner"
          />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-zinc-400">
            <span>Se guarda localmente de forma segura en tu disco.</span>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-indigo-400 hover:text-indigo-300 underline font-semibold flex items-center gap-1"
            >
              Conseguir API Key gratuita en Google AI Studio <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Engine Preference */}
        <div className="pt-4 border-t border-white/[0.06] space-y-3">
          <label className="block text-xs font-bold text-zinc-300">
            Motor de Difusión Visual:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <button
              type="button"
              onClick={() => setDefaultEngine('auto')}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 ${
                defaultEngine === 'auto'
                  ? 'border-indigo-500 bg-indigo-950/30 text-white shadow-lg shadow-indigo-500/10'
                  : 'border-white/[0.06] bg-zinc-950/50 text-zinc-400 hover:border-white/20'
              }`}
            >
              <div className="font-bold text-xs text-white flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-indigo-400" />
                <span>Automático</span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-1 leading-snug">
                Utiliza Imagen 3 con API Key, o Flux como motor alternativo de alta resolución.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setDefaultEngine('pollinations-flux')}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 ${
                defaultEngine === 'pollinations-flux'
                  ? 'border-indigo-500 bg-indigo-950/30 text-white shadow-lg shadow-indigo-500/10'
                  : 'border-white/[0.06] bg-zinc-950/50 text-zinc-400 hover:border-white/20'
              }`}
            >
              <div className="font-bold text-xs text-white flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                <span>Flux (1024x1024)</span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-1 leading-snug">
                Fidelidad artística y fotográfica sin requerir credenciales ni cuotas.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setDefaultEngine('pollinations-turbo')}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 ${
                defaultEngine === 'pollinations-turbo'
                  ? 'border-indigo-500 bg-indigo-950/30 text-white shadow-lg shadow-indigo-500/10'
                  : 'border-white/[0.06] bg-zinc-950/50 text-zinc-400 hover:border-white/20'
              }`}
            >
              <div className="font-bold text-xs text-white flex items-center gap-1.5">
                <Server className="h-3.5 w-3.5 text-emerald-400" />
                <span>Turbo Express</span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-1 leading-snug">
                Generación ultra rápida en menos de 2 segundos para iteración ágil.
              </p>
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs sm:text-sm font-bold rounded-2xl transition shadow-xl shadow-indigo-600/25"
          >
            {saving ? 'Guardando...' : 'Guardar Preferencias'}
          </button>
        </div>
      </form>

      {/* RAG Educational Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-5">
        <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
          <Info className="h-4 w-4 text-indigo-400" />
          <span>Detalle de la Arquitectura RAG Implementada</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="bg-zinc-950/80 p-4 rounded-2xl border border-white/[0.08] space-y-2">
            <div className="font-bold text-indigo-400 text-xs">1. Vectorización</div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              La frase del usuario se traduce a un vector denso multidimensional que mapea su significado semántico.
            </p>
          </div>

          <div className="bg-zinc-950/80 p-4 rounded-2xl border border-white/[0.08] space-y-2">
            <div className="font-bold text-purple-400 text-xs">2. Retrieval</div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Se aplica el producto escalar normalizado (Similitud Coseno) sobre las directivas ópticas para extraer los Top-K afines.
            </p>
          </div>

          <div className="bg-zinc-950/80 p-4 rounded-2xl border border-white/[0.08] space-y-2">
            <div className="font-bold text-pink-400 text-xs">3. Augmentation</div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              El LLM sintetiza la idea del usuario con lentes, iluminación y paletas de color en un prompt maestro en inglés.
            </p>
          </div>

          <div className="bg-zinc-950/80 p-4 rounded-2xl border border-white/[0.08] space-y-2">
            <div className="font-bold text-emerald-400 text-xs">4. Persistencia</div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              La imagen resultante y su vector se registran en la base para habilitar búsqueda semántica por conceptos en la galería.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
