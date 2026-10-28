import React, { useState } from 'react';
import { Wrench, CheckCircle, AlertCircle } from 'lucide-react';
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
    <div className="relative rounded-[2rem] border border-white/[0.12] bg-gradient-to-b from-purple-500/[0.08] via-neutral-950 to-neutral-950 shadow-[0_25px_80px_rgba(0,0,0,0.9)] p-6 sm:p-10 transition-all overflow-hidden">
      {/* Top Training Card Header */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-6">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
          <Wrench className="w-3.5 h-3.5 text-purple-400 shrink-0" />
          <span>{card.badgeText || 'Field Traps & Troubleshooting'}</span>
        </div>

        {card.levelNumber !== undefined ? (
          <span className="text-[10px] font-mono tracking-widest text-purple-400 font-bold uppercase px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20">
            LEVEL {card.levelNumber} · DEBUGGING
          </span>
        ) : (
          <span className="text-[10px] font-mono tracking-widest text-neutral-400 font-bold uppercase">
            TRAINING CARD
          </span>
        )}
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
          <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white mb-1.5 leading-tight">
            {card.title}
          </h2>
          {card.subtitle && (
            <p className="text-xs sm:text-sm text-neutral-400 mb-2">
              {card.subtitle}
            </p>
          )}
          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-3xl font-normal mb-3">
            {card.feynmanExplanation}
          </p>

          {/* Stop Work Trigger Badge */}
          {card.stopWorkTrigger && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold my-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>Stop-Work Trigger: {card.stopWorkTrigger}</span>
            </div>
          )}

          {/* Split Pass / Fail Visual Contrast Block */}
          {(card.image?.layout === 'split_pass_fail' || card.image?.passFailComparison) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4 p-4 rounded-2xl bg-neutral-900/80 border border-white/10">
              {/* Passed Visual Box */}
              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>PASSED / CORRECT</span>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    ACCEPTABLE
                  </span>
                </div>
                <p className="text-xs text-emerald-100 font-medium leading-relaxed">
                  {card.image?.passFailComparison?.passText || card.image?.passCaption || 'Visual threshold met: zero defect alignment.'}
                </p>
              </div>

              {/* Failed / Defective Visual Box */}
              <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-red-400">
                  <span className="flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span>DEFECT / REJECTED</span>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-300">
                    STOP WORK
                  </span>
                </div>
                <p className="text-xs text-red-100 font-medium leading-relaxed">
                  {card.image?.passFailComparison?.failText || card.image?.failCaption || 'Misalignment or parameter drift detected. Reject item.'}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tabular Pitfall Grid */}
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
                {/* Column 1: The Mistake */}
                <div className="md:col-span-4 space-y-1">
                  <div className="text-[11px] font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-purple-400" />
                    <span>Issue #{idx + 1}</span>
                  </div>
                  <div className="text-sm sm:text-base font-bold text-white leading-snug">
                    {pf.symptomOrMistake}
                  </div>
                </div>

                {/* Column 2: Root Cause */}
                <div className="md:col-span-4 space-y-1 text-xs">
                  <div className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
                    Root Cause
                  </div>
                  <p className="text-neutral-300 leading-relaxed font-normal bg-white/[0.02] p-2 rounded-xl border border-white/[0.06]">
                    {pf.rootCause}
                  </p>
                </div>

                {/* Column 3: The Protocol Fix */}
                <div className="md:col-span-4 space-y-1 text-xs">
                  <div className="text-[11px] font-medium text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Corrective Action</span>
                  </div>
                  <p className="text-emerald-100 font-medium leading-relaxed bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20">
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

