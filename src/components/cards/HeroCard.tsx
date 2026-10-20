import React, { useState } from 'react';
import { Clock, Users, Lightbulb } from 'lucide-react';
import { FeynmanDeck, CardImage } from '../../types/deck';
import { CardVisual } from '../visuals/CardVisual';

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

  const handleUpdateHeroImage = (newImage: CardImage) => {
    onUpdateDeck({
      ...deck,
      heroImage: newImage,
    });
  };

  // Derive domain default schematic from deck title
  const defaultDiagram: CardImage['diagramType'] = deck.title.toLowerCase().includes('cold')
    ? 'cold_chain'
    : deck.title.toLowerCase().includes('clean')
    ? 'cleanroom'
    : deck.title.toLowerCase().includes('incident') || deck.title.toLowerCase().includes('p1')
    ? 'incident_triage'
    : 'flowchart';

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 sm:p-10 transition-colors">
      {/* Decorative top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-400 to-amber-300" />

      {/* 2-Column Split: Editorial Content + High-Fidelity Visual Stage (No cards-in-cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Editorial Column (7 cols on desktop) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Metadata strip (Clean unboxed text with separators per frontend-design skill) */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-amber-600 dark:text-amber-400">
              {deck.originalDocType}
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span className="font-mono tabular-nums">{deck.estimatedMinutes}</span> min study deck
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span>{deck.targetAudience}</span>
            </span>
          </div>

          {/* Title & Summary */}
          {isEditingTitle ? (
            <div className="space-y-3">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-2xl font-bold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-900 dark:text-white"
              />
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={3}
                className="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-slate-700 dark:text-slate-300"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-amber-400 text-slate-950 rounded-lg shadow-sm"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditingTitle(false)}
                  className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="group">
              <div className="flex items-start justify-between">
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight mb-3">
                  {deck.title}
                </h1>
                <button
                  onClick={() => setIsEditingTitle(true)}
                  className="opacity-0 group-hover:opacity-100 text-xs text-amber-600 dark:text-amber-400 hover:underline px-2 py-1 shrink-0"
                >
                  Edit
                </button>
              </div>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                {deck.summary}
              </p>
            </div>
          )}

          {/* The Central Mental Model (Clean unboxed editorial quote block - NO cards-in-cards) */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1.5">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>Core Feynman Mental Model</span>
            </div>

            <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1.5">
              {deck.feynmanCoreConcept.centralAnalogy.title}
            </div>

            <blockquote className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic border-l-2 border-amber-400 pl-3 mb-2">
              "{deck.feynmanCoreConcept.centralAnalogy.analogyText}"
            </blockquote>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              <strong className="text-slate-700 dark:text-slate-300 font-semibold">How this maps to SOP:</strong>{' '}
              {deck.feynmanCoreConcept.centralAnalogy.howItMapsToSOP}
            </p>
          </div>
        </div>

        {/* Right Visual Column (5 cols on desktop): High-Fidelity Diagram / Picture */}
        <div className="lg:col-span-5 w-full">
          <CardVisual
            image={deck.heroImage}
            onUpdateImage={handleUpdateHeroImage}
            defaultDiagram={defaultDiagram}
            titleContext={deck.title}
          />
        </div>
      </div>
    </div>
  );
};
