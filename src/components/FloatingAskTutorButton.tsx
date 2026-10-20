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
      className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 group w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-2xl flex items-center justify-center border border-blue-400/40 hover:scale-110 active:scale-95 transition-all cursor-pointer"
      aria-label="Ask Mentor KOYA"
      title="Ask Mentor KOYA"
    >
      <Sparkles className="w-5 h-5 text-white group-hover:rotate-12 transition-transform" />
      <span className="absolute -top-1 -right-1 flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-300 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-300 border-2 border-black"></span>
      </span>
    </button>
  );
};
