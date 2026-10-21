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
        return <Lightbulb className="w-4 h-4 text-neutral-300" />;
      case 'critical_rules':
        return <ShieldAlert className="w-4 h-4 text-neutral-300" />;
      case 'process_steps':
        return <Layers className="w-4 h-4 text-neutral-300" />;
      case 'pitfalls_troubleshooting':
        return <Wrench className="w-4 h-4 text-neutral-300" />;
      case 'scenario_quiz':
        return <HelpCircle className="w-4 h-4 text-neutral-300" />;
      case 'quick_reference':
        return <Bookmark className="w-4 h-4 text-neutral-300" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/80 backdrop-blur-md md:hidden animate-fadeIn font-sans">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-h-[80vh] bg-neutral-950 rounded-t-3xl border-t border-white/[0.08] shadow-2xl flex flex-col overflow-hidden animate-slideUp">
        {/* Drag Handle Affordance */}
        <div className="pt-3 pb-1">
          <div className="w-10 h-1 bg-neutral-700 rounded-full mx-auto" />
        </div>

        {/* Header */}
        <div className="px-5 py-3 border-b border-white/[0.08] flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">
              Card Outline
            </h3>
            <p className="text-xs text-neutral-400">
              {deck.cards.length} cards in this SOP
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-neutral-400 hover:text-white rounded-full cursor-pointer"
            aria-label="Close outline"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Card List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {/* Card Outline row */}
          <button
            type="button"
            onClick={() => {
              onSelectCard('card-outline');
              onClose();
            }}
            className="w-full min-h-[48px] p-3 rounded-2xl bg-neutral-900/60 hover:bg-neutral-800 border border-white/[0.08] flex items-center gap-3 text-left transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 truncate">
              <div className="text-xs font-semibold text-white truncate">
                Card Outline
              </div>
              <div className="text-[11px] text-neutral-400 truncate">
                Table of contents & card index
              </div>
            </div>
          </button>

          {/* Hero / Overview row */}
          <button
            type="button"
            onClick={() => {
              onSelectCard('hero-card');
              onClose();
            }}
            className="w-full min-h-[48px] p-3 rounded-2xl bg-neutral-900/60 hover:bg-neutral-800 border border-white/[0.08] flex items-center gap-3 text-left transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 truncate">
              <div className="text-xs font-semibold text-white truncate">
                Overview & Central Analogy
              </div>
              <div className="text-[11px] text-neutral-400 truncate">
                {deck.feynmanCoreConcept.centralAnalogy.title}
              </div>
            </div>
          </button>

          {/* Cards List */}
          {deck.cards.map((card, idx) => (
            <button
              key={card.id}
              type="button"
              onClick={() => {
                onSelectCard(card.id);
                onClose();
              }}
              className="w-full min-h-[48px] p-3 rounded-2xl bg-neutral-900/40 hover:bg-neutral-800 border border-white/[0.08] flex items-center gap-3 text-left transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center shrink-0">
                {cardIcon(card.cardType)}
              </div>
              <div className="flex-1 truncate">
                <div className="text-xs font-semibold text-white truncate">
                  {idx + 1}. {card.title}
                </div>
                <div className="text-[11px] text-neutral-400 truncate">
                  {card.subtitle || card.badgeText || card.cardType.replace('_', ' ')}
                </div>
              </div>
            </button>
          ))}

          {/* Add Section Section */}
          <div className="pt-4 mt-2 border-t border-white/[0.08]">
            <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
              Add Instructional Section:
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  onAddCard('concept_analogy');
                  onClose();
                }}
                className="min-h-[44px] p-2.5 rounded-full bg-white hover:bg-neutral-200 text-black border border-white font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-amber-600 stroke-[2]" />
                <span>+ Analogy</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onAddCard('critical_rules');
                  onClose();
                }}
                className="min-h-[44px] p-2.5 rounded-full bg-white hover:bg-neutral-200 text-black border border-white font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-red-600 stroke-[2]" />
                <span>+ Red Lines</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onAddCard('process_steps');
                  onClose();
                }}
                className="min-h-[44px] p-2.5 rounded-full bg-white hover:bg-neutral-200 text-black border border-white font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-blue-600 stroke-[2]" />
                <span>+ Steps</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onAddCard('scenario_quiz');
                  onClose();
                }}
                className="min-h-[44px] p-2.5 rounded-full bg-white hover:bg-neutral-200 text-black border border-white font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-purple-600 stroke-[2]" />
                <span>+ Quiz</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
