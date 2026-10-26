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
  Code2,
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
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Cpu className="h-5 w-5 text-indigo-400" />
          Configuración del Motor & Modelos
        </h2>
        <p className="text-xs text-zinc-400 mt-1">
          Ajusta las credenciales de inteligencia artificial y los motores de generación de imagen.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 bg-emerald-950/40 border border-emerald-800/60 rounded-xl flex items-center gap-2 text-xs text-emerald-300">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>¡Configuración guardada correctamente!</span>
        </div>
      )}

      {/* API Key Form */}
      <form onSubmit={handleSave} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Key className="h-4 w-4 text-amber-400" />
            Google Gemini API Key (Opcional)
          </h3>
          {hasApiKey ? (
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              API Key Configurada ({maskedKey})
            </span>
          ) : (
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
              Modo Local / Fallback Activo
            </span>
          )}
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed">
          Si configuras tu API Key de Google, la aplicación utilizará los modelos oficiales
          <strong className="text-white"> text-embedding-004</strong> para los embeddings densos,
          <strong className="text-white"> gemini-2.5-flash</strong> para la síntesis RAG y
          <strong className="text-white"> Imagen 3</strong> para las imágenes. Si no la ingresas, el sistema
          opera automáticamente con su motor vectorial local integrado y difusión rápida (Flux).
        </p>

        <div className="space-y-2">
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={hasApiKey ? 'Introduce una nueva API Key para reemplazar la actual...' : 'AIzaSy...'}
            className="w-full bg-zinc-950 border border-zinc-800 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 outline-none transition"
          />
          <div className="flex items-center justify-between text-[11px] text-zinc-500">
            <span>Se almacena localmente de forma segura en tu máquina.</span>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-indigo-400 hover:underline flex items-center gap-0.5"
            >
              Obtener API Key en Google AI Studio <ExternalLink className="h-2.5 w-2.5" />
            </a>
          </div>
        </div>

        {/* Engine Preference */}
        <div className="pt-4 border-t border-zinc-800/80 space-y-2">
          <label className="block text-xs font-medium text-zinc-300">
            Motor de Difusión Preferido:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setDefaultEngine('auto')}
              className={`p-3 rounded-xl border text-left transition ${
                defaultEngine === 'auto'
                  ? 'border-indigo-500 bg-indigo-950/20 text-white'
                  : 'border-zinc-800 bg-zinc-950/50 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <div className="font-semibold text-xs text-white">Automático</div>
              <p className="text-[10px] text-zinc-400 mt-0.5">
                Imagen 3 si hay API Key disponible, con fallback a Flux.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setDefaultEngine('pollinations-flux')}
              className={`p-3 rounded-xl border text-left transition ${
                defaultEngine === 'pollinations-flux'
                  ? 'border-indigo-500 bg-indigo-950/20 text-white'
                  : 'border-zinc-800 bg-zinc-950/50 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <div className="font-semibold text-xs text-white">Flux (1024x1024)</div>
              <p className="text-[10px] text-zinc-400 mt-0.5">
                Alta fidelidad estética sin necesidad de credenciales.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setDefaultEngine('pollinations-turbo')}
              className={`p-3 rounded-xl border text-left transition ${
                defaultEngine === 'pollinations-turbo'
                  ? 'border-indigo-500 bg-indigo-950/20 text-white'
                  : 'border-zinc-800 bg-zinc-950/50 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <div className="font-semibold text-xs text-white">Turbo Ultra Rápido</div>
              <p className="text-[10px] text-zinc-400 mt-0.5">
                Generación en menos de 2 segundos.
              </p>
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition shadow-md shadow-indigo-600/20"
          >
            {saving ? 'Guardando...' : 'Guardar Preferencias'}
          </button>
        </div>
      </form>

      {/* RAG Architecture Educational Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Info className="h-4 w-4 text-indigo-400" />
          ¿Cómo funciona esta Arquitectura RAG?
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-1.5">
            <div className="font-bold text-indigo-400">1. Vectorización</div>
            <p className="text-[11px] text-zinc-400">
              La frase del usuario se proyecta a un vector numérico multidimensional (espacio semántico).
            </p>
          </div>

          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-1.5">
            <div className="font-bold text-purple-400">2. Retrieval</div>
            <p className="text-[11px] text-zinc-400">
              Se calcula la <em>Similitud Coseno</em> con la base de directivas fotográficas y se seleccionan los Top-K afines.
            </p>
          </div>

          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-1.5">
            <div className="font-bold text-pink-400">3. Augmentation</div>
            <p className="text-[11px] text-zinc-400">
              El LLM sintetiza la idea del usuario con los estilos recuperados en un prompt maestro optimizado.
            </p>
          </div>

          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-1.5">
            <div className="font-bold text-emerald-400">4. Persistencia</div>
            <p className="text-[11px] text-zinc-400">
              La imagen generada se guarda con su vector para permitir búsquedas conceptuales en la galería.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
