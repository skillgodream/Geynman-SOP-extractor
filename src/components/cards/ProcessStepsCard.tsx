import React, { useState } from 'react';
import { Layers, ArrowRight, AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';
import { DeckCard, ProcessStep, CardImage } from '../../types/deck';
import { CardToolbar } from '../CardToolbar';
import { CardVisual } from '../visuals/CardVisual';

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

  const handleUpdateImage = (newImage: CardImage) => {
    onUpdateCard({
      ...card,
      image: newImage,
    });
  };

  const activeStep = steps[activeStepIndex] || steps[0];

  return (
    <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 sm:p-10 transition-colors">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-3">
        <Layers className="w-4 h-4" />
        <span>{card.badgeText || 'Chunked Workflow Steps'}</span>
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

      {/* Step Navigator Bar (Interactive Segmented Timeline) */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-6 overflow-x-auto scrollbar-none">
        {steps.map((st, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveStepIndex(idx)}
            className={`min-h-[44px] flex-1 min-w-[120px] py-2 px-3 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
              activeStepIndex === idx
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
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

      {/* 2-Column Split: Active Step Detail + Step Visual Diagram (NO nested bordered boxes) */}
      {activeStep && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-6">
          {/* Left Column: Step Instruction & Underlying Feynman Physics (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
              <span>STEP {activeStep.stepNumber || activeStepIndex + 1} OF {steps.length}</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-700 dark:text-slate-300">{activeStep.title}</span>
            </div>

            <div className="font-bold text-slate-900 dark:text-white text-base sm:text-xl leading-snug">
              {activeStep.action}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
              <div className="space-y-1">
                <div className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Why This Step Matters (The Logic)</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed pl-2 border-l-2 border-blue-400">
                  {activeStep.whyItMatters}
                </p>
              </div>

              {activeStep.criticalWatchout && (
                <div className="space-y-1">
                  <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Critical Watchout</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed pl-2 border-l-2 border-amber-400">
                    {activeStep.criticalWatchout}
                  </p>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/80 text-xs">
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

          {/* Right Column: Visual Diagram / Flowchart (5 cols) */}
          <div className="lg:col-span-5 w-full">
            <CardVisual
              image={card.image}
              onUpdateImage={handleUpdateImage}
              defaultDiagram="flowchart"
              titleContext={activeStep.title}
            />
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
