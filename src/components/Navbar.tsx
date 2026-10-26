'use client';

import React from 'react';
import {
  Sparkles,
  Database,
  Image as ImageIcon,
  Settings,
  Cpu,
  Zap,
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'generator' | 'gallery' | 'knowledge' | 'settings';
  setActiveTab: (tab: 'generator' | 'gallery' | 'knowledge' | 'settings') => void;
  hasApiKey: boolean;
  creationsCount: number;
}

export function Navbar({ activeTab, setActiveTab, hasApiKey, creationsCount }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-zinc-950/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3.5">
          <div className="relative group">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-70 blur-md group-hover:opacity-100 transition duration-300"></div>
            <div className="relative h-11 w-11 rounded-2xl bg-zinc-900 border border-white/20 flex items-center justify-center shadow-2xl">
              <Sparkles className="h-5 w-5 text-indigo-400 group-hover:scale-110 transition duration-200" />
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2.5">
              <span className="font-extrabold text-xl tracking-tight text-white">
                RAG Image <span className="text-gradient">Studio</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                RAG Online
              </span>
            </div>
            <p className="text-xs text-zinc-400 hidden sm:flex items-center gap-1.5 mt-0.5">
              <span>Búsqueda Vectorial Coseno</span>
              <span className="text-zinc-600">&bull;</span>
              <span>Enriquecimiento Óptico</span>
              <span className="text-zinc-600">&bull;</span>
              <span>Galería Persistente</span>
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-2">
          <nav className="flex items-center p-1.5 bg-zinc-900/90 border border-white/[0.08] rounded-2xl shadow-inner backdrop-blur-md">
            <button
              onClick={() => setActiveTab('generator')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeTab === 'generator'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Generador RAG</span>
              <span className="sm:hidden">Crear</span>
            </button>

            <button
              onClick={() => setActiveTab('gallery')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeTab === 'gallery'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/30'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              <ImageIcon className="h-4 w-4" />
              <span>Galería</span>
              {creationsCount > 0 && (
                <span className="ml-1 text-[11px] font-mono px-1.5 py-0.2 rounded-full bg-white/20 text-white font-bold">
                  {creationsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('knowledge')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeTab === 'knowledge'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-600/30'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              <Database className="h-4 w-4" />
              <span className="hidden md:inline">Base Vectorial</span>
              <span className="md:hidden">Vectores</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeTab === 'settings'
                  ? 'bg-zinc-800 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              <Settings className="h-4 w-4" />
              <span className="hidden lg:inline">Ajustes</span>
            </button>
          </nav>

          {/* GitHub Link */}
          <a
            href="https://github.com/juanavilestech/rag-image-studio"
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-2xl bg-zinc-900/80 hover:bg-zinc-800 border border-white/[0.08] text-zinc-300 hover:text-white transition duration-200 hidden sm:flex items-center justify-center shadow-sm"
            title="Ver repositorio en GitHub"
          >
            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}
