import React, { useState } from 'react';
import { X, Award, CheckCircle2, Clock, User, BarChart3, AlertCircle, Trash2, Check, Play, HelpCircle } from 'lucide-react';
import { FeynmanDeck } from '../types/deck';
import { getLearnerProgress, LearnerProgressRecord } from '../utils/learnerProgress';

interface ProgressDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  deck: FeynmanDeck;
}

export const ProgressDashboardModal: React.FC<ProgressDashboardModalProps> = ({
  isOpen,
  onClose,
  deck,
}) => {
  const [filter, setFilter] = useState<'all' | 'certified' | 'in_progress'>('all');

  if (!isOpen || !deck) return null;

  const records = getLearnerProgress(deck.id);

  const filteredRecords = records.filter((r) => {
    if (filter === 'certified') return r.testPassed;
    if (filter === 'in_progress') return !r.testPassed;
    return true;
  });

  const totalAssigned = records.length;
  const certifiedCount = records.filter((r) => r.testPassed).length;
  const avgScore = records.reduce((acc, r) => acc + (r.testScore || 0), 0) / (records.filter((r) => r.testScore !== undefined).length || 1);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-2xl animate-in fade-in duration-200">
      <div className="w-full max-w-2xl max-h-[90vh] bg-neutral-950 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col relative overflow-hidden text-white space-y-6">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Learner Progress & Certifications
              </h2>
              <p className="text-xs text-neutral-400 truncate max-w-md">
                {deck.title}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-neutral-400 hover:text-white bg-neutral-900 border border-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 shrink-0">
          <div className="p-3.5 rounded-2xl bg-neutral-900/80 border border-white/10 space-y-1">
            <div className="text-[10px] font-mono text-neutral-400 font-bold uppercase">Assigned</div>
            <div className="text-xl font-extrabold text-white">{totalAssigned}</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-1">
            <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase">Certified</div>
            <div className="text-xl font-extrabold text-emerald-300">{certifiedCount}</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-blue-950/40 border border-blue-500/30 space-y-1">
            <div className="text-[10px] font-mono text-blue-400 font-bold uppercase">Avg Test Score</div>
            <div className="text-xl font-extrabold text-blue-300">{Math.round(avgScore)}%</div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 shrink-0 border-b border-white/[0.08] pb-3">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-white text-black font-bold shadow-md'
                : 'text-neutral-400 hover:text-white bg-neutral-900'
            }`}
          >
            All Learners ({records.length})
          </button>

          <button
            type="button"
            onClick={() => setFilter('certified')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              filter === 'certified'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-neutral-400 hover:text-white bg-neutral-900'
            }`}
          >
            Certified ({certifiedCount})
          </button>

          <button
            type="button"
            onClick={() => setFilter('in_progress')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              filter === 'in_progress'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-neutral-400 hover:text-white bg-neutral-900'
            }`}
          >
            In Progress ({totalAssigned - certifiedCount})
          </button>
        </div>

        {/* Learner Progress List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {filteredRecords.length === 0 ? (
            <div className="p-8 text-center text-xs text-neutral-500 space-y-2">
              <div>No learner progress records match this filter.</div>
              <div>Use the "Send SOP Module" button to assign this module to learners.</div>
            </div>
          ) : (
            filteredRecords.map((r) => (
              <div
                key={r.id}
                className="p-4 rounded-2xl bg-neutral-900/60 border border-white/10 space-y-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center text-xs font-bold text-white shrink-0">
                      {r.learnerName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate">{r.learnerName}</div>
                      {r.learnerEmail && (
                        <div className="text-[10px] text-neutral-400 truncate">{r.learnerEmail}</div>
                      )}
                    </div>
                  </div>

                  {/* Certification Badge */}
                  {r.testPassed ? (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold shrink-0">
                      <Award className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Certified ({r.testScore}%)</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold shrink-0">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>In Progress</span>
                    </div>
                  )}
                </div>

                {/* 4 Mode Progress Status Checklist */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/5 text-[11px]">
                  <div className={`p-2 rounded-xl border flex items-center gap-1.5 ${r.cardsCompleted ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-neutral-900 border-white/5 text-neutral-500'}`}>
                    <CheckCircle2 className={`w-3.5 h-3.5 ${r.cardsCompleted ? 'text-emerald-400' : 'text-neutral-600'}`} />
                    <span>Card Deck</span>
                  </div>

                  <div className={`p-2 rounded-xl border flex items-center gap-1.5 ${r.videoCompleted ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-neutral-900 border-white/5 text-neutral-500'}`}>
                    <Play className={`w-3.5 h-3.5 ${r.videoCompleted ? 'text-emerald-400' : 'text-neutral-600'}`} />
                    <span>Show Me Video</span>
                  </div>

                  <div className={`p-2 rounded-xl border flex items-center gap-1.5 ${r.guideMeCompleted ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-neutral-900 border-white/5 text-neutral-500'}`}>
                    <HelpCircle className={`w-3.5 h-3.5 ${r.guideMeCompleted ? 'text-emerald-400' : 'text-neutral-600'}`} />
                    <span>Guide Me</span>
                  </div>

                  <div className={`p-2 rounded-xl border flex items-center gap-1.5 ${r.testPassed ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-neutral-900 border-white/5 text-neutral-500'}`}>
                    <Award className={`w-3.5 h-3.5 ${r.testPassed ? 'text-emerald-400' : 'text-neutral-600'}`} />
                    <span>Test Me</span>
                  </div>
                </div>

                {r.completedAt && (
                  <div className="text-[10px] text-neutral-500 font-mono pt-1 text-right">
                    Certified on {new Date(r.completedAt).toLocaleDateString()} at {new Date(r.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs text-neutral-400 shrink-0">
          <span>Real-time completion tracking</span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-white text-black font-bold text-xs rounded-full hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
