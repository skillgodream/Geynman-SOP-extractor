import React, { useState } from 'react';
import {
  Printer,
  Copy,
  Download,
  Plus,
  Palette,
  Check,
  ChevronRight,
  BookOpen,
  HelpCircle,
  Lightbulb,
  ShieldAlert,
  Layers,
  Wrench,
  Bookmark,
  List
} from 'lucide-react';
import { FeynmanDeck, DeckCard, DeckTheme } from '../types/deck';
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
  isMobileOutlineOpen?: boolean;
  onCloseMobileOutline?: () => void;
  isMobileTutorOpen?: boolean;
  onCloseMobileTutor?: () => void;
}

export const DeckViewer: React.FC<DeckViewerProps> = ({
  deck,
  onUpdateDeck,
  onSwitchToPresentation,
  isMobileOutlineOpen = false,
  onCloseMobileOutline = () => {},
  isMobileTutorOpen = false,
  onCloseMobileTutor = () => {},
}) => {
  const [theme, setTheme] = useState<DeckTheme>('obsidian');
  const [activeTutorCard, setActiveTutorCard] = useState<DeckCard | null>(null);
  const [isTutorOpen, setIsTutorOpen] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Sync internal tutor with external mobile tutor trigger
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
              scenario: 'Describe a realistic 3 AM shift dilemma...',
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
                label: 'Core Threshold',
                value: 'Target Metric',
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
    md += `**Target Audience:** ${deck.targetAudience} · **Est. Time:** ${deck.estimatedMinutes} mins\n\n`;
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

  const themeContainerClass =
    theme === 'obsidian'
      ? 'dark bg-slate-950 text-slate-100'
      : theme === 'nordic'
      ? 'dark bg-[#0a1120] text-slate-100'
      : theme === 'sage'
      ? 'bg-[#f4f7f4] text-slate-900'
      : 'bg-[#fafaf9] text-slate-900';

  const cardIcon = (type: DeckCard['cardType']) => {
    switch (type) {
      case 'concept_analogy':
        return <Lightbulb className="w-3.5 h-3.5 text-amber-500" />;
      case 'critical_rules':
        return <ShieldAlert className="w-3.5 h-3.5 text-red-500" />;
      case 'process_steps':
        return <Layers className="w-3.5 h-3.5 text-blue-500" />;
      case 'pitfalls_troubleshooting':
        return <Wrench className="w-3.5 h-3.5 text-amber-500" />;
      case 'scenario_quiz':
        return <HelpCircle className="w-3.5 h-3.5 text-purple-500" />;
      case 'quick_reference':
        return <Bookmark className="w-3.5 h-3.5 text-emerald-500" />;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 pb-28 md:pb-20 ${themeContainerClass}`}>
      {/* Sub-header Controls Bar */}
      <div className="sticky top-14 sm:top-16 z-30 border-b border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 sm:px-6 lg:px-8 py-2 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
          {/* Deck Title Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs truncate shrink-0 max-w-[200px] sm:max-w-md">
            <span className="font-semibold text-amber-600 dark:text-amber-400">
              Training
            </span>
            <span className="text-slate-400">/</span>
            <span className="truncate font-medium text-slate-800 dark:text-slate-200">
              {deck.title}
            </span>
          </div>

          {/* Right Tools: Theme & Export Actions with touch friendly targets */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Theme selector pills */}
            <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
              <button
                onClick={() => setTheme('obsidian')}
                className={`min-h-[36px] px-2.5 rounded transition-colors text-[11px] ${
                  theme === 'obsidian'
                    ? 'bg-slate-900 text-white shadow-sm font-semibold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Dark
              </button>
              <button
                onClick={() => setTheme('clean')}
                className={`min-h-[36px] px-2.5 rounded transition-colors text-[11px] ${
                  theme === 'clean'
                    ? 'bg-white text-slate-950 shadow-sm font-semibold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Light
              </button>
              <button
                onClick={() => setTheme('nordic')}
                className={`hidden sm:block min-h-[36px] px-2.5 rounded transition-colors text-[11px] ${
                  theme === 'nordic'
                    ? 'bg-blue-950 text-blue-200 shadow-sm font-semibold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Nordic
              </button>
            </div>

            {/* Print button */}
            <button
              onClick={handlePrint}
              className="min-h-[38px] min-w-[38px] flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Print Deck or Save to PDF"
              aria-label="Print Deck"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Copy Markdown */}
            <button
              onClick={handleCopyMarkdown}
              className="min-h-[38px] min-w-[38px] flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
              title="Copy Deck as Markdown"
              aria-label="Copy Markdown"
            >
              {copiedNotification ? (
                <Check className="w-4 h-4 text-emerald-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>

            {/* Slide Mode (Desktop) */}
            <button
              onClick={onSwitchToPresentation}
              className="hidden md:flex min-h-[38px] items-center px-3 py-1 text-xs font-semibold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              Slide Mode
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Split layout with Sticky Card TOC & Main Cards Flow */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-5 sm:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Sticky Left Sidebar (Desktop only) */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-32 space-y-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
                <span>Card Outline</span>
                <span className="text-[11px] font-mono">{deck.cards.length} cards</span>
              </div>

              <div className="space-y-1 text-xs">
                <a
                  href="#hero-card"
                  className="flex items-center gap-2 p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="truncate">Overview & Mental Model</span>
                </a>

                {deck.cards.map((card) => (
                  <a
                    key={card.id}
                    href={`#${card.id}`}
                    className="flex items-center gap-2 p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    <span className="shrink-0">{cardIcon(card.cardType)}</span>
                    <span className="truncate">{card.title}</span>
                  </a>
                ))}
              </div>

              {/* Add card */}
              <div className="pt-3 mt-3 border-t border-slate-200 dark:border-slate-800">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Add Card Chunk:
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  <button
                    onClick={() => handleAddCard('concept_analogy')}
                    className="p-1.5 text-left rounded bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-amber-950/40 text-slate-700 dark:text-slate-300 truncate"
                  >
                    + Analogy
                  </button>
                  <button
                    onClick={() => handleAddCard('critical_rules')}
                    className="p-1.5 text-left rounded bg-slate-100 dark:bg-slate-800 hover:bg-red-100 dark:hover:bg-red-950/40 text-slate-700 dark:text-slate-300 truncate"
                  >
                    + Red Lines
                  </button>
                  <button
                    onClick={() => handleAddCard('process_steps')}
                    className="p-1.5 text-left rounded bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-300 truncate"
                  >
                    + Steps
                  </button>
                  <button
                    onClick={() => handleAddCard('scenario_quiz')}
                    className="p-1.5 text-left rounded bg-slate-100 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-950/40 text-slate-700 dark:text-slate-300 truncate"
                  >
                    + Quiz
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Deck Flow Column */}
          <main className="col-span-1 lg:col-span-9 space-y-5 sm:space-y-8">
            {/* 1. Hero Card */}
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

            {/* Completion Card */}
            <div className="p-6 sm:p-8 rounded-2xl border border-dashed border-amber-300 dark:border-amber-800/80 bg-amber-50/30 dark:bg-amber-950/10 text-center">
              <div className="w-11 h-11 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center mx-auto mb-2 font-bold">
                ✓
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1">
                Instructional Mastery Complete
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-4">
                You have reviewed the core Feynman mental models, non-negotiable red lines, execution steps, and active recall checks for this SOP.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
                <button
                  onClick={onSwitchToPresentation}
                  className="w-full sm:w-auto min-h-[44px] px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-sm transition-colors flex items-center justify-center"
                >
                  Review in Slide Presenter Mode
                </button>
                <button
                  onClick={handlePrint}
                  className="w-full sm:w-auto min-h-[44px] px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center"
                >
                  Print Pocket Study Card
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
