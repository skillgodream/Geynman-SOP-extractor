import React, { useState } from 'react';
import { Award, Play, HelpCircle, BookOpen, CheckCircle2, ArrowRight, ShieldCheck, Sparkles, User, RefreshCw } from 'lucide-react';
import { FeynmanDeck, AppViewMode } from '../types/deck';
import { saveLearnerProgress, getLearnerProgress } from '../utils/learnerProgress';

interface LearnerPortalScreenProps {
  deck: FeynmanDeck;
  learnerName?: string;
  onOpenMode: (mode: AppViewMode) => void;
  onExitPortal?: () => void;
}

export const LearnerPortalScreen: React.FC<LearnerPortalScreenProps> = ({
  deck,
  learnerName = 'Frontline Operator',
  onOpenMode,
  onExitPortal,
}) => {
  const existingRecords = getLearnerProgress(deck.id);
  const currentLearner = existingRecords.find((r) => r.learnerName.toLowerCase() === learnerName.toLowerCase()) || existingRecords[0] || {
    id: `prog-${deck.id}-active`,
    deckId: deck.id,
    learnerName,
    cardsCompleted: false,
    videoCompleted: false,
    guideMeCompleted: false,
    testScore: undefined,
    testPassed: false,
    lastActiveAt: new Date().toISOString(),
  };

  const completedCount = [
    currentLearner.cardsCompleted,
    currentLearner.videoCompleted,
    currentLearner.guideMeCompleted,
    currentLearner.testPassed,
  ].filter(Boolean).length;

  const progressPercent = Math.round((completedCount / 4) * 100);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans antialiased selection:bg-neutral-800 selection:text-white select-none">
      {/* Top Apple Minimal Header */}
      <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-black/85 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-xs font-bold text-blue-400">
              K
            </div>
            <span className="text-xs font-bold tracking-wider text-white uppercase font-mono">
              LEARNER PORTAL
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 border border-white/10 text-xs text-neutral-300">
              <User className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-semibold text-white">{learnerName}</span>
            </div>

            {onExitPortal && (
              <button
                type="button"
                onClick={onExitPortal}
                className="text-xs font-medium text-neutral-400 hover:text-white px-2 py-1 rounded-lg transition-colors cursor-pointer"
              >
                Manager View
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col space-y-6">
        
        {/* Module Title Banner (Apple Style) */}
        <div className="p-6 sm:p-8 rounded-3xl border border-white/[0.1] bg-gradient-to-b from-blue-500/[0.08] via-neutral-950 to-neutral-950 shadow-2xl space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between gap-3">
            <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-mono font-bold uppercase">
              ASSIGNED SOP MODULE
            </span>

            {currentLearner.testPassed && (
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>CERTIFIED ({currentLearner.testScore}%)</span>
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
            {deck.title}
          </h1>

          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
            {deck.summary}
          </p>

          {/* Progress Bar */}
          <div className="pt-3 border-t border-white/[0.08] space-y-2">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-neutral-400 font-mono">Module Completion Progress</span>
              <span className="text-white font-bold font-mono">{completedCount}/4 Modes ({progressPercent}%)</span>
            </div>
            <div className="w-full h-2 rounded-full bg-neutral-900 overflow-hidden border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* The 4 Core Option Cards (Card Deck, Video, Guide Me, Test Me) */}
        <div className="space-y-3">
          <div className="text-xs font-mono tracking-wider font-bold text-neutral-400 uppercase px-1">
            SELECT LEARNING HUB ({deck.cards.length} Interactive Cards)
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            
            {/* HUB 1: Card Deck */}
            <div
              onClick={() => {
                saveLearnerProgress({ ...currentLearner, cardsCompleted: true });
                onOpenMode('outline');
              }}
              className="p-5 rounded-2xl bg-[#0c1017] hover:bg-neutral-900 border border-white/[0.08] hover:border-blue-500/40 transition-all flex flex-col justify-between gap-4 cursor-pointer group shadow-xl relative overflow-hidden"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                    <BookOpen className="w-5 h-5 text-blue-400" />
                  </div>

                  {currentLearner.cardsCompleted ? (
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Done
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-white/5">
                      Hub 1
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                  Interactive Card Deck
                </h3>

                <p className="text-xs text-neutral-400 font-normal leading-relaxed">
                  Study core mental models, critical red lines, and workflow step sequences.
                </p>
              </div>

              <div className="flex items-center justify-between text-xs font-semibold text-blue-400 pt-2 border-t border-white/5">
                <span>Start Reading ({deck.cards.length} cards)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* HUB 2: Show Me Video */}
            <div
              onClick={() => {
                saveLearnerProgress({ ...currentLearner, videoCompleted: true });
                onOpenMode('show_me');
              }}
              className="p-5 rounded-2xl bg-[#0c1017] hover:bg-neutral-900 border border-white/[0.08] hover:border-purple-500/40 transition-all flex flex-col justify-between gap-4 cursor-pointer group shadow-xl relative overflow-hidden"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                    <Play className="w-5 h-5 text-purple-400" />
                  </div>

                  {currentLearner.videoCompleted ? (
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Watched
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-white/5">
                      Hub 2
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                  Video Guide ("Show Me")
                </h3>

                <p className="text-xs text-neutral-400 font-normal leading-relaxed">
                  Watch step-by-step video script walkthrough with slim controls and visuals.
                </p>
              </div>

              <div className="flex items-center justify-between text-xs font-semibold text-purple-400 pt-2 border-t border-white/5">
                <span>Watch Video Walkthrough</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* HUB 3: Guide Me Practice */}
            <div
              onClick={() => {
                saveLearnerProgress({ ...currentLearner, guideMeCompleted: true });
                onOpenMode('guide_me');
              }}
              className="p-5 rounded-2xl bg-[#0c1017] hover:bg-neutral-900 border border-white/[0.08] hover:border-amber-500/40 transition-all flex flex-col justify-between gap-4 cursor-pointer group shadow-xl relative overflow-hidden"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                    <HelpCircle className="w-5 h-5 text-amber-400" />
                  </div>

                  {currentLearner.guideMeCompleted ? (
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Passed
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-white/5">
                      Hub 3
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                  Guide Me (Practice Scenarios)
                </h3>

                <p className="text-xs text-neutral-400 font-normal leading-relaxed">
                  Practice high-stakes shift dilemma scenarios and branching choices.
                </p>
              </div>

              <div className="flex items-center justify-between text-xs font-semibold text-amber-400 pt-2 border-t border-white/5">
                <span>Execute Practice Scenarios</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* HUB 4: Test Me Assessment */}
            <div
              onClick={() => {
                onOpenMode('test_me');
              }}
              className="p-5 rounded-2xl bg-[#0c1017] hover:bg-neutral-900 border border-white/[0.08] hover:border-emerald-500/40 transition-all flex flex-col justify-between gap-4 cursor-pointer group shadow-xl relative overflow-hidden"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                    <Award className="w-5 h-5 text-emerald-400" />
                  </div>

                  {currentLearner.testPassed ? (
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Certified ({currentLearner.testScore}%)
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-white/5">
                      Hub 4
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                  Test Me (Assessment & Certification)
                </h3>

                <p className="text-xs text-neutral-400 font-normal leading-relaxed">
                  Take the official scored operational test to record your score & certification.
                </p>
              </div>

              <div className="flex items-center justify-between text-xs font-semibold text-emerald-400 pt-2 border-t border-white/5">
                <span>Take Certification Test</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
};
