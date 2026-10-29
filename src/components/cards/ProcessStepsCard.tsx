import React, { useState } from 'react';
import { Layers, HelpCircle, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';
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

  const normalizeSteps = (rawSteps: any[]): ProcessStep[] => {
    if (!Array.isArray(rawSteps)) return [];
    return rawSteps.map((st: any, idx: number) => {
      const stepNum = st.stepNumber || idx + 1;
      const getStr = (val: any): string | null => {
        if (!val) return null;
        if (Array.isArray(val)) {
          const joined = val.map((v) => String(v).trim()).filter(Boolean).join('. ');
          return joined.length > 0 ? joined : null;
        }
        const s = String(val).trim();
        if (s.toLowerCase() === 'undefined' || s.toLowerCase() === 'null' || !s) return null;
        return s;
      };

      const title =
        getStr(st.title) ||
        getStr(st.stepTitle) ||
        getStr(st.phaseTag) ||
        getStr(st.name) ||
        `Step ${stepNum}`;

      const action =
        getStr(st.action) ||
        getStr(st.coreAction) ||
        getStr(st.description) ||
        getStr(st.instruction) ||
        `Execute step ${stepNum} protocol according to specifications.`;

      const whyItMatters =
        getStr(st.whyItMatters) ||
        getStr(st.feynmanIntuition) ||
        getStr(st.rationale) ||
        getStr(st.why) ||
        getStr(st.dataMathBox) ||
        `Guarantees operational accuracy and prevents process drift.`;

      const criticalWatchout =
        getStr(st.criticalWatchout) ||
        getStr(st.watchout) ||
        getStr(st.warning) ||
        undefined;

      return {
        stepNumber: stepNum,
        title,
        action,
        whyItMatters,
        ...(criticalWatchout ? { criticalWatchout } : {}),
      };
    });
  };

  const [steps, setSteps] = useState<ProcessStep[]>(() => normalizeSteps(card.steps || []));
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  // Sync steps if card prop changes
  React.useEffect(() => {
    setSteps(normalizeSteps(card.steps || []));
  }, [card.steps]);

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

  // Clean badge text logic to avoid double pill repetition (e.g. "Level 2 · Execution" + "LEVEL 2 · EXECUTION")
  const levelLabel = card.levelNumber !== undefined ? `LEVEL ${card.levelNumber} · EXECUTION` : null;
  const isBadgeDuplicate = card.badgeText && levelLabel && card.badgeText.toUpperCase().includes(`LEVEL ${card.levelNumber}`);
  const headerBadge = isBadgeDuplicate ? levelLabel : (card.badgeText || levelLabel || 'WORKFLOW STEPS');

  return (
    <div className="relative rounded-[2rem] border border-white/[0.12] bg-gradient-to-b from-sky-500/[0.08] via-neutral-950 to-neutral-950 shadow-[0_25px_80px_rgba(0,0,0,0.9)] p-5 sm:p-8 transition-all overflow-hidden">

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
        /* Streamlined Context Bar — Compact headline to give maximum viewport to the active step */
        <div className="mb-5 border-b border-white/[0.06] pb-4">
          <h2 className="text-lg sm:text-xl font-bold text-neutral-200 tracking-tight mb-1">
            {card.title}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-3xl font-normal">
            {card.feynmanExplanation}
          </p>
        </div>
      )}

      {/* Step Selector Pills Bar with Active Step Title Label */}
      <div className="space-y-2 mb-6">
        <div className="flex items-center gap-1.5 p-1 bg-black/60 border border-white/10 rounded-2xl w-full backdrop-blur-md overflow-x-auto scrollbar-none">
          {steps.map((st, idx) => {
            const isCurrent = activeStepIndex === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveStepIndex(idx)}
                title={`Step ${st.stepNumber || idx + 1}: ${st.title}`}
                className={`min-h-[38px] flex-1 py-1.5 px-2 text-xs sm:text-sm font-bold tracking-wide rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer shrink-0 sm:shrink ${
                  isCurrent
                    ? 'bg-sky-400 text-black shadow-lg shadow-sky-500/20 scale-[1.02]'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>P{st.stepNumber || idx + 1}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2-Column Split: Active Step Detail Stage + Step Visual Diagram */}
      {activeStep && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-6">
          {/* Left Column: HERO Step Action Directive Stage */}
          <div className="lg:col-span-7 space-y-4">
            {/* HERO STEP ACTION BOX */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-sky-500/10 via-neutral-900 to-neutral-950 border border-sky-500/30 shadow-xl space-y-3 relative overflow-hidden group">
              <div className="flex items-center justify-between gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-mono font-bold tracking-wider uppercase">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>
                    STEP {activeStep.stepNumber || activeStepIndex + 1} · {activeStep.title && activeStep.title !== 'undefined' ? activeStep.title : 'ACTION'}
                  </span>
                </div>
              </div>

              {/* Core Hero Instruction Directive */}
              <div className="text-xl sm:text-2xl font-extrabold text-white leading-snug tracking-tight text-balance">
                {activeStep.action && activeStep.action !== 'undefined'
                  ? activeStep.action
                  : 'Execute step protocol according to specifications.'}
              </div>
            </div>

            {/* Supporting Context: Rationale & Watchout as Side-by-Side Micro Callout Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Operational Rationale Card */}
              <div className="p-4 rounded-xl bg-sky-950/20 border border-sky-500/20 space-y-1.5">
                <div className="text-[11px] font-bold text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>Operational Rationale</span>
                </div>
                <p className="text-xs text-sky-100 leading-relaxed font-normal">
                  {activeStep.whyItMatters && activeStep.whyItMatters !== 'undefined'
                    ? activeStep.whyItMatters
                    : 'Guarantees operational accuracy and prevents process drift.'}
                </p>
              </div>

              {/* Watchout Card */}
              {activeStep.criticalWatchout && activeStep.criticalWatchout !== 'undefined' && (
                <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/20 space-y-1.5">
                  <div className="text-[11px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>Watchout</span>
                  </div>
                  <p className="text-xs text-rose-200 leading-relaxed font-normal">
                    {activeStep.criticalWatchout}
                  </p>
                </div>
              )}
            </div>

            {/* Pagination Step Controls */}
            <div className="flex items-center justify-between pt-3 border-t border-white/[0.08] text-xs">
              <button
                type="button"
                onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
                disabled={activeStepIndex === 0}
                className="min-h-[38px] px-3 py-1.5 text-neutral-400 hover:text-white disabled:opacity-30 font-medium transition-colors cursor-pointer flex items-center gap-1"
              >
                ← Previous Step
              </button>
              <button
                type="button"
                onClick={() => setActiveStepIndex((prev) => Math.min(steps.length - 1, prev + 1))}
                disabled={activeStepIndex === steps.length - 1}
                className="min-h-[38px] px-4 py-1.5 text-black font-semibold bg-white hover:bg-neutral-200 disabled:opacity-30 rounded-full transition-colors cursor-pointer flex items-center gap-1 shadow-sm"
              >
                <span>Next Step</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Column: Visual Schematic Diagram */}
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


