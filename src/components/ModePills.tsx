import React from 'react';
import {
  SquareStack,
  Presentation,
  Video,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { AppViewMode } from '../types/deck';

interface ModePillsProps {
  activeMode?: AppViewMode;
  onSelectMode: (mode: AppViewMode, slideIndex?: number) => void;
  slideIndex?: number;
  className?: string;
  allowedModes?: AppViewMode[];
  gridCols?: number;
  variant?: 'colorful' | 'monochrome';
}

export const ModePills: React.FC<ModePillsProps> = ({
  activeMode,
  onSelectMode,
  slideIndex = 0,
  className = '',
  allowedModes,
  gridCols,
  variant = 'monochrome',
}) => {
  const isMonochrome = variant === 'monochrome';

  const allModes: {
    mode: AppViewMode;
    label: string;
    icon: (isActive: boolean) => React.ReactNode;
    defaultBg: string;
    activeBg: string;
  }[] = [
    {
      mode: 'outline',
      label: 'Training Deck',
      icon: (isActive) => (
        <SquareStack
          className={`w-3.5 h-3.5 shrink-0 stroke-[2.2] transition-colors ${
            isMonochrome
              ? isActive ? 'text-black' : 'text-neutral-300 group-hover:text-white'
              : 'text-cyan-400'
          }`}
        />
      ),
      defaultBg: isMonochrome
        ? 'bg-[#111622] hover:bg-neutral-800 text-neutral-200 hover:text-white border-white/15 hover:border-white/40 shadow-sm'
        : 'bg-cyan-950/30 hover:bg-cyan-900/50 text-cyan-200 border-cyan-500/30 hover:border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.1)]',
      activeBg: isMonochrome
        ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)] font-extrabold'
        : 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)] font-bold',
    },
    {
      mode: 'presentation',
      label: 'Slide View',
      icon: (isActive) => (
        <Presentation
          className={`w-3.5 h-3.5 shrink-0 stroke-[2.2] transition-colors ${
            isMonochrome
              ? isActive ? 'text-black' : 'text-neutral-300 group-hover:text-white'
              : 'text-purple-400'
          }`}
        />
      ),
      defaultBg: isMonochrome
        ? 'bg-[#111622] hover:bg-neutral-800 text-neutral-200 hover:text-white border-white/15 hover:border-white/40 shadow-sm'
        : 'bg-purple-950/30 hover:bg-purple-900/50 text-purple-200 border-purple-500/30 hover:border-purple-400/60 shadow-[0_0_15px_rgba(168,85,247,0.1)]',
      activeBg: isMonochrome
        ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)] font-extrabold'
        : 'bg-purple-500 text-white border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.4)] font-bold',
    },
    {
      mode: 'show_me',
      label: 'Video',
      icon: (isActive) => (
        <Video
          className={`w-3.5 h-3.5 shrink-0 stroke-[2.2] transition-colors ${
            isMonochrome
              ? isActive ? 'text-black' : 'text-neutral-300 group-hover:text-white'
              : 'text-blue-400'
          }`}
        />
      ),
      defaultBg: isMonochrome
        ? 'bg-[#111622] hover:bg-neutral-800 text-neutral-200 hover:text-white border-white/15 hover:border-white/40 shadow-sm'
        : 'bg-blue-950/30 hover:bg-blue-900/50 text-blue-200 border-blue-500/30 hover:border-blue-400/60 shadow-[0_0_15px_rgba(59,130,246,0.1)]',
      activeBg: isMonochrome
        ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)] font-extrabold'
        : 'bg-blue-500 text-white border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.4)] font-bold',
    },
    {
      mode: 'guide_me',
      label: 'Guide Me',
      icon: (isActive) => (
        <Compass
          className={`w-3.5 h-3.5 shrink-0 stroke-[2.2] transition-colors ${
            isMonochrome
              ? isActive ? 'text-black' : 'text-neutral-300 group-hover:text-white'
              : 'text-amber-400'
          }`}
        />
      ),
      defaultBg: isMonochrome
        ? 'bg-[#111622] hover:bg-neutral-800 text-neutral-200 hover:text-white border-white/15 hover:border-white/40 shadow-sm'
        : 'bg-amber-950/30 hover:bg-amber-900/50 text-amber-200 border-amber-500/30 hover:border-amber-400/60 shadow-[0_0_15px_rgba(245,158,11,0.1)]',
      activeBg: isMonochrome
        ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)] font-extrabold'
        : 'bg-amber-500 text-black border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)] font-bold',
    },
    {
      mode: 'test_me',
      label: 'Test Me',
      icon: (isActive) => (
        <CheckCircle2
          className={`w-3.5 h-3.5 shrink-0 stroke-[2.2] transition-colors ${
            isMonochrome
              ? isActive ? 'text-black' : 'text-neutral-300 group-hover:text-white'
              : 'text-emerald-400'
          }`}
        />
      ),
      defaultBg: isMonochrome
        ? 'bg-[#111622] hover:bg-neutral-800 text-neutral-200 hover:text-white border-white/15 hover:border-white/40 shadow-sm'
        : 'bg-emerald-950/30 hover:bg-emerald-900/50 text-emerald-200 border-emerald-500/30 hover:border-emerald-400/60 shadow-[0_0_15px_rgba(16,185,129,0.1)]',
      activeBg: isMonochrome
        ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)] font-extrabold'
        : 'bg-emerald-500 text-black border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)] font-bold',
    },
  ];

  const modes = allowedModes
    ? allModes.filter((m) => allowedModes.includes(m.mode))
    : allModes;

  const containerClass = gridCols === 2
    ? `grid grid-cols-2 gap-2.5 py-1 w-full ${className}`
    : `flex items-center gap-2 overflow-x-auto no-scrollbar py-1 ${className}`;

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
            className={`group min-h-[38px] px-4 py-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-2 shrink-0 transition-all duration-300 active:scale-95 cursor-pointer backdrop-blur-md ${
              gridCols === 2 ? 'w-full' : ''
            } ${isActive ? m.activeBg : m.defaultBg}`}
          >
            {m.icon(isActive)}
            <span className="truncate">{m.label}</span>
          </button>
        );
      })}
    </div>
  );
};
