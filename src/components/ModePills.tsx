import React from 'react';
import {
  SquareStack,
  Presentation,
  Video,
  PlayCircle,
  Compass,
  Sparkles,
  CheckCircle2,
  CheckSquare
} from 'lucide-react';
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
      icon: <SquareStack className="w-3.5 h-3.5 text-neutral-200 shrink-0 stroke-[2]" />,
      activeBg: 'bg-white text-black border-white shadow-md font-bold',
    },
    {
      mode: 'presentation',
      label: 'Slide View',
      icon: <Presentation className="w-3.5 h-3.5 text-amber-300 shrink-0 stroke-[2]" />,
      activeBg: 'bg-amber-500/20 text-amber-200 border-amber-500/40 shadow-sm font-bold',
    },
    {
      mode: 'show_me',
      label: 'Video',
      icon: <Video className="w-3.5 h-3.5 text-sky-400 shrink-0 stroke-[2]" />,
      activeBg: 'bg-sky-500/20 text-sky-200 border-sky-500/40 shadow-sm font-bold',
    },
    {
      mode: 'guide_me',
      label: 'Guide Me',
      icon: <Compass className="w-3.5 h-3.5 text-purple-400 shrink-0 stroke-[2]" />,
      activeBg: 'bg-purple-500/20 text-purple-200 border-purple-500/40 shadow-sm font-bold',
    },
    {
      mode: 'test_me',
      label: 'Test Me',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 stroke-[2]" />,
      activeBg: 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40 shadow-sm font-bold',
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
            className={`min-h-[34px] px-3.5 py-1.5 rounded-full text-xs font-medium border flex items-center justify-center gap-2 shrink-0 transition-all duration-200 active:scale-95 cursor-pointer ${
              gridCols === 2 ? 'w-full' : ''
            } ${
              isActive
                ? m.activeBg
                : 'bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 hover:text-white border-white/[0.12] hover:border-white/25 shadow-sm'
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

