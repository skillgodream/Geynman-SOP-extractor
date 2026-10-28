import React, { useState } from 'react';
import { SAMPLE_DECKS } from './data/sampleDecks';
import { FeynmanDeck, DeckCard, AppViewMode, CardType } from './types/deck';
import { HomeScreen } from './components/HomeScreen';
import { ExploreSelectionScreen } from './components/ExploreSelectionScreen';
import { UploadScreen } from './components/UploadScreen';
import { ScanScreen } from './components/ScanScreen';
import { DemoDecksScreen } from './components/DemoDecksScreen';
import { CardOutlineScreen } from './components/CardOutlineScreen';
import { TopNav } from './components/TopNav';
import { MobileBottomNav } from './components/MobileBottomNav';
import { DeckViewer } from './components/DeckViewer';
import { PresentationMode } from './components/PresentationMode';
import { ShowMeMode } from './components/modes/ShowMeMode';
import { GuideMeMode } from './components/modes/GuideMeMode';
import { TestMeMode } from './components/modes/TestMeMode';
import { FeynmanMethodModal } from './components/FeynmanMethodModal';
import { FloatingAskTutorButton } from './components/FloatingAskTutorButton';
import { FeynmanTutorDrawer } from './components/FeynmanTutorDrawer';

import { LearnerPortalScreen } from './components/LearnerPortalScreen';

