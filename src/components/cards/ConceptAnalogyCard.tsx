import React, { useState } from 'react';
import { Lightbulb, ArrowRight, BookOpen } from 'lucide-react';
import { DeckCard, CardImage } from '../../types/deck';
import { CardToolbar } from '../CardToolbar';
import { CardVisual } from '../visuals/CardVisual';

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

  const handleUpdateImage = (newImage: CardImage) => {
    onUpdateCard({
      ...card,
      image: newImage,
    });
  };

  const defaultDiagram: CardImage['diagramType'] =
    card.title.toLowerCase().includes('origami') || deckTitle.toLowerCase().includes('cold')
      ? 'protein_origami'
      : deckTitle.toLowerCase().includes('clean')
      ? 'cleanroom'
      : 'flowchart';

  return (
    <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 sm:p-10 transition-colors">
      {/* Category header */}
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-3">
        <Lightbulb className="w-4 h-4" />
        <span>{card.badgeText || 'Intuition & Mental Model'}</span>
      </div>

      {isEditing ? (
        <div className="space-y-3 mb-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-xl font-bold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white"
          />
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2 text-slate-600 dark:text-slate-400"
          />
          <textarea
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            rows={3}
            className="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2 text-slate-700 dark:text-slate-300"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              value={metaphor}
              placeholder="Metaphor"
              onChange={(e) => setMetaphor(e.target.value)}
              className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2"
            />
            <input
              type="text"
              value={takeaway}
              placeholder="Takeaway"
              onChange={(e) => setTakeaway(e.target.value)}
              className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2"
            />
          </div>
          <button
            onClick={handleSave}
            className="px-3.5 py-1.5 text-xs font-semibold bg-amber-400 text-slate-950 rounded-lg shadow-sm"
          >
            Save Card Changes
          </button>
        </div>
      ) : (
        /* Ultra-Premium 2-Column Split: Picture / Diagram + Editorial Text (Zero cards-in-cards) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-6">
          {/* Visual Column (5 cols) */}
          <div className="lg:col-span-5 w-full order-2 lg:order-1">
            <CardVisual
              image={card.image}
              onUpdateImage={handleUpdateImage}
              defaultDiagram={defaultDiagram}
              titleContext={card.title}
            />
          </div>

          {/* Text Content Column (7 cols) - Clean Editorial, NO cards in cards */}
          <div className="lg:col-span-7 space-y-4 order-1 lg:order-2">
            <div>
              <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-1.5">
                {card.title}
              </h2>
              {card.subtitle && (
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  {card.subtitle}
                </p>
              )}
            </div>

            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
              {card.feynmanExplanation}
            </p>

            {/* Metaphor & Takeaway (Pure Typography & Hairlines, NO nested boxes) */}
            {card.analogy && (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
                <div className="space-y-1">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                    <span>Everyday Metaphor</span>
                  </div>
                  <blockquote className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 italic border-l-2 border-blue-400 pl-3 leading-relaxed">
                    "{card.analogy.metaphor}"
                  </blockquote>
                </div>

                <div className="space-y-1">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ArrowRight className="w-3.5 h-3.5 text-amber-500" />
                    <span>Operational Takeaway</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-900 dark:text-slate-100 font-medium pl-3">
                    {card.analogy.takeaway}
                  </p>
                </div>
              </div>
            )}
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
