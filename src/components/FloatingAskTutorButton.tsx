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
      className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 group w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 shadow-xl flex items-center justify-center border border-white/15 hover:border-blue-500/50 hover:scale-105 active:scale-95 transition-all cursor-pointer backdrop-blur-md"
      aria-label="Ask Mentor KOYA"
      title="Ask Mentor KOYA"
    >
      <Sparkles className="w-4 h-4 sm:w-4 sm:h-4 text-blue-500 group-hover:rotate-12 transition-transform" />
      <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500 border border-black"></span>
      </span>
    </button>
  );
};