type AppScreen = 'home' | 'explore' | 'scan' | 'upload' | 'demo' | 'deck' | 'learner_portal';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('home');
  const [allDecks, setAllDecks] = useState<FeynmanDeck[]>(SAMPLE_DECKS);
  const [currentDeck, setCurrentDeck] = useState<FeynmanDeck>(SAMPLE_DECKS[0]);
  const [activeView, setActiveView] = useState<AppViewMode>('outline');
  const [presentationSlideIndex, setPresentationSlideIndex] = useState(0);
  const [isMethodModalOpen, setIsMethodModalOpen] = useState(false);
  const [isMobileOutlineOpen, setIsMobileOutlineOpen] = useState(false);
  const [isTutorOpen, setIsTutorOpen] = useState(false);
  const [activeTutorCard, setActiveTutorCard] = useState<DeckCard | null>(null);

  const [sharedLearnerName, setSharedLearnerName] = useState('Frontline Operator');

  // Check URL search parameters on mount for shared learner links (?shareId=xyz&learnerName=...)
  React.useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const shareId = params.get('shareId') || params.get('share');
      const name = params.get('learnerName');

      if (name) setSharedLearnerName(name);

      if (shareId) {
        const matched = SAMPLE_DECKS.find((d) => d.id === shareId);
        if (matched) {
          setCurrentDeck(matched);
          setCurrentScreen('learner_portal');
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Transition from Home -> Explore Selection (Only Scan, Upload, Demo)
  const handleStartExplore = () => {
    setCurrentScreen('explore');
  };

  // When user clicks one of the 3 options on the Explore page:
  const handleSelectExploreOption = (option: 'scan' | 'upload' | 'demo') => {
    if (option === 'scan') setCurrentScreen('scan');
    else if (option === 'upload') setCurrentScreen('upload');
    else if (option === 'demo') setCurrentScreen('demo');
  };

  // When AI generates a new deck from upload/scan -> Card Outline is the FIRST page
  const handleDeckGenerated = (newDeck: FeynmanDeck) => {
    setAllDecks((prev) => [newDeck, ...prev]);
    setCurrentDeck(newDeck);
    setActiveTutorCard(newDeck.cards[0] || null);
    setActiveView('outline');
    setCurrentScreen('deck');
  };

  // Select a Demo or Ingested Deck -> First page is Card Outline
  const handleSelectDeck = (deck: FeynmanDeck, initialView: AppViewMode = 'outline') => {
    setCurrentDeck(deck);
    setActiveTutorCard(deck.cards[0] || null);
    setActiveView(initialView);
    setCurrentScreen('deck');
  };

  const handleUpdateCard = (updatedCard: DeckCard) => {
    const updatedCards = currentDeck.cards.map((c) =>
      c.id === updatedCard.id ? updatedCard : c
    );
    const updatedDeck = { ...currentDeck, cards: updatedCards };
    setCurrentDeck(updatedDeck);
    setAllDecks((prev) =>
      prev.map((d) => (d.id === updatedDeck.id ? updatedDeck : d))
    );
  };

  const handleDeleteCard = (cardId: string) => {
    const updatedCards = currentDeck.cards.filter((c) => c.id !== cardId);
    const updatedDeck = { ...currentDeck, cards: updatedCards };
    setCurrentDeck(updatedDeck);
    setAllDecks((prev) =>
      prev.map((d) => (d.id === updatedDeck.id ? updatedDeck : d))
    );
  };

  // Add new card chunk directly from Card Outline screen
  const handleAddCardChunk = (type: CardType) => {
    const newCard: DeckCard = {
      id: `custom-card-${Date.now()}`,
      title:
        type === 'critical_rules'
          ? 'Non-Negotiable Red Lines'
          : type === 'process_steps'
          ? 'Emergency Sequence Steps'
          : type === 'scenario_quiz'
          ? 'Active Recall Dilemma'
          : 'Intuitive Analogy',
      subtitle: 'Newly added instructional chunk',
      cardType: type,
      feynmanExplanation:
        'Explain this concept in plain everyday language so anyone on the floor grasps it instantly.',
      badgeText: 'New Section',
      ...(type === 'critical_rules'
        ? {
            criticalRules: [
              {
                type: 'must_do',
                rule: 'Clearly state the essential action',
                consequenceOfFailure: 'Explain the operational or patient safety risk',
                verificationCheck: 'How to verify compliance on the shift',
              },
            ],
          }
        : type === 'process_steps'
        ? {
            steps: [
              {
                stepNumber: 1,
                title: 'Immediate First Action',
                action: 'Specific physical or operational procedure',
                whyItMatters: 'Intuitive explanation of why this step cannot be skipped',
                criticalWatchout: 'Common error to guard against',
              },
            ],
          }
        : type === 'scenario_quiz'
        ? {
            quiz: {
              scenario: 'A high-stakes operational dilemma arises unexpectedly...',
              question: 'What is the required standard response?',
              options: ['Option A (Correct standard)', 'Option B (Flawed shortcut)', 'Option C (High risk violation)'],
              correctAnswerIndex: 0,
              feynmanFeedback: 'Why option A preserves safety and compliance.',
              distractorExplanations: ['Flaw in option B', 'Danger in option C'],
            },
          }
        : {
            analogy: {
              metaphor: 'Compare to an everyday experience or household object',
              takeaway: 'Key takeaway for the team',
            },
          }),
    };

    const updatedDeck: FeynmanDeck = {
      ...currentDeck,
      cards: [...currentDeck.cards, newCard],
    };

    setCurrentDeck(updatedDeck);
    setAllDecks((prev) =>
      prev.map((d) => (d.id === updatedDeck.id ? updatedDeck : d))
    );
  };

  // Wrapper for training deck screens to include Floating Ask Tutor icon & Tutor Drawer on EVERY screen
  const renderDeckView = (content: React.ReactNode) => {
    return (
      <div className="relative min-h-screen bg-black">
        {content}
        <FloatingAskTutorButton onClick={() => setIsTutorOpen(true)} />
        <FeynmanTutorDrawer
          isOpen={isTutorOpen}
          onClose={() => setIsTutorOpen(false)}
          activeCard={activeTutorCard || currentDeck.cards[0] || null}
          deck={currentDeck}
        />
      </div>
    );
  };

  // SCREEN 1: HOME SCREEN (Character + Only ONE button: "Let's Explore")
  if (currentScreen === 'home') {
    return <HomeScreen onExplore={handleStartExplore} />;
  }

  // SCREEN 2: EXPLORE SELECTION SCREEN (Only 3 Options: Scan, Upload, Demo)
  if (currentScreen === 'explore') {
    return (
      <ExploreSelectionScreen
        onBackToHome={() => setCurrentScreen('home')}
        onSelectOption={handleSelectExploreOption}
      />
    );
  }

  // SCREEN 3: DEDICATED SCAN SCREEN
  if (currentScreen === 'scan') {
    return (
      <ScanScreen
        onBack={() => setCurrentScreen('explore')}
        onDeckGenerated={handleDeckGenerated}
      />
    );
  }

  // SCREEN 4: DEDICATED UPLOAD & PASTE TEXT SCREEN
  if (currentScreen === 'upload') {
    return (
      <UploadScreen
        onBack={() => setCurrentScreen('explore')}
        onDeckGenerated={handleDeckGenerated}
      />
    );
  }

  // SCREEN 5: DEDICATED DEMO & CREATED DECKS SCREEN
  if (currentScreen === 'demo') {
    return (
      <DemoDecksScreen
        decks={allDecks}
        onBackToExplore={() => setCurrentScreen('explore')}
        onOpenUpload={() => setCurrentScreen('upload')}
        onSelectDeck={handleSelectDeck}
      />
    );
  }

  // SCREEN 5B: FOCUSED LEARNER PORTAL SCREEN (Opened via Shared SOP Module Link)
  if (currentScreen === 'learner_portal') {
    return (
      <LearnerPortalScreen
        deck={currentDeck}
        learnerName={sharedLearnerName}
        onOpenMode={(mode) => {
          setActiveView(mode);
          setCurrentScreen('deck');
        }}
        onExitPortal={() => setCurrentScreen('demo')}
      />
    );
  }

  // TRAINING DECK VIEWS (Every view includes floating Ask Tutor icon)

  // SCREEN 6: CARD OUTLINE IS THE FIRST PAGE OF ANY TRAINING DECK
  if (activeView === 'outline') {
    return renderDeckView(
      <CardOutlineScreen
        deck={currentDeck}
        onBackToExplore={() => setCurrentScreen('demo')}
        onOpenSlideView={(slideIndex = 0) => {
          setPresentationSlideIndex(slideIndex);
          setActiveView('presentation');
        }}
        onOpenFlowView={() => {
          setActiveView('flow');
        }}
        onSwitchToMode={(mode) => setActiveView(mode)}
        onAddCardChunk={handleAddCardChunk}
      />
    );
  }

  // SCREEN 7: SLIDE VIEW / PRESENTATION MODE
  if (activeView === 'presentation') {
    return renderDeckView(
      <PresentationMode
        deck={currentDeck}
        initialSlideIndex={presentationSlideIndex}
        onExit={() => setActiveView('outline')}
        onUpdateCard={handleUpdateCard}
        onDeleteCard={handleDeleteCard}
        onOpenTutor={(card) => {
          if (card) setActiveTutorCard(card);
          setIsTutorOpen(true);
        }}
        onSwitchToMode={(mode, slideIndex = 0) => {
          setPresentationSlideIndex(slideIndex);
          setActiveView(mode);
        }}
      />
    );
  }

  // SCREEN 8: SHOW ME (VIDEO) MODE
  if (activeView === 'show_me') {
    return renderDeckView(
      <ShowMeMode
        deck={currentDeck}
        onExit={() => setActiveView('outline')}
        onSwitchToMode={(mode, slideIndex = 0) => {
          setPresentationSlideIndex(slideIndex);
          setActiveView(mode);
        }}
      />
    );
  }

  // SCREEN 9: GUIDE ME (DILEMMAS) MODE
  if (activeView === 'guide_me') {
    return renderDeckView(
      <GuideMeMode
        deck={currentDeck}
        onExit={() => setActiveView('outline')}
        onSwitchToMode={(mode, slideIndex = 0) => {
          setPresentationSlideIndex(slideIndex);
          setActiveView(mode);
        }}
      />
    );
  }

  // SCREEN 10: TEST ME (ASSESSMENT) MODE
  if (activeView === 'test_me') {
    return renderDeckView(
      <TestMeMode
        deck={currentDeck}
        onExit={() => setActiveView('outline')}
        onSwitchToMode={(mode, slideIndex = 0) => {
          setPresentationSlideIndex(slideIndex);
          setActiveView(mode);
        }}
      />
    );
  }

  // SCREEN 11: FULL DECK FLOW (SCROLL CARDS VIEW)
  return renderDeckView(
    <div className="min-h-screen bg-black text-white flex flex-col font-sans antialiased selection:bg-neutral-800 selection:text-white">
      {/* Top Bar Navigation — Strictly Back to Explore, Deck Title, and Slide View */}
      <TopNav
        activeView={activeView}
        onViewChange={(view) => setActiveView(view)}
        onNavigateToExplore={() => setActiveView('outline')}
        onOpenMethodModal={() => setIsMethodModalOpen(true)}
        deckTitle={currentDeck.title}
      />

      <DeckViewer
        deck={currentDeck}
        onUpdateDeck={setCurrentDeck}
        onSwitchToPresentation={() => {
          setPresentationSlideIndex(0);
          setActiveView('presentation');
        }}
        onSwitchToOutline={() => setActiveView('outline')}
        onSwitchToView={(v) => setActiveView(v)}
        isMobileOutlineOpen={isMobileOutlineOpen}
        onCloseMobileOutline={() => setIsMobileOutlineOpen(false)}
        isMobileTutorOpen={isTutorOpen}
        onCloseMobileTutor={() => setIsTutorOpen(false)}
      />

      {/* Mobile-First Fixed Bottom Navigation Bar */}
      <MobileBottomNav
        activeView={activeView}
        onViewChange={(view) => setActiveView(view)}
        onOpenExplore={() => setActiveView('outline')}
        onOpenTutor={() => setIsTutorOpen(true)}
        onOpenNewModal={() => setCurrentScreen('upload')}
      />

      {/* Feynman Technique Pedagogy Modal */}
      <FeynmanMethodModal
        isOpen={isMethodModalOpen}
        onClose={() => setIsMethodModalOpen(false)}
      />
    </div>
  );
}
