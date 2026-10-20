import React from 'react';
import { Layers, Film, HelpCircle, Award, Compass } from 'lucide-react';
import { AppViewMode } from '../types/deck';

interface MobileBottomNavProps {
  activeView: AppViewMode;
  onViewChange: (view: AppViewMode) => void;
  onOpenExplore: () => void;
  onOpenTutor: () => void;
  onOpenNewModal: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeView,
  onViewChange,
  onOpenExplore,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-xl border-t border-white/[0.08] lg:hidden px-2 pb-safe">
      <div className="grid grid-cols-5 items-center h-16">
        {/* Tab 1: Flow */}
        <button
          type="button"
          onClick={() => onViewChange('flow')}
          className={`min-h-[48px] flex flex-col items-center justify-center transition-colors cursor-pointer ${
            activeView === 'flow'
              ? 'text-white font-semibold'
              : 'text-neutral-500 hover:text-white'
          }`}
          aria-label="Deck Flow"
        >
          <Layers className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-0.5">Flow</span>
        </button>

        {/* Tab 2: Show Me */}
        <button
          type="button"
          onClick={() => onViewChange('show_me')}
          className={`min-h-[48px] flex flex-col items-center justify-center transition-colors cursor-pointer ${
            activeView === 'show_me'
              ? 'text-white font-semibold'
              : 'text-neutral-500 hover:text-white'
          }`}
          aria-label="Show Me Video"
        >
          <Film className={`w-5 h-5 ${activeView === 'show_me' ? 'text-sky-300' : 'text-sky-300/70'}`} />
          <span className="text-[10px] tracking-tight mt-0.5">Show Me</span>
        </button>

        {/* Tab 3: Guide Me */}
        <button
          type="button"
          onClick={() => onViewChange('guide_me')}
          className={`min-h-[48px] flex flex-col items-center justify-center transition-colors cursor-pointer ${
            activeView === 'guide_me'
              ? 'text-white font-semibold'
              : 'text-neutral-500 hover:text-white'
          }`}
          aria-label="Guide Me Practice"
        >
          <HelpCircle className={`w-5 h-5 ${activeView === 'guide_me' ? 'text-amber-300' : 'text-amber-300/70'}`} />
          <span className="text-[10px] tracking-tight mt-0.5">Guide Me</span>
        </button>

        {/* Tab 4: Test Me */}
        <button
          type="button"
          onClick={() => onViewChange('test_me')}
          className={`min-h-[48px] flex flex-col items-center justify-center transition-colors cursor-pointer ${
            activeView === 'test_me'
              ? 'text-white font-semibold'
              : 'text-neutral-500 hover:text-white'
          }`}
          aria-label="Test Me Assessment"
        >
          <Award className={`w-5 h-5 ${activeView === 'test_me' ? 'text-emerald-300' : 'text-emerald-300/70'}`} />
          <span className="text-[10px] tracking-tight mt-0.5">Test Me</span>
        </button>

        {/* Tab 5: Outline / Switch Deck */}
        <button
          type="button"
          onClick={onOpenExplore}
          className="min-h-[48px] flex flex-col items-center justify-center text-neutral-500 hover:text-white transition-colors cursor-pointer"
          aria-label="Return to Card Outline"
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-0.5">Outline</span>
        </button>
      </div>
    </nav>
  );
};
