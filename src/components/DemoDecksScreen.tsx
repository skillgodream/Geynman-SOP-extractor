import React from 'react';
import { ArrowLeft, ChevronRight, Trash2 } from 'lucide-react';
import { FeynmanDeck, AppViewMode } from '../types/deck';
import { ModePills } from './ModePills';

interface DemoDecksScreenProps {
  decks: FeynmanDeck[];
  onBackToExplore: () => void;
  onOpenUpload: () => void;
  onSelectDeck: (deck: FeynmanDeck, initialView?: AppViewMode) => void;
  onDeleteDeck?: (deckId: string) => void;
}

export const DemoDecksScreen: React.FC<DemoDecksScreenProps> = ({
  decks,
  onBackToExplore,
  onSelectDeck,
  onDeleteDeck,
}) => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans antialiased selection:bg-neutral-800 selection:text-white select-none">
      {/* Top Apple Minimalist Header */}
      <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-black/85 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToExplore}
            className="min-h-[44px] flex items-center gap-1.5 text-xs font-medium text-neutral-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Back to Explore"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Explore</span>
          </button>

          <span className="text-xs font-semibold tracking-tight text-white uppercase font-mono">
            Demo & Created Decks
          </span>

          <div className="w-12" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col">
        {/* Decks Grid / Table Container (Matching Reference Screenshot) */}
        <div className="w-full">
          <div className="divide-y divide-white/[0.08] border border-white/[0.08] bg-[#0c1017] rounded-3xl overflow-hidden shadow-2xl">
            {decks.map((deck) => {
              const tagLabel = deck.tags?.[0]
                ? deck.tags[0].toUpperCase()
                : 'ALL';

              return (
                <div
                  key={deck.id}
                  onClick={() => onSelectDeck(deck, 'outline')}
                  className="p-4 sm:p-5 hover:bg-neutral-900/60 transition-colors flex items-center justify-between gap-4 group cursor-pointer"
                >
                  {/* Left Column: Category Badge Tag + Title + Subtitle + Mode Pills */}
                  <div className="flex-1 min-w-0 space-y-2">
                    {/* Category Tag Pill */}
                    <div>
                      <span className="text-[10px] font-mono tracking-wider font-semibold text-neutral-300 bg-neutral-900 border border-white/10 px-2.5 py-0.5 rounded-md uppercase inline-block">
                        {tagLabel}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-sm sm:text-base font-bold text-white group-hover:text-blue-300 transition-colors leading-snug truncate">
                      {deck.title}
                    </h2>

                    {/* Short Subtitle Snippet */}
                    <p className="text-xs text-neutral-400 font-normal leading-relaxed truncate">
                      {deck.summary || deck.feynmanCoreConcept?.centralAnalogy?.title || 'Standard Operating Procedure execution guide'}
                    </p>

                    {/* Mode Pills (2-column layout, without Slide View) */}
                    <ModePills
                      allowedModes={['outline', 'show_me', 'guide_me', 'test_me']}
                      gridCols={2}
                      onSelectMode={(mode) => onSelectDeck(deck, mode)}
                    />
                  </div>

                  {/* Right Column: Actions (Trash + Chevron Right) */}
                  <div className="flex items-center gap-3 shrink-0 text-neutral-500 group-hover:text-white transition-colors">
                    {onDeleteDeck && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteDeck(deck.id);
                        }}
                        className="p-1.5 hover:text-red-400 transition-colors cursor-pointer rounded-lg hover:bg-white/5"
                        title="Delete Deck"
                        aria-label="Delete Deck"
                      >
                        <Trash2 className="w-4 h-4 text-neutral-400 hover:text-red-400" />
                      </button>
                    )}

                    <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};
