import React, { useState } from 'react';
import { Lightbulb } from 'lucide-react';
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
    <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-neutral-950 shadow-2xl p-6 sm:p-10 transition-colors">
      {/* 2-Column Split: Editorial Content + High-Fidelity Visual Stage (No cards-in-cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Editorial Column (7 cols on desktop) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Title & Summary */}
          {isEditingTitle ? (
            <div className="space-y-3">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-2xl font-bold bg-neutral-900 border border-white/10 rounded-xl p-2.5 text-white"
              />
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={3}
                className="w-full text-sm bg-neutral-900 border border-white/10 rounded-xl p-2.5 text-neutral-200"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-2 text-xs font-semibold bg-white text-black rounded-full shadow-sm hover:bg-neutral-200 cursor-pointer"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingTitle(false)}
                  className="px-4 py-2 text-xs text-neutral-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="group">
              <div className="flex items-start justify-between">
                <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight mb-3">
                  {deck.title}
                </h1>
                <button
                  type="button"
                  onClick={() => setIsEditingTitle(true)}
                  className="opacity-0 group-hover:opacity-100 text-xs text-neutral-400 hover:text-white hover:underline px-2 py-1 shrink-0 cursor-pointer"
                >
                  Edit
                </button>
              </div>
              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-2xl font-normal">
                {deck.summary}
              </p>
            </div>
          )}

          {/* The Central Mental Model (Clean unboxed editorial quote block - NO cards-in-cards) */}
          <div className="pt-4 border-t border-white/[0.08] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-400 uppercase tracking-wider">
              <Lightbulb className="w-4 h-4 text-neutral-300" />
              <span>Core Feynman Mental Model</span>
            </div>

            <div className="text-base sm:text-lg font-bold text-white">
              {deck.feynmanCoreConcept.centralAnalogy.title}
            </div>

            <blockquote className="text-xs sm:text-sm text-neutral-200 leading-relaxed italic border-l-2 border-white/40 pl-3">
              "{deck.feynmanCoreConcept.centralAnalogy.analogyText}"
            </blockquote>

            <p className="text-xs text-neutral-400 pt-1">
              <strong className="text-neutral-200 font-semibold">Real-World Application:</strong>{' '}
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
