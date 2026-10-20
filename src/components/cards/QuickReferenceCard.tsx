import React, { useState } from 'react';
import { Bookmark } from 'lucide-react';
import { DeckCard, ReferenceItem } from '../../types/deck';
import { CardToolbar } from '../CardToolbar';

interface QuickReferenceCardProps {
  card: DeckCard;
  deckTitle: string;
  onUpdateCard: (card: DeckCard) => void;
  onDeleteCard: () => void;
  onOpenTutor: (card: DeckCard) => void;
}

export const QuickReferenceCard: React.FC<QuickReferenceCardProps> = ({
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
  const [items, setItems] = useState<ReferenceItem[]>(card.referenceItems || []);

  const handleSave = () => {
    setIsEditing(false);
    onUpdateCard({
      ...card,
      title,
      subtitle,
      feynmanExplanation: explanation,
      referenceItems: items,
    });
  };

  const handleItemChange = (index: number, field: keyof ReferenceItem, val: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: val };
    setItems(updated);
  };

  return (
    <div className="rounded-3xl border border-white/[0.08] bg-neutral-950 shadow-2xl p-6 sm:p-10 transition-colors">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">
        <Bookmark className="w-3.5 h-3.5 text-neutral-300" />
        <span>{card.badgeText || 'High-Yield Pocket Reference'}</span>
      </div>

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
            rows={2}
            className="w-full text-sm bg-neutral-900 border border-white/10 rounded-xl p-2 text-neutral-200"
          />
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 text-xs font-semibold bg-white text-black rounded-full shadow-sm hover:bg-neutral-200 cursor-pointer"
          >
            Save Card Changes
          </button>
        </div>
      ) : (
        <div className="mb-6">
          <h2 className="text-xl sm:text-3xl font-bold tracking-tight text-white mb-1.5">
            {card.title}
          </h2>
          {card.subtitle && (
            <p className="text-xs sm:text-sm text-neutral-400 mb-2">
              {card.subtitle}
            </p>
          )}
          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-3xl font-normal">
            {card.feynmanExplanation}
          </p>
        </div>
      )}

      {/* Clean Tabular Hairline List (NO nested bordered cards) */}
      <div className="divide-y divide-white/[0.08] mb-6">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
          >
            {isEditing ? (
              <div className="flex gap-2 w-full text-xs">
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => handleItemChange(idx, 'label', e.target.value)}
                  className="bg-neutral-900 border border-white/10 p-1.5 rounded-lg text-neutral-300 w-1/3"
                />
                <input
                  type="text"
                  value={item.value}
                  onChange={(e) => handleItemChange(idx, 'value', e.target.value)}
                  className="bg-neutral-900 border border-white/10 p-1.5 rounded-lg text-white font-mono w-1/3"
                />
                <input
                  type="text"
                  value={item.detail}
                  onChange={(e) => handleItemChange(idx, 'detail', e.target.value)}
                  className="bg-neutral-900 border border-white/10 p-1.5 rounded-lg text-neutral-400 flex-1"
                />
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                  <span className="text-xs sm:text-sm font-medium text-neutral-300">
                    {item.label}
                  </span>
                </div>

                <div className="flex items-baseline gap-3 text-right">
                  <span className="text-xs sm:text-sm font-mono font-bold text-white">
                    {item.value}
                  </span>
                  <span className="text-xs text-neutral-400 font-normal">
                    {item.detail}
                  </span>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

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
