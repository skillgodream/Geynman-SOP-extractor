import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  HelpCircle,
  ShieldAlert,
  Edit2,
  Trash2,
  Check,
  Loader2
} from 'lucide-react';
import { DeckCard } from '../types/deck';

interface CardToolbarProps {
  card: DeckCard;
  deckTitle: string;
  onUpdateCard: (updatedCard: DeckCard) => void;
  onDeleteCard: () => void;
  onOpenTutor: (card: DeckCard) => void;
  isEditing: boolean;
  onToggleEdit: () => void;
}

export const CardToolbar: React.FC<CardToolbarProps> = ({
  card,
  deckTitle,
  onUpdateCard,
  onDeleteCard,
  onOpenTutor,
  isEditing,
  onToggleEdit,
}) => {
  const [isRefining, setIsRefining] = useState<boolean>(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const handleRefine = async (instructionType: string) => {
    setIsRefining(true);
    setActiveAction(instructionType);
    try {
      const res = await fetch('/api/deck/refine-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          card,
          deckTitle,
          instructionType,
        }),
      });
      const data = await res.json();
      if (data.success && data.updatedCard) {
        onUpdateCard(data.updatedCard);
      }
    } catch (err) {
      console.error('Failed to refine card:', err);
    } finally {
      setIsRefining(false);
      setActiveAction(null);
    }
  };

  return (
    <div className="pt-3 mt-4 border-t border-white/[0.08] space-y-2">
      {/* Apple-style minimalist tool buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        <button
          type="button"
          onClick={() => handleRefine('analogy')}
          disabled={isRefining}
          className="min-h-[38px] flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-white/10 active:scale-95 transition-all disabled:opacity-50 whitespace-nowrap shrink-0 font-medium cursor-pointer"
          title="Enhance the intuitive mental model or metaphor"
        >
          {isRefining && activeAction === 'analogy' ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
          ) : (
            <BookOpen className="w-3.5 h-3.5 text-neutral-400" />
          )}
          <span>New Analogy</span>
        </button>

        <button
          type="button"
          onClick={() => handleRefine('simplify')}
          disabled={isRefining}
          className="min-h-[38px] flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-white/10 active:scale-95 transition-all disabled:opacity-50 whitespace-nowrap shrink-0 font-medium cursor-pointer"
          title="Run 12-Year-Old test to strip remaining jargon"
        >
          {isRefining && activeAction === 'simplify' ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
          )}
          <span>12-Yr-Old Test</span>
        </button>

        <button
          type="button"
          onClick={() => handleRefine('highlight_rules')}
          disabled={isRefining}
          className="min-h-[38px] flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-white/10 active:scale-95 transition-all disabled:opacity-50 whitespace-nowrap shrink-0 font-medium cursor-pointer"
          title="Spotlight critical red lines and failure traps"
        >
          {isRefining && activeAction === 'highlight_rules' ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
          ) : (
            <ShieldAlert className="w-3.5 h-3.5 text-neutral-400" />
          )}
          <span>Red Lines</span>
        </button>

        <button
          type="button"
          onClick={() => onOpenTutor(card)}
          className="min-h-[38px] flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-black hover:bg-neutral-200 active:scale-95 transition-all whitespace-nowrap shrink-0 font-semibold cursor-pointer"
          title="Ask Feynman Tutor about this concept"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Ask Tutor</span>
        </button>

        <div className="h-4 w-[1px] bg-white/10 mx-1 shrink-0" />

        <button
          type="button"
          onClick={onToggleEdit}
          className={`min-h-[38px] flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors shrink-0 font-medium cursor-pointer ${
            isEditing
              ? 'bg-white text-black font-semibold'
              : 'hover:bg-neutral-800 text-neutral-400 hover:text-white'
          }`}
          title={isEditing ? 'Finish editing' : 'Edit card text directly'}
        >
          {isEditing ? <Check className="w-3.5 h-3.5" /> : <Edit2 className="w-3.5 h-3.5" />}
          <span>{isEditing ? 'Done' : 'Edit'}</span>
        </button>

        <button
          type="button"
          onClick={onDeleteCard}
          className="min-h-[38px] min-w-[38px] flex items-center justify-center p-2 hover:text-red-400 hover:bg-red-950/20 rounded-full transition-colors text-neutral-500 shrink-0 cursor-pointer"
          title="Delete card"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
