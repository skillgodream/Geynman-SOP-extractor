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
    <div className="pt-3 mt-4 border-t border-slate-200/80 dark:border-slate-800/80 space-y-2.5">
      {/* Mobile-friendly horizontal scroll / wrap tool buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <button
          type="button"
          onClick={() => handleRefine('analogy')}
          disabled={isRefining}
          className="min-h-[40px] flex items-center gap-1.5 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 hover:text-amber-800 dark:hover:bg-amber-950/40 dark:hover:text-amber-300 active:scale-95 transition-all disabled:opacity-50 whitespace-nowrap shrink-0 text-slate-700 dark:text-slate-300 font-medium"
          title="Enhance the intuitive mental model or metaphor"
        >
          {isRefining && activeAction === 'analogy' ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-500" />
          ) : (
            <BookOpen className="w-3.5 h-3.5 text-amber-500" />
          )}
          <span>New Analogy</span>
        </button>

        <button
          type="button"
          onClick={() => handleRefine('simplify')}
          disabled={isRefining}
          className="min-h-[40px] flex items-center gap-1.5 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 hover:text-blue-800 dark:hover:bg-blue-950/40 dark:hover:text-blue-300 active:scale-95 transition-all disabled:opacity-50 whitespace-nowrap shrink-0 text-slate-700 dark:text-slate-300 font-medium"
          title="Run 12-Year-Old test to strip remaining jargon"
        >
          {isRefining && activeAction === 'simplify' ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          )}
          <span>12-Yr-Old Test</span>
        </button>

        <button
          type="button"
          onClick={() => handleRefine('highlight_rules')}
          disabled={isRefining}
          className="min-h-[40px] flex items-center gap-1.5 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-red-100 hover:text-red-800 dark:hover:bg-red-950/40 dark:hover:text-red-300 active:scale-95 transition-all disabled:opacity-50 whitespace-nowrap shrink-0 text-slate-700 dark:text-slate-300 font-medium"
          title="Spotlight critical red lines and failure traps"
        >
          {isRefining && activeAction === 'highlight_rules' ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-red-500" />
          ) : (
            <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
          )}
          <span>Red Lines</span>
        </button>

        <button
          type="button"
          onClick={() => onOpenTutor(card)}
          className="min-h-[40px] flex items-center gap-1.5 px-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60 hover:bg-amber-100 active:scale-95 transition-all whitespace-nowrap shrink-0 font-medium"
          title="Ask Feynman Tutor about this concept"
        >
          <HelpCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>Ask Tutor</span>
        </button>

        <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1 shrink-0" />

        <button
          type="button"
          onClick={onToggleEdit}
          className={`min-h-[40px] flex items-center gap-1 px-3 rounded-lg transition-colors shrink-0 font-medium ${
            isEditing
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
          title={isEditing ? 'Finish editing' : 'Edit card text directly'}
        >
          {isEditing ? <Check className="w-3.5 h-3.5" /> : <Edit2 className="w-3.5 h-3.5" />}
          <span>{isEditing ? 'Done' : 'Edit'}</span>
        </button>

        <button
          type="button"
          onClick={onDeleteCard}
          className="min-h-[40px] min-w-[40px] flex items-center justify-center p-2 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors text-slate-400 shrink-0"
          title="Delete card"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
