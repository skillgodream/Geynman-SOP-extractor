import React, { useState } from 'react';
import { SAMPLE_DECKS } from './data/sampleDecks';
import { FeynmanDeck, DeckCard } from './types/deck';
import { TopNav } from './components/TopNav';
import { MobileBottomNav } from './components/MobileBottomNav';
import { DeckViewer } from './components/DeckViewer';
import { PresentationMode } from './components/PresentationMode';
import { SOPInputModal } from './components/SOPInputModal';
import { FeynmanMethodModal } from './components/FeynmanMethodModal';

export default function App() {
  const [currentDeck, setCurrentDeck] = useState<FeynmanDeck>(SAMPLE_DECKS[0]);
  const [activeView, setActiveView] = useState<'flow' | 'presentation'>('flow');
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [isMethodModalOpen, setIsMethodModalOpen] = useState(false);
  const [isMobileOutlineOpen, setIsMobileOutlineOpen] = useState(false);
  const [isMobileTutorOpen, setIsMobileTutorOpen] = useState(false);

  const handleSelectSample = (deckId: string) => {
    const found = SAMPLE_DECKS.find((d) => d.id === deckId);
    if (found) {
      setCurrentDeck(found);
    }
  };

  const handleDeckGenerated = (newDeck: FeynmanDeck) => {
    setCurrentDeck(newDeck);
    setActiveView('flow');
  };

  const handleUpdateCard = (updatedCard: DeckCard) => {
    const updatedCards = currentDeck.cards.map((c) =>
      c.id === updatedCard.id ? updatedCard : c
    );
    setCurrentDeck({ ...currentDeck, cards: updatedCards });
  };

  const handleDeleteCard = (cardId: string) => {
    const updatedCards = currentDeck.cards.filter((c) => c.id !== cardId);
    setCurrentDeck({ ...currentDeck, cards: updatedCards });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-amber-400 selection:text-slate-950">
      {/* Top Bar Navigation (Responsive Mobile & Desktop) */}
      <TopNav
        activeView={activeView}
        onViewChange={(view) => setActiveView(view)}
        onOpenNewModal={() => setIsInputModalOpen(true)}
        onOpenSampleModal={() => setIsInputModalOpen(true)}
        onOpenMethodModal={() => setIsMethodModalOpen(true)}
      />

      {/* Main View: Continuous Deck Flow vs 16:9 Presentation Mode */}
      {activeView === 'presentation' ? (
        <PresentationMode
          deck={currentDeck}
          onExit={() => setActiveView('flow')}
          onUpdateCard={handleUpdateCard}
          onDeleteCard={handleDeleteCard}
          onOpenTutor={(card) => {
            setActiveView('flow');
            setIsMobileTutorOpen(true);
          }}
        />
      ) : (
        <DeckViewer
          deck={currentDeck}
          onUpdateDeck={setCurrentDeck}
          onSwitchToPresentation={() => setActiveView('presentation')}
          isMobileOutlineOpen={isMobileOutlineOpen}
          onCloseMobileOutline={() => setIsMobileOutlineOpen(false)}
          isMobileTutorOpen={isMobileTutorOpen}
          onCloseMobileTutor={() => setIsMobileTutorOpen(false)}
        />
      )}

      {/* Mobile-First Fixed Bottom Navigation Bar */}
      {activeView === 'flow' && (
        <MobileBottomNav
          activeView={activeView}
          onViewChange={(view) => setActiveView(view)}
          onOpenOutline={() => setIsMobileOutlineOpen(true)}
          onOpenTutor={() => setIsMobileTutorOpen(true)}
          onOpenNewModal={() => setIsInputModalOpen(true)}
        />
      )}

      {/* SOP Ingestion Modal */}
      <SOPInputModal
        isOpen={isInputModalOpen}
        onClose={() => setIsInputModalOpen(false)}
        onDeckGenerated={handleDeckGenerated}
        onSelectSample={handleSelectSample}
      />

      {/* Feynman Technique Pedagogy Modal */}
      <FeynmanMethodModal
        isOpen={isMethodModalOpen}
        onClose={() => setIsMethodModalOpen(false)}
      />
    </div>
  );
}
