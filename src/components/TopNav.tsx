import React from 'react';
import { Sparkles, Layers, BookOpen, Presentation, Plus } from 'lucide-react';

interface TopNavProps {
  activeView: 'flow' | 'presentation';
  onViewChange: (view: 'flow' | 'presentation') => void;
  onOpenNewModal: () => void;
  onOpenSampleModal: () => void;
  onOpenMethodModal: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeView,
  onViewChange,
  onOpenNewModal,
  onOpenSampleModal,
  onOpenMethodModal,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-base sm:text-lg shadow-sm">
            F
          </div>
          <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
            FeynmanDeck
          </span>
        </div>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={onOpenSampleModal}
            className="min-h-[44px] flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap"
          >
            <BookOpen className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            <span>Sample SOPs</span>
          </button>

          <button
            onClick={() => onViewChange('flow')}
            className={`min-h-[44px] flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeView === 'flow'
                ? 'text-amber-600 dark:text-amber-400 font-semibold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Deck Flow</span>
          </button>

          <button
            onClick={() => onViewChange('presentation')}
            className={`min-h-[44px] flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeView === 'presentation'
                ? 'text-amber-600 dark:text-amber-400 font-semibold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Presentation className="w-4 h-4" />
            <span>Present Mode</span>
          </button>

          <button
            onClick={onOpenMethodModal}
            className="min-h-[44px] flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>The Feynman Method</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions (Touch-Friendly) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenMethodModal}
            className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 rounded-lg"
            title="The Feynman Method"
            aria-label="Feynman Method"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
          </button>

          <button
            onClick={onOpenSampleModal}
            className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 rounded-lg"
            title="Sample SOPs"
            aria-label="Sample SOPs"
          >
            <BookOpen className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenNewModal}
            className="min-h-[44px] flex items-center gap-1.5 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 dark:bg-amber-400 dark:hover:bg-amber-300 rounded-lg shadow-sm transition-all active:scale-[0.98] whitespace-nowrap"
          >
            <Plus className="w-4 h-4 font-bold" />
            <span>Convert SOP</span>
          </button>
        </div>
      </div>
    </header>
  );
};
