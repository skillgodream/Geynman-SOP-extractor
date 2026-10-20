import React, { useState } from 'react';
import { Layers, ArrowRight, AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';
import { DeckCard, ProcessStep } from '../../types/deck';
import { CardToolbar } from '../CardToolbar';

interface ProcessStepsCardProps {
  card: DeckCard;
  deckTitle: string;
  onUpdateCard: (card: DeckCard) => void;
  onDeleteCard: () => void;
  onOpenTutor: (card: DeckCard) => void;
}

export const ProcessStepsCard: React.FC<ProcessStepsCardProps> = ({
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
  const [steps, setSteps] = useState<ProcessStep[]>(card.steps || []);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  const handleSave = () => {
    setIsEditing(false);
    onUpdateCard({
      ...card,
      title,
      subtitle,
      feynmanExplanation: explanation,
      steps,
    });
  };

  const activeStep = steps[activeStepIndex] || steps[0];

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 sm:p-8 transition-colors">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
        <Layers className="w-4 h-4" />
        <span>{card.badgeText || 'Chunked Workflow Steps'}</span>
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

      {/* Step Navigator Bar (Interactive Tabs) */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-6 overflow-x-auto">
        {steps.map((st, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveStepIndex(idx)}
            className={`flex-1 min-w-[120px] py-2 px-3 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
              activeStepIndex === idx
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                activeStepIndex === idx
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
              }`}
            >
              {st.stepNumber || idx + 1}
            </span>
            <span className="truncate">{st.title}</span>
          </button>
        ))}
      </div>

      {/* Active Step Spotlight Card */}
      {activeStep && (
        <div className="p-5 sm:p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 mb-4 transition-all">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 mb-2">
            <span>STEP {activeStep.stepNumber || activeStepIndex + 1} OF {steps.length}</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-700 dark:text-slate-300">{activeStep.title}</span>
          </div>

          <div className="font-semibold text-slate-900 dark:text-white text-base sm:text-lg mb-4">
            {activeStep.action}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Feynman Why it matters */}
            <div className="p-4 rounded-lg bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider mb-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Why This Step Matters (The Logic)</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {activeStep.whyItMatters}
              </p>
            </div>

            {/* Critical Watchout */}
            {activeStep.criticalWatchout && (
              <div className="p-4 rounded-lg bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider mb-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Critical Watchout</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {activeStep.criticalWatchout}
                </p>
              </div>
            )}
          </div>

          {/* Step pagination controls with touch targets */}
          <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
              disabled={activeStepIndex === 0}
              className="min-h-[44px] px-3 py-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 disabled:opacity-30 disabled:hover:text-slate-500 font-medium transition-colors flex items-center"
            >
              ← Previous Step
            </button>
            <div className="text-slate-400 font-mono text-[11px]">
              {activeStepIndex + 1} / {steps.length}
            </div>
            <button
              onClick={() => setActiveStepIndex((prev) => Math.min(steps.length - 1, prev + 1))}
              disabled={activeStepIndex === steps.length - 1}
              className="min-h-[44px] px-3 py-2 text-amber-600 dark:text-amber-400 font-semibold hover:underline disabled:opacity-30 disabled:no-underline transition-colors flex items-center"
            >
              Next Step →
            </button>
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
