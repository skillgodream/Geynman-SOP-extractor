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
        // Fallback safely
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
    <div className="relative rounded-[2rem] border border-white/[0.12] bg-gradient-to-b from-emerald-500/[0.08] via-neutral-950 to-neutral-950 shadow-[0_25px_80px_rgba(0,0,0,0.9)] p-6 sm:p-10 transition-all overflow-hidden">
      {/* Top Training Card Header */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-6">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">
          <HelpCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>{card.badgeText || 'Active Recall Dilemma'}</span>
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
          <textarea
            value={quiz.scenario}
            onChange={(e) => setQuiz({ ...quiz, scenario: e.target.value })}
            placeholder="Dilemma Scenario"
            rows={2}
            className="w-full text-xs bg-neutral-900 border border-white/10 rounded-xl p-2 text-neutral-200"
          />
          <input
            type="text"
            value={quiz.question}
            onChange={(e) => setQuiz({ ...quiz, question: e.target.value })}
            placeholder="Question"
            className="w-full text-xs bg-neutral-900 border border-white/10 rounded-xl p-2 text-neutral-200"
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
            <p className="text-xs sm:text-sm text-neutral-400 mb-4">
              {card.subtitle}
            </p>
          )}

          {/* 2-Column Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-4">
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-4">
              {/* Scenario setup */}
              <div className="border-l-2 border-emerald-400/50 pl-3.5 space-y-1">
                <div className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
                  Scenario:
                </div>
                <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-normal">
                  {quiz.scenario}
                </p>
              </div>

              {/* The Question */}
              <div className="font-bold text-white text-sm sm:text-base pt-1">
                {quiz.question}
              </div>

              {/* Options List */}
              <div className="space-y-2.5">
                {quiz.options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const isTargetCorrect = quiz.correctAnswerIndex === idx;

                  let btnStyle =
                    'border-white/10 bg-black/50 hover:border-white/20 text-neutral-200';

                  if (hasAnswered) {
                    if (isTargetCorrect) {
                      btnStyle =
                        'border-emerald-500 bg-emerald-950/60 text-emerald-100 font-semibold ring-1 ring-emerald-500';
                    } else if (isSelected && !isTargetCorrect) {
                      btnStyle =
                        'border-rose-500/80 bg-rose-950/60 text-rose-200 line-through opacity-80';
                    } else {
                      btnStyle = 'border-white/5 opacity-40';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectOption(idx)}
                      disabled={hasAnswered}
                      className={`w-full min-h-[48px] text-left p-3.5 rounded-2xl border text-xs sm:text-sm transition-all flex items-start gap-3 active:scale-[0.99] cursor-pointer ${btnStyle}`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                          hasAnswered && isTargetCorrect
                            ? 'border-emerald-500 bg-emerald-500 text-white'
                            : hasAnswered && isSelected && !isTargetCorrect
                            ? 'border-rose-500 bg-rose-500 text-white'
                            : 'border-neutral-700 text-neutral-400'
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
                <div className="pt-3 border-t border-white/[0.08] animate-fadeIn space-y-2">
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${
                        isCorrect ? 'text-emerald-400' : 'text-neutral-300'
                      }`}
                    >
                      {isCorrect ? (
                        <>
                          <Sparkles className="w-4 h-4 text-emerald-400" />
                          <span>Feynman Principle Verified</span>
                        </>
                      ) : (
                        <>
                          <HelpCircle className="w-4 h-4 text-neutral-400" />
                          <span>SOP Standard Clarification</span>
                        </>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="min-h-[36px] flex items-center gap-1 text-xs text-neutral-400 hover:text-white underline font-medium cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Try Again</span>
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal bg-white/[0.03] p-3 rounded-xl border border-white/[0.08]">
                    {quiz.feynmanFeedback}
                  </p>
                </div>
              )}
            </div>

            {/* Right Column: Scenario Visual */}
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

