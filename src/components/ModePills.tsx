import React from 'react';
import { Layers, Presentation, Film, HelpCircle, Award } from 'lucide-react';
import { AppViewMode } from '../types/deck';

interface ModePillsProps {
  activeMode?: AppViewMode;
  onSelectMode: (mode: AppViewMode, slideIndex?: number) => void;
  slideIndex?: number;
  className?: string;
  allowedModes?: AppViewMode[];
  gridCols?: number;
}

export const ModePills: React.FC<ModePillsProps> = ({
  activeMode,
  onSelectMode,
  slideIndex = 0,
  className = '',
  allowedModes,
  gridCols,
}) => {
  const allModes: { mode: AppViewMode; label: string; icon: React.ReactNode; activeBg: string }[] = [
    {
      mode: 'outline',
      label: 'Card Deck',
      icon: <Layers className="w-3.5 h-3.5 text-neutral-300 shrink-0" />,
      activeBg: 'bg-neutral-800 text-white border-white/30 shadow-sm',
    },
    {
      mode: 'presentation',
      label: 'Slide View',
      icon: <Presentation className="w-3.5 h-3.5 text-amber-300 shrink-0" />,
      activeBg: 'bg-amber-500/20 text-amber-200 border-amber-500/40 shadow-sm',
    },
    {
      mode: 'show_me',
      label: 'Video',
      icon: <Film className="w-3.5 h-3.5 text-sky-300 shrink-0" />,
      activeBg: 'bg-sky-500/20 text-sky-200 border-sky-500/40 shadow-sm',
    },
    {
      mode: 'guide_me',
      label: 'Guide Me',
      icon: <HelpCircle className="w-3.5 h-3.5 text-purple-300 shrink-0" />,
      activeBg: 'bg-purple-500/20 text-purple-200 border-purple-500/40 shadow-sm',
    },
    {
      mode: 'test_me',
      label: 'Test Me',
      icon: <Award className="w-3.5 h-3.5 text-emerald-300 shrink-0" />,
      activeBg: 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40 shadow-sm',
    },
  ];

  const modes = allowedModes
    ? allModes.filter((m) => allowedModes.includes(m.mode))
    : allModes;

  const containerClass = gridCols === 2
    ? `grid grid-cols-2 gap-2 py-1.5 w-full max-w-xs ${className}`
    : `flex items-center gap-2 overflow-x-auto no-scrollbar py-1.5 ${className}`;

  return (
    <div
      className={containerClass}
      onClick={(e) => e.stopPropagation()}
    >
      {modes.map((m) => {
        const isActive = activeMode === m.mode;
        return (
          <button
            key={m.mode}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectMode(m.mode, slideIndex);
            }}
            className={`min-h-[32px] px-3 py-1 rounded-full text-xs font-semibold border flex items-center justify-center gap-1.5 shrink-0 transition-all cursor-pointer ${
              gridCols === 2 ? 'w-full' : ''
            } ${
              isActive
                ? m.activeBg
                : 'bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 hover:text-white border-white/10'
            }`}
          >
            {m.icon}
            <span className="truncate">{m.label}</span>
          </button>
        );
      })}
    </div>
  );
};
