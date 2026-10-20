import React, { useEffect, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  X,
  Clock,
  Lightbulb
} from 'lucide-react';
import { FeynmanDeck, DeckCard } from '../types/deck';
import { ConceptAnalogyCard } from './cards/ConceptAnalogyCard';
import { CriticalRulesCard } from './cards/CriticalRulesCard';
import { ProcessStepsCard } from './cards/ProcessStepsCard';
import { TroubleshootingCard } from './cards/TroubleshootingCard';
import { ScenarioQuizCard } from './cards/ScenarioQuizCard';
import { QuickReferenceCard } from './cards/QuickReferenceCard';

interface PresentationModeProps {
  deck: FeynmanDeck;
  onExit: () => void;
  onUpdateCard: (card: DeckCard) => void;
  onDeleteCard: (cardId: string) => void;
  onOpenTutor: (card: DeckCard) => void;
}

export const PresentationMode: React.FC<PresentationModeProps> = ({
  deck,
  onExit,
  onUpdateCard,
  onDeleteCard,
  onOpenTutor,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const totalSlides = deck.cards.length + 1; // Slide 0 is Hero/Cover

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        setCurrentSlideIndex((prev) => Math.min(totalSlides - 1, prev + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        setCurrentSlideIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          onExit();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalSlides, onExit]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  const currentCard = currentSlideIndex > 0 ? deck.cards[currentSlideIndex - 1] : null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col select-none overflow-hidden">
      {/* Top control bar (Compact 52px) */}
      <div className="h-13 sm:h-14 px-4 sm:px-6 flex items-center justify-between border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
        <div className="flex items-center gap-2 truncate">
          <span className="font-bold text-xs sm:text-sm tracking-tight text-amber-400 truncate max-w-[150px] sm:max-w-xs">
            {deck.title}
          </span>
          <span className="text-slate-500">·</span>
          <span className="text-[11px] sm:text-xs text-slate-400 font-mono">
            {currentSlideIndex + 1}/{totalSlides}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={toggleFullscreen}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-white rounded-lg transition-colors"
            title="Toggle fullscreen"
            aria-label="Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onExit}
            className="min-h-[44px] flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Exit</span>
          </button>
        </div>
      </div>

      {/* Main Slide Stage (Responsive touch scroll) */}
      <div className="flex-1 flex items-center justify-center p-3 sm:p-8 md:p-12 overflow-y-auto">
        <div className="w-full max-w-4xl max-h-[82vh] transition-all">
          {currentSlideIndex === 0 ? (
            /* Cover Slide */
            <div className="bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-400 to-amber-300" />
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">
                <span>{deck.originalDocType}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {deck.estimatedMinutes} min
                </span>
                <span>·</span>
                <span>{deck.targetAudience}</span>
              </div>

              <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
                {deck.title}
              </h1>

              <p className="text-xs sm:text-base text-slate-300 leading-relaxed mb-6 max-w-2xl">
                {deck.summary}
              </p>

              <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-slate-800/60 border border-amber-500/30">
                <div className="text-[11px] sm:text-xs font-bold text-amber-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <span>The Central Mental Model</span>
                </div>
                <h3 className="text-sm sm:text-lg font-bold text-white mb-1.5">
                  {deck.feynmanCoreConcept.centralAnalogy.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic mb-2">
                  "{deck.feynmanCoreConcept.centralAnalogy.analogyText}"
                </p>
                <div className="text-[11px] sm:text-xs text-slate-400">
                  {deck.feynmanCoreConcept.centralAnalogy.howItMapsToSOP}
                </div>
              </div>
            </div>
          ) : currentCard ? (
            /* Individual Card Slide */
            <div className="slide-content">
              {currentCard.cardType === 'concept_analogy' && (
                <ConceptAnalogyCard
                  card={currentCard}
                  deckTitle={deck.title}
                  onUpdateCard={onUpdateCard}
                  onDeleteCard={() => onDeleteCard(currentCard.id)}
                  onOpenTutor={onOpenTutor}
                />
              )}
              {currentCard.cardType === 'critical_rules' && (
                <CriticalRulesCard
                  card={currentCard}
                  deckTitle={deck.title}
                  onUpdateCard={onUpdateCard}
                  onDeleteCard={() => onDeleteCard(currentCard.id)}
                  onOpenTutor={onOpenTutor}
                />
              )}
              {currentCard.cardType === 'process_steps' && (
                <ProcessStepsCard
                  card={currentCard}
                  deckTitle={deck.title}
                  onUpdateCard={onUpdateCard}
                  onDeleteCard={() => onDeleteCard(currentCard.id)}
                  onOpenTutor={onOpenTutor}
                />
              )}
              {currentCard.cardType === 'pitfalls_troubleshooting' && (
                <TroubleshootingCard
                  card={currentCard}
                  deckTitle={deck.title}
                  onUpdateCard={onUpdateCard}
                  onDeleteCard={() => onDeleteCard(currentCard.id)}
                  onOpenTutor={onOpenTutor}
                />
              )}
              {currentCard.cardType === 'scenario_quiz' && (
                <ScenarioQuizCard
                  card={currentCard}
                  deckTitle={deck.title}
                  onUpdateCard={onUpdateCard}
                  onDeleteCard={() => onDeleteCard(currentCard.id)}
                  onOpenTutor={onOpenTutor}
                />
              )}
              {currentCard.cardType === 'quick_reference' && (
                <QuickReferenceCard
                  card={currentCard}
                  deckTitle={deck.title}
                  onUpdateCard={onUpdateCard}
                  onDeleteCard={() => onDeleteCard(currentCard.id)}
                  onOpenTutor={onOpenTutor}
                />
              )}
            </div>
          ) : null}
        </div>
      </div>

      {/* Bottom control bar with 48px touch targets */}
      <div className="h-16 px-4 sm:px-6 flex items-center justify-between border-t border-slate-800 bg-slate-900/90 backdrop-blur-md pb-safe">
        <button
          onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentSlideIndex === 0}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center gap-1.5 px-3 sm:px-4 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-xl transition-colors active:scale-95"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Slide Dots / Thumbnails */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-[180px] sm:max-w-md px-2 scrollbar-none">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`h-2.5 rounded-full transition-all ${
                currentSlideIndex === idx
                  ? 'w-6 sm:w-7 bg-amber-400'
                  : 'w-2.5 bg-slate-700 hover:bg-slate-500'
              }`}
              title={`Jump to slide ${idx + 1}`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() => setCurrentSlideIndex((prev) => Math.min(totalSlides - 1, prev + 1))}
          disabled={currentSlideIndex === totalSlides - 1}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center gap-1.5 px-3 sm:px-4 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-30 rounded-xl transition-colors active:scale-95"
          aria-label="Next Slide"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-5 h-5 font-bold" />
        </button>
      </div>
    </div>
  );
};
