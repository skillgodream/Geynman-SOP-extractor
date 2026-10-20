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
      {/* 1. Header — strictly Back to Decks (Removed truncated title & Slide View to avoid crowding) */}
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

      {/* 2. Main Content — Clean Apple layout with ZERO card-in-card nesting */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col justify-start">
        {/* Top Info Section: Deck Title & Subtitle with Start Slides CTA */}
        <div className="pb-6 border-b border-white/[0.08] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
              {totalCardsCount} Instructional Cards
            </span>
            <span className="text-xs text-neutral-500 font-mono">
              Feynman Structure
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
            {deck.title}
          </h1>

          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            {deck.summary}
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => onOpenSlideView(0)}
              className="min-h-[44px] px-6 py-2.5 bg-white hover:bg-neutral-200 active:scale-95 text-black text-xs font-semibold rounded-full inline-flex items-center gap-2 shadow-md transition-all cursor-pointer"
              aria-label="Start Slide View"
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>Start Slides</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* List of Instructional Cards — Clean list rows with NO card-in-card nesting & NO text truncation */}
        <div className="divide-y divide-white/[0.07]">
          {/* Card 0: Overview & Central Analogy */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => onOpenSlideView(0)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onOpenSlideView(0);
            }}
            className="py-4 sm:py-5 flex items-start justify-between gap-3.5 group cursor-pointer hover:bg-neutral-900/30 -mx-2 px-2 rounded-xl transition-colors active:scale-[0.99]"
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

          {/* Cards 1 to N */}
          {deck.cards.map((card, idx) => (
            <div
              key={card.id}
              role="button"
              tabIndex={0}
              onClick={() => onOpenSlideView(idx + 1)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onOpenSlideView(idx + 1);
              }}
              className="py-4 sm:py-5 flex items-start justify-between gap-3.5 group cursor-pointer hover:bg-neutral-900/30 -mx-2 px-2 rounded-xl transition-colors active:scale-[0.99]"
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
          ))}
        </div>

        {/* ADD NEW CARD CHUNK Section */}
        <div className="pt-8 mt-4 border-t border-white/[0.08] space-y-3">
          <div className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase">
            Add New Card Chunk:
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => onAddCardChunk('critical_rules')}
              className="min-h-[44px] px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white border border-white/10 flex items-center justify-center gap-2 text-xs font-semibold transition-all active:scale-95 cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>+ Red Lines</span>
            </button>

            <button
              type="button"
              onClick={() => onAddCardChunk('process_steps')}
              className="min-h-[44px] px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white border border-white/10 flex items-center justify-center gap-2 text-xs font-semibold transition-all active:scale-95 cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              <span>+ Step Sequence</span>
            </button>

            <button
              type="button"
              onClick={() => onAddCardChunk('scenario_quiz')}
              className="min-h-[44px] px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white border border-white/10 flex items-center justify-center gap-2 text-xs font-semibold transition-all active:scale-95 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
              <span>+ Dilemma Quiz</span>
            </button>

            <button
              type="button"
              onClick={() => onAddCardChunk('concept_analogy')}
              className="min-h-[44px] px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white border border-white/10 flex items-center justify-center gap-2 text-xs font-semibold transition-all active:scale-95 cursor-pointer"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-300" />
              <span>+ Analogy</span>
            </button>
          </div>
        </div>

        {/* Alternative Modes Row */}
        <div className="pt-6 mt-6 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-2 pb-12">
          <span className="text-[11px] text-neutral-400 font-medium">
            Alternative Modes:
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => onOpenFlowView()}
              className="min-h-[36px] px-3 py-1.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-white/10 text-xs font-medium transition-colors cursor-pointer"
            >
              Deck Flow
            </button>
            <button
              type="button"
              onClick={() => onSwitchToMode('show_me')}
              className="min-h-[36px] px-3 py-1.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-white/10 text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Film className="w-3 h-3 text-sky-300" />
              <span>Video</span>
            </button>
            <button
              type="button"
              onClick={() => onSwitchToMode('guide_me')}
              className="min-h-[36px] px-3 py-1.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-white/10 text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
            >
              <HelpCircle className="w-3 h-3 text-amber-300" />
              <span>Guide Me</span>
            </button>
            <button
              type="button"
              onClick={() => onSwitchToMode('test_me')}
              className="min-h-[36px] px-3 py-1.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-white/10 text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Award className="w-3 h-3 text-emerald-300" />
              <span>Test Me</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
