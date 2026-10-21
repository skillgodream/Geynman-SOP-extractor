import React from 'react';
import {
  BookOpen,
  Lightbulb,
  ShieldAlert,
  Layers,
  Wrench,
  HelpCircle,
  Bookmark,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Presentation,
  Film,
  Award
} from 'lucide-react';
import { FeynmanDeck, CardType, AppViewMode } from '../types/deck';

import { ModePills } from './ModePills';

interface CardOutlineScreenProps {
  deck: FeynmanDeck;
  onBackToExplore: () => void;
  onOpenSlideView: (slideIndex?: number) => void;
  onOpenFlowView: (cardId?: string) => void;
  onSwitchToMode: (mode: AppViewMode) => void;
  onAddCardChunk: (type: CardType) => void;
}

export const CardOutlineScreen: React.FC<CardOutlineScreenProps> = ({
  deck,
  onBackToExplore,
  onOpenSlideView,
  onOpenFlowView,
  onSwitchToMode,
  onAddCardChunk,
}) => {
  const handleSelectMode = (mode: AppViewMode, slideIndex = 0) => {
    if (mode === 'presentation') {
      onOpenSlideView(slideIndex);
    } else {
      onSwitchToMode(mode);
    }
  };

  const getCardIcon = (type: CardType) => {
    switch (type) {
      case 'concept_analogy':
        return <Lightbulb className="w-4 h-4 text-amber-300" />;
      case 'critical_rules':
        return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      case 'process_steps':
        return <Layers className="w-4 h-4 text-sky-400" />;
      case 'pitfalls_troubleshooting':
        return <Wrench className="w-4 h-4 text-amber-400" />;
      case 'scenario_quiz':
        return <HelpCircle className="w-4 h-4 text-purple-400" />;
      case 'quick_reference':
        return <Bookmark className="w-4 h-4 text-emerald-400" />;
      default:
        return <BookOpen className="w-4 h-4 text-neutral-300" />;
    }
  };

  const totalCardsCount = deck.cards.length + 1; // 1 for Overview & Analogy + N cards

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans antialiased selection:bg-neutral-800 selection:text-white">
      {/* 1. Header — strictly Back to Decks */}
      <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-black/85 backdrop-blur-xl">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToExplore}
            className="min-h-[44px] flex items-center gap-1.5 text-xs font-medium text-neutral-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Back to Decks"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Decks</span>
          </button>

          <span className="text-xs font-semibold tracking-tight text-white uppercase font-mono">
            Card Outline
          </span>

          <div className="w-12" />
        </div>
      </header>

      {/* 2. Main Content */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col justify-start">
        {/* Top Info Section: Deck Title & Subtitle with Mode Pills */}
        <div className="pb-6 border-b border-white/[0.08] space-y-3">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
            {deck.title}
          </h1>

          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            {deck.summary}
          </p>

          <div className="pt-2 space-y-2">
            <div className="text-[11px] font-mono tracking-wider font-semibold text-neutral-400 uppercase">
              Select Deck Mode:
            </div>
            <ModePills
              activeMode="outline"
              allowedModes={['outline', 'presentation']}
              onSelectMode={handleSelectMode}
            />
          </div>
        </div>

        {/* List of Instructional Cards */}
        <div className="divide-y divide-white/[0.07]">
          {/* Card 0: Overview & Central Analogy */}
          <div className="py-4 sm:py-5 hover:bg-neutral-900/30 -mx-2 px-2 rounded-xl transition-colors">
            <div
              role="button"
              tabIndex={0}
              onClick={() => onOpenSlideView(0)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onOpenSlideView(0);
              }}
              className="flex items-start justify-between gap-3.5 group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                <BookOpen className="w-4 h-4 text-amber-300" />
              </div>

              <div className="flex-1 min-w-0">
                <h2 className="text-sm sm:text-base font-semibold text-white group-hover:text-neutral-200 leading-snug">
                  Overview & Central Analogy
                </h2>
                <p className="text-xs text-neutral-400 leading-relaxed mt-1">
                  {deck.feynmanCoreConcept?.centralAnalogy?.title || 'Core Mental Model & Mission'}
                </p>
              </div>

              <div className="w-7 h-7 flex items-center justify-center text-neutral-500 group-hover:text-white shrink-0 mt-1">
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>

          {/* Cards 1 to N */}
          {deck.cards.map((card, idx) => (
            <div
              key={card.id}
              className="py-4 sm:py-5 hover:bg-neutral-900/30 -mx-2 px-2 rounded-xl transition-colors"
            >
              <div
                role="button"
                tabIndex={0}
                onClick={() => onOpenSlideView(idx + 1)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') onOpenSlideView(idx + 1);
                }}
                className="flex items-start justify-between gap-3.5 group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                  {getCardIcon(card.cardType)}
                </div>

                <div className="flex-1 min-w-0">
                  <h2 className="text-sm sm:text-base font-semibold text-white group-hover:text-neutral-200 leading-snug">
                    {idx + 1}. {card.title}
                  </h2>
                  <p className="text-xs text-neutral-400 leading-relaxed mt-1">
                    {card.subtitle || card.feynmanExplanation}
                  </p>
                </div>

                <div className="w-7 h-7 flex items-center justify-center text-neutral-500 group-hover:text-white shrink-0 mt-1">
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ADD NEW CARD CHUNK Section (White Cards) */}
        <div className="pt-8 mt-4 border-t border-white/[0.08] space-y-3 pb-8">
          <div className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase">
            Add New Card Chunk:
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => onAddCardChunk('critical_rules')}
              className="min-h-[46px] px-3 py-3 rounded-2xl bg-white hover:bg-neutral-200 text-black border border-white flex items-center justify-center gap-2 text-xs font-semibold transition-all active:scale-95 cursor-pointer shadow-md"
            >
              <ShieldAlert className="w-4 h-4 text-red-600 stroke-[2]" />
              <span>+ Red Lines</span>
            </button>

            <button
              type="button"
              onClick={() => onAddCardChunk('process_steps')}
              className="min-h-[46px] px-3 py-3 rounded-2xl bg-white hover:bg-neutral-200 text-black border border-white flex items-center justify-center gap-2 text-xs font-semibold transition-all active:scale-95 cursor-pointer shadow-md"
            >
              <Layers className="w-4 h-4 text-blue-600 stroke-[2]" />
              <span>+ Step Sequence</span>
            </button>

            <button
              type="button"
              onClick={() => onAddCardChunk('scenario_quiz')}
              className="min-h-[46px] px-3 py-3 rounded-2xl bg-white hover:bg-neutral-200 text-black border border-white flex items-center justify-center gap-2 text-xs font-semibold transition-all active:scale-95 cursor-pointer shadow-md"
            >
              <HelpCircle className="w-4 h-4 text-purple-600 stroke-[2]" />
              <span>+ Dilemma Quiz</span>
            </button>

            <button
              type="button"
              onClick={() => onAddCardChunk('concept_analogy')}
              className="min-h-[46px] px-3 py-3 rounded-2xl bg-white hover:bg-neutral-200 text-black border border-white flex items-center justify-center gap-2 text-xs font-semibold transition-all active:scale-95 cursor-pointer shadow-md"
            >
              <Lightbulb className="w-4 h-4 text-amber-600 stroke-[2]" />
              <span>+ Analogy</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
