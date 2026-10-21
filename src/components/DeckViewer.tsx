import React, { useState } from 'react';
import {
  Printer,
  Copy,
  Download,
  Plus,
  Check,
  BookOpen,
  HelpCircle,
  Lightbulb,
  ShieldAlert,
  Layers,
  Bookmark,
  Film,
  Award,
  Wrench,
  Presentation
} from 'lucide-react';
import { FeynmanDeck, DeckCard } from '../types/deck';
import { CardOutlineCard } from './cards/CardOutlineCard';
import { HeroCard } from './cards/HeroCard';
import { ConceptAnalogyCard } from './cards/ConceptAnalogyCard';
import { CriticalRulesCard } from './cards/CriticalRulesCard';
import { ProcessStepsCard } from './cards/ProcessStepsCard';
import { TroubleshootingCard } from './cards/TroubleshootingCard';
import { ScenarioQuizCard } from './cards/ScenarioQuizCard';
import { QuickReferenceCard } from './cards/QuickReferenceCard';
import { FeynmanTutorDrawer } from './FeynmanTutorDrawer';
import { MobileOutlineSheet } from './MobileOutlineSheet';

interface DeckViewerProps {
  deck: FeynmanDeck;
  onUpdateDeck: (updated: FeynmanDeck) => void;
  onSwitchToPresentation: () => void;
  onSwitchToOutline?: () => void;
  onSwitchToView?: (view: 'flow' | 'presentation' | 'show_me' | 'guide_me' | 'test_me') => void;
  isMobileOutlineOpen?: boolean;
  onCloseMobileOutline?: () => void;
  isMobileTutorOpen?: boolean;
  onCloseMobileTutor?: () => void;
}

