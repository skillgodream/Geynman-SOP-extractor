import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, Sparkles, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DeckCard, QuizData, CardImage } from '../../types/deck';
import { CardToolbar } from '../CardToolbar';
import { CardVisual } from '../visuals/CardVisual';

interface ScenarioQuizCardProps {
  card: DeckCard;
  deckTitle: string;
  onUpdateCard: (card: DeckCard) => void;
  onDeleteCard: () => void;
  onOpenTutor: (card: DeckCard) => void;
}

export const ScenarioQuizCard: React.FC<ScenarioQuizCardProps> = ({
  card,
  deckTitle,
  onUpdateCard,
  onDeleteCard,
  onOpenTutor,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(card.title);
  const [subtitle, setSubtitle] = useState(card.subtitle || '');
  const [quiz, setQuiz] = useState<QuizData>(
    card.quiz || {
      scenario: 'Reviewing emergency procedure...',
      question: 'What is the correct protocol response?',
      options: ['Option A', 'Option B', 'Option C'],
      correctAnswerIndex: 0,
      feynmanFeedback: 'Explanation',
      distractorExplanations: ['Flaw in A', 'Flaw in B'],
    }
  );

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);

  const handleSelectOption = (index: number) => {
    if (hasAnswered) return;
    setSelectedOption(index);
    setHasAnswered(true);

    if (index === quiz.correctAnswerIndex) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch (e) {
        // Fallback safely if canvas not available
      }
    }
  };

  const handleReset = () => {
    setSelectedOption(null);
    setHasAnswered(false);
  };

  const handleSave = () => {
    setIsEditing(false);
    onUpdateCard({
      ...card,
      title,
      subtitle,
      quiz,
    });
  };

  const handleUpdateImage = (newImage: CardImage) => {
    onUpdateCard({
      ...card,
      image: newImage,
    });
  };

  const isCorrect = selectedOption === quiz.correctAnswerIndex;

  return (
    <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 sm:p-10 transition-colors">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-3">
        <HelpCircle className="w-4 h-4" />
        <span>{card.badgeText || 'Active Recall: Shift Dilemma'}</span>
      </div>

      {isEditing ? (
        <div className="space-y-3 mb-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-xl font-bold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white"
          />
          <textarea
            value={quiz.scenario}
            onChange={(e) => setQuiz({ ...quiz, scenario: e.target.value })}
            placeholder="Scenario description"
            rows={3}
            className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2"
          />
          <input
            type="text"
            value={quiz.question}
            onChange={(e) => setQuiz({ ...quiz, question: e.target.value })}
            placeholder="Question"
            className="w-full text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2"
          />
          {quiz.options.map((opt, i) => (
            <div key={i} className="flex gap-2 items-center text-xs">
              <input
                type="radio"
                name="correctOpt"
                checked={quiz.correctAnswerIndex === i}
                onChange={() => setQuiz({ ...quiz, correctAnswerIndex: i })}
              />
              <input
                type="text"
                value={opt}
                onChange={(e) => {
                  const opts = [...quiz.options];
                  opts[i] = e.target.value;
                  setQuiz({ ...quiz, options: opts });
                }}
                className="flex-1 bg-white dark:bg-slate-800 border p-1 rounded"
              />
            </div>
          ))}
          <textarea
            value={quiz.feynmanFeedback}
            onChange={(e) => setQuiz({ ...quiz, feynmanFeedback: e.target.value })}
            placeholder="Feedback explanation"
            rows={2}
            className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2"
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
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-4">
              {card.subtitle}
            </p>
          )}

          {/* 2-Column Split: Dilemma Scenario & Questions + Visual Scenario Diagram */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-4">
            {/* Left Column: The Scenario & Options (7 cols) - Clean Editorial, NO cards in cards */}
            <div className="lg:col-span-7 space-y-4">
              {/* Scenario setup (clean left accent rule, no nested boxed card) */}
              <div className="border-l-2 border-purple-500 pl-4 space-y-1">
                <div className="text-[11px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                  The Workplace Dilemma:
                </div>
                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
                  {quiz.scenario}
                </p>
              </div>

              {/* The Question */}
              <div className="font-bold text-slate-900 dark:text-white text-sm sm:text-base pt-1">
                {quiz.question}
              </div>

              {/* Options List */}
              <div className="space-y-2.5">
                {quiz.options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const isTargetCorrect = quiz.correctAnswerIndex === idx;

                  let btnStyle =
                    'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:border-slate-400 dark:hover:border-slate-600 text-slate-800 dark:text-slate-200';

                  if (hasAnswered) {
                    if (isTargetCorrect) {
                      btnStyle =
                        'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 font-semibold ring-1 ring-emerald-500';
                    } else if (isSelected && !isTargetCorrect) {
                      btnStyle =
                        'border-red-400 bg-red-50/80 dark:bg-red-950/40 text-red-950 dark:text-red-100 line-through opacity-80';
                    } else {
                      btnStyle = 'border-slate-200 dark:border-slate-800 opacity-50';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectOption(idx)}
                      disabled={hasAnswered}
                      className={`w-full min-h-[48px] text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-3 active:scale-[0.99] ${btnStyle}`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                          hasAnswered && isTargetCorrect
                            ? 'border-emerald-500 bg-emerald-500 text-white'
                            : hasAnswered && isSelected && !isTargetCorrect
                            ? 'border-red-500 bg-red-500 text-white'
                            : 'border-slate-300 dark:border-slate-600 text-slate-500'
                        }`}
                      >
                        {hasAnswered && isTargetCorrect ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : hasAnswered && isSelected && !isTargetCorrect ? (
                          <XCircle className="w-3.5 h-3.5" />
                        ) : (
                          String.fromCharCode(65 + idx)
                        )}
                      </div>
                      <span className="flex-1 leading-snug">{option}</span>
                    </button>
                  );
                })}
              </div>

              {/* Feedback Section once answered */}
              {hasAnswered && (
                <div
                  className={`pt-3 border-t border-slate-100 dark:border-slate-800/80 animate-fadeIn`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div
                      className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${
                        isCorrect
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : 'text-amber-700 dark:text-amber-400'
                      }`}
                    >
                      {isCorrect ? (
                        <>
                          <Sparkles className="w-4 h-4 text-emerald-500" />
                          <span>Feynman Principle Verified!</span>
                        </>
                      ) : (
                        <>
                          <HelpCircle className="w-4 h-4 text-amber-500" />
                          <span>Field Misconception Detected</span>
                        </>
                      )}
                    </div>

                    <button
                      onClick={handleReset}
                      className="min-h-[36px] flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline font-medium"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Try Again</span>
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
                    {quiz.feynmanFeedback}
                  </p>
                </div>
              )}
            </div>

            {/* Right Column: Scenario Visual / Diagram (5 cols) */}
            <div className="lg:col-span-5 w-full">
              <CardVisual
                image={card.image}
                onUpdateImage={handleUpdateImage}
                defaultDiagram="cold_chain"
                titleContext={card.title}
              />
            </div>
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
