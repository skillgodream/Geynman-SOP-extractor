import React, { useEffect, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  X,
  Clock,
  Lightbulb,
  Printer
} from 'lucide-react';
import { FeynmanDeck, DeckCard, AppViewMode } from '../types/deck';
import { printDeckToPdf } from '../utils/printPdf';
import { PrintPdfModal } from './PrintPdfModal';
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
  const [isMobileMaximized, setIsMobileMaximized] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const totalSlides = deck.cards.length + 1; // Slide 0 is Overview/Hero, Slides 1..N are Deck Cards

  // Keyboard navigation & Fullscreen Change Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        setCurrentSlideIndex((prev) => Math.min(totalSlides - 1, prev + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        setCurrentSlideIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        } else {
          setIsMobileMaximized(false);
          setIsFullscreen(false);
          onExit();
        }
      }
    };

    const handleFullscreenChange = () => {
      const doc = document as any;
      const isFull = !!(
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement
      );
      setIsFullscreen(isFull);
      if (!isFull) setIsMobileMaximized(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, [totalSlides, onExit]);

  /**
   * Mobile-Compatible Fullscreen & Immersive Stretch Handler
   * Works on iOS Safari, Android Webview, iFrames, and Desktops!
   */
  const toggleFullscreen = async () => {
    try {
      const docEl = document.documentElement as any;
      const doc = document as any;

      const isFull = !!(
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement
      );

      if (!isFull && !isMobileMaximized) {
        // Try Native Fullscreen API
        if (docEl.requestFullscreen) {
          await docEl.requestFullscreen();
          setIsFullscreen(true);
        } else if (docEl.webkitRequestFullscreen) {
          await docEl.webkitRequestFullscreen();
          setIsFullscreen(true);
        } else if (docEl.mozRequestFullScreen) {
          await docEl.mozRequestFullScreen();
          setIsFullscreen(true);
        } else if (docEl.msRequestFullscreen) {
          await docEl.msRequestFullscreen();
          setIsFullscreen(true);
        } else {
          // Mobile Safari / iOS Fallback: CSS Cinema Viewport Stretch
          setIsMobileMaximized(true);
          setIsFullscreen(true);
        }
      } else {
        if (doc.exitFullscreen) {
          await doc.exitFullscreen().catch(() => {});
        } else if (doc.webkitExitFullscreen) {
          await doc.webkitExitFullscreen().catch(() => {});
        } else if (doc.mozCancelFullScreen) {
          await doc.mozCancelFullScreen().catch(() => {});
        } else if (doc.msExitFullscreen) {
          await doc.msExitFullscreen().catch(() => {});
        }
        setIsFullscreen(false);
        setIsMobileMaximized(false);
      }
    } catch (err) {
      // Mobile Safari / iframe fallback on API rejection
      setIsMobileMaximized((prev) => !prev);
      setIsFullscreen((prev) => !prev);
    }
  };

  const currentCard = currentSlideIndex >= 1 ? deck.cards[currentSlideIndex - 1] : null;
  const isStretched = isFullscreen || isMobileMaximized;

  return (
    <div className="fixed inset-0 z-50 bg-black text-white flex flex-col select-none overflow-hidden font-sans">
      {/* Top Keynote Control Bar */}
      <div className="relative h-14 px-3 sm:px-6 flex items-center justify-between border-b border-white/[0.08] bg-black/85 backdrop-blur-2xl shrink-0">
        {/* Subtle Slide Progress Bar at very top */}
        <div
          className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-cyan-400 to-white transition-all duration-300"
          style={{ width: `${((currentSlideIndex + 1) / totalSlides) * 100}%` }}
        />

        <div className="flex items-center gap-2 truncate">
          <span className="font-semibold text-xs sm:text-sm tracking-tight text-white truncate max-w-[130px] sm:max-w-xs">
            {deck.title}
          </span>
          <span className="text-neutral-600">·</span>
          <span className="text-[11px] sm:text-xs text-neutral-400 font-mono font-medium tracking-wider shrink-0">
            {String(currentSlideIndex + 1).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setIsPrintModalOpen(true)}
            className="min-h-[36px] px-3 sm:px-3.5 py-1.5 flex items-center gap-1.5 text-xs font-semibold text-neutral-300 hover:text-white rounded-full bg-neutral-900/80 hover:bg-neutral-800 border border-white/10 transition-colors cursor-pointer no-print"
            title="Export Slide Deck to PDF"
            aria-label="Print to PDF"
          >
            <Printer className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Print to PDF</span>
          </button>

          {/* Fullscreen / Stretch Icon Button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className={`min-h-[36px] min-w-[36px] flex items-center justify-center text-neutral-300 hover:text-white rounded-full border transition-all cursor-pointer no-print active:scale-95 ${
              isStretched
                ? 'bg-cyan-500 text-black border-cyan-400 font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                : 'bg-neutral-900/80 hover:bg-neutral-800 border-white/10'
            }`}
            title={isStretched ? 'Exit fullscreen / stretch' : 'Stretch to fullscreen'}
            aria-label="Stretch to Fullscreen"
          >
            {isStretched ? (
              <Minimize2 className="w-4 h-4 text-black stroke-[2.5]" />
            ) : (
              <Maximize2 className="w-4 h-4 text-cyan-400 stroke-[2]" />
            )}
          </button>

          <button
            type="button"
            onClick={onExit}
            className="min-h-[36px] flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 border border-white/10 rounded-full transition-colors cursor-pointer no-print"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Exit Slides</span>
          </button>
        </div>
      </div>

      {/* Main Slide Stage — Adaptive Mobile Cinema Viewport */}
      <div
        className={`flex-1 overflow-y-auto flex flex-col items-center justify-center transition-all ${
          isStretched ? 'p-1 sm:p-2' : 'p-3 sm:p-6 md:p-8'
        }`}
      >
        <div
          className={`w-full my-auto transition-all duration-300 presentation-slide ${
            isStretched ? 'max-w-full p-0 sm:p-1' : 'max-w-5xl py-2 sm:py-4'
          }`}
        >
          {currentSlideIndex === 0 ? (
            /* Slide 0: Cover / Overview Slide */
            <div className="relative rounded-[2rem] border border-white/[0.12] bg-gradient-to-b from-blue-500/[0.08] via-neutral-950 to-neutral-950 p-6 sm:p-10 md:p-12 shadow-[0_30px_90px_rgba(0,0,0,0.95)] overflow-hidden">
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
            /* Individual Card Slide */
            <div className="slide-content w-full">
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

      {/* Bottom Control Bar */}
      <div className="h-16 px-4 sm:px-6 flex items-center justify-between border-t border-white/[0.08] bg-black/85 backdrop-blur-2xl pb-safe shrink-0">
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

        {/* Slide Dots */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-[180px] sm:max-w-md px-2 scrollbar-none">
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlideIndex(idx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  currentSlideIndex === idx
                    ? 'w-7 bg-cyan-400 shadow-sm'
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

      {/* Print PDF Modal */}
      {isPrintModalOpen && (
        <PrintPdfModal
          isOpen={isPrintModalOpen}
          onClose={() => setIsPrintModalOpen(false)}
          deck={deck}
        />
      )}
    </div>
  );
};
