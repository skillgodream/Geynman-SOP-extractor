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
  Flame,
  Clock,
  Timer,
  Database,
  RefreshCw,
  UserCheck,
  QrCode,
  Sparkles,
  ShieldAlert
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

  // Is this a Golden Rules / Non-negotiable Controls card?
  const isGoldenRulesCard =
    card.title.toLowerCase().includes('golden rules') ||
    card.title.toLowerCase().includes('controls') ||
    card.title.toLowerCase().includes('non-negotiable') ||
    card.levelNumber === 4;

  // Dynamically generate default checklist items from verification checks of each rule
  const initialChecklist = rules.map((r, idx) => ({
    id: String(idx + 1),
    label: r.verificationCheck || r.rule.slice(0, 45),
    checked: false,
  }));

  const [checklist, setChecklist] = useState(
    initialChecklist.length > 0
      ? initialChecklist
      : [
          { id: '1', label: 'Approved directive verified', checked: false },
          { id: '2', label: 'Item/SKU parameter verified', checked: false },
          { id: '3', label: 'System status tested', checked: false },
        ]
  );

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

  /**
   * Adaptive Rule Text & Title Parser
   * Extracts clean uppercase titles regardless of the SOP domain!
   */
  const parseRuleText = (ruleText: string, index: number) => {
    let titleStr = '';
    let bodyStr = ruleText;

    if (ruleText.includes(':')) {
      const parts = ruleText.split(':');
      titleStr = parts[0].trim();
      bodyStr = parts.slice(1).join(':').trim();
    } else {
      const lower = ruleText.toLowerCase();

      // Retail / Pricing Domain
      if (lower.includes('authoriz') || lower.includes('approved') || lower.includes('directive')) {
        titleStr = 'AUTHORIZATION';
      } else if (lower.includes('sku') || lower.includes('barcode') || lower.includes('relabel')) {
        titleStr = 'SKU MATCH';
      } else if (lower.includes('pos') || lower.includes('checkout') || lower.includes('register')) {
        titleStr = 'POS FIRST';
      } else if (lower.includes('exception') || lower.includes('escalat') || lower.includes('differ')) {
        titleStr = 'EXCEPTIONS';
      }
      // Cold Chain / Pharma Domain
      else if (lower.includes('temp') || lower.includes('2°c') || lower.includes('8°c') || lower.includes('cold')) {
        titleStr = 'TEMPERATURE BOUNDARY';
      } else if (lower.includes('quarantine') || lower.includes('isolate') || lower.includes('discard')) {
        titleStr = 'QUARANTINE ISOLATION';
      } else if (lower.includes('log') || lower.includes('minute') || lower.includes('ticket')) {
        titleStr = 'INCIDENT LOGGING';
      }
      // Cleanroom / Sterility Domain
      else if (lower.includes('sterile') || lower.includes('glove') || lower.includes('gown')) {
        titleStr = 'STERILE PROTOCOL';
      } else if (lower.includes('cleanroom') || lower.includes('touch') || lower.includes('ipa')) {
        titleStr = 'SANIZATION';
      }
      // Generic Fallback Header Extractor
      else {
        const cleanRule = ruleText.replace(/^(MUST|NEVER|ALWAYS)\s+(do\s+)?/i, '');
        const words = cleanRule.split(' ').filter(w => w.length > 2);
        titleStr = words.slice(0, 2).join(' ').toUpperCase();
      }
    }

    titleStr = titleStr.replace(/^(MUST|NEVER)\s+/i, '').toUpperCase();
    if (!titleStr) titleStr = `RULE ${index + 1}`;

    return { title: titleStr, body: bodyStr };
  };

  /**
   * Multi-Domain Semantic Adaptive Icon Engine
   * Dynamically adapts the icon to the uploaded SOP's domain context!
   */
  const renderAdaptiveIcon = (ruleText: string, index: number) => {
    const lower = (ruleText + ' ' + deckTitle).toLowerCase();

    // 1. Temperature & Cold Chain Domain
    if (lower.includes('temp') || lower.includes('cold') || lower.includes('fridge') || lower.includes('2°c') || lower.includes('8°c') || lower.includes('freeze')) {
      return (
        <div className="relative">
          <Thermometer className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-400 stroke-[1.5]" />
          <div className="absolute -bottom-1 -right-1 bg-cyan-500/20 rounded-full p-0.5 text-cyan-400 border border-cyan-400/40">
            <Snowflake className="w-3.5 h-3.5 text-cyan-300" />
          </div>
        </div>
      );
    }

    // 2. Authorization, Approvals & Directives
    if (lower.includes('authoriz') || lower.includes('approved') || lower.includes('directive') || lower.includes('permit') || lower.includes('sign-off')) {
      return (
        <div className="relative">
          <FileCheck className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-400 stroke-[1.5]" />
          <div className="absolute -bottom-1 -right-1 bg-cyan-500 rounded-full p-0.5 text-black">
            <CheckCircle2 className="w-3.5 h-3.5 text-black fill-cyan-400" />
          </div>
        </div>
      );
    }

    // 3. Barcode, SKU, Labels & Scanning
    if (lower.includes('sku') || lower.includes('barcode') || lower.includes('relabel') || lower.includes('scan') || lower.includes('tag')) {
      return (
        <div className="relative">
          <ScanBarcode className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-400 stroke-[1.5]" />
        </div>
      );
    }

    // 4. POS, Cashier, Pricing & Checkout
    if (lower.includes('pos') || lower.includes('checkout') || lower.includes('register') || lower.includes('cash') || lower.includes('price')) {
      return (
        <div className="relative">
          <Store className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-400 stroke-[1.5]" />
        </div>
      );
    }

    // 5. Cleanroom, Sterility, Hygiene & IPA
    if (lower.includes('sterile') || lower.includes('glove') || lower.includes('cleanroom') || lower.includes('sanitize') || lower.includes('mask')) {
      return (
        <div className="relative">
          <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-400 stroke-[1.5]" />
        </div>
      );
    }

    // 6. Database, Servers, Networks & IT Sync
    if (lower.includes('database') || lower.includes('server') || lower.includes('network') || lower.includes('sync') || lower.includes('system')) {
      return (
        <div className="relative">
          <Database className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-400 stroke-[1.5]" />
        </div>
      );
    }

    // 7. Time, Speed & Timers
    if (lower.includes('minute') || lower.includes('hour') || lower.includes('time') || lower.includes('clock') || lower.includes('delay')) {
      return (
        <div className="relative">
          <Clock className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-400 stroke-[1.5]" />
        </div>
      );
    }

    // 8. Exceptions, Hazards, Escalations & Alerts
    if (lower.includes('exception') || lower.includes('escalat') || lower.includes('differ') || lower.includes('hazard') || lower.includes('warn') || lower.includes('never')) {
      return (
        <div className="relative">
          <AlertTriangle className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-400 stroke-[1.5]" />
        </div>
      );
    }

    // 9. Supervisor & User Verification
    if (lower.includes('supervisor') || lower.includes('manager') || lower.includes('operator') || lower.includes('role')) {
      return (
        <div className="relative">
          <UserCheck className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-400 stroke-[1.5]" />
        </div>
      );
    }

    // Default Fallback
    return <ShieldCheck className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-400 stroke-[1.5]" />;
  };

  const levelNum = card.levelNumber ?? (isGoldenRulesCard ? 4 : 0);
  const categoryText = card.subtitle
    ? card.subtitle.toUpperCase()
    : isGoldenRulesCard
    ? 'GOLDEN RULES & CONTROLS'
    : 'PREREQUISITES';

  // --- RENDER GOLDEN RULES / CONTROLS CARD ---
  if (isGoldenRulesCard) {
    return (
      <div className="relative rounded-[2rem] border border-white/[0.12] bg-[#0b0f17] shadow-[0_25px_80px_rgba(0,0,0,0.9)] p-6 sm:p-10 transition-all overflow-hidden text-white font-sans">
        {/* Header Badge */}
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-3">
          <span>LEVEL {levelNum}</span>
          <span>•</span>
          <span>{categoryText}</span>
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

  // --- RENDER STANDARD PREREQUISITES / CRITICAL RULES CARD ---
  return (
    <div className="relative rounded-[2rem] border border-white/[0.12] bg-gradient-to-b from-rose-500/[0.08] via-neutral-950 to-neutral-950 shadow-[0_25px_80px_rgba(0,0,0,0.9)] p-6 sm:p-10 transition-all overflow-hidden text-white font-sans">
      {/* Header Badge */}
      <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-rose-400 mb-3">
        <span>LEVEL {levelNum}</span>
        <span>•</span>
        <span>{categoryText}</span>
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
            className="px-4 py-2 text-xs font-semibold bg-white text-black rounded-full shadow-sm hover:bg-neutral-200 cursor-pointer"
          >
            Save Card Changes
          </button>
        </div>
      ) : (
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-1.5 leading-tight">
            {card.title}
          </h2>
          {card.subtitle && (
            <p className="text-xs sm:text-sm text-neutral-400 mb-2 font-medium">
              {card.subtitle}
            </p>
          )}
          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-normal max-w-3xl">
            {card.feynmanExplanation}
          </p>
        </div>
      )}

      {/* Rules List for Prerequisites */}
      <div className="divide-y divide-white/[0.08] mb-6">
        {rules.map((rule, idx) => {
          const isNever = rule.type === 'never_do';
          const isMust = rule.type === 'must_do';

          return (
            <div key={idx} className="py-4 sm:py-5 first:pt-0 last:pb-0">
              {isEditing ? (
                <div className="space-y-2 text-xs">
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
                  <input
                    type="text"
                    value={rule.consequenceOfFailure}
                    placeholder="Consequence of Failure"
                    onChange={(e) => handleRuleChange(idx, 'consequenceOfFailure', e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 p-1.5 rounded-lg text-red-400"
                  />
                  <input
                    type="text"
                    value={rule.verificationCheck}
                    placeholder="Verification Check"
                    onChange={(e) => handleRuleChange(idx, 'verificationCheck', e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 p-1.5 rounded-lg text-neutral-400"
                  />
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 sm:gap-6">
                  {/* Left: Rule Type Tag */}
                  <div className="shrink-0 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
                    {isNever ? (
                      <span className="text-rose-400 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20">
                        <XCircle className="w-3.5 h-3.5 text-rose-400" />
                        <span>NEVER DO</span>
                      </span>
                    ) : isMust ? (
                      <span className="text-emerald-400 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>MUST DO</span>
                      </span>
                    ) : (
                      <span className="text-amber-400 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        <span>CRITICAL</span>
                      </span>
                    )}
                  </div>

                  {/* Middle: The Rule Text & Details */}
                  <div className="flex-1 space-y-1.5">
                    <div className="text-sm sm:text-base font-bold text-white leading-snug">
                      {rule.rule}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs pt-1">
                      <div className="text-rose-300 leading-relaxed font-normal bg-rose-500/5 p-2 rounded-xl border border-rose-500/10">
                        <strong className="font-semibold text-rose-200">Failure Risk:</strong> {rule.consequenceOfFailure}
                      </div>
                      <div className="text-neutral-300 leading-relaxed flex items-baseline gap-1.5 font-normal bg-white/[0.03] p-2 rounded-xl border border-white/[0.08]">
                        <CheckSquare className="w-3.5 h-3.5 text-neutral-400 shrink-0 translate-y-0.5" />
                        <span>
                          <strong className="text-white font-semibold">Verification Check:</strong>{' '}
                          {rule.verificationCheck}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
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
};
