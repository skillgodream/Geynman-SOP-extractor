import React, { useState } from 'react';
import { ShieldAlert, CheckSquare, XCircle, CheckCircle2, AlertTriangle } from 'lucide-react';
import { DeckCard, CriticalRule, CardImage } from '../../types/deck';
import { CardToolbar } from '../CardToolbar';

interface CriticalRulesCardProps {
  card: DeckCard;
  deckTitle: string;
  onUpdateCard: (card: DeckCard) => void;
  onDeleteCard: () => void;
  onOpenTutor: (card: DeckCard) => void;
}

export const CriticalRulesCard: React.FC<CriticalRulesCardProps> = ({
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
  const [rules, setRules] = useState<CriticalRule[]>(card.criticalRules || []);

  const handleSave = () => {
    setIsEditing(false);
    onUpdateCard({
      ...card,
      title,
      subtitle,
      feynmanExplanation: explanation,
      criticalRules: rules,
    });
  };

  const handleRuleChange = (index: number, field: keyof CriticalRule, val: string) => {
    const updated = [...rules];
    updated[index] = { ...updated[index], [field]: val };
    setRules(updated);
  };

  return (
    <div className="relative rounded-[2rem] border border-white/[0.12] bg-gradient-to-b from-rose-500/[0.08] via-neutral-950 to-neutral-950 shadow-[0_25px_80px_rgba(0,0,0,0.9)] p-6 sm:p-10 transition-all overflow-hidden">
      {/* Top Training Card Header */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-6">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <span>{card.badgeText || 'Critical Red Lines & Invariants'}</span>
        </div>

        {card.levelNumber !== undefined ? (
          <span className="text-[10px] font-mono tracking-widest text-blue-400 font-bold uppercase px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20">
            LEVEL {card.levelNumber} · {card.levelNumber === 0 ? 'PREREQUISITES' : card.levelNumber === 4 ? 'METRICS' : 'SAFETY'}
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
          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-3xl font-normal">
            {card.feynmanExplanation}
          </p>
        </div>
      )}

      {/* Tabular Rule List */}
      <div className="divide-y divide-white/[0.08] mb-6">
        {rules.map((rule, idx) => {
          const isNever = rule.type === 'never_do';
          const isMust = rule.type === 'must_do';

          return (
            <div key={idx} className="py-4 sm:py-5 first:pt-0 last:pb-0">
              {isEditing ? (
                <div className="space-y-2 text-xs">
                  <div className="flex gap-2">
                    <select
                      value={rule.type}
                      onChange={(e) => handleRuleChange(idx, 'type', e.target.value as any)}
                      className="bg-neutral-900 border border-white/10 p-1.5 rounded-lg text-white font-semibold"
                    >
                      <option value="never_do">NEVER DO</option>
                      <option value="must_do">MUST DO</option>
                      <option value="warning">WARNING</option>
                    </select>
                    <input
                      type="text"
                      value={rule.rule}
                      onChange={(e) => handleRuleChange(idx, 'rule', e.target.value)}
                      className="flex-1 bg-neutral-900 border border-white/10 p-1.5 rounded-lg text-white font-medium"
                    />
                  </div>
                  <input
                    type="text"
                    value={rule.consequenceOfFailure}
                    placeholder="Consequence of Failure"
                    onChange={(e) => handleRuleChange(idx, 'consequenceOfFailure', e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 p-1.5 rounded-lg text-red-400"
                  />
                  <input
                    type="text"
                    value={rule.verificationCheck}
                    placeholder="Verification Check"
                    onChange={(e) => handleRuleChange(idx, 'verificationCheck', e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 p-1.5 rounded-lg text-neutral-400"
                  />
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 sm:gap-6">
                  {/* Left: Rule Type Tag */}
                  <div className="shrink-0 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
                    {isNever ? (
                      <span className="text-rose-400 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20">
                        <XCircle className="w-3.5 h-3.5 text-rose-400" />
                        <span>NEVER DO</span>
                      </span>
                    ) : isMust ? (
                      <span className="text-emerald-400 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>MUST DO</span>
                      </span>
                    ) : (
                      <span className="text-amber-400 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        <span>CRITICAL</span>
                      </span>
                    )}
                  </div>

                  {/* Middle: The Rule Text & Details */}
                  <div className="flex-1 space-y-1.5">
                    <div className="text-sm sm:text-base font-bold text-white leading-snug">
                      {rule.rule}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs pt-1">
                      <div className="text-rose-300 leading-relaxed font-normal bg-rose-500/5 p-2 rounded-xl border border-rose-500/10">
                        <strong className="font-semibold text-rose-200">Failure Risk:</strong> {rule.consequenceOfFailure}
                      </div>
                      <div className="text-neutral-300 leading-relaxed flex items-baseline gap-1.5 font-normal bg-white/[0.03] p-2 rounded-xl border border-white/[0.08]">
                        <CheckSquare className="w-3.5 h-3.5 text-neutral-400 shrink-0 translate-y-0.5" />
                        <span>
                          <strong className="text-white font-semibold">Verification Check:</strong>{' '}
                          {rule.verificationCheck}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
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

