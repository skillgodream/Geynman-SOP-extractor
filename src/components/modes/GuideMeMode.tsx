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
import { FeynmanDeck, GuideScenario, GuideScenarioOption, AppViewMode } from '../../types/deck';
import { deriveGuideScenarios } from '../../utils/deckDerivations';
import { CardVisual } from '../visuals/CardVisual';
import { ModePills } from '../ModePills';

interface GuideMeModeProps {
  deck: FeynmanDeck;
  onExit: () => void;
  onSwitchToMode?: (mode: AppViewMode, slideIndex?: number) => void;
}

export const GuideMeMode: React.FC<GuideMeModeProps> = ({ deck, onExit, onSwitchToMode }) => {
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
      <div className="flex-1 flex flex-col p-4 sm:p-6 md:p-8 overflow-y-auto items-center">
        <div className="w-full max-w-2xl flex flex-col gap-6 pb-12">
          {/* Top Situation Picture Banner */}
          <div className="relative w-full h-48 sm:h-60 rounded-3xl overflow-hidden border border-white/[0.08] bg-neutral-900 shadow-2xl shrink-0">
            <img
              src={
                currentScenario.imageUrl ||
                'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80'
              }
              alt={currentScenario.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              loading="eager"
            />
            {/* Subtle Gradient Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
          </div>

          {/* Question & Options Stack */}
          <div className="space-y-6">

            {/* Heading / Question with Animated Typing / Fade-In */}
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight animate-fadeIn">
              {currentScenario.question}
            </div>

            {/* Situation Context Detail Block */}
            <div className="p-5 rounded-2xl bg-neutral-900/60 border border-white/[0.05] text-neutral-300 text-sm leading-relaxed">
              <span className="font-bold text-neutral-500 block mb-2 uppercase tracking-wider text-[11px]">
                Situational Context:
              </span>
              {currentScenario.situation}
            </div>

            {/* Options List with Staggered Animation */}
            <div className="space-y-3">
              {currentScenario.options.map((option, idx) => {
                const isSelected = selectedOptionId === option.id;
                const isCorrect = option.isCorrect;

                let styleClass =
                  'border-white/[0.05] bg-neutral-900/40 text-neutral-300 hover:border-white/10 hover:bg-neutral-900';

                if (hasSubmitted) {
                  if (isSelected && isCorrect) {
                    styleClass =
                      'border-emerald-500/50 bg-emerald-950/30 text-emerald-100 ring-1 ring-emerald-500/50';
                  } else if (isSelected && !isCorrect) {
                    styleClass =
                      'border-red-500/50 bg-red-950/30 text-red-100 ring-1 ring-red-500/50';
                  } else if (!isSelected && isCorrect && !isUserCorrect) {
                    // BLINKING / HIGHLIGHTING CORRECT OPTION IN GREEN WHEN WRONG
                    styleClass =
                      'animate-blink-green border-emerald-500 bg-emerald-950/70 text-emerald-100 ring-2 ring-emerald-500 shadow-lg';
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
                    style={{ animationDelay: `${idx * 90}ms` }}
                    className={`w-full min-h-[60px] text-left p-4 rounded-xl border text-sm transition-all flex items-start gap-4 active:scale-[0.99] cursor-pointer animate-fadeIn ${styleClass}`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                        hasSubmitted && isCorrect
                          ? 'border-emerald-500 bg-emerald-500 text-white'
                          : hasSubmitted && isSelected && !isCorrect
                          ? 'border-red-500 bg-red-500 text-white'
                          : 'border-neutral-700 text-neutral-400 bg-neutral-800'
                      }`}
                    >
                      {hasSubmitted && isCorrect ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : hasSubmitted && isSelected && !isCorrect ? (
                        <XCircle className="w-4 h-4" />
                      ) : (
                        String.fromCharCode(65 + idx)
                      )}
                    </div>
                    <div className="flex-1 leading-relaxed">
                      {option.text}
                    </div>
                  </button>
                );
              })}
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
