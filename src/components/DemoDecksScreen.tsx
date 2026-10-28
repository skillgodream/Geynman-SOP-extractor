import React, { useState } from 'react';
import { ArrowLeft, ChevronRight, Trash2, Send, BarChart3, Award } from 'lucide-react';
import { FeynmanDeck, AppViewMode } from '../types/deck';
import { ModePills } from './ModePills';
import { ShareModuleModal } from './ShareModuleModal';
import { ProgressDashboardModal } from './ProgressDashboardModal';
import { getLearnerProgress } from '../utils/learnerProgress';

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
  const [activeShareDeck, setActiveShareDeck] = useState<FeynmanDeck | null>(null);
  const [activeProgressDeck, setActiveProgressDeck] = useState<FeynmanDeck | null>(null);

  // Compute total certified learners across all library decks
  const totalCertified = decks.reduce((acc, d) => {
    return acc + getLearnerProgress(d.id).filter((r) => r.testPassed).length;
  }, 0);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans antialiased selection:bg-neutral-800 selection:text-white select-none pb-28">
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

          <span className="text-xs font-bold tracking-wider text-white uppercase font-mono">
            LIBRARY
          </span>

          <div className="w-12" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col">
        {/* Decks Grid / Table Container */}
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
                  className="p-4 sm:p-5 hover:bg-neutral-900/60 transition-colors flex items-start sm:items-center justify-between gap-4 group cursor-pointer"
                >
                  {/* Left Column: Category Badge Tag + Title + Subtitle + Mode Pills */}
                  <div className="flex-1 min-w-0 space-y-2.5">
                    {/* Top Row: Category Tag Pill + Sleek Send Button */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono tracking-wider font-semibold text-neutral-300 bg-neutral-900 border border-white/10 px-2.5 py-0.5 rounded-md uppercase inline-block">
                        {tagLabel}
                      </span>

                      {/* Clean Un-cramped Send Icon Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveShareDeck(deck);
                        }}
                        className="min-h-[30px] px-3 py-1 rounded-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shrink-0"
                        title="Send SOP Module to Learner"
                      >
                        <Send className="w-3.5 h-3.5 text-blue-400" />
                        <span>Send</span>
                      </button>
                    </div>

                    {/* Title — Fully visible, no truncate */}
                    <h2 className="text-sm sm:text-base font-bold text-white group-hover:text-blue-300 transition-colors leading-snug break-words">
                      {deck.title}
                    </h2>

                    {/* Mode Pills (2-column layout, without Slide View) */}
                    <ModePills
                      allowedModes={['outline', 'show_me', 'guide_me', 'test_me']}
                      gridCols={2}
                      onSelectMode={(mode) => onSelectDeck(deck, mode)}
                    />
                  </div>

                  {/* Right Column: Actions (Trash + Chevron Right) */}
                  <div className="flex items-center gap-2 shrink-0 text-neutral-500 group-hover:text-white transition-colors pt-1 sm:pt-0">
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

      {/* Smart Apple Style Floating Bottom Pill (Learner Progress) */}
      <div className="fixed bottom-6 inset-x-0 z-40 flex justify-center px-4 pointer-events-auto">
        <button
          type="button"
          onClick={() => setActiveProgressDeck(decks[0])}
          className="min-h-[44px] px-5 py-2.5 bg-zinc-900/85 backdrop-blur-2xl border border-white/15 text-white rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.8)] hover:bg-zinc-800 hover:border-white/25 transition-all cursor-pointer flex items-center gap-2.5 active:scale-95"
        >
          <BarChart3 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-medium tracking-tight text-white">Learner Progress</span>
          <span className="ml-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-semibold">
            {totalCertified}
          </span>
        </button>
      </div>

      {/* Share Module Modal */}
      {activeShareDeck && (
        <ShareModuleModal
          isOpen={!!activeShareDeck}
          onClose={() => setActiveShareDeck(null)}
          deck={activeShareDeck}
        />
      )}

      {/* Learner Progress Dashboard Modal */}
      {activeProgressDeck && (
        <ProgressDashboardModal
          isOpen={!!activeProgressDeck}
          onClose={() => setActiveProgressDeck(null)}
          deck={activeProgressDeck}
        />
      )}
    </div>
  );
};
