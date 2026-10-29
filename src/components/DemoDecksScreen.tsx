import React, { useState } from 'react';
import {
  ArrowLeft,
  ChevronRight,
  Trash2,
  Send,
  BarChart3,
  Sparkles,
  Layers,
  Clock,
  UserCheck,
  CheckCircle2
} from 'lucide-react';
import { FeynmanDeck, AppViewMode } from '../types/deck';
import { ModePills } from './ModePills';
import { ShareModuleModal } from './ShareModuleModal';
import { ProgressDashboardModal } from './ProgressDashboardModal';
import { getLearnerProgress } from '../utils/learnerProgress';
import { resolveContextualPhoto } from '../utils/deckDerivations';

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
    <div className="min-h-screen bg-[#07090e] text-white flex flex-col font-sans antialiased selection:bg-neutral-800 selection:text-white select-none pb-28">
      {/* Top Glass Header */}
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-black/80 backdrop-blur-2xl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToExplore}
            className="min-h-[40px] px-3.5 py-1.5 rounded-full bg-neutral-900/80 hover:bg-neutral-800 border border-white/10 text-xs font-semibold text-neutral-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
            aria-label="Back to Explore"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Explore</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold tracking-widest text-white uppercase font-mono">
              MASTER SOP LIBRARY
            </span>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold">
              {decks.length} Decks
            </span>
          </div>

          <div className="w-16" />
        </div>
      </header>

      {/* Main Library Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col">
        {/* Header Title Section */}
        <div className="mb-6 sm:mb-8 space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight flex items-center gap-2.5">
            <Layers className="w-7 h-7 text-cyan-400" />
            <span>Interactive Training Decks</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 font-normal">
            Select an SOP module below to launch Feynman learning cards, video scenes, guided practice, or certified tests.
          </p>
        </div>

        {/* Decks Card Grid */}
        <div className="space-y-6">
          {decks.map((deck) => {
            const cardCount = deck.cards.length;
            const tagLabel = deck.tags?.[0]
              ? deck.tags[0].toUpperCase()
              : deck.title.toLowerCase().includes('retail') || deck.title.toLowerCase().includes('price')
              ? 'RETAIL SOP'
              : deck.title.toLowerCase().includes('cold')
              ? 'PHARMA COLD CHAIN'
              : deck.title.toLowerCase().includes('triage') || deck.title.toLowerCase().includes('sev')
              ? 'CYBER SRE & DEVOPS'
              : 'OPERATIONAL SOP';

            const photoUrl = resolveContextualPhoto(deck, deck.heroImage, deck.title);

            return (
              <div
                key={deck.id}
                onClick={() => onSelectDeck(deck, 'outline')}
                className="group rounded-3xl border border-white/10 bg-[#0d121d] hover:border-cyan-500/40 transition-all duration-300 shadow-[0_15px_40px_rgba(0,0,0,0.8)] overflow-hidden cursor-pointer flex flex-col sm:flex-row hover:shadow-[0_20px_60px_rgba(6,182,212,0.15)]"
              >
                {/* Left Visual Banner Image */}
                <div className="sm:w-64 h-44 sm:h-auto relative overflow-hidden shrink-0 border-b sm:border-b-0 sm:border-r border-white/10">
                  <img
                    src={photoUrl}
                    alt={deck.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d121d] via-[#0d121d]/40 to-transparent sm:bg-gradient-to-r sm:from-transparent sm:via-transparent sm:to-[#0d121d]" />

                  {/* Top Category Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="text-[10px] font-mono font-bold tracking-wider text-cyan-300 bg-black/80 backdrop-blur-md border border-cyan-500/40 px-2.5 py-1 rounded-full uppercase shadow-md inline-block">
                      {tagLabel}
                    </span>
                  </div>
                </div>

                {/* Right Details & Launcher Section */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between gap-4">
                  {/* Top Bar: Title & Action Buttons */}
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-base sm:text-xl font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                        {deck.title}
                      </h2>

                      <div className="flex items-center gap-2 shrink-0">
                        {/* Send / Share Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveShareDeck(deck);
                          }}
                          className="min-h-[34px] px-3.5 py-1 rounded-full bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 border border-blue-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-md"
                          title="Send SOP Module to Learner"
                        >
                          <Send className="w-3.5 h-3.5 text-blue-400" />
                          <span>Send</span>
                        </button>

                        {/* Delete Button */}
                        {onDeleteDeck && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteDeck(deck.id);
                            }}
                            className="min-h-[34px] p-2 rounded-xl bg-neutral-900 hover:bg-rose-500/20 text-neutral-400 hover:text-rose-400 border border-white/10 hover:border-rose-500/30 transition-colors cursor-pointer"
                            title="Delete Deck"
                            aria-label="Delete Deck"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <div className="p-2 rounded-full bg-neutral-900 group-hover:bg-cyan-500 group-hover:text-black border border-white/10 transition-all">
                          <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-black" />
                        </div>
                      </div>
                    </div>

                    {/* Summary Paragraph */}
                    <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed line-clamp-2 font-normal">
                      {deck.summary}
                    </p>
                  </div>

                  {/* Metadata Chips (Cards, Est. Time, Target Role) */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400">
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 font-mono text-[11px]">
                      <Layers className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{cardCount} Cards</span>
                    </span>

                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 font-mono text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{deck.estimatedMinutes || 8} mins</span>
                    </span>

                    {deck.targetAudience && (
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-[11px] truncate max-w-[220px]">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{deck.targetAudience}</span>
                      </span>
                    )}
                  </div>

                  {/* Revamped Mode Launcher Grid */}
                  <div className="pt-2 border-t border-white/10">
                    <ModePills
                      allowedModes={['outline', 'show_me', 'guide_me', 'test_me']}
                      gridCols={2}
                      onSelectMode={(mode) => onSelectDeck(deck, mode)}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Smart Apple Style Floating Bottom Pill (Learner Progress) */}
      <div className="fixed bottom-6 inset-x-0 z-40 flex justify-center px-4 pointer-events-auto">
        <button
          type="button"
          onClick={() => setActiveProgressDeck(decks[0])}
          className="min-h-[46px] px-6 py-2.5 bg-neutral-900/90 backdrop-blur-2xl border border-white/20 text-white rounded-full shadow-[0_15px_40px_rgba(0,0,0,0.9)] hover:bg-neutral-800 hover:border-emerald-500/40 transition-all cursor-pointer flex items-center gap-3 active:scale-95"
        >
          <BarChart3 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold tracking-tight text-white">Learner Progress Dashboard</span>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-mono font-bold">
            {totalCertified} Certified
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
