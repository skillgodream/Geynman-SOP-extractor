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
    <div className="fixed inset-0 z-50 bg-black text-white flex flex-col select-none overflow-hidden font-sans">
      {/* Top Keynote Control Bar */}
      <div className="relative h-14 px-4 sm:px-6 flex items-center justify-between border-b border-white/[0.08] bg-black/85 backdrop-blur-2xl">
        {/* Subtle Slide Progress Bar at very top */}
        <div
          className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-white/70 to-white transition-all duration-300"
          style={{ width: `${((currentSlideIndex + 1) / totalSlides) * 100}%` }}
        />

        <div className="flex items-center gap-2.5 truncate">
          <span className="font-semibold text-xs sm:text-sm tracking-tight text-white truncate max-w-[150px] sm:max-w-xs">
            {deck.title}
          </span>
          <span className="text-neutral-600">·</span>
          <span className="text-[11px] sm:text-xs text-neutral-400 font-mono font-medium tracking-wider">
            {String(currentSlideIndex + 1).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
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

      {/* Main Slide Stage — Cinema Pro Canvas (Header-safe scroll alignment) */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10 flex flex-col items-center">
        <div className="w-full max-w-5xl my-auto transition-all duration-300 presentation-slide py-2 sm:py-4">
          {currentSlideIndex === 0 ? (
            /* Slide 0: Cover / Overview Slide in Apple Keynote Style */
            <div className="relative rounded-[2rem] border border-white/[0.12] bg-gradient-to-b from-blue-500/[0.08] via-neutral-950 to-neutral-950 p-6 sm:p-10 md:p-12 shadow-[0_30px_90px_rgba(0,0,0,0.95)] overflow-hidden">
              {/* Top Cover Header */}
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-6">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                  <span>{deck.originalDocType ? deck.originalDocType.toUpperCase() : 'OPERATIONAL MASTERCLASS'}</span>
                </div>

                <span className="text-[10px] font-mono tracking-widest text-neutral-400 font-bold uppercase">
                  MASTER TRAINING DECK
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                    {deck.title}
                  </h1>

                  <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-normal">
                    {deck.summary}
                  </p>

                  <div className="pt-4 border-t border-white/[0.08] space-y-2">
                    <div className="text-xs font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4 text-amber-400" />
                      <span>Core Mental Model</span>
                    </div>
                    <blockquote className="text-xs sm:text-sm text-neutral-200 leading-relaxed italic border-l-2 border-amber-400/60 pl-3">
                      "{deck.feynmanCoreConcept.centralAnalogy.analogyText}"
                    </blockquote>
                    <p className="text-xs text-neutral-400 pt-1">
                      <strong className="text-neutral-200 font-semibold">Application:</strong>{' '}
                      {deck.feynmanCoreConcept.centralAnalogy.howItMapsToSOP}
                    </p>
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
            /* Individual Card Slide — Zero editor toolbar in presentation view */
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
      <div className="h-16 px-4 sm:px-6 flex items-center justify-between border-t border-white/[0.08] bg-black/85 backdrop-blur-2xl pb-safe">
        <button
          type="button"
          onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentSlideIndex === 0}
          className="min-h-[42px] min-w-[42px] flex items-center justify-center gap-1.5 px-4 text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 disabled:opacity-20 rounded-full border border-white/10 transition-all active:scale-95 cursor-pointer"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Slide Dots & Key Hint */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-[200px] sm:max-w-md px-2 scrollbar-none">
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlideIndex(idx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  currentSlideIndex === idx
                    ? 'w-7 bg-white shadow-sm'
                    : 'w-1.5 bg-neutral-800 hover:bg-neutral-600'
                }`}
                title={`Jump to slide ${idx + 1}`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
          <span className="hidden md:inline text-[10px] text-neutral-500 font-mono">
            Arrow keys ← → to navigate
          </span>
        </div>

        <button
          type="button"
          onClick={() => setCurrentSlideIndex((prev) => Math.min(totalSlides - 1, prev + 1))}
          disabled={currentSlideIndex === totalSlides - 1}
          className="min-h-[42px] min-w-[42px] flex items-center justify-center gap-1.5 px-5 text-xs font-semibold text-black bg-white hover:bg-neutral-200 disabled:opacity-20 rounded-full transition-all active:scale-95 cursor-pointer shadow-md"
          aria-label="Next Slide"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
