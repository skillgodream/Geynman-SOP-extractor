import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Printer,
  ChevronRight,
  ChevronLeft,
  FileCheck,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FeynmanDeck, AssessmentQuestion, AppViewMode } from '../../types/deck';
import { deriveAssessmentQuestions } from '../../utils/deckDerivations';
import { ModePills } from '../ModePills';

interface TestMeModeProps {
  deck: FeynmanDeck;
  onExit: () => void;
  onSwitchToMode?: (mode: AppViewMode, slideIndex?: number) => void;
}

export const TestMeMode: React.FC<TestMeModeProps> = ({ deck, onExit, onSwitchToMode }) => {
  const questions: AssessmentQuestion[] = deriveAssessmentQuestions(deck);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [learnerName, setLearnerName] = useState('Certified Operator');

  const currentQ = questions[currentQuestionIndex];
  const answeredCount = Object.keys(userAnswers).length;

  const handleSelectAnswer = (optionIndex: number) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optionIndex,
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswerIndex) {
        correct++;
      }
    });
    return correct;
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    const score = calculateScore();
    const pct = Math.round((score / questions.length) * 100);

    if (pct >= 80) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Safe fallback
      }
    }
  };

  const handleRetake = () => {
    setUserAnswers({});
    setIsSubmitted(false);
    setCurrentQuestionIndex(0);
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  const score = calculateScore();
  const percentage = Math.round((score / questions.length) * 100);
  const isPassed = percentage >= 80;

  return (
    <div className="fixed inset-0 z-50 bg-black text-white flex flex-col select-none overflow-hidden font-sans">
      {/* Top Header */}
      <div className="h-14 px-4 sm:px-6 flex items-center justify-between border-b border-white/[0.08] bg-black/80 backdrop-blur-xl">
        <div className="flex items-center gap-2.5 truncate">
          <div className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center font-bold text-xs">
            <Award className="w-4 h-4" />
          </div>
          <div className="truncate">
            <div className="text-xs sm:text-sm font-semibold text-white truncate">
              {deck.title}
            </div>
            <div className="text-[10px] sm:text-xs text-neutral-400 font-mono">
              TEST ME · SOP Competency Assessment
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onExit}
          className="min-h-[38px] flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 border border-white/10 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
          <span>Exit Test</span>
        </button>
      </div>

      {/* Mode Pills Sub-Bar */}
      {onSwitchToMode && (
        <div className="px-4 py-1.5 border-b border-white/[0.08] bg-neutral-950/90 backdrop-blur-md flex items-center justify-center shrink-0">
          <ModePills
            activeMode="test_me"
            slideIndex={currentQuestionIndex + 1}
            onSelectMode={(mode, idx) => onSwitchToMode(mode, idx)}
          />
        </div>
      )}

      {/* Main Assessment Container (Header-safe scroll alignment) */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 flex flex-col items-center">
        <div className="w-full max-w-3xl my-auto bg-neutral-950 border border-white/[0.08] rounded-3xl p-6 sm:p-10 shadow-2xl flex flex-col">
          {!isSubmitted ? (
            /* Active Assessment Flow */
            <div>
              {/* Question Navigation Bar in Apple Segmented Style */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                  {questions.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`min-h-[36px] min-w-[36px] rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
                        currentQuestionIndex === idx
                          ? 'bg-white text-black shadow-sm'
                          : userAnswers[idx] !== undefined
                          ? 'bg-neutral-800 text-white border border-white/20'
                          : 'bg-neutral-900 text-neutral-500 hover:text-white'
                      }`}
                    >
                      Q{idx + 1}
                    </button>
                  ))}
                </div>

                <div className="text-xs font-mono text-neutral-400 shrink-0 ml-2">
                  Answered: {answeredCount}/{questions.length}
                </div>
              </div>

              {/* Active Question */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-400">
                  <span className="text-white">QUESTION {currentQuestionIndex + 1} OF {questions.length}</span>
                  <span className="text-neutral-600">·</span>
                  <span className="text-neutral-500 capitalize">
                    {currentQ.category.replace('_', ' ')}
                  </span>
                </div>

                <h2 className="text-base sm:text-xl font-bold text-white leading-snug">
                  {currentQ.question}
                </h2>

                {/* Options List */}
                <div className="space-y-2.5 pt-2">
                  {currentQ.options.map((opt, optIdx) => {
                    const isSelected = userAnswers[currentQuestionIndex] === optIdx;

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectAnswer(optIdx)}
                        className={`w-full min-h-[50px] text-left p-4 rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-3 active:scale-[0.99] cursor-pointer ${
                          isSelected
                            ? 'border-white bg-neutral-900 text-white font-semibold'
                            : 'border-white/[0.08] bg-neutral-900/50 text-neutral-300 hover:border-white/20 hover:bg-neutral-900'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                            isSelected
                              ? 'border-white bg-white text-black'
                              : 'border-neutral-700 text-neutral-400'
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </div>
                        <div className="flex-1 leading-snug">{opt}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Navigation & Submit Bar */}
              <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="min-h-[44px] flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-neutral-400 hover:text-white disabled:opacity-30 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {currentQuestionIndex < questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                    className="min-h-[44px] flex items-center gap-1.5 px-6 py-2.5 text-xs font-semibold text-black bg-white hover:bg-neutral-200 rounded-full shadow-md transition-colors cursor-pointer"
                  >
                    <span>Next Question</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={answeredCount < questions.length}
                    className="min-h-[44px] flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-black bg-white hover:bg-neutral-200 disabled:opacity-40 rounded-full shadow-lg transition-transform active:scale-95 cursor-pointer"
                  >
                    <FileCheck className="w-4 h-4" />
                    <span>Submit Assessment</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Results & Certification Screen */
            <div className="space-y-6">
              {/* Score Banner */}
              <div
                className={`p-6 sm:p-8 rounded-3xl border text-center ${
                  isPassed
                    ? 'border-white/20 bg-neutral-900/60'
                    : 'border-white/10 bg-neutral-900/30'
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center font-bold text-2xl ${
                    isPassed ? 'bg-white text-black' : 'bg-neutral-800 text-white'
                  }`}
                >
                  {isPassed ? '✓' : '!'}
                </div>

                <div className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1">
                  Assessment Result
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  {isPassed ? 'Competency Verified (Passed)' : 'Remediation Required'}
                </h2>

                <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white my-2">
                  {percentage}% ({score} / {questions.length})
                </div>

                <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
                  {isPassed
                    ? 'Congratulations. You demonstrated operational mastery of the core Feynman mental models and critical red-line standards.'
                    : 'Passing score threshold is 80%. Review the incorrect items below and retake the assessment.'}
                </p>

                {/* Printable Certificate (Visible when passed) */}
                {isPassed && (
                  <div className="mt-6 pt-6 border-t border-white/[0.08] text-left bg-black p-5 rounded-2xl border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-neutral-300" />
                        <span>Official Certificate of SOP Competency</span>
                      </div>
                      <button
                        type="button"
                        onClick={handlePrintCertificate}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-white text-black rounded-full hover:bg-neutral-200 transition-colors cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Certificate</span>
                      </button>
                    </div>

                    <div className="text-xs text-neutral-300 space-y-1">
                      <div>
                        This certifies that{' '}
                        <input
                          type="text"
                          value={learnerName}
                          onChange={(e) => setLearnerName(e.target.value)}
                          className="font-bold text-white bg-neutral-900 px-2 py-0.5 rounded border border-white/10"
                        />{' '}
                        has achieved operational competency on:
                      </div>
                      <div className="text-sm font-bold text-white py-1">
                        {deck.title} ({deck.originalDocType})
                      </div>
                      <div className="text-[11px] text-neutral-500 font-mono">
                        Date: {new Date().toLocaleDateString()} · Score: {percentage}% · Standard: Feynman Instructional Method
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Question Review Breakdown */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400">
                  Question Review Breakdown:
                </h3>

                <div className="divide-y divide-white/[0.08]">
                  {questions.map((q, idx) => {
                    const chosenIdx = userAnswers[idx];
                    const isCorrect = chosenIdx === q.correctAnswerIndex;

                    return (
                      <div key={q.id} className="py-4 first:pt-0 last:pb-0 space-y-2">
                        <div className="flex items-start gap-2.5">
                          <div className="mt-0.5 shrink-0">
                            {isCorrect ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-400" />
                            )}
                          </div>
                          <div className="flex-1 text-xs sm:text-sm font-semibold text-white">
                            {idx + 1}. {q.question}
                          </div>
                        </div>

                        <div className="pl-6 space-y-1 text-xs">
                          <div className="text-neutral-300">
                            <strong>Your Answer:</strong>{' '}
                            <span className={isCorrect ? 'text-emerald-400 font-medium' : 'text-red-400 font-medium'}>
                              {chosenIdx !== undefined ? q.options[chosenIdx] : 'Unanswered'}
                            </span>
                          </div>

                          {!isCorrect && (
                            <div className="text-emerald-400">
                              <strong>Correct Standard:</strong> {q.options[q.correctAnswerIndex]}
                            </div>
                          )}

                          <div className="text-neutral-400 text-[11px] leading-relaxed pt-1">
                            {q.feynmanFeedback}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={handleRetake}
                  className="min-h-[44px] flex items-center gap-2 px-5 py-2 text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-900 border border-white/10 rounded-full cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retake Assessment</span>
                </button>

                <button
                  type="button"
                  onClick={onExit}
                  className="min-h-[44px] px-6 py-2 text-xs font-bold text-black bg-white hover:bg-neutral-200 rounded-full shadow-md cursor-pointer"
                >
                  Return to Deck
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
