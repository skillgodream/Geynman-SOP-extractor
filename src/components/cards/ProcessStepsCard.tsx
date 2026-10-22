import React, { useState } from 'react';
import { Layers, HelpCircle, AlertTriangle, ArrowRight } from 'lucide-react';
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
    <div className="relative rounded-[2rem] border border-white/[0.12] bg-gradient-to-b from-sky-500/[0.08] via-neutral-950 to-neutral-950 shadow-[0_25px_80px_rgba(0,0,0,0.9)] p-6 sm:p-10 transition-all overflow-hidden">
      {/* Top Training Card Header */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-6">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300 text-xs font-semibold">
          <Layers className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <span>{card.badgeText || 'Chunked Workflow Steps'}</span>
        </div>

        <span className="text-[10px] font-mono tracking-widest text-neutral-400 font-bold uppercase">
          TRAINING CARD
        </span>
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

      {/* Step Selector Pills in iOS Segmented Style */}
      <div className="flex items-center gap-1.5 p-1 bg-black/60 border border-white/10 rounded-2xl mb-6 w-full backdrop-blur-md">
        {steps.map((st, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveStepIndex(idx)}
            className={`min-h-[38px] flex-1 py-1.5 px-2 text-xs sm:text-sm font-bold tracking-wide rounded-xl transition-all flex items-center justify-center cursor-pointer ${
              activeStepIndex === idx
                ? 'bg-white text-black shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>P{st.stepNumber || idx + 1}</span>
          </button>
        ))}
      </div>

      {/* 2-Column Split: Active Step Detail + Step Visual Diagram */}
      {activeStep && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-6">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-sky-400">
              {activeStep.title}
            </div>

            <div className="font-bold text-sky-200 text-base sm:text-xl leading-snug flex items-center justify-between gap-3">
              <span>{activeStep.action}</span>
              <ArrowRight className="w-5 h-5 text-sky-400 shrink-0" />
            </div>

            <div className="pt-3 border-t border-white/[0.08] space-y-3">
              <div className="space-y-1">
                <div className="text-[11px] font-bold text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
                  <span>Operational Rationale</span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed pl-3 border-l-2 border-sky-400/50 font-normal">
                  {activeStep.whyItMatters}
                </p>
              </div>

              {activeStep.criticalWatchout && (
                <div className="space-y-1">
                  <div className="text-[11px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    <span>Watchout</span>
                  </div>
                  <p className="text-xs sm:text-sm text-rose-300 leading-relaxed pl-3 border-l-2 border-rose-500/50 font-normal">
                    {activeStep.criticalWatchout}
                  </p>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-white/[0.08] text-xs">
              <button
                type="button"
                onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
                disabled={activeStepIndex === 0}
                className="min-h-[40px] px-3 py-1.5 text-neutral-400 hover:text-white disabled:opacity-30 font-medium transition-colors cursor-pointer"
              >
                ← Previous Step
              </button>
              <button
                type="button"
                onClick={() => setActiveStepIndex((prev) => Math.min(steps.length - 1, prev + 1))}
                disabled={activeStepIndex === steps.length - 1}
                className="min-h-[40px] px-3 py-1.5 text-white font-medium hover:underline disabled:opacity-30 disabled:no-underline transition-colors cursor-pointer"
              >
                Next Step →
              </button>
            </div>
          </div>

          {/* Right Column: Visual Diagram */}
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

