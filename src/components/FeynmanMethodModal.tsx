import React from 'react';
import { X, CheckCircle2, AlertTriangle, Lightbulb, Compass, Zap } from 'lucide-react';

interface FeynmanMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeynmanMethodModal: React.FC<FeynmanMethodModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn font-sans">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-neutral-950 border border-white/[0.08] rounded-3xl shadow-2xl p-6 sm:p-10 text-white">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 min-h-[44px] min-w-[44px] flex items-center justify-center text-neutral-400 hover:text-white rounded-full cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
          <span>Instructional Design Science</span>
          <span aria-hidden="true" className="text-neutral-600">·</span>
          <span>Pedagogy</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
          The Feynman Technique for SOPs
        </h2>

        <p className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-8 font-normal">
          Standard Operating Procedures are usually written by compliance committees in dense bureaucratic language.
          Learners skim them, memorize nothing, and make mistakes under shift pressure.
          Nobel laureate Richard Feynman proposed that <span className="font-semibold text-white">if you cannot explain a concept to a 12-year-old, you do not truly understand it</span>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="p-5 rounded-2xl border border-red-500/30 bg-neutral-900 text-xs space-y-2">
            <div className="flex items-center gap-2 text-red-400 font-bold uppercase tracking-wider text-[11px]">
              <AlertTriangle className="w-4 h-4" />
              <span>Standard Bureaucratic SOP</span>
            </div>
            <p className="text-neutral-400 leading-relaxed italic">
              "Pursuant to protocol §4.2, personnel must execute bilateral hand desensitization with 70% v/v isopropanol utilizing unidirectional friction across the interdigital crevices prior to sterile gowning..."
            </p>
            <div className="text-red-400 font-medium">
              Problem: High cognitive load, jargon, learner eyes glaze over.
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-emerald-500/30 bg-neutral-900 text-xs space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
              <CheckCircle2 className="w-4 h-4" />
              <span>The Feynman Deck Equivalent</span>
            </div>
            <p className="text-neutral-200 leading-relaxed font-normal">
              "Your hands are particle magnets. Apply alcohol foam and scrub between fingers for 20 seconds. If your bare skin brushes the airlock door, you start over immediately."
            </p>
            <div className="text-emerald-400 font-medium">
              Result: Clear mental model, intuitive rule, immediate recall under pressure.
            </div>
          </div>
        </div>

        {/* 4 Pillars */}
        <div className="space-y-4 mb-8">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400">
            The 4 Instructional Pillars:
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl border border-white/[0.08] bg-neutral-900/40 space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-neutral-300" />
                <span>1. Central Analogy Anchor</span>
              </div>
              <p className="text-neutral-400 leading-relaxed">
                Every complex procedure anchors onto an everyday physical mental model (e.g., protein folding = paper origami; war-room triage = ER doctor).
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-white/[0.08] bg-neutral-900/40 space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-neutral-300" />
                <span>2. Chunked Workflows (Miller's Law)</span>
              </div>
              <p className="text-neutral-400 leading-relaxed">
                Procedures are broken into discrete operational phases so the operator's working memory is never overwhelmed.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-white/[0.08] bg-neutral-900/40 space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-neutral-300" />
                <span>3. Non-Negotiable Red Lines</span>
              </div>
              <p className="text-neutral-400 leading-relaxed">
                Clear distinction between flexible recommendations and absolute failure red lines (Must Do vs. Never Do).
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-white/[0.08] bg-neutral-900/40 space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-neutral-300" />
                <span>4. Active Recall Dilemmas</span>
              </div>
              <p className="text-neutral-400 leading-relaxed">
                Real-world dilemmas simulate 3 AM operational pressure, forcing active decision-making over passive reading.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/[0.08] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-6 py-2.5 bg-white hover:bg-neutral-200 text-black text-xs font-semibold rounded-full shadow-md transition-all cursor-pointer"
          >
            Got it, Let's Learn
          </button>
        </div>
      </div>
    </div>
  );
};
