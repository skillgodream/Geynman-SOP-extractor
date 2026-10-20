import React, { useState } from 'react';
import { ShieldAlert, CheckSquare, XCircle, CheckCircle2, AlertTriangle } from 'lucide-react';
import { DeckCard, CriticalRule, CardImage } from '../../types/deck';
import { CardToolbar } from '../CardToolbar';
import { CardVisual } from '../visuals/CardVisual';

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

  const handleUpdateImage = (newImage: CardImage) => {
    onUpdateCard({
      ...card,
      image: newImage,
    });
  };

  const handleRuleChange = (index: number, field: keyof CriticalRule, val: string) => {
    const updated = [...rules];
    updated[index] = { ...updated[index], [field]: val };
    setRules(updated);
  };

  return (
    <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 sm:p-10 transition-colors">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-400 mb-3">
        <ShieldAlert className="w-4 h-4" />
        <span>{card.badgeText || 'Critical Red Lines & Invariants'}</span>
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

      {/* Ultra-Premium Open Tabular List (NO nested bordered boxes) */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800/80 mb-6">
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
                      className="bg-white dark:bg-slate-800 border p-1 rounded font-semibold"
                    >
                      <option value="never_do">NEVER DO</option>
                      <option value="must_do">MUST DO</option>
                      <option value="warning">WARNING</option>
                    </select>
                    <input
                      type="text"
                      value={rule.rule}
                      onChange={(e) => handleRuleChange(idx, 'rule', e.target.value)}
                      className="flex-1 bg-white dark:bg-slate-800 border p-1 rounded font-medium"
                    />
                  </div>
                  <input
                    type="text"
                    value={rule.consequenceOfFailure}
                    placeholder="Consequence of Failure"
                    onChange={(e) => handleRuleChange(idx, 'consequenceOfFailure', e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 border p-1 rounded text-red-600"
                  />
                  <input
                    type="text"
                    value={rule.verificationCheck}
                    placeholder="Verification Check"
                    onChange={(e) => handleRuleChange(idx, 'verificationCheck', e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 border p-1 rounded text-slate-600"
                  />
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 sm:gap-6">
                  {/* Left: Unboxed Type Label (Strict Zero-Pill Discipline) */}
                  <div className="shrink-0 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
                    {isNever ? (
                      <span className="text-red-600 dark:text-red-400 flex items-center gap-1">
                        <span aria-hidden="true">●</span> NEVER DO
                      </span>
                    ) : isMust ? (
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <span aria-hidden="true">●</span> MUST DO
                      </span>
                    ) : (
                      <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <span aria-hidden="true">▲</span> CRITICAL
                      </span>
                    )}
                  </div>

                  {/* Middle: The Rule Text & Details */}
                  <div className="flex-1 space-y-1.5">
                    <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {rule.rule}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      <div className="text-red-700 dark:text-red-300/90 leading-relaxed">
                        <strong className="font-semibold">Catastrophic Risk:</strong> {rule.consequenceOfFailure}
                      </div>
                      <div className="text-slate-600 dark:text-slate-400 leading-relaxed flex items-baseline gap-1">
                        <CheckSquare className="w-3.5 h-3.5 text-slate-400 shrink-0 translate-y-0.5" />
                        <span>
                          <strong className="text-slate-800 dark:text-slate-200 font-semibold">Verification Check:</strong>{' '}
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
