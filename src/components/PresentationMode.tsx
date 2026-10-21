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
import { FeynmanDeck, DeckCard, AppViewMode } from '../types/deck';
import { ConceptAnalogyCard } from './cards/ConceptAnalogyCard';
import { CriticalRulesCard } from './cards/CriticalRulesCard';
import { ProcessStepsCard } from './cards/ProcessStepsCard';
import { TroubleshootingCard } from './cards/TroubleshootingCard';
import { ScenarioQuizCard } from './cards/ScenarioQuizCard';
import { QuickReferenceCard } from './cards/QuickReferenceCard';
import { CardVisual } from './visuals/CardVisual';

interface PresentationModeProps {
  deck: FeynmanDeck;
  initialSlideIndex?: number;
  onExit: () => void;
  onUpdateCard: (card: DeckCard) => void;
  onDeleteCard: (cardId: string) => void;
  onOpenTutor: (card: DeckCard) => void;
  onSwitchToMode?: (mode: AppViewMode, slideIndex?: number) => void;
}

export const PresentationMode: React.FC<PresentationModeProps> = ({
  deck,
  initialSlideIndex = 0,
  onExit,
  onUpdateCard,
  onDeleteCard,
  onOpenTutor,
  onSwitchToMode,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(initialSlideIndex);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const totalSlides = deck.cards.length + 1; // Slide 0 is Overview/Hero, Slides 1..N are Deck Cards

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

  const currentCard = currentSlideIndex >= 1 ? deck.cards[currentSlideIndex - 1] : null;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-[#1c1c1e] via-[#141416] to-[#0a0a0c] text-white flex flex-col select-none overflow-hidden font-sans">
      {/* Top control bar */}
      <div className="h-14 px-4 sm:px-6 flex items-center justify-between border-b border-white/[0.08] bg-[#1c1c1e]/90 backdrop-blur-2xl">
        <div className="flex items-center gap-2 truncate">
          <span className="font-semibold text-xs sm:text-sm tracking-tight text-white truncate max-w-[150px] sm:max-w-xs">
            {deck.title}
          </span>
          <span className="text-neutral-500">·</span>
          <span className="text-[11px] sm:text-xs text-neutral-400 font-mono">
            Slide {currentSlideIndex + 1} of {totalSlides}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleFullscreen}
            className="min-h-[38px] min-w-[38px] flex items-center justify-center text-neutral-400 hover:text-white rounded-full bg-neutral-900/60 hover:bg-neutral-800 border border-white/10 transition-colors cursor-pointer"
            title="Toggle fullscreen"
            aria-label="Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={onExit}
            className="min-h-[38px] flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 border border-white/10 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Exit Slides</span>
          </button>
        </div>
      </div>


      {/* Main Slide Stage */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 md:p-12 overflow-y-auto">
        <div className="w-full max-w-4xl max-h-[85vh] transition-all">
          {currentSlideIndex === 0 ? (
            /* Slide 0: Cover / Overview Slide in Apple Keynote Style */
            <div className="bg-[#18181b]/95 backdrop-blur-2xl border border-white/[0.1] rounded-3xl p-8 sm:p-12 shadow-[0_30px_90px_rgba(0,0,0,0.8)] relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-5">
                  <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-[1.15]">
                    {deck.title}
                  </h1>

                  <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-2xl font-normal">
                    {deck.summary}
                  </p>

                  <div className="pt-4 border-t border-white/[0.08] space-y-2">
                    <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4 text-amber-400" />
                      <span>{deck.feynmanCoreConcept.centralAnalogy.title}</span>
                    </div>
                    <blockquote className="text-xs sm:text-sm text-neutral-200 leading-relaxed italic border-l-2 border-white/40 pl-3">
                      "{deck.feynmanCoreConcept.centralAnalogy.analogyText}"
                    </blockquote>
                  </div>
                </div>

                <div className="lg:col-span-5 w-full">
                  <CardVisual
                    image={deck.heroImage}
                    onUpdateImage={(newImg) => {
                      deck.heroImage = newImg;
                    }}
                    defaultDiagram={
                      deck.title.toLowerCase().includes('cold')
                        ? 'cold_chain'
                        : deck.title.toLowerCase().includes('clean')
                        ? 'cleanroom'
                        : deck.title.toLowerCase().includes('incident')
                        ? 'incident_triage'
                        : 'flowchart'
                    }
                    titleContext={deck.title}
                  />
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

      {/* Bottom control bar */}
      <div className="h-16 px-4 sm:px-6 flex items-center justify-between border-t border-white/[0.08] bg-black/80 backdrop-blur-xl pb-safe">
        <button
          type="button"
          onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentSlideIndex === 0}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center gap-1.5 px-4 text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 disabled:opacity-30 rounded-full border border-white/10 transition-colors active:scale-95 cursor-pointer"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Slide Dots */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-[180px] sm:max-w-md px-2 scrollbar-none">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentSlideIndex(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                currentSlideIndex === idx
                  ? 'w-6 bg-white'
                  : 'w-2 bg-neutral-800 hover:bg-neutral-600'
              }`}
              title={`Jump to slide ${idx + 1}`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => setCurrentSlideIndex((prev) => Math.min(totalSlides - 1, prev + 1))}
          disabled={currentSlideIndex === totalSlides - 1}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center gap-1.5 px-5 text-xs font-semibold text-black bg-white hover:bg-neutral-200 disabled:opacity-30 rounded-full transition-colors active:scale-95 cursor-pointer shadow-md"
          aria-label="Next Slide"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4 font-bold" />
        </button>
      </div>
    </div>
  );
};
