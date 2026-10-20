import React from 'react';
import { X, CheckCircle2, AlertTriangle, Lightbulb, Compass, Zap } from 'lucide-react';

interface FeynmanMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeynmanMethodModal: React.FC<FeynmanMethodModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2">
          <span>Instructional Design Science</span>
          <span aria-hidden="true">·</span>
          <span>Pedagogy</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
          The Feynman Technique for SOPs
        </h2>

        <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed mb-8">
          Standard Operating Procedures are usually written by compliance committees in dense bureaucratic language.
          Learners skim them, memorize nothing, and make mistakes under shift pressure.
          Nobel laureate Richard Feynman proposed that <span className="font-semibold text-slate-900 dark:text-white">if you cannot explain a concept to a 12-year-old, you do not truly understand it</span>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="p-5 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/20">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-semibold mb-2 text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Standard Bureaucratic SOP</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic mb-2">
              "Pursuant to protocol §4.2, personnel must execute bilateral hand desensitization with 70% v/v isopropanol utilizing unidirectional friction across the interdigital crevices prior to sterile gowning..."
            </p>
            <div className="text-xs text-red-600 dark:text-red-400 font-medium">
              Problem: High cognitive load, jargon, learner eyes glaze over.
            </div>
          </div>

          <div className="p-5 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/20">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold mb-2 text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>The Feynman Deck Equivalent</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium mb-2">
              "Your hands are particle magnets. Apply alcohol foam and scrub between fingers for 20 seconds. If your bare skin brushes the airlock door, you start over immediately."
            </p>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              Result: Clear mental model, actionable trigger, zero ambiguity.
            </div>
          </div>
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
          The 5 Core Pillars in Every Deck
        </h3>

        <div className="space-y-4 mb-8">
          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0 font-bold text-sm">
              1
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                The 12-Year-Old Test
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-0.5">
                Strips out passive voice, acronym soup, and corporate filler to state the fundamental objective in plain everyday language.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 flex items-center justify-center shrink-0 font-bold text-sm">
              2
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                Vivid Concrete Mental Models (Analogies)
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-0.5">
                Connects complex systems to familiar mechanisms (e.g., submarine airlocks, melting ice cream, emergency room trauma dispatch).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400 flex items-center justify-center shrink-0 font-bold text-sm">
              3
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                Non-Negotiable Red Lines & Golden Rules
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-0.5">
                Elevates the 20% of rules that prevent 80% of catastrophic failures into high-salience cards with explicit consequences.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-400 flex items-center justify-center shrink-0 font-bold text-sm">
              4
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                Action-Oriented Chunking (Miller's Law)
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-0.5">
                Limits operational steps into digestible 3–5 step sequences with active action verbs, underlying rationales, and critical watchouts.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 font-bold text-sm">
              5
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                Active Recall: Realistic Shift Dilemma Checks
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-0.5">
                Puts learners in the hot seat with high-pressure scenarios ("It's 2 AM and the sensor beeps") providing immediate reasoning feedback.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            Got It, Let's Build Decks
          </button>
        </div>
      </div>
    </div>
  );
};
