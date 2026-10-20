import React from 'react';
import {
  Presentation,
  ArrowLeft,
  X
} from 'lucide-react';
import { AppViewMode } from '../types/deck';

interface TopNavProps {
  activeView: AppViewMode;
  onViewChange: (view: AppViewMode) => void;
  onNavigateToExplore: () => void;
  onOpenMethodModal?: () => void;
  deckTitle?: string;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeView,
  onViewChange,
  onNavigateToExplore,
  deckTitle,
}) => {
  const isSlideView = activeView === 'presentation';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-black/90 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-3">
        {/* Left: Back to Explore & Brand / Deck Title */}
        <div className="flex items-center gap-3 shrink-0 min-w-0">
          <button
            type="button"
            onClick={onNavigateToExplore}
            className="min-h-[44px] flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-white/10 text-xs font-medium transition-all active:scale-95 cursor-pointer"
            aria-label={activeView === 'flow' ? 'Back to Outline' : 'Back to Decks'}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{activeView === 'flow' ? 'Outline' : 'Decks'}</span>
          </button>

          <div className="flex items-center gap-2 truncate">
            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white shrink-0">
              F
            </div>
            {deckTitle ? (
              <span className="text-xs sm:text-sm font-semibold tracking-tight text-white truncate max-w-[160px] sm:max-w-xs md:max-w-md">
                {deckTitle}
              </span>
            ) : (
              <span className="text-xs sm:text-sm font-semibold tracking-tight text-white whitespace-nowrap">
                FeynmanDeck
              </span>
            )}
          </div>
        </div>

        {/* Right: Slide View Option directly on the Header (Clean Apple style) */}
        <div className="flex items-center gap-2 shrink-0">
          {isSlideView ? (
            <button
              type="button"
              onClick={() => onViewChange('flow')}
              className="min-h-[40px] px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 border border-white/10 rounded-full transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Exit Slides</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onViewChange('presentation')}
              className="min-h-[40px] px-4 py-2 text-xs font-semibold text-black bg-white hover:bg-neutral-200 rounded-full shadow-sm transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
              aria-label="Open Slide View"
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>Slide View</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
