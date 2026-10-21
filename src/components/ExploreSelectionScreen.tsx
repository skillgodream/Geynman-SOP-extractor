import React from 'react';
import { Camera, Upload, Play, ArrowLeft, Sparkles, Layers } from 'lucide-react';

interface ExploreSelectionScreenProps {
  onBackToHome: () => void;
  onSelectOption: (option: 'scan' | 'upload' | 'demo') => void;
}

export const ExploreSelectionScreen: React.FC<ExploreSelectionScreenProps> = ({
  onBackToHome,
  onSelectOption,
}) => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans antialiased selection:bg-neutral-800 selection:text-white">
      {/* Top Clean Header — Only Back to Home */}
      <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-black/85 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToHome}
            className="min-h-[44px] flex items-center gap-1.5 text-xs font-medium text-neutral-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Back to Home"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Home</span>
          </button>

          <span className="text-xs font-semibold tracking-tight text-white uppercase font-mono">
            FeynmanDeck Engine
          </span>

          <div className="w-12" />
        </div>
      </header>

      {/* Main Stage — Faithfully styled like the attached screenshot */}
      <main className="flex-1 w-full max-w-lg mx-auto px-4 sm:px-6 py-10 sm:py-16 flex flex-col items-center justify-center">
        {/* Apple Black Style Centered Card (Matching attached screenshot) */}
        <div className="w-full rounded-3xl border border-white/[0.08] bg-neutral-950 p-8 sm:p-12 text-center shadow-2xl relative space-y-6">
          {/* Top Circular Icon Badge */}
          <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center mx-auto font-bold shadow-lg">
            <Layers className="w-5 h-5 text-black" />
          </div>

          {/* Title Header */}
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
              Choose Ingestion Source
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-xs sm:max-w-sm mx-auto leading-relaxed">
              Feed any manual, procedural document, or runbook into the Feynman simplifier.
            </p>
          </div>

          {/* Beautiful Three Clickable Tabs (Matching attached screenshot pills) */}
          <div className="space-y-3 pt-2 max-w-xs sm:max-w-sm mx-auto w-full">
            {/* Tab 1: Upload (Primary White Pill) */}
            <button
              type="button"
              onClick={() => onSelectOption('upload')}
              className="min-h-[48px] w-full px-6 py-3 text-sm font-semibold text-black bg-white hover:bg-neutral-200 rounded-full shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Upload (PDF or Text)</span>
            </button>

            {/* Tab 2: Scan (Dark Bordered Pill) */}
            <button
              type="button"
              onClick={() => onSelectOption('scan')}
              className="min-h-[48px] w-full px-6 py-3 text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 border border-white/10 rounded-full transition-all active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Camera className="w-4 h-4 text-neutral-300" />
              <span>Scan (Camera or Photo)</span>
            </button>

            {/* Tab 3: Demo (Dark Bordered Pill) */}
            <button
              type="button"
              onClick={() => onSelectOption('demo')}
              className="min-h-[48px] w-full px-6 py-3 text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 border border-white/10 rounded-full transition-all active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Play className="w-4 h-4 text-neutral-300" />
              <span>Library (Decks)</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-md mx-auto text-center py-6 text-xs text-neutral-600">
        FeynmanDeck Engine · Apple Minimalist UI
      </footer>
    </div>
  );
};
