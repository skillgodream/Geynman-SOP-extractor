import React, { useState } from 'react';
import { Bookmark, FileCheck } from 'lucide-react';
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
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 sm:p-8 transition-colors">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
        <Bookmark className="w-4 h-4" />
        <span>{card.badgeText || 'High-Yield Pocket Reference'}</span>
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
            rows={2}
            className="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-slate-700 dark:text-slate-300"
          />
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
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-3">
              {card.subtitle}
            </p>
          )}
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {card.feynmanExplanation}
          </p>
        </div>
      )}

      {/* Cheatsheet Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {items.map((ref, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-between"
          >
            {isEditing ? (
              <div className="space-y-1.5 text-xs">
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
              <div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  {ref.label}
                </div>
                <div className="text-base sm:text-lg font-bold text-amber-600 dark:text-amber-400 font-mono tabular-nums mb-1">
                  {ref.value}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300">
                  {ref.detail}
                </div>
              </div>
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
