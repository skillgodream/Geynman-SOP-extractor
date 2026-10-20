import React, { useState } from 'react';
import { Clock, Users, FileCheck, Lightbulb, Sparkles, BookOpen } from 'lucide-react';
import { FeynmanDeck } from '../../types/deck';

interface HeroCardProps {
  deck: FeynmanDeck;
  onUpdateDeck: (updated: FeynmanDeck) => void;
}

export const HeroCard: React.FC<HeroCardProps> = ({ deck, onUpdateDeck }) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(deck.title);
  const [summary, setSummary] = useState(deck.summary);

  const handleSave = () => {
    setIsEditingTitle(false);
    onUpdateDeck({
      ...deck,
      title,
      summary,
    });
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 sm:p-8 transition-colors">
      {/* Decorative top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-400 to-amber-300" />

      {/* Metadata strip (Clean unboxed text with separators per frontend-design skill) */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-4">
        <span className="font-semibold text-amber-600 dark:text-amber-400">
          {deck.originalDocType}
        </span>
        <span aria-hidden="true">·</span>
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          <span>{deck.estimatedMinutes} min study deck</span>
        </span>
        <span aria-hidden="true">·</span>
        <span className="flex items-center gap-1">
          <Users className="w-3.5 h-3.5" />
          <span>{deck.targetAudience}</span>
        </span>
      </div>

      {/* Main Title & Summary */}
      {isEditingTitle ? (
        <div className="space-y-3 mb-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-2xl font-bold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white"
          />
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={3}
            className="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-slate-700 dark:text-slate-300"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-3 py-1 text-xs font-semibold bg-amber-400 text-slate-950 rounded-md"
            >
              Save Changes
            </button>
            <button
              onClick={() => setIsEditingTitle(false)}
              className="px-3 py-1 text-xs text-slate-500 hover:text-slate-700"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-6 group">
          <div className="flex items-start justify-between">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight mb-2">
              {deck.title}
            </h1>
            <button
              onClick={() => setIsEditingTitle(true)}
              className="opacity-0 group-hover:opacity-100 text-xs text-amber-600 dark:text-amber-400 hover:underline px-2 py-1"
            >
              Edit Overview
            </button>
          </div>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
            {deck.summary}
          </p>
        </div>
      )}

      {/* Central Feynman Mental Model Spotlight */}
      <div className="rounded-xl border border-amber-200/80 dark:border-amber-900/40 bg-gradient-to-br from-amber-50/60 to-orange-50/30 dark:from-amber-950/20 dark:to-orange-950/10 p-5 sm:p-6">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider mb-2">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <span>The Core Mental Model (Feynman Simplification)</span>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
          {deck.feynmanCoreConcept.centralAnalogy.title}
        </h3>

        <div className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-normal mb-4">
          "{deck.feynmanCoreConcept.centralAnalogy.analogyText}"
        </div>

        <div className="pt-3 border-t border-amber-200/60 dark:border-amber-900/40 flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400">
          <span className="font-semibold text-amber-800 dark:text-amber-300 shrink-0">
            How this maps to reality:
          </span>
          <span>{deck.feynmanCoreConcept.centralAnalogy.howItMapsToSOP}</span>
        </div>
      </div>
    </div>
  );
};
