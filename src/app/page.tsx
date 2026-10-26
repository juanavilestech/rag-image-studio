'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/Navbar';
import { GeneratorTab } from '@/components/GeneratorTab';
import { GalleryTab } from '@/components/GalleryTab';
import { KnowledgeBaseTab } from '@/components/KnowledgeBaseTab';
import { SettingsTab } from '@/components/SettingsTab';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'generator' | 'gallery' | 'knowledge' | 'settings'>('generator');
  const [hasApiKey, setHasApiKey] = useState(false);
  const [creationsCount, setCreationsCount] = useState(0);

  const fetchStatus = useCallback(async () => {
    try {
      const [configRes, creationsRes] = await Promise.all([
        fetch('/api/config'),
        fetch('/api/creations'),
      ]);
      const configData = await configRes.json();
      const creationsData = await creationsRes.json();

      setHasApiKey(Boolean(configData.hasApiKey));
      setCreationsCount(creationsData.creations?.length || 0);
    } catch (err) {
      console.warn('Status fetch error:', err);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const handleGenerationComplete = () => {
    setCreationsCount((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen flex flex-col ambient-mesh text-zinc-100 selection:bg-indigo-500 selection:text-white">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasApiKey={hasApiKey}
        creationsCount={creationsCount}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {activeTab === 'generator' && (
          <GeneratorTab onGenerationComplete={handleGenerationComplete} />
        )}

        {activeTab === 'gallery' && <GalleryTab />}

        {activeTab === 'knowledge' && <KnowledgeBaseTab />}

        {activeTab === 'settings' && <SettingsTab />}
      </main>

      <footer className="border-t border-white/[0.06] bg-zinc-950/80 backdrop-blur-md py-8 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-zinc-300">RAG Image Studio</span>
            <span>&bull;</span>
            <span>Juan Avilés</span>
          </div>
          <p className="text-[11px] text-zinc-500">
            Next.js 15 &bull; Tailwind CSS 4 &bull; Cosine Similarity Search &bull; Google GenAI &bull; Flux
          </p>
        </div>
      </footer>
    </div>
  );
}
