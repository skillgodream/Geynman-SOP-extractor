import React from 'react';
import { Sparkles } from 'lucide-react';

interface FloatingAskTutorButtonProps {
  onClick: () => void;
}

export const FloatingAskTutorButton: React.FC<FloatingAskTutorButtonProps> = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 group flex items-center gap-2.5 px-4 py-3 rounded-full bg-neutral-900/95 border border-white/20 text-white shadow-2xl backdrop-blur-xl hover:bg-neutral-800 hover:border-white/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
      aria-label="Ask Feynman AI Tutor"
      title="Ask Feynman AI Tutor about this training deck"
    >
      <div className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center font-bold shadow-md group-hover:rotate-12 transition-transform">
        <Sparkles className="w-4 h-4 text-black" />
      </div>
      <span className="text-xs sm:text-sm font-semibold tracking-wide text-white">
        Ask Tutor
      </span>
      <span className="relative flex h-2 w-2 -ml-1 -mt-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
    </button>
  );
};
