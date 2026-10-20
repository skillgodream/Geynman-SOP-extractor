import React from 'react';
import {
  ArrowLeft,
  Layers,
  Film,
  HelpCircle,
  Award,
  Presentation,
  ArrowRight
} from 'lucide-react';
import { FeynmanDeck, AppViewMode } from '../types/deck';

interface DemoDecksScreenProps {
  decks: FeynmanDeck[];
  onBackToExplore: () => void;
  onOpenUpload: () => void;
  onSelectDeck: (deck: FeynmanDeck, initialView?: AppViewMode) => void;
}

export const DemoDecksScreen: React.FC<DemoDecksScreenProps> = ({
  decks,
  onBackToExplore,
  onSelectDeck,
}) => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans antialiased selection:bg-neutral-800 selection:text-white">
      {/* Top Apple Minimalist Header — Clean Back Button Only, NO '+' icon, NO SOP text */}
      <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-black/85 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToExplore}
            className="min-h-[44px] flex items-center gap-1.5 text-xs font-medium text-neutral-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Back to Explore"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Explore</span>
          </button>

          <span className="text-xs font-semibold tracking-tight text-white uppercase font-mono">
            Demo & Created Decks
          </span>

          <div className="w-12" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col">
        {/* Title Header */}
        <div className="text-center mb-8 space-y-2">
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
            Explore Training Decks
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
            Real-world operational expertise transformed into intuitive visual cards.
          </p>
        </div>

        {/* Decks Grid / List */}
        <div className="w-full">
          <div className="divide-y divide-white/[0.08] border border-white/[0.08] bg-neutral-950 rounded-3xl overflow-hidden shadow-2xl">
            {decks.map((deck) => (
              <div
                key={deck.id}
                className="p-5 sm:p-7 hover:bg-neutral-900/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-5 group"
              >
                {/* Deck Info */}
                <div className="space-y-2 max-w-xl">
                  {deck.tags && deck.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
                      {deck.tags.map((t: string, i: number) => (
                        <span
                          key={i}
                          className="text-[10px] text-neutral-400 px-2 py-0.5 rounded-md bg-neutral-900 border border-white/5 font-mono"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}

                  <h2
                    onClick={() => onSelectDeck(deck, 'outline')}
                    className="text-lg sm:text-xl font-bold text-white group-hover:text-neutral-200 cursor-pointer transition-colors leading-snug"
                  >
                    {deck.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-neutral-400 line-clamp-2 leading-relaxed">
                    {deck.summary}
                  </p>
                </div>

                {/* 1-Tap Action Triggers */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0 pt-2 md:pt-0">
                  {/* Card Outline — the first page of any training deck */}
                  <button
                    type="button"
                    onClick={() => onSelectDeck(deck, 'outline')}
                    className="min-h-[44px] px-4 py-2 bg-white hover:bg-neutral-200 text-black text-xs font-semibold rounded-full flex items-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Card Outline</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {/* Slide View directly on deck card */}
                  <button
                    type="button"
                    onClick={() => onSelectDeck(deck, 'presentation')}
                    className="min-h-[44px] px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-white/10 text-xs font-medium rounded-full flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Start Slide View"
                  >
                    <Presentation className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Slide View</span>
                  </button>

                  {/* Video — soft sky blue icon */}
                  <button
                    type="button"
                    onClick={() => onSelectDeck(deck, 'show_me')}
                    className="min-h-[44px] px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-white/10 text-xs font-medium rounded-full flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Watch Walkthrough"
                  >
                    <Film className="w-3.5 h-3.5 text-sky-300" />
                    <span>Video</span>
                  </button>

                  {/* Guide Me — soft amber icon */}
                  <button
                    type="button"
                    onClick={() => onSelectDeck(deck, 'guide_me')}
                    className="min-h-[44px] px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-white/10 text-xs font-medium rounded-full flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Interactive Dilemmas"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-amber-300" />
                    <span>Guide Me</span>
                  </button>

                  {/* Test Me — soft mint/emerald icon */}
                  <button
                    type="button"
                    onClick={() => onSelectDeck(deck, 'test_me')}
                    className="min-h-[44px] px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-white/10 text-xs font-medium rounded-full flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Take Assessment Test"
                  >
                    <Award className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Test Me</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
