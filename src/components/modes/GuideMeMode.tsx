import React, { useState } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  Sparkles,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FeynmanDeck, GuideScenario, GuideScenarioOption } from '../../types/deck';
import { deriveGuideScenarios } from '../../utils/deckDerivations';
import { CardVisual } from '../visuals/CardVisual';

interface GuideMeModeProps {
  deck: FeynmanDeck;
  onExit: () => void;
}

export const GuideMeMode: React.FC<GuideMeModeProps> = ({ deck, onExit }) => {
  const scenarios: GuideScenario[] = deriveGuideScenarios(deck);

  const [activeScenarioIndex, setActiveScenarioIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [scenarioResults, setScenarioResults] = useState<Record<number, boolean>>({});

  const currentScenario = scenarios[activeScenarioIndex] || scenarios[0];
  const selectedOption = currentScenario.options.find((o) => o.id === selectedOptionId);
  const correctOption = currentScenario.options.find((o) => o.isCorrect);

  const isUserCorrect = selectedOption?.isCorrect === true;

  const handleSelectOption = (option: GuideScenarioOption) => {
    if (hasSubmitted) return;
    setSelectedOptionId(option.id);
    setHasSubmitted(true);

    const isCorrect = option.isCorrect;
    setScenarioResults((prev) => ({ ...prev, [activeScenarioIndex]: isCorrect }));

    if (isCorrect) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.65 },
        });
      } catch (e) {
        // Safe fallback
      }
    }
  };

  const handleResetScenario = () => {
    setSelectedOptionId(null);
    setHasSubmitted(false);
  };

  const handleNextScenario = () => {
    if (activeScenarioIndex < scenarios.length - 1) {
      setActiveScenarioIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setHasSubmitted(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black text-white flex flex-col select-none overflow-hidden font-sans">
      {/* Top Header */}
      <div className="h-14 px-4 sm:px-6 flex items-center justify-between border-b border-white/[0.08] bg-black/80 backdrop-blur-xl">
        <div className="flex items-center gap-2.5 truncate">
          <div className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center font-bold text-xs">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div className="truncate">
            <div className="text-xs sm:text-sm font-semibold text-white truncate">
              {deck.title}
            </div>
            <div className="text-[10px] sm:text-xs text-neutral-400 font-mono">
              GUIDE ME · Situational Decision Practice
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onExit}
          className="min-h-[38px] flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 border border-white/10 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
          <span>Exit Guide</span>
        </button>
      </div>

      {/* Main Guided Practice Stage */}
      <div className="flex-1 flex items-center justify-center p-3 sm:p-6 md:p-8 overflow-y-auto">
        <div className="w-full max-w-5xl bg-neutral-950 border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-10 flex flex-col">
          {/* Scenario Selector Tabs in Apple Segmented Style */}
          <div className="flex items-center gap-1.5 p-1 bg-neutral-900/90 border border-white/[0.08] rounded-full mb-6 overflow-x-auto scrollbar-none">
            {scenarios.map((sc, idx) => (
              <button
                key={sc.id}
                type="button"
                onClick={() => {
                  setActiveScenarioIndex(idx);
                  setSelectedOptionId(null);
                  setHasSubmitted(false);
                }}
                className={`min-h-[40px] flex-1 min-w-[130px] px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeScenarioIndex === idx
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span>Situation {idx + 1}</span>
                {scenarioResults[idx] === true && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                )}
                {scenarioResults[idx] === false && (
                  <XCircle className="w-3.5 h-3.5 text-red-400" />
                )}
              </button>
            ))}
          </div>

          {/* 2-Column Split: Situation Narrative + Visual Schematic */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-6">
            {/* Left Column (7 cols): The Dilemma Situation & Question */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-400">
                <span className="text-white">{currentScenario.context}</span>
                <span className="text-neutral-600">·</span>
                <span className="text-neutral-500">Field Dilemma</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {currentScenario.title}
              </h2>

              {/* The Situation Context Block */}
              <div className="p-4 rounded-2xl bg-neutral-900/60 border border-white/[0.08] text-neutral-200 text-xs sm:text-sm leading-relaxed">
                <span className="font-bold text-neutral-400 block mb-1 uppercase tracking-wider text-[11px]">
                  Situational Context:
                </span>
                {currentScenario.situation}
              </div>

              {/* The Question */}
              <div className="text-sm sm:text-base font-bold text-white pt-1">
                {currentScenario.question}
              </div>

              {/* Options List */}
              <div className="space-y-2.5">
                {currentScenario.options.map((option, idx) => {
                  const isSelected = selectedOptionId === option.id;
                  const isCorrect = option.isCorrect;

                  let styleClass =
                    'border-white/[0.08] bg-neutral-900/50 text-neutral-200 hover:border-white/20 hover:bg-neutral-900';

                  if (hasSubmitted) {
                    if (isSelected && isCorrect) {
                      styleClass =
                        'border-emerald-500 bg-emerald-950/40 text-emerald-100 ring-1 ring-emerald-500';
                    } else if (isSelected && !isCorrect) {
                      styleClass =
                        'border-red-500/80 bg-red-950/40 text-red-100 ring-1 ring-red-500/80';
                    } else if (!isSelected && isCorrect && !isUserCorrect) {
                      styleClass =
                        'border-emerald-500/80 bg-emerald-950/30 text-emerald-200 ring-1 ring-emerald-500/40';
                    } else {
                      styleClass = 'border-white/5 opacity-40';
                    }
                  }

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleSelectOption(option)}
                      disabled={hasSubmitted}
                      className={`w-full min-h-[50px] text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-3 active:scale-[0.99] cursor-pointer ${styleClass}`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                          hasSubmitted && isCorrect
                            ? 'border-emerald-500 bg-emerald-500 text-white'
                            : hasSubmitted && isSelected && !isCorrect
                            ? 'border-red-500 bg-red-500 text-white'
                            : 'border-neutral-700 text-neutral-400'
                        }`}
                      >
                        {hasSubmitted && isCorrect ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : hasSubmitted && isSelected && !isCorrect ? (
                          <XCircle className="w-3.5 h-3.5" />
                        ) : (
                          String.fromCharCode(65 + idx)
                        )}
                      </div>
                      <div className="flex-1 leading-snug">
                        {option.text}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column (5 cols): Visual Context Schematic */}
            <div className="lg:col-span-5 w-full">
              <CardVisual
                image={{
                  diagramType: currentScenario.diagramType || 'cold_chain',
                  caption: `Field Situation: ${currentScenario.title}`,
                }}
                onUpdateImage={() => {}}
                defaultDiagram={currentScenario.diagramType || 'cold_chain'}
                titleContext={currentScenario.title}
              />
            </div>
          </div>

          {/* Feedback Section (CRITICAL REQUIREMENT: if user chooses wrong, show correct one!) */}
          {hasSubmitted && (
            <div className="pt-5 border-t border-white/[0.08] animate-fadeIn space-y-4">
              {!isUserCorrect ? (
                /* WRONG CHOICE FEEDBACK + EXPLICIT SYSTEM CORRECTION */
                <div className="space-y-3">
                  {/* What the user chose wrong */}
                  <div className="p-4 rounded-2xl bg-neutral-900 border border-red-500/30">
                    <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wider mb-1">
                      <XCircle className="w-4 h-4" />
                      <span>Incorrect Choice (Protocol Violation)</span>
                    </div>
                    <div className="text-xs sm:text-sm text-red-200 leading-relaxed mb-1.5 font-medium">
                      "{selectedOption?.text}"
                    </div>
                    <div className="text-xs text-red-300">
                      <strong>Consequence:</strong> {selectedOption?.consequenceIfChosen}
                    </div>
                  </div>

                  {/* The System Correction: Shows the correct one! */}
                  <div className="p-4 rounded-2xl bg-neutral-900 border border-emerald-500/40">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>System Correction (Mandatory Correct SOP Action)</span>
                    </div>
                    <div className="text-xs sm:text-sm text-emerald-100 font-semibold leading-relaxed mb-1.5">
                      "{correctOption?.text}"
                    </div>
                    <div className="text-xs text-emerald-300/90 leading-relaxed">
                      <strong>Feynman Reasoning:</strong> {correctOption?.explanation}
                    </div>
                  </div>
                </div>
              ) : (
                /* CORRECT CHOICE CONFIRMATION */
                <div className="p-4 rounded-2xl bg-neutral-900 border border-emerald-500/40">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>Protocol Preserved! Correct Action</span>
                  </div>
                  <div className="text-xs sm:text-sm text-emerald-100 font-semibold leading-relaxed mb-1.5">
                    "{selectedOption?.text}"
                  </div>
                  <div className="text-xs text-emerald-300/90 leading-relaxed">
                    <strong>Feynman Reasoning:</strong> {selectedOption?.explanation}
                  </div>
                </div>
              )}

              {/* Navigation Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleResetScenario}
                  className="min-h-[44px] flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-400 hover:text-white cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Try Situation Again</span>
                </button>

                {activeScenarioIndex < scenarios.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNextScenario}
                    className="min-h-[44px] flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-black bg-white hover:bg-neutral-200 rounded-full shadow-md transition-colors cursor-pointer"
                  >
                    <span>Next Situation</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onExit}
                    className="min-h-[44px] flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-black bg-white hover:bg-neutral-200 rounded-full shadow-md transition-colors cursor-pointer"
                  >
                    <span>Finish Practice</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
