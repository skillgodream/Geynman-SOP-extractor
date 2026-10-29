import React, { useState } from 'react';
import { Lightbulb, ArrowRight, BookOpen, Sparkles } from 'lucide-react';
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
    <div className="relative rounded-[2rem] border border-white/[0.12] bg-gradient-to-b from-amber-500/[0.06] via-neutral-950 to-neutral-950 shadow-[0_25px_80px_rgba(0,0,0,0.9)] p-6 sm:p-10 transition-all overflow-hidden">

      {isEditing ? (
        <div className="space-y-3 mb-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-xl font-bold bg-neutral-900 border border-white/10 rounded-xl p-2.5 text-white"
          />
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="w-full text-xs bg-neutral-900 border border-white/10 rounded-xl p-2 text-neutral-400"
          />
          <textarea
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            rows={3}
            className="w-full text-sm bg-neutral-900 border border-white/10 rounded-xl p-2 text-neutral-200"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              value={metaphor}
              placeholder="Metaphor"
              onChange={(e) => setMetaphor(e.target.value)}
              className="w-full text-xs bg-neutral-900 border border-white/10 rounded-xl p-2 text-neutral-200"
            />
            <input
              type="text"
              value={takeaway}
              placeholder="Takeaway"
              onChange={(e) => setTakeaway(e.target.value)}
              className="w-full text-xs bg-neutral-900 border border-white/10 rounded-xl p-2 text-neutral-200"
            />
          </div>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 text-xs font-semibold bg-white text-black rounded-full shadow-sm hover:bg-neutral-200 cursor-pointer"
          >
            Save Card Changes
          </button>
        </div>
      ) : (
        /* 2-Column Split Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-6">
          {/* Visual Column */}
          <div className="lg:col-span-5 w-full order-2 lg:order-1">
            <CardVisual
              image={card.image}
              onUpdateImage={handleUpdateImage}
              defaultDiagram={defaultDiagram}
              titleContext={card.title}
            />
          </div>

          {/* Text Content Column */}
          <div className="lg:col-span-7 space-y-4 order-1 lg:order-2">
            <div>
              <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white mb-1.5 leading-tight">
                {card.title}
              </h2>
              {card.subtitle && (
                <p className="text-xs sm:text-sm text-neutral-400">
                  {card.subtitle}
                </p>
              )}
            </div>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-normal">
              {card.feynmanExplanation}
            </p>

            {/* Metaphor & Takeaway */}
            {card.analogy && (
              <div className="pt-4 border-t border-white/[0.08] space-y-3">
                <div className="space-y-1">
                  <div className="text-[11px] font-bold text-amber-300/90 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                    <span>Everyday Metaphor</span>
                  </div>
                  <blockquote className="text-xs sm:text-sm text-neutral-200 italic border-l-2 border-amber-400/60 pl-3 leading-relaxed">
                    "{card.analogy.metaphor}"
                  </blockquote>
                </div>

                <div className="space-y-1">
                  <div className="text-[11px] font-bold text-amber-300/90 uppercase tracking-wider flex items-center gap-1.5">
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                    <span>Operational Takeaway</span>
                  </div>
                  <p className="text-xs sm:text-sm text-amber-100 font-semibold pl-3 border-l-2 border-amber-400/30">
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

