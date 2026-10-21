import React from 'react';
import { ArrowRight, Target, Film, Zap, CheckSquare } from 'lucide-react';

interface HomeScreenProps {
  onExplore: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onExplore }) => {
  return (
    <div className="h-screen w-full max-h-screen overflow-hidden bg-black text-white flex flex-col justify-between items-center px-4 sm:px-6 py-4 sm:py-6 selection:bg-neutral-800 selection:text-white font-sans select-none">
      {/* Top Header Bar: Dark grey JANGID Method Engine text */}
      <header className="w-full max-w-5xl flex items-center justify-end shrink-0 pt-1 px-2">
        <div className="text-xs font-medium text-neutral-700 tracking-widest uppercase">
          JANGID Method Engine
        </div>
      </header>

      {/* Center Hero Content (Flex-1 vertically centered) */}
      <main className="flex-1 w-full max-w-lg mx-auto flex flex-col items-center justify-center text-center px-2 py-2 my-auto overflow-hidden">
        {/* Koala Mascot Character (Centered) */}
        <div className="relative group cursor-default flex items-center justify-center shrink-0">
          <div className="absolute -inset-8 bg-white/[0.05] rounded-full blur-3xl group-hover:bg-white/[0.08] transition-all duration-700 pointer-events-none" />
          <img
            src="/assets/aistudio/Glossy Black Chrome Lightning Bolt.png"
            alt="Glossy Black Chrome Lightning Bolt"
            className="relative z-10 w-auto h-auto max-h-[250px] sm:max-h-[320px] md:max-h-[360px] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)] transition-transform duration-500 hover:scale-105 select-none"
            loading="eager"
          />
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-1 mt-4 sm:mt-5 mb-3 sm:mb-4 shrink-0">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-none">
            KOYA
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 font-medium tracking-wide">
            Frontline Trainer
          </p>
        </div>

        {/* 4 Pill Tags in one line: Learn, Watch, Guide, Test */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 shrink-0 flex-nowrap overflow-x-auto max-w-full scrollbar-none px-1">
          <div className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full bg-neutral-900/90 border border-white/10 text-xs font-semibold text-neutral-200 shrink-0">
            <Target className="w-3.5 h-3.5 text-cyan-400" />
            <span>Learn</span>
          </div>

          <div className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full bg-neutral-900/90 border border-white/10 text-xs font-semibold text-neutral-200 shrink-0">
            <Film className="w-3.5 h-3.5 text-indigo-400" />
            <span>Watch</span>
          </div>

          <div className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full bg-neutral-900/90 border border-white/10 text-xs font-semibold text-neutral-200 shrink-0">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Guide</span>
          </div>

          <div className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full bg-neutral-900/90 border border-white/10 text-xs font-semibold text-neutral-200 shrink-0">
            <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
            <span>Test</span>
          </div>
        </div>
      </main>

      {/* Bottom Anchored Action Area: "Tap to explore →" */}
      <footer className="w-full max-w-md mx-auto shrink-0 pb-4 sm:pb-8 pt-2 px-2 flex justify-center">
        <button
          type="button"
          onClick={onExplore}
          className="w-full py-4 px-8 bg-neutral-900/95 hover:bg-neutral-800 border border-white/20 text-white font-semibold text-lg sm:text-xl rounded-full shadow-2xl flex items-center justify-center gap-3 transition-all duration-200 active:scale-95 group cursor-pointer"
          aria-label="Tap to explore"
        >
          <span>Tap to explore</span>
          <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
        </button>
      </footer>
    </div>
  );
};
