import React, { useState } from 'react';
import { Bookmark, FileCheck } from 'lucide-react';
import { DeckCard, ReferenceItem, CardImage } from '../../types/deck';
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
    <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 sm:p-10 transition-colors">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-3">
        <Bookmark className="w-4 h-4" />
        <span>{card.badgeText || 'High-Yield Pocket Reference'}</span>
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
            rows={2}
            className="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2 text-slate-700 dark:text-slate-300"
          />
          <button
            onClick={handleSave}
            className="px-3.5 py-1.5 text-xs font-semibold bg-amber-400 text-slate-950 rounded-lg shadow-sm"
          >
            Save Card Changes
          </button>
        </div>
      ) : (
        <div className="mb-6">
          <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-1.5">
            {card.title}
          </h2>
          {card.subtitle && (
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-2">
              {card.subtitle}
            </p>
          )}
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
            {card.feynmanExplanation}
          </p>
        </div>
      )}

      {/* Ultra-Premium Open Table (Zero cards-in-cards) */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800/80 mb-6">
        {items.map((ref, idx) => (
          <div key={idx} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            {isEditing ? (
              <div className="w-full space-y-1.5 text-xs">
                <input
                  type="text"
                  value={ref.label}
                  placeholder="Label"
                  onChange={(e) => handleItemChange(idx, 'label', e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border p-1 rounded font-semibold"
                />
                <input
                  type="text"
                  value={ref.value}
                  placeholder="Value / Threshold"
                  onChange={(e) => handleItemChange(idx, 'value', e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border p-1 rounded text-amber-600 font-bold"
                />
                <input
                  type="text"
                  value={ref.detail}
                  placeholder="Detail"
                  onChange={(e) => handleItemChange(idx, 'detail', e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border p-1 rounded"
                />
              </div>
            ) : (
              <>
                <div className="sm:w-1/3">
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {ref.label}
                  </div>
                </div>

                <div className="sm:w-1/3">
                  <div className="text-sm sm:text-base font-bold text-amber-600 dark:text-amber-400 font-mono tabular-nums">
                    {ref.value}
                  </div>
                </div>

                <div className="sm:w-1/3 text-xs text-slate-500 dark:text-slate-400">
                  {ref.detail}
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
