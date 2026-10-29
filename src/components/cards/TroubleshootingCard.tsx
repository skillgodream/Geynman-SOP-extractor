import React, { useState } from 'react';
import {
  AlertTriangle,
  ScanBarcode,
  Store,
  Tag,
  Calendar,
  Thermometer,
  XCircle,
  CheckCircle2,
  CheckSquare,
  Square,
  ShieldAlert,
  Flame,
  Wrench
} from 'lucide-react';
import { DeckCard, Pitfall } from '../../types/deck';
import { CardToolbar } from '../CardToolbar';

interface TroubleshootingCardProps {
  card: DeckCard;
  deckTitle: string;
  onUpdateCard: (card: DeckCard) => void;
  onDeleteCard: () => void;
  onOpenTutor: (card: DeckCard) => void;
}

export const TroubleshootingCard: React.FC<TroubleshootingCardProps> = ({
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
  const [pitfalls, setPitfalls] = useState<Pitfall[]>(card.pitfalls || []);

  // Checklist state for "RESUME ONLY WHEN"
  const defaultResumeChecklist = [
    { id: '1', label: 'Approved price is confirmed.', checked: false },
    { id: '2', label: 'POS test is successful.', checked: false },
    { id: '3', label: 'Correct label is displayed.', checked: false },
  ];
  const [resumeChecklist, setResumeChecklist] = useState(defaultResumeChecklist);

  const toggleResumeChecklist = (id: string) => {
    setResumeChecklist(prev =>
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
      pitfalls,
    });
  };

  const handlePitfallChange = (index: number, field: keyof Pitfall, val: string) => {
    const updated = [...pitfalls];
    updated[index] = { ...updated[index], [field]: val };
    setPitfalls(updated);
  };

  /**
   * Helper to render adaptive vector icon with Red "X" badge overlay
   */
  const renderIssueIcon = (symptom: string, index: number) => {
    const lower = (symptom + ' ' + deckTitle).toLowerCase();

    let IconComponent = ScanBarcode;
    if (lower.includes('sku') || lower.includes('barcode') || index === 0) {
      IconComponent = ScanBarcode;
    } else if (lower.includes('pos') || lower.includes('register') || lower.includes('checkout') || index === 1) {
      IconComponent = Store;
    } else if (lower.includes('label') || lower.includes('shelf') || lower.includes('tag') || index === 2) {
      IconComponent = Tag;
    } else if (lower.includes('expired') || lower.includes('offer') || lower.includes('promo') || lower.includes('calendar') || index === 3) {
      IconComponent = Calendar;
    } else if (lower.includes('temp') || lower.includes('cold') || lower.includes('fridge')) {
      IconComponent = Thermometer;
    } else {
      IconComponent = AlertTriangle;
    }

    return (
      <div className="relative flex items-center justify-center">
        <IconComponent className="w-9 h-9 sm:w-11 sm:h-11 text-white stroke-[1.5]" />
        <div className="absolute -bottom-1 -right-1 bg-rose-600 rounded-full p-0.5 text-white">
          <XCircle className="w-3.5 h-3.5 fill-rose-600 text-white" />
        </div>
      </div>
    );
  };

  const levelNum = card.levelNumber ?? 3;
  const stopWorkMsg =
    card.stopWorkTrigger || 'if POS price differs from the approved instruction.';

  return (
    <div className="relative rounded-[2rem] border border-white/[0.12] bg-[#0b0f17] shadow-[0_25px_80px_rgba(0,0,0,0.9)] p-6 sm:p-10 transition-all overflow-hidden text-white font-sans">
      
      {/* Header Badge */}
      <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-3">
        <span>LEVEL {levelNum}</span>
        <span>•</span>
        <span>TROUBLESHOOTING</span>
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
        <div className="mb-5">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-1.5 leading-tight">
            {card.title}
          </h2>
          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-normal">
            {card.feynmanExplanation || card.subtitle || 'Stop. Verify. Escalate.'}
          </p>
        </div>
      )}

      {/* Red STOP WORK Banner */}
      <div className="rounded-2xl border border-rose-500/30 bg-rose-950/40 p-4 sm:p-5 flex items-center gap-4 sm:gap-5 mb-6">
        <div className="shrink-0 p-2 sm:p-2.5 rounded-xl bg-rose-500/10 text-rose-500">
          <AlertTriangle className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2]" />
        </div>
        <div className="border-r border-rose-500/30 h-10 shrink-0" />
        <div className="space-y-0.5">
          <div className="text-xs sm:text-sm font-bold text-rose-400 uppercase tracking-wider">
            STOP WORK
          </div>
          <div className="text-xs sm:text-sm text-neutral-200 font-medium">
            {stopWorkMsg}
          </div>
        </div>
      </div>

      {/* Section Divider Header */}
      <div className="text-[11px] font-mono font-bold tracking-wider text-neutral-400 uppercase mb-3">
        COMMON ISSUES AND WHAT TO DO
      </div>

      {/* List of Issue Cards */}
      <div className="space-y-4 mb-6 sm:mb-8">
        {pitfalls.map((pf, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-white/10 bg-neutral-900/60 p-4 sm:p-5 flex items-start sm:items-center gap-4 sm:gap-6 hover:border-rose-500/30 transition-all group"
          >
            {isEditing ? (
              <div className="w-full space-y-2 text-xs">
                <input
                  type="text"
                  value={pf.symptomOrMistake}
                  placeholder="Symptom or Common Mistake"
                  onChange={(e) => handlePitfallChange(idx, 'symptomOrMistake', e.target.value)}
                  className="w-full bg-neutral-900 border border-white/10 p-2 rounded-lg text-white"
                />
                <input
                  type="text"
                  value={pf.rootCause}
                  placeholder="Root Cause / Don't Action"
                  onChange={(e) => handlePitfallChange(idx, 'rootCause', e.target.value)}
                  className="w-full bg-neutral-900 border border-white/10 p-2 rounded-lg text-neutral-300"
                />
                <input
                  type="text"
                  value={pf.immediateFix}
                  placeholder="Immediate Field Fix"
                  onChange={(e) => handlePitfallChange(idx, 'immediateFix', e.target.value)}
                  className="w-full bg-neutral-900 border border-white/10 p-2 rounded-lg text-neutral-300"
                />
              </div>
            ) : (
              <>
                {/* Left zone: Index number + Icon + Divider */}
                <div className="shrink-0 flex items-center gap-3 sm:gap-4 border-r border-white/10 pr-4 sm:pr-6">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-neutral-800 text-neutral-300 font-bold text-xs sm:text-sm flex items-center justify-center shrink-0">
                    {idx + 1}
                  </div>
                  {renderIssueIcon(pf.symptomOrMistake, idx)}
                </div>

                {/* Right block: Title & Red Bullet Points */}
                <div className="flex-1 space-y-2">
                  <div className="text-sm sm:text-base font-bold text-white leading-snug">
                    {pf.symptomOrMistake}
                  </div>

                  <div className="space-y-1">
                    {pf.rootCause && (
                      <div className="flex items-start gap-2 text-xs sm:text-sm text-neutral-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                        <span>{pf.rootCause}</span>
                      </div>
                    )}
                    {pf.immediateFix && (
                      <div className="flex items-start gap-2 text-xs sm:text-sm text-neutral-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                        <span>{pf.immediateFix}</span>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Green "RESUME ONLY WHEN" Checklist Box */}
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-4 border-b border-emerald-500/20 pb-3">
          <div className="p-2 rounded-full bg-emerald-500 text-black shrink-0">
            <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-black fill-emerald-500" />
          </div>
          <div className="border-r border-emerald-500/30 h-8 shrink-0" />
          <div className="text-sm sm:text-base font-bold text-emerald-400 uppercase tracking-wider">
            RESUME ONLY WHEN
          </div>
        </div>

        <div className="space-y-2.5">
          {resumeChecklist.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleResumeChecklist(item.id)}
              className="flex items-center gap-3 w-full text-left text-xs sm:text-sm text-neutral-200 hover:text-white transition-colors cursor-pointer group py-1"
            >
              <div className="shrink-0 text-neutral-400 group-hover:text-emerald-400 transition-colors">
                {item.checked ? (
                  <CheckSquare className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
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
};
