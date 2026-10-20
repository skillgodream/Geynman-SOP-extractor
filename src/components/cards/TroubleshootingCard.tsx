import React, { useState } from 'react';
import { Wrench, AlertCircle, RefreshCw, CheckCircle } from 'lucide-react';
import { DeckCard, Pitfall } from '../../types/deck';
import { CardToolbar } from '../CardToolbar';

interface TroubleshootingCardProps {
  card: DeckCard;
  deckTitle: string;
  onUpdateCard: (card: DeckCard) => void;
  onDeleteCard: () => void;
  onOpenTutor: (card: DeckCard) => void;
}

export const TroubleshootingCard: React.FC<TroubleshootingCardProps> = ({
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
  const [pitfalls, setPitfalls] = useState<Pitfall[]>(card.pitfalls || []);

  const handleSave = () => {
    setIsEditing(false);
    onUpdateCard({
      ...card,
      title,
      subtitle,
      feynmanExplanation: explanation,
      pitfalls,
    });
  };

  const handlePitfallChange = (index: number, field: keyof Pitfall, val: string) => {
    const updated = [...pitfalls];
    updated[index] = { ...updated[index], [field]: val };
    setPitfalls(updated);
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 sm:p-8 transition-colors">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2">
        <Wrench className="w-4 h-4" />
        <span>{card.badgeText || 'Field Traps & Troubleshooting'}</span>
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

      {/* Troubleshooting Grid */}
      <div className="space-y-4 mb-4">
        {pitfalls.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30"
          >
            {isEditing ? (
              <div className="space-y-2 text-xs">
                <input
                  type="text"
                  value={item.symptomOrMistake}
                  placeholder="Symptom or Mistake"
                  onChange={(e) => handlePitfallChange(idx, 'symptomOrMistake', e.target.value)}
                  className="w-full font-bold bg-white dark:bg-slate-800 border p-1 rounded"
                />
                <input
                  type="text"
                  value={item.rootCause}
                  placeholder="Root Cause"
                  onChange={(e) => handlePitfallChange(idx, 'rootCause', e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border p-1 rounded"
                />
                <input
                  type="text"
                  value={item.immediateFix}
                  placeholder="Immediate Fix"
                  onChange={(e) => handlePitfallChange(idx, 'immediateFix', e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border p-1 rounded font-semibold text-emerald-600"
                />
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white mb-2">
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{item.symptomOrMistake}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mt-2 pt-2 border-t border-slate-200 dark:border-slate-700/60">
                  <div>
                    <span className="font-semibold text-slate-500 dark:text-slate-400 block mb-0.5">
                      Why This Happens (Root Cause):
                    </span>
                    <span className="text-slate-700 dark:text-slate-300">
                      {item.rootCause}
                    </span>
                  </div>

                  <div>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400 block mb-0.5 flex items-center gap-1">
                      <RefreshCw className="w-3 h-3" />
                      <span>Immediate Field Protocol:</span>
                    </span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium">
                      {item.immediateFix}
                    </span>
                  </div>
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
