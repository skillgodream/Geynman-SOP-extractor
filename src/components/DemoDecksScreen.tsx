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
  CheckCircle2,
  AlertTriangle,
  X
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
  const [deckToDelete, setDeckToDelete] = useState<FeynmanDeck | null>(null);

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
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white border border-white/20 text-[10px] font-mono font-bold">
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
            <Layers className="w-7 h-7 text-white" />
            <span>Interactive Training Decks</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 font-normal">
            Select an SOP module below to launch Feynman learning cards, video scenes, guided practice, or certified tests.
          </p>
        </div>

        {/* Decks Card Grid - Lightweight & Airy Layout */}
        <div className="space-y-4">
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
                className="group rounded-2xl border border-white/10 bg-[#0a0d14] hover:border-white/30 transition-all duration-300 shadow-xl overflow-hidden cursor-pointer flex flex-col sm:flex-row hover:shadow-2xl"
              >
                {/* Left Visual Banner Image */}
                <div className="sm:w-52 h-36 sm:h-auto relative overflow-hidden shrink-0 border-b sm:border-b-0 sm:border-r border-white/10 bg-neutral-900">
                  <img
                    src={photoUrl}
                    alt={deck.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d14] via-transparent to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-[#0a0d14]/80" />
                </div>

                {/* Right Details & Launcher Section */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3.5">
                  {/* Top Header Row: Category Badge & Quick Actions */}
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[10px] font-mono font-bold tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-0.5 rounded-full uppercase shadow-sm">
                      {tagLabel}
                    </span>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Send / Share Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveShareDeck(deck);
                        }}
                        className="min-h-[30px] px-3 py-1 rounded-full bg-white/10 hover:bg-white hover:text-black text-white border border-white/15 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-sm"
                        title="Send SOP Module to Learner"
                      >
                        <Send className="w-3 h-3 text-white" />
                        <span>Send</span>
                      </button>

                      {/* Delete Button */}
                      {onDeleteDeck && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeckToDelete(deck);
                          }}
                          className="min-h-[30px] p-1.5 rounded-lg bg-neutral-900/80 hover:bg-rose-500/20 text-neutral-400 hover:text-rose-400 border border-white/10 transition-colors cursor-pointer"
                          title="Delete Deck"
                          aria-label="Delete Deck"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <div className="p-1 rounded-full bg-neutral-900 group-hover:bg-white group-hover:text-black border border-white/10 transition-all">
                        <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-black" />
                      </div>
                    </div>
                  </div>

                  {/* Full Width Un-cramped Title & Metadata Section */}
                  <div className="space-y-1.5">
                    <h2 className="text-base sm:text-lg md:text-xl font-extrabold text-white group-hover:text-cyan-300 transition-colors leading-snug tracking-tight w-full">
                      {deck.title}
                    </h2>

                    {/* Clean Dot-Separated Inline Metadata Row */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400 font-medium pt-0.5">
                      <span className="flex items-center gap-1 text-neutral-300">
                        <Layers className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{cardCount} Cards</span>
                      </span>

                      <span>•</span>

                      <span className="flex items-center gap-1 text-neutral-300">
                        <Clock className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{deck.estimatedMinutes || 8} mins</span>
                      </span>

                      {deck.targetAudience && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-neutral-300 truncate max-w-[240px]">
                            <UserCheck className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                            <span className="truncate">{deck.targetAudience}</span>
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Mode Launcher Grid */}
                  <div className="pt-2 border-t border-white/10">
                    <ModePills
                      allowedModes={['outline', 'show_me', 'guide_me', 'test_me']}
                      gridCols={2}
                      variant="monochrome"
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

      {/* Delete Confirmation Modal Pop-up */}
      {deckToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl border border-rose-500/30 bg-[#0d121d] p-6 sm:p-8 shadow-[0_25px_80px_rgba(244,63,94,0.2)] text-white space-y-6 relative overflow-hidden">
            {/* Top Warning Icon Badge */}
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 shrink-0">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white leading-tight">
                  Delete Training Deck?
                </h3>
                <p className="text-xs text-rose-400 font-medium">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            {/* Deck Summary Box */}
            <div className="p-4 rounded-2xl bg-neutral-900/80 border border-white/10 space-y-1">
              <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                DECK TITLE
              </div>
              <div className="text-sm font-bold text-white leading-snug">
                {deckToDelete.title}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeckToDelete(null)}
                className="min-h-[42px] px-5 py-2 rounded-full border border-white/10 bg-neutral-900 hover:bg-neutral-800 text-xs font-semibold text-neutral-300 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onDeleteDeck) onDeleteDeck(deckToDelete.id);
                  setDeckToDelete(null);
                }}
                className="min-h-[42px] px-6 py-2 rounded-full bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white shadow-lg transition-all cursor-pointer active:scale-95 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

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
