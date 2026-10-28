import React from 'react';
import {
  BookOpen,
  Lightbulb,
  ShieldAlert,
  Layers,
  Wrench,
  HelpCircle,
  Bookmark,
  ArrowRight
} from 'lucide-react';
import { FeynmanDeck, CardType } from '../../types/deck';

interface CardOutlineCardProps {
  deck: FeynmanDeck;
  onJumpToCard: (cardId: string) => void;
  onAddCardChunk: (type: CardType) => void;
  onStartSlideMode?: () => void;
}

export const CardOutlineCard: React.FC<CardOutlineCardProps> = ({
  deck,
  onJumpToCard,
  onAddCardChunk,
  onStartSlideMode,
}) => {
  const getCardIcon = (type: CardType) => {
    switch (type) {
      case 'concept_analogy':
        return <Lightbulb className="w-5 h-5 text-neutral-300" />;
      case 'critical_rules':
        return <ShieldAlert className="w-5 h-5 text-neutral-300" />;
      case 'process_steps':
        return <Layers className="w-5 h-5 text-neutral-300" />;
      case 'pitfalls_troubleshooting':
        return <Wrench className="w-5 h-5 text-neutral-300" />;
      case 'scenario_quiz':
        return <HelpCircle className="w-5 h-5 text-neutral-300" />;
      case 'quick_reference':
        return <Bookmark className="w-5 h-5 text-neutral-300" />;
      default:
        return <BookOpen className="w-5 h-5 text-neutral-300" />;
    }
  };

  return (
    <div
      id="card-outline"
      className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-neutral-950 shadow-2xl p-6 sm:p-10 transition-colors"
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header Section (Matching Screenshot) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Card Outline
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400">
              {deck.cards.length + 1} instructional cards in this training deck · Tap any card to begin
            </p>
          </div>

          {onStartSlideMode && (
            <button
              type="button"
              onClick={onStartSlideMode}
              className="min-h-[40px] px-4 py-2 bg-white hover:bg-neutral-200 text-black text-xs font-semibold rounded-full flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer self-start sm:self-auto shrink-0"
            >
              <span>Present Slides</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Structural Sections / Modules Chapter Overview */}
        {deck.modules && deck.modules.length > 0 && (
          <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 space-y-2">
            <div className="text-xs font-bold text-blue-400 uppercase tracking-wider font-mono flex items-center justify-between">
              <span>Deep Dive Structural Sections ({deck.modules.length} SOP Chapters)</span>
              <span className="text-[10px] text-blue-300 font-normal">Auto-Parsed</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
              {deck.modules.map((mod) => (
                <div
                  key={mod.id}
                  className="p-2.5 rounded-xl bg-neutral-900/90 border border-white/10 text-neutral-200 font-medium flex items-center gap-2"
                >
                  <span className="w-5 h-5 rounded-md bg-blue-500/20 text-blue-300 text-[10px] font-bold font-mono flex items-center justify-center shrink-0">
                    {mod.moduleNumber}
                  </span>
                  <span className="truncate">{mod.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* List of Cards in Apple Theme (Matching Screenshot) */}
        <div className="space-y-3">
          {/* Item 0: Overview & Central Analogy */}
          <div
            onClick={() => onJumpToCard('hero-card')}
            className="p-4 sm:p-5 rounded-2xl bg-neutral-900/60 hover:bg-neutral-900 border border-white/[0.08] hover:border-white/20 transition-all flex items-center justify-between gap-4 cursor-pointer group"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-neutral-800/90 border border-white/10 flex items-center justify-center shrink-0 text-neutral-200 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5 text-neutral-200" />
              </div>
              <div className="min-w-0 space-y-0.5">
                <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-neutral-200 truncate">
                  Overview & Central Analogy
                </h3>
                <p className="text-xs text-neutral-400 truncate">
                  {deck.feynmanCoreConcept?.centralAnalogy?.title || 'Core Mental Model & Mission'}
                </p>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-neutral-800/60 border border-white/5 flex items-center justify-center text-neutral-400 group-hover:text-white shrink-0">
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Cards 1 to N */}
          {deck.cards.map((card, idx) => (
            <div
              key={card.id}
              onClick={() => onJumpToCard(card.id)}
              className="p-4 sm:p-5 rounded-2xl bg-neutral-900/60 hover:bg-neutral-900 border border-white/[0.08] hover:border-white/20 transition-all flex items-center justify-between gap-4 cursor-pointer group"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-neutral-800/90 border border-white/10 flex items-center justify-center shrink-0 text-neutral-200 group-hover:scale-105 transition-transform">
                  {getCardIcon(card.cardType)}
                </div>
                <div className="min-w-0 space-y-0.5">
                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-neutral-200 truncate">
                    {idx + 1}. {card.title}
                  </h3>
                  <p className="text-xs text-neutral-400 truncate">
                    {card.subtitle || card.feynmanExplanation.slice(0, 75)}
                  </p>
                </div>
              </div>

              <div className="w-8 h-8 rounded-full bg-neutral-800/60 border border-white/5 flex items-center justify-center text-neutral-400 group-hover:text-white shrink-0">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        {/* ADD NEW CARD CHUNK Section (Matching Screenshot) */}
        <div className="pt-6 border-t border-white/[0.08] space-y-3">
          <div className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase">
            Add New Card Chunk:
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onAddCardChunk('critical_rules')}
              className="min-h-[46px] p-3 rounded-2xl bg-white hover:bg-neutral-200 text-black border border-white flex items-center justify-center gap-2 text-xs font-semibold transition-all active:scale-95 cursor-pointer shadow-md"
            >
              <ShieldAlert className="w-4 h-4 text-red-600 stroke-[2]" />
              <span>+ Red Lines</span>
            </button>

            <button
              type="button"
              onClick={() => onAddCardChunk('process_steps')}
              className="min-h-[46px] p-3 rounded-2xl bg-white hover:bg-neutral-200 text-black border border-white flex items-center justify-center gap-2 text-xs font-semibold transition-all active:scale-95 cursor-pointer shadow-md"
            >
              <Layers className="w-4 h-4 text-blue-600 stroke-[2]" />
              <span>+ Step Sequence</span>
            </button>

            <button
              type="button"
              onClick={() => onAddCardChunk('scenario_quiz')}
              className="min-h-[46px] p-3 rounded-2xl bg-white hover:bg-neutral-200 text-black border border-white flex items-center justify-center gap-2 text-xs font-semibold transition-all active:scale-95 cursor-pointer shadow-md"
            >
              <HelpCircle className="w-4 h-4 text-purple-600 stroke-[2]" />
              <span>+ Dilemma Quiz</span>
            </button>

            <button
              type="button"
              onClick={() => onAddCardChunk('concept_analogy')}
              className="min-h-[46px] p-3 rounded-2xl bg-white hover:bg-neutral-200 text-black border border-white flex items-center justify-center gap-2 text-xs font-semibold transition-all active:scale-95 cursor-pointer shadow-md"
            >
              <Lightbulb className="w-4 h-4 text-amber-600 stroke-[2]" />
              <span>+ Analogy</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
