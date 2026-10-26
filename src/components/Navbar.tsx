'use client';

import React from 'react';
import { Sparkles, Database, Image as ImageIcon, Settings, Cpu, Layers } from 'lucide-react';

interface NavbarProps {
  activeTab: 'generator' | 'gallery' | 'knowledge' | 'settings';
  setActiveTab: (tab: 'generator' | 'gallery' | 'knowledge' | 'settings') => void;
  hasApiKey: boolean;
  creationsCount: number;
}

export function Navbar({ activeTab, setActiveTab, hasApiKey, creationsCount }: NavbarProps) {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg text-white tracking-tight">RAG Image Studio</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                RAG Activo
              </span>
            </div>
            <p className="text-xs text-zinc-400 hidden sm:block">
              Retrieval-Augmented Generation con Búsqueda Vectorial
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-1 sm:space-x-2">
          <button
            onClick={() => setActiveTab('generator')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'generator'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Cpu className="h-4 w-4 text-indigo-400" />
            <span className="hidden md:inline">Generador RAG</span>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'gallery'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <ImageIcon className="h-4 w-4 text-purple-400" />
            <span>Galería</span>
            {creationsCount > 0 && (
              <span className="text-xs px-1.5 py-0.2 rounded-full bg-zinc-700 text-zinc-200">
                {creationsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('knowledge')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'knowledge'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Database className="h-4 w-4 text-amber-400" />
            <span className="hidden md:inline">Base Vectorial</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'settings'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Settings className="h-4 w-4 text-zinc-400" />
            <span className="hidden md:inline">Ajustes</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
