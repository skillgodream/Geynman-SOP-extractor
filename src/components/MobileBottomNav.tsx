import React from 'react';
import { Layers, List, Presentation, Sparkles, Plus } from 'lucide-react';

interface MobileBottomNavProps {
  activeView: 'flow' | 'presentation';
  onViewChange: (view: 'flow' | 'presentation') => void;
  onOpenOutline: () => void;
  onOpenTutor: () => void;
  onOpenNewModal: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeView,
  onViewChange,
  onOpenOutline,
  onOpenTutor,
  onOpenNewModal,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 md:hidden px-2 pb-safe">
      <div className="grid grid-cols-5 items-center h-16">
        {/* Tab 1: Cards Flow */}
        <button
          type="button"
          onClick={() => onViewChange('flow')}
          className={`min-h-[48px] flex flex-col items-center justify-center transition-colors ${
            activeView === 'flow'
              ? 'text-amber-600 dark:text-amber-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          aria-label="Deck Flow"
        >
          <Layers className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight mt-1">Flow</span>
        </button>

        {/* Tab 2: Outline Jump Sheet */}
        <button
          type="button"
          onClick={onOpenOutline}
          className="min-h-[48px] flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          aria-label="Card Outline"
        >
          <List className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight mt-1">Outline</span>
        </button>

        {/* Tab 3: Center Primary Action (+ Convert) */}
        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={onOpenNewModal}
            className="w-11 h-11 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center justify-center shadow-md active:scale-95 transition-transform"
            aria-label="Convert New SOP"
          >
            <Plus className="w-5 h-5 font-bold" />
          </button>
        </div>

        {/* Tab 4: Slide Present Mode */}
        <button
          type="button"
          onClick={() => onViewChange('presentation')}
          className={`min-h-[48px] flex flex-col items-center justify-center transition-colors ${
            activeView === 'presentation'
              ? 'text-amber-600 dark:text-amber-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          aria-label="Slide Presenter"
        >
          <Presentation className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight mt-1">Present</span>
        </button>

        {/* Tab 5: Feynman Tutor Drawer */}
        <button
          type="button"
          onClick={onOpenTutor}
          className="min-h-[48px] flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          aria-label="Feynman Tutor"
        >
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span className="text-[10px] font-medium tracking-tight mt-1">Tutor</span>
        </button>
      </div>
    </nav>
  );
};
