import React, { useState } from 'react';
import {
  FileCheck,
  ScanBarcode,
  Store,
  AlertTriangle,
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  CheckSquare,
  Square,
  Thermometer,
  Snowflake,
  Clock,
  Database,
  UserCheck,
  Sparkles,
  MessageSquare,
  FileSearch,
  Printer,
  Info,
  X
} from 'lucide-react';
import { DeckCard, CriticalRule } from '../../types/deck';
import { CardToolbar } from '../CardToolbar';

interface CriticalRulesCardProps {
  card: DeckCard;
  deckTitle: string;
  onUpdateCard: (card: DeckCard) => void;
  onDeleteCard: () => void;
  onOpenTutor: (card: DeckCard) => void;
}

export const CriticalRulesCard: React.FC<CriticalRulesCardProps> = ({
  card,
  deckTitle,
  onUpdateCard,
  onDeleteCard,
  onOpenTutor,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(card.title);
  const [subtitle, setSubtitle] = useState(card.subtitle || '');
  const [explanation, setExplanation] = useState(card.feynmanExplanation);
  const [rules, setRules] = useState<CriticalRule[]>(card.criticalRules || []);

  // Determine Card Layout Variant
  const isGoldenRulesCard =
    card.title.toLowerCase().includes('golden rules') ||
    card.title.toLowerCase().includes('controls') ||
    card.title.toLowerCase().includes('non-negotiable') ||
    card.levelNumber === 4;

  const isSetupCard =
    !isGoldenRulesCard &&
    (card.levelNumber === 0 ||
      card.title.toLowerCase().includes('setup') ||
      card.title.toLowerCase().includes('prerequisite') ||
      card.title.toLowerCase().includes('before you') ||
      card.title.toLowerCase().includes('authorization') ||
      card.title.toLowerCase().includes('gate'));

  // Checklist state for Golden Rules "Before you finish"
  const getDynamicChecklist = (ruleItems: CriticalRule[]) => {
    if (ruleItems.length > 0) {
      return ruleItems.map((r, idx) => ({
        id: String(idx + 1),
        label: r.verificationCheck || r.rule,
        checked: false,
      }));
    }
    return [
      { id: '1', label: 'Authorized directive verified', checked: false },
      { id: '2', label: 'Item/SKU parameter verified', checked: false },
      { id: '3', label: 'System status tested', checked: false },
    ];
  };

  const [checklist, setChecklist] = useState(() => getDynamicChecklist(rules));

  // Sync internal state when card prop changes
  React.useEffect(() => {
    setTitle(card.title);
    setSubtitle(card.subtitle || '');
    setExplanation(card.feynmanExplanation);
    setRules(card.criticalRules || []);
    setChecklist(getDynamicChecklist(card.criticalRules || []));
  }, [card]);

  const toggleChecklist = (id: string) => {
    setChecklist(prev =>
      prev.map(item => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleSave = () => {
    setIsEditing(false);
    onUpdateCard({
      ...card,
      title,
      subtitle,
      feynmanExplanation: explanation,
      criticalRules: rules,
    });
  };

  const handleRuleChange = (index: number, field: keyof CriticalRule, val: string) => {
    const updated = [...rules];
    updated[index] = { ...updated[index], [field]: val };
    setRules(updated);
  };

  // Rule Text Parser
  const parseRuleText = (ruleText: string, index: number) => {
    let titleStr = '';
    let bodyStr = ruleText;

    if (ruleText.includes(':')) {
      const parts = ruleText.split(':');
      titleStr = parts[0].trim();
      bodyStr = parts.slice(1).join(':').trim();
    } else {
      const lower = ruleText.toLowerCase();

      if (lower.includes('confirm official') || lower.includes('instruction') || lower.includes('channel')) {
        titleStr = 'Confirm official instruction';
      } else if (lower.includes('verify the directive') || lower.includes('check document') || lower.includes('sign-off')) {
        titleStr = 'Verify the directive';
      } else if (lower.includes('confirm before printing') || lower.includes('print') || lower.includes('shelf tags')) {
        titleStr = 'Confirm before printing';
      } else if (lower.includes('authoriz') || lower.includes('approved')) {
        titleStr = 'AUTHORIZATION';
      } else if (lower.includes('sku') || lower.includes('barcode')) {
        titleStr = 'SKU MATCH';
      } else if (lower.includes('pos') || lower.includes('checkout')) {
        titleStr = 'POS FIRST';
      } else if (lower.includes('exception') || lower.includes('escalat')) {
        titleStr = 'EXCEPTIONS';
      } else {
        const cleanRule = ruleText.replace(/^(MUST|NEVER|ALWAYS)\s+(do\s+)?/i, '');
        const words = cleanRule.split(' ').filter(w => w.length > 2);
        titleStr = words.slice(0, 3).join(' ');
      }
    }

    titleStr = titleStr.replace(/^(MUST|NEVER)\s+/i, '');
    if (!titleStr) titleStr = `Step ${index + 1}`;

    return { title: titleStr, body: bodyStr };
  };

  /**
   * Adaptive Icon Resolver for Level 0 Setup Steps
   */
  const renderSetupStepIcon = (text: string, index: number) => {
    const lower = text.toLowerCase();

    if (lower.includes('channel') || lower.includes('verbal') || lower.includes('communication') || lower.includes('instruction') || index === 0) {
      return <MessageSquare className="w-6 h-6 text-white stroke-[1.5]" />;
    }
    if (lower.includes('document') || lower.includes('directive') || lower.includes('sign-off') || lower.includes('verify') || index === 1) {
      return <FileSearch className="w-6 h-6 text-white stroke-[1.5]" />;
    }
    if (lower.includes('print') || lower.includes('tag') || lower.includes('label') || index === 2) {
      return <Printer className="w-6 h-6 text-white stroke-[1.5]" />;
    }

    return <ShieldCheck className="w-6 h-6 text-white stroke-[1.5]" />;
  };

  /**
   * Multi-Domain Semantic Adaptive Icon Engine for Level 4 Golden Rules
   */
  const renderAdaptiveIcon = (ruleText: string, index: number) => {
    const lower = (ruleText + ' ' + deckTitle).toLowerCase();

    if (lower.includes('temp') || lower.includes('cold') || lower.includes('fridge') || lower.includes('2°c') || lower.includes('8°c')) {
      return (
        <div className="relative">
          <Thermometer className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-400 stroke-[1.5]" />
          <div className="absolute -bottom-1 -right-1 bg-cyan-500/20 rounded-full p-0.5 text-cyan-400 border border-cyan-400/40">
            <Snowflake className="w-3.5 h-3.5 text-cyan-300" />
          </div>
        </div>
      );
    }
    if (lower.includes('authoriz') || lower.includes('approved') || lower.includes('directive') || lower.includes('sign-off')) {
      return (
        <div className="relative">
          <FileCheck className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-400 stroke-[1.5]" />
          <div className="absolute -bottom-1 -right-1 bg-cyan-500 rounded-full p-0.5 text-black">
            <CheckCircle2 className="w-3.5 h-3.5 text-black fill-cyan-400" />
          </div>
        </div>
      );
    }
    if (lower.includes('sku') || lower.includes('barcode') || lower.includes('relabel') || lower.includes('scan')) {
      return (
        <div className="relative">
          <ScanBarcode className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-400 stroke-[1.5]" />
        </div>
      );
    }
    if (lower.includes('pos') || lower.includes('checkout') || lower.includes('register') || lower.includes('price')) {
      return (
        <div className="relative">
          <Store className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-400 stroke-[1.5]" />
        </div>
      );
    }
    if (lower.includes('sterile') || lower.includes('glove') || lower.includes('cleanroom') || lower.includes('sanitize')) {
      return (
        <div className="relative">
          <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-400 stroke-[1.5]" />
        </div>
      );
    }
    if (lower.includes('exception') || lower.includes('escalat') || lower.includes('differ') || lower.includes('never')) {
      return (
        <div className="relative">
          <AlertTriangle className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-400 stroke-[1.5]" />
        </div>
      );
    }

    return <ShieldCheck className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-400 stroke-[1.5]" />;
  };

  const levelNum = card.levelNumber ?? (isGoldenRulesCard ? 4 : 0);

  // Extract Never Do & Must Do items dynamically from card data
  const neverDoRule = rules.find(r => r.type === 'never_do') || {
    type: 'never_do' as const,
    rule: card.stopWorkTrigger || rules[0]?.rule || 'Do not proceed without proper authorization or verification.',
    consequenceOfFailure: rules[0]?.consequenceOfFailure || card.feynmanExplanation || 'Ensures process integrity and compliance.',
    verificationCheck: rules[0]?.verificationCheck || 'Verification complete'
  };

  const mustDoRules = rules.filter(r => r.type !== 'never_do');
  const mainConsequence = rules[0]?.consequenceOfFailure || card.feynmanExplanation || 'Guarantees operational baseline tolerance and safety compliance.';
  const keyRuleText =
    rules.find(r => r.type === 'must_do')?.rule ||
    rules[0]?.rule ||
    card.subtitle ||
    'Mandatory authorization required before execution.';

  // --- VARIANT 1: LEVEL 0 AUTHORIZATION & VERIFICATION / SETUP SCREEN ---
  if (isSetupCard) {
    return (
      <div className="relative rounded-[2rem] border border-white/[0.12] bg-[#0b0f17] shadow-[0_25px_80px_rgba(0,0,0,0.9)] p-6 sm:p-10 transition-all overflow-hidden text-white font-sans">
        {/* Top Header Badge */}
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-3">
          <span>LEVEL {levelNum}</span>
          <span>•</span>
          <span>SETUP</span>
        </div>

        {isEditing ? (
          <div className="space-y-3 mb-6">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xl font-bold bg-neutral-900 border border-white/10 rounded-xl p-2.5 text-white"
            />
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full text-xs bg-neutral-900 border border-white/10 rounded-xl p-2 text-neutral-400"
            />
            <textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              rows={2}
              className="w-full text-sm bg-neutral-900 border border-white/10 rounded-xl p-2 text-neutral-200"
            />
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 text-xs font-semibold bg-cyan-400 text-black rounded-full shadow-sm hover:bg-cyan-300 cursor-pointer"
            >
              Save Card Changes
            </button>
          </div>
        ) : (
          <div className="mb-6">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-1 leading-tight">
              {card.title}
            </h2>
            <div className="text-xs sm:text-sm font-semibold text-neutral-400 mb-2 capitalize">
              {card.subtitle || 'Authorization & verification'}
            </div>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
              {card.feynmanExplanation}
            </p>
          </div>
        )}

        {/* Hero Cyan KEY RULE Box */}
        <div className="rounded-2xl border border-cyan-500/40 bg-cyan-950/30 p-4 sm:p-5 flex items-center gap-4 sm:gap-5 mb-5">
          <div className="shrink-0 relative">
            <FileCheck className="w-9 h-9 sm:w-11 sm:h-11 text-cyan-400 stroke-[1.5]" />
            <div className="absolute -bottom-1 -right-1 bg-cyan-500 rounded-full p-0.5 text-black">
              <CheckCircle2 className="w-3.5 h-3.5 text-black fill-cyan-400" />
            </div>
          </div>
          <div className="border-r border-cyan-500/30 h-10 shrink-0" />
          <div className="space-y-0.5">
            <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              KEY RULE
            </div>
            <div className="text-sm sm:text-lg font-extrabold text-white leading-snug">
              {keyRuleText}
            </div>
          </div>
        </div>

        {/* Numbered Verification Steps */}
        <div className="space-y-3 mb-5">
          {mustDoRules.map((r, idx) => {
            const { title: stepTitle, body: stepBody } = parseRuleText(r.rule, idx);
            return (
              <div
                key={idx}
                className="rounded-2xl border border-white/10 bg-neutral-900/60 p-4 sm:p-5 flex items-center gap-4 sm:gap-6 hover:border-cyan-500/30 transition-all group"
              >
                <div className="shrink-0 flex items-center gap-3 sm:gap-4 border-r border-white/10 pr-4 sm:pr-6">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-neutral-800 text-neutral-300 font-bold text-xs sm:text-sm flex items-center justify-center shrink-0">
                    {idx + 1}
                  </div>
                  {renderSetupStepIcon(r.rule, idx)}
                </div>

                <div className="flex-1 space-y-0.5">
                  <div className="text-sm sm:text-base font-bold text-white leading-snug">
                    {stepTitle}
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-normal">
                    {stepBody}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Red NEVER DO Banner */}
        <div className="rounded-2xl border border-rose-500/30 bg-rose-950/40 p-4 sm:p-5 flex items-center gap-4 sm:gap-5 mb-4">
          <div className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-rose-500 text-black flex items-center justify-center font-extrabold">
            <X className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />
          </div>
          <div className="border-r border-rose-500/30 h-10 shrink-0" />
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-rose-400 uppercase tracking-wider">
              NEVER DO
            </div>
            <div className="text-xs sm:text-sm font-bold text-white leading-snug">
              {neverDoRule.rule.replace(/^(NEVER\s+DO|NEVER):\s*/i, '')}
            </div>
          </div>
        </div>

        {/* Bottom "Why it matters:" Rationale Box */}
        <div className="rounded-2xl border border-white/10 bg-neutral-900/60 p-4 sm:p-5 flex items-start gap-4 mb-6">
          <div className="shrink-0 p-1 rounded-full border border-neutral-400 text-neutral-300 mt-0.5">
            <Info className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="border-r border-white/10 h-8 shrink-0" />
          <div className="space-y-0.5">
            <div className="text-xs sm:text-sm font-bold text-white">
              Why it matters:
            </div>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-normal">
              {mainConsequence}
            </p>
          </div>
        </div>

        {/* Toolbar */}
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
  }

  // --- VARIANT 2: LEVEL 4 GOLDEN RULES / CONTROLS SCREEN ---
  if (isGoldenRulesCard) {
    return (
      <div className="relative rounded-[2rem] border border-white/[0.12] bg-[#0b0f17] shadow-[0_25px_80px_rgba(0,0,0,0.9)] p-6 sm:p-10 transition-all overflow-hidden text-white font-sans">
        {/* Header Badge */}
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-3">
          <span>LEVEL {levelNum}</span>
          <span>•</span>
          <span>{card.badgeText || card.subtitle?.toUpperCase() || 'NON-NEGOTIABLE CONTROLS'}</span>
        </div>

        {isEditing ? (
          <div className="space-y-3 mb-6">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xl font-bold bg-neutral-900 border border-white/10 rounded-xl p-2.5 text-white"
            />
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full text-xs bg-neutral-900 border border-white/10 rounded-xl p-2 text-neutral-400"
            />
            <textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              rows={2}
              className="w-full text-sm bg-neutral-900 border border-white/10 rounded-xl p-2 text-neutral-200"
            />
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 text-xs font-semibold bg-cyan-400 text-black rounded-full shadow-sm hover:bg-cyan-300 cursor-pointer"
            >
              Save Card Changes
            </button>
          </div>
        ) : (
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-1.5 leading-tight">
              {card.title}
            </h2>
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-normal">
              {card.feynmanExplanation || card.subtitle || 'Controls every associate must follow.'}
            </p>
          </div>
        )}

        {/* Adaptive Icon-Based Rule Cards */}
        <div className="space-y-4 mb-6 sm:mb-8">
          {rules.map((rule, idx) => {
            const { title: ruleTitle, body: ruleBody } = parseRuleText(rule.rule, idx);
            const stepNum = String(idx + 1).padStart(2, '0');

            return (
              <div
                key={idx}
                className="rounded-2xl border border-white/10 bg-neutral-900/60 p-4 sm:p-5 flex items-center gap-4 sm:gap-6 hover:border-cyan-500/30 transition-all group"
              >
                {isEditing ? (
                  <div className="w-full space-y-2 text-xs">
                    <div className="flex gap-2">
                      <select
                        value={rule.type}
                        onChange={(e) => handleRuleChange(idx, 'type', e.target.value as any)}
                        className="bg-neutral-900 border border-white/10 p-1.5 rounded-lg text-white font-semibold"
                      >
                        <option value="never_do">NEVER DO</option>
                        <option value="must_do">MUST DO</option>
                        <option value="warning">WARNING</option>
                      </select>
                      <input
                        type="text"
                        value={rule.rule}
                        onChange={(e) => handleRuleChange(idx, 'rule', e.target.value)}
                        className="flex-1 bg-neutral-900 border border-white/10 p-1.5 rounded-lg text-white font-medium"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="shrink-0 w-16 sm:w-20 flex items-center justify-center border-r border-white/10 pr-4 sm:pr-6">
                      {renderAdaptiveIcon(rule.rule, idx)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="text-cyan-400 font-mono text-xs font-bold tracking-wider">
                        {stepNum}
                      </div>
                      <div className="text-sm sm:text-base font-bold text-white uppercase tracking-wide">
                        {ruleTitle}
                      </div>
                      <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
                        {ruleBody}
                      </p>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Dynamic "Before you finish" Checklist Box */}
        <div className="rounded-2xl border border-white/10 bg-neutral-900/40 p-5 sm:p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
              <ClipboardCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                Before you finish
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 font-normal">
                Check all items below.
              </p>
            </div>
          </div>

          <div className="border-t border-white/10 pt-3 space-y-2.5">
            {checklist.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleChecklist(item.id)}
                className="flex items-center gap-3 w-full text-left text-xs sm:text-sm text-neutral-200 hover:text-white transition-colors cursor-pointer group py-1"
              >
                <div className="shrink-0 text-neutral-400 group-hover:text-cyan-400 transition-colors">
                  {item.checked ? (
                    <CheckSquare className="w-5 h-5 text-cyan-400 fill-cyan-400/20" />
                  ) : (
                    <Square className="w-5 h-5 text-neutral-500" />
                  )}
                </div>
                <span className={item.checked ? 'line-through text-neutral-400' : 'font-medium'}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Toolbar */}
        <div className="mt-6">
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
      </div>
    );
  }

  // --- VARIANT 3: STANDARD FALLBACK ---
  return (
    <div className="relative rounded-[2rem] border border-white/[0.12] bg-gradient-to-b from-rose-500/[0.08] via-neutral-950 to-neutral-950 shadow-[0_25px_80px_rgba(0,0,0,0.9)] p-6 sm:p-10 transition-all overflow-hidden text-white font-sans">
      <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-rose-400 mb-3">
        <span>LEVEL {levelNum}</span>
        <span>•</span>
        <span>CRITICAL RULES</span>
      </div>

      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-1.5 leading-tight">
          {card.title}
        </h2>
        <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-normal max-w-3xl">
          {card.feynmanExplanation}
        </p>
      </div>

      <div className="divide-y divide-white/[0.08] mb-6">
        {rules.map((rule, idx) => (
          <div key={idx} className="py-4 text-xs sm:text-sm text-neutral-200">
            {rule.rule}
          </div>
        ))}
      </div>

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
