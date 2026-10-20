import React from 'react';
import { X, BookOpen, Lightbulb, ShieldAlert, Layers, Wrench, HelpCircle, Bookmark, Plus } from 'lucide-react';
import { FeynmanDeck, DeckCard } from '../types/deck';

interface MobileOutlineSheetProps {
  isOpen: boolean;
  onClose: () => void;
  deck: FeynmanDeck;
  onSelectCard: (cardId: string) => void;
  onAddCard: (type: DeckCard['cardType']) => void;
}

export const MobileOutlineSheet: React.FC<MobileOutlineSheetProps> = ({
  isOpen,
  onClose,
  deck,
  onSelectCard,
  onAddCard,
}) => {
  if (!isOpen) return null;

  const cardIcon = (type: DeckCard['cardType']) => {
    switch (type) {
      case 'concept_analogy':
        return <Lightbulb className="w-4 h-4 text-amber-500" />;
      case 'critical_rules':
        return <ShieldAlert className="w-4 h-4 text-red-500" />;
      case 'process_steps':
        return <Layers className="w-4 h-4 text-blue-500" />;
      case 'pitfalls_troubleshooting':
        return <Wrench className="w-4 h-4 text-amber-500" />;
      case 'scenario_quiz':
        return <HelpCircle className="w-4 h-4 text-purple-500" />;
      case 'quick_reference':
        return <Bookmark className="w-4 h-4 text-emerald-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-950/70 backdrop-blur-sm md:hidden animate-fadeIn">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-h-[80vh] bg-white dark:bg-slate-900 rounded-t-3xl border-t border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-slideUp">
        {/* Drag Handle Affordance */}
        <div className="pt-3 pb-1">
          <div className="w-10 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto" />
        </div>

        {/* Header */}
        <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Card Outline
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {deck.cards.length} instructional cards in this SOP
            </p>
          </div>
          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card list with touch-friendly rows */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {/* Hero / Overview row */}
          <button
            type="button"
            onClick={() => {
              onSelectCard('hero-card');
              onClose();
            }}
            className="w-full min-h-[52px] p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-left flex items-center gap-3 active:scale-[0.99] transition-transform"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                Overview & Central Analogy
              </div>
              <div className="text-[11px] text-slate-500 truncate">
                {deck.feynmanCoreConcept.centralAnalogy.title}
              </div>
            </div>
          </button>

          {/* Cards */}
          {deck.cards.map((card, idx) => (
            <button
              key={card.id}
              type="button"
              onClick={() => {
                onSelectCard(card.id);
                onClose();
              }}
              className="w-full min-h-[52px] p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-800 text-left flex items-center gap-3 active:scale-[0.99] transition-transform"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                {cardIcon(card.cardType)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                  {idx + 1}. {card.title}
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  {card.subtitle || card.badgeText}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Quick Add Section */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Add New Card Chunk:
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => {
                onAddCard('critical_rules');
                onClose();
              }}
              className="min-h-[44px] flex items-center justify-center gap-1.5 p-2 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-medium text-slate-800 dark:text-slate-200"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
              <span>+ Red Lines</span>
            </button>
            <button
              onClick={() => {
                onAddCard('process_steps');
                onClose();
              }}
              className="min-h-[44px] flex items-center justify-center gap-1.5 p-2 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-medium text-slate-800 dark:text-slate-200"
            >
              <Layers className="w-3.5 h-3.5 text-blue-500" />
              <span>+ Step Sequence</span>
            </button>
            <button
              onClick={() => {
                onAddCard('scenario_quiz');
                onClose();
              }}
              className="min-h-[44px] flex items-center justify-center gap-1.5 p-2 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-medium text-slate-800 dark:text-slate-200"
            >
              <HelpCircle className="w-3.5 h-3.5 text-purple-500" />
              <span>+ Dilemma Quiz</span>
            </button>
            <button
              onClick={() => {
                onAddCard('concept_analogy');
                onClose();
              }}
              className="min-h-[44px] flex items-center justify-center gap-1.5 p-2 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-medium text-slate-800 dark:text-slate-200"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>+ Analogy</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