export const DeckViewer: React.FC<DeckViewerProps> = ({
  deck,
  onUpdateDeck,
  onSwitchToPresentation,
  onSwitchToOutline = () => {},
  onSwitchToView = () => {},
  isMobileOutlineOpen = false,
  onCloseMobileOutline = () => {},
  isMobileTutorOpen = false,
  onCloseMobileTutor = () => {},
}) => {
  const [activeTutorCard, setActiveTutorCard] = useState<DeckCard | null>(null);
  const [isTutorOpen, setIsTutorOpen] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  const effectiveTutorOpen = isTutorOpen || isMobileTutorOpen;
  const handleCloseTutor = () => {
    setIsTutorOpen(false);
    onCloseMobileTutor();
  };

  const handleUpdateCard = (updatedCard: DeckCard) => {
    const updatedCards = deck.cards.map((c) =>
      c.id === updatedCard.id ? updatedCard : c
    );
    onUpdateDeck({ ...deck, cards: updatedCards });
  };

  const handleDeleteCard = (cardId: string) => {
    const updatedCards = deck.cards.filter((c) => c.id !== cardId);
    onUpdateDeck({ ...deck, cards: updatedCards });
  };

  const handleAddCard = (type: DeckCard['cardType']) => {
    const newCard: DeckCard = {
      id: `custom-card-${Date.now()}`,
      title: 'New Instructional Card',
      subtitle: 'Custom instructional chunk',
      cardType: type,
      feynmanExplanation: 'Write your intuitive explanation here using everyday language.',
      badgeText: 'Custom Section',
      ...(type === 'critical_rules'
        ? {
            criticalRules: [
              {
                type: 'must_do',
                rule: 'Clearly state the essential action',
                consequenceOfFailure: 'Explain the risk if omitted',
                verificationCheck: 'How to verify compliance',
              },
            ],
          }
        : type === 'process_steps'
        ? {
            steps: [
              {
                stepNumber: 1,
                title: 'First Key Step',
                action: 'Specific physical or operational action',
                whyItMatters: 'Feynman intuition why this step is essential',
                criticalWatchout: 'Common trap to avoid',
              },
            ],
          }
        : type === 'scenario_quiz'
        ? {
            quiz: {
              scenario: 'Describe a realistic shift dilemma...',
              question: 'What is the correct protocol response?',
              options: ['Option A (Correct)', 'Option B (Flawed)', 'Option C (Dangerous)'],
              correctAnswerIndex: 0,
              feynmanFeedback: 'Why option A preserves safety and operational integrity.',
              distractorExplanations: ['Flaw in B', 'Danger in C'],
            },
          }
        : type === 'quick_reference'
        ? {
            referenceItems: [
              {
                label: 'Core Metric',
                value: 'Target Threshold',
                detail: 'Emergency escalation criteria',
              },
            ],
          }
        : {
            analogy: {
              metaphor: 'Compare to an everyday object or experience',
              takeaway: 'Key takeaway for the operator',
            },
          }),
    };

    onUpdateDeck({
      ...deck,
      cards: [...deck.cards, newCard],
    });
  };

  const handleOpenTutor = (card: DeckCard) => {
    setActiveTutorCard(card);
    setIsTutorOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyMarkdown = () => {
    let md = `# ${deck.title}\n\n`;
    md += `> ${deck.summary}\n\n`;
    md += `## Central Mental Model: ${deck.feynmanCoreConcept.centralAnalogy.title}\n`;
    md += `*${deck.feynmanCoreConcept.centralAnalogy.analogyText}*\n\n`;

    deck.cards.forEach((c, idx) => {
      md += `### ${idx + 1}. ${c.title}\n`;
      md += `${c.feynmanExplanation}\n\n`;
      if (c.criticalRules) {
        c.criticalRules.forEach((r) => {
          md += `- **[${r.type.toUpperCase()}]** ${r.rule} (Risk: ${r.consequenceOfFailure})\n`;
        });
      }
      if (c.steps) {
        c.steps.forEach((s) => {
          md += `${s.stepNumber}. **${s.title}**: ${s.action} *(Why: ${s.whyItMatters})*\n`;
        });
      }
      md += `\n`;
    });

    navigator.clipboard.writeText(md);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(deck, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${deck.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const scrollToCard = (cardId: string) => {
    const el = document.getElementById(cardId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const cardIcon = (type: DeckCard['cardType']) => {
    switch (type) {
      case 'concept_analogy':
        return <Lightbulb className="w-3.5 h-3.5 text-neutral-300" />;
      case 'critical_rules':
        return <ShieldAlert className="w-3.5 h-3.5 text-neutral-300" />;
      case 'process_steps':
        return <Layers className="w-3.5 h-3.5 text-neutral-300" />;
      case 'pitfalls_troubleshooting':
        return <Wrench className="w-3.5 h-3.5 text-neutral-300" />;
      case 'scenario_quiz':
        return <HelpCircle className="w-3.5 h-3.5 text-neutral-300" />;
      case 'quick_reference':
        return <Bookmark className="w-3.5 h-3.5 text-neutral-300" />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased pb-28 md:pb-20">
      {/* Sub-header Controls Bar in Apple style Black */}
      <div className="border-b border-white/[0.08] bg-black/85 backdrop-blur-xl px-4 sm:px-6 lg:px-8 py-2.5 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 overflow-x-auto scrollbar-none">
          {/* Deck Outline Button & Title */}
          <div className="flex items-center gap-2.5 text-xs truncate shrink-0 max-w-[280px] sm:max-w-md">
            <button
              type="button"
              onClick={onSwitchToOutline}
              className="min-h-[34px] flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-white/10 text-xs font-medium transition-colors cursor-pointer shrink-0"
              title="Return to Card Outline"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Outline</span>
            </button>
            <span className="truncate font-semibold text-white">
              {deck.title}
            </span>
          </div>

          {/* Right Tools: Export & Present */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Print button */}
            <button
              type="button"
              onClick={handlePrint}
              className="min-h-[38px] min-w-[38px] flex items-center justify-center text-neutral-400 hover:text-white rounded-full hover:bg-neutral-900 border border-transparent hover:border-white/10 transition-colors cursor-pointer"
              title="Print Deck or Save to PDF"
              aria-label="Print Deck"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Copy Markdown */}
            <button
              type="button"
              onClick={handleCopyMarkdown}
              className="min-h-[38px] min-w-[38px] flex items-center justify-center text-neutral-400 hover:text-white rounded-full hover:bg-neutral-900 border border-transparent hover:border-white/10 transition-colors relative cursor-pointer"
              title="Copy Deck as Markdown"
              aria-label="Copy Markdown"
            >
              {copiedNotification ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>

            {/* Download JSON */}
            <button
              type="button"
              onClick={handleDownloadJSON}
              className="min-h-[38px] min-w-[38px] flex items-center justify-center text-neutral-400 hover:text-white rounded-full hover:bg-neutral-900 border border-transparent hover:border-white/10 transition-colors cursor-pointer"
              title="Download Deck JSON"
              aria-label="Download JSON"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Slide Mode */}
            <button
              type="button"
              onClick={onSwitchToPresentation}
              className="hidden md:flex min-h-[38px] items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-black bg-white hover:bg-neutral-200 rounded-full transition-all cursor-pointer"
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>Slide Mode</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Split layout with Sticky Card TOC & Main Cards Flow */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sticky Left Sidebar (Desktop only) */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-32 space-y-4">
            <div className="p-5 rounded-3xl border border-white/[0.08] bg-neutral-950/80 backdrop-blur-md">
              <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3 flex items-center justify-between">
                <span>Card Outline</span>
                <span className="text-[11px] font-mono text-neutral-500">{deck.cards.length} cards</span>
              </div>

              <div className="space-y-1 text-xs">
                <a
                  href="#card-outline"
                  className="flex items-center gap-2 p-2 rounded-xl text-neutral-400 hover:bg-neutral-900 hover:text-white transition-colors"
                >
                  <Layers className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
                  <span className="truncate">Card Outline</span>
                </a>

                <a
                  href="#hero-card"
                  className="flex items-center gap-2 p-2 rounded-xl text-neutral-400 hover:bg-neutral-900 hover:text-white transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
                  <span className="truncate">Overview & Mental Model</span>
                </a>

                {deck.cards.map((card) => (
                  <a
                    key={card.id}
                    href={`#${card.id}`}
                    className="flex items-center gap-2 p-2 rounded-xl text-neutral-400 hover:bg-neutral-900 hover:text-white transition-colors"
                  >
                    <span className="shrink-0">{cardIcon(card.cardType)}</span>
                    <span className="truncate">{card.title}</span>
                  </a>
                ))}
              </div>

              {/* Add card */}
              <div className="pt-3 mt-3 border-t border-white/[0.08]">
                <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                  Add Section:
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => handleAddCard('concept_analogy')}
                    className="p-2 text-left rounded-xl bg-white hover:bg-neutral-200 text-black border border-white font-semibold truncate cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <span className="text-amber-600 font-bold">+</span> Analogy
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddCard('critical_rules')}
                    className="p-2 text-left rounded-xl bg-white hover:bg-neutral-200 text-black border border-white font-semibold truncate cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <span className="text-red-600 font-bold">+</span> Red Lines
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddCard('process_steps')}
                    className="p-2 text-left rounded-xl bg-white hover:bg-neutral-200 text-black border border-white font-semibold truncate cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <span className="text-blue-600 font-bold">+</span> Steps
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddCard('scenario_quiz')}
                    className="p-2 text-left rounded-xl bg-white hover:bg-neutral-200 text-black border border-white font-semibold truncate cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <span className="text-purple-600 font-bold">+</span> Quiz
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Deck Flow Column */}
          <main className="col-span-1 lg:col-span-9 space-y-6 sm:space-y-8">
            {/* 1. Card Outline — First Page of Any Training Deck */}
            <div id="card-outline" className="scroll-mt-32">
              <CardOutlineCard
                deck={deck}
                onJumpToCard={scrollToCard}
                onAddCardChunk={handleAddCard}
                onStartSlideMode={onSwitchToPresentation}
              />
            </div>

            {/* 2. Overview & Mental Model (Hero Card) */}
            <div id="hero-card" className="scroll-mt-32">
              <HeroCard deck={deck} onUpdateDeck={onUpdateDeck} />
            </div>

            {/* 2. Structured Cards Flow */}
            {deck.cards.map((card) => (
              <div key={card.id} id={card.id} className="scroll-mt-32">
                {card.cardType === 'concept_analogy' && (
                  <ConceptAnalogyCard
                    card={card}
                    deckTitle={deck.title}
                    onUpdateCard={handleUpdateCard}
                    onDeleteCard={() => handleDeleteCard(card.id)}
                    onOpenTutor={handleOpenTutor}
                  />
                )}
                {card.cardType === 'critical_rules' && (
                  <CriticalRulesCard
                    card={card}
                    deckTitle={deck.title}
                    onUpdateCard={handleUpdateCard}
                    onDeleteCard={() => handleDeleteCard(card.id)}
                    onOpenTutor={handleOpenTutor}
                  />
                )}
                {card.cardType === 'process_steps' && (
                  <ProcessStepsCard
                    card={card}
                    deckTitle={deck.title}
                    onUpdateCard={handleUpdateCard}
                    onDeleteCard={() => handleDeleteCard(card.id)}
                    onOpenTutor={handleOpenTutor}
                  />
                )}
                {card.cardType === 'pitfalls_troubleshooting' && (
                  <TroubleshootingCard
                    card={card}
                    deckTitle={deck.title}
                    onUpdateCard={handleUpdateCard}
                    onDeleteCard={() => handleDeleteCard(card.id)}
                    onOpenTutor={handleOpenTutor}
                  />
                )}
                {card.cardType === 'scenario_quiz' && (
                  <ScenarioQuizCard
                    card={card}
                    deckTitle={deck.title}
                    onUpdateCard={handleUpdateCard}
                    onDeleteCard={() => handleDeleteCard(card.id)}
                    onOpenTutor={handleOpenTutor}
                  />
                )}
                {card.cardType === 'quick_reference' && (
                  <QuickReferenceCard
                    card={card}
                    deckTitle={deck.title}
                    onUpdateCard={handleUpdateCard}
                    onDeleteCard={() => handleDeleteCard(card.id)}
                    onOpenTutor={handleOpenTutor}
                  />
                )}
              </div>
            ))}

            {/* Completion Card in Apple Black Style */}
            <div className="p-8 sm:p-12 rounded-3xl border border-white/[0.08] bg-neutral-950 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center mx-auto font-bold text-lg">
                ✓
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Instructional Mastery Complete
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
                You have reviewed the core Feynman mental models, non-negotiable red lines, execution steps, and active recall checks for this SOP.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onSwitchToView('show_me')}
                  className="min-h-[44px] px-5 py-2.5 text-xs font-semibold text-black bg-white hover:bg-neutral-200 rounded-full shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Film className="w-4 h-4" />
                  <span>Show Me (Video)</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSwitchToView('guide_me')}
                  className="min-h-[44px] px-5 py-2.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 border border-white/10 rounded-full transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Guide Me (Practice)</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSwitchToView('test_me')}
                  className="min-h-[44px] px-5 py-2.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 border border-white/10 rounded-full transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  <span>Test Me (Assessment)</span>
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="min-h-[44px] px-5 py-2.5 text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-white/10 rounded-full transition-colors flex items-center justify-center cursor-pointer"
                >
                  Print Study Guide
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Interactive Feynman Tutor Drawer */}
      <FeynmanTutorDrawer
        isOpen={effectiveTutorOpen}
        onClose={handleCloseTutor}
        activeCard={activeTutorCard}
        deck={deck}
      />

      {/* Mobile Card Outline Sheet */}
      <MobileOutlineSheet
        isOpen={isMobileOutlineOpen}
        onClose={onCloseMobileOutline}
        deck={deck}
        onSelectCard={scrollToCard}
        onAddCard={handleAddCard}
      />
    </div>
  );
};
