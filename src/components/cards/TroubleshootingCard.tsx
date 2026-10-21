import React, { useState } from 'react';
import { Wrench, CheckCircle } from 'lucide-react';
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
    <div className="rounded-3xl border border-white/[0.08] bg-neutral-950 shadow-2xl p-6 sm:p-10 transition-colors">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">
        <Wrench className="w-3.5 h-3.5 text-neutral-300" />
        <span>{card.badgeText || 'Field Traps & Troubleshooting'}</span>
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

      {/* Ultra-Premium Tabular Pitfall Grid (NO nested cards) */}
      <div className="divide-y divide-white/[0.08] mb-6">
        {pitfalls.map((pf, idx) => (
          <div key={idx} className="py-4 sm:py-5 first:pt-0 last:pb-0">
            {isEditing ? (
              <div className="space-y-2 text-xs">
                <input
                  type="text"
                  value={pf.symptomOrMistake}
                  placeholder="Symptom or Common Mistake"
                  onChange={(e) => handlePitfallChange(idx, 'symptomOrMistake', e.target.value)}
                  className="w-full bg-neutral-900 border border-white/10 p-2 rounded-lg text-white"
                />
                <input
                  type="text"
                  value={pf.rootCause}
                  placeholder="Root Cause (Why it occurs)"
                  onChange={(e) => handlePitfallChange(idx, 'rootCause', e.target.value)}
                  className="w-full bg-neutral-900 border border-white/10 p-2 rounded-lg text-neutral-300"
                />
                <input
                  type="text"
                  value={pf.immediateFix}
                  placeholder="Immediate Field Fix"
                  onChange={(e) => handlePitfallChange(idx, 'immediateFix', e.target.value)}
                  className="w-full bg-neutral-900 border border-white/10 p-2 rounded-lg text-neutral-300"
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-6 items-baseline">
                {/* Column 1: The Mistake (4 cols) */}
                <div className="md:col-span-4 space-y-1">
                  <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                    Issue #{idx + 1}
                  </div>
                  <div className="text-sm sm:text-base font-bold text-white leading-snug">
                    {pf.symptomOrMistake}
                  </div>
                </div>

                {/* Column 2: Root Cause (4 cols) */}
                <div className="md:col-span-4 space-y-1 text-xs">
                  <div className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
                    Root Cause
                  </div>
                  <p className="text-neutral-300 leading-relaxed font-normal">
                    {pf.rootCause}
                  </p>
                </div>

                {/* Column 3: The Protocol Fix (4 cols) */}
                <div className="md:col-span-4 space-y-1 text-xs">
                  <div className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Corrective Action</span>
                  </div>
                  <p className="text-neutral-200 leading-relaxed font-normal">
                    {pf.immediateFix}
                  </p>
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
