import React, { useState } from 'react';
import { Lightbulb, ArrowRight, BookOpen } from 'lucide-react';
import { DeckCard } from '../../types/deck';
import { CardToolbar } from '../CardToolbar';

interface ConceptAnalogyCardProps {
  card: DeckCard;
  deckTitle: string;
  onUpdateCard: (card: DeckCard) => void;
  onDeleteCard: () => void;
  onOpenTutor: (card: DeckCard) => void;
}

export const ConceptAnalogyCard: React.FC<ConceptAnalogyCardProps> = ({
  card,
  deckTitle,
  onUpdateCard,
  onDeleteCard,
  onOpenTutor,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(card.title);
  const [subtitle, setSubtitle] = useState(card.subtitle || '');
  const [explanation, setExplanation] = useState(card.feynmanExplanation);
  const [metaphor, setMetaphor] = useState(card.analogy?.metaphor || '');
  const [takeaway, setTakeaway] = useState(card.analogy?.takeaway || '');

  const handleSave = () => {
    setIsEditing(false);
    onUpdateCard({
      ...card,
      title,
      subtitle,
      feynmanExplanation: explanation,
      analogy: {
        metaphor,
        takeaway,
      },
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 sm:p-8 transition-colors">
      {/* Category header */}
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2">
        <Lightbulb className="w-4 h-4" />
        <span>{card.badgeText || 'Intuition & Mental Model'}</span>
      </div>

      {isEditing ? (
        <div className="space-y-3 mb-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-xl font-bold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
          />
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-slate-600 dark:text-slate-400"
          />
          <textarea
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            rows={3}
            className="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-slate-700 dark:text-slate-300"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              value={metaphor}
              placeholder="Metaphor"
              onChange={(e) => setMetaphor(e.target.value)}
              className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2"
            />
            <input
              type="text"
              value={takeaway}
              placeholder="Takeaway"
              onChange={(e) => setTakeaway(e.target.value)}
              className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2"
            />
          </div>
          <button
            onClick={handleSave}
            className="px-3 py-1.5 text-xs font-semibold bg-amber-400 text-slate-950 rounded-md"
          >
            Save Card Changes
          </button>
        </div>
      ) : (
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-1">
            {card.title}
          </h2>
          {card.subtitle && (
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-4">
              {card.subtitle}
            </p>
          )}
          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            {card.feynmanExplanation}
          </p>
        </div>
      )}

      {/* Visual Analogy Box */}
      {card.analogy && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/40 bg-blue-50/40 dark:bg-blue-950/20">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Real-World Metaphor</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
              {card.analogy.metaphor}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/20">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider mb-2">
              <ArrowRight className="w-3.5 h-3.5" />
              <span>Core Operational Takeaway</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
              {card.analogy.takeaway}
            </p>
          </div>
        </div>
      )}

      <CardToolbar
        card={card}
        deckTitle={deckTitle}
        onUpdateCard={onUpdateCard}
        onDeleteCard={onDeleteCard}
        onOpenTutor={onOpenTutor}
        isEditing={isEditing}
        onToggleEdit={() => setIsEditing(!isEditing)}
      />
    </div>
  );
};
