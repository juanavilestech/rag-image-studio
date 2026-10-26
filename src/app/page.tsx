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
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasApiKey={hasApiKey}
        creationsCount={creationsCount}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'generator' && (
          <GeneratorTab onGenerationComplete={handleGenerationComplete} />
        )}

        {activeTab === 'gallery' && <GalleryTab />}

        {activeTab === 'knowledge' && <KnowledgeBaseTab />}

        {activeTab === 'settings' && <SettingsTab />}
      </main>

      <footer className="border-t border-zinc-900 bg-zinc-950 py-6 text-center text-xs text-zinc-500">
        <p>
          RAG Image Studio &bull; Next.js 15 &bull; Tailwind CSS &bull; Google GenAI &bull; Cosine Similarity Search
        </p>
      </footer>
    </div>
  );
}
