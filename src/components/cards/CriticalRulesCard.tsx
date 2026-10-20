import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, XCircle, AlertTriangle, CheckSquare } from 'lucide-react';
import { DeckCard, CriticalRule } from '../../types/deck';
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
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 sm:p-8 transition-colors">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-400 mb-2">
        <ShieldAlert className="w-4 h-4" />
        <span>{card.badgeText || 'Critical Red Lines & Invariants'}</span>
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

      {/* Rules list */}
      <div className="space-y-3.5 mb-4">
        {rules.map((rule, idx) => {
          const isNever = rule.type === 'never_do';
          const isMust = rule.type === 'must_do';

          return (
            <div
              key={idx}
              className={`p-4 rounded-xl border transition-all ${
                isNever
                  ? 'border-red-200 dark:border-red-900/40 bg-red-50/30 dark:bg-red-950/20'
                  : isMust
                  ? 'border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/30 dark:bg-emerald-950/20'
                  : 'border-amber-200 dark:border-amber-900/40 bg-amber-50/30 dark:bg-amber-950/20'
              }`}
            >
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
                <>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      {isNever ? (
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>NEVER</span>
                        </div>
                      ) : isMust ? (
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>MUST DO</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>CRITICAL</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-snug">
                        {rule.rule}
                      </div>

                      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="text-red-700 dark:text-red-300/90 flex items-start gap-1.5">
                          <span className="font-semibold shrink-0">Failure Risk:</span>
                          <span>{rule.consequenceOfFailure}</span>
                        </div>
                        <div className="text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                          <CheckSquare className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <span>
                            <strong className="text-slate-800 dark:text-slate-200">Verify:</strong>{' '}
                            {rule.verificationCheck}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
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
