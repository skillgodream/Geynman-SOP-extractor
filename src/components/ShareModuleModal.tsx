import React, { useState } from 'react';
import { X, Copy, Check, User, Link as LinkIcon, MessageCircle, Mail } from 'lucide-react';
import { FeynmanDeck } from '../types/deck';
import { saveLearnerProgress } from '../utils/learnerProgress';

interface ShareModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  deck: FeynmanDeck;
}

export const ShareModuleModal: React.FC<ShareModuleModalProps> = ({
  isOpen,
  onClose,
  deck,
}) => {
  const [learnerName, setLearnerName] = useState('Frontline Operator');
  const [learnerEmail, setLearnerEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const [waSentToast, setWaSentToast] = useState(false);

  if (!isOpen || !deck) return null;

  // Build the Share URL with query parameters using active origin
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const shareUrl = `${baseUrl}/?shareId=${deck.id}&learnerName=${encodeURIComponent(learnerName || 'Learner')}`;

  const whatsAppText =
    `Hi ${learnerName || 'Operator'}! Here is your assigned SOP Training Module: "${deck.title}".\n\n` +
    `Summary: ${deck.summary}\n\n` +
    `Access your training portal here:\n` +
    `${shareUrl}`;

  const registerLearnerAssignment = () => {
    saveLearnerProgress({
      id: `prog-${deck.id}-${Date.now()}`,
      deckId: deck.id,
      learnerName: learnerName || 'Assigned Learner',
      learnerEmail: learnerEmail || undefined,
      cardsCompleted: false,
      videoCompleted: false,
      guideMeCompleted: false,
      testScore: undefined,
      testPassed: false,
      lastActiveAt: new Date().toISOString(),
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    registerLearnerAssignment();
  };

  const handleSendWhatsApp = () => {
    navigator.clipboard.writeText(shareUrl);
    registerLearnerAssignment();

    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsAppText)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');

    setWaSentToast(true);
    setTimeout(() => {
      setWaSentToast(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-zinc-900/85 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 shadow-2xl relative text-white space-y-5">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-t-3xl" />

        {/* Modal Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-white">
              <MessageCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white tracking-tight">
                Send SOP Module
              </h2>
              <p className="text-xs text-neutral-400">
                Share module link or open WhatsApp
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Target Module Glass Box */}
        <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1">
          <div className="text-[10px] font-mono tracking-wider font-semibold text-neutral-400 uppercase">
            TARGET MODULE
          </div>
          <div className="text-sm font-semibold text-white truncate">{deck.title}</div>
          <div className="text-xs text-neutral-400 line-clamp-1">{deck.summary}</div>
        </div>

        {/* Inputs */}
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-neutral-400" />
              <span>Learner Name</span>
            </label>
            <input
              type="text"
              value={learnerName}
              onChange={(e) => setLearnerName(e.target.value)}
              placeholder="e.g., Alex Rivera"
              className="w-full text-xs bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-neutral-400" />
              <span>Learner Email <span className="text-neutral-500 font-normal">(Optional)</span></span>
            </label>
            <input
              type="email"
              value={learnerEmail}
              onChange={(e) => setLearnerEmail(e.target.value)}
              placeholder="operator@plant-ops.com"
              className="w-full text-xs bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>
        </div>

        {/* Generated Link Box */}
        <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
          <div className="text-[11px] font-medium text-neutral-400 flex items-center gap-1.5">
            <LinkIcon className="w-3.5 h-3.5 text-neutral-300" />
            <span>Generated Learner Portal URL</span>
          </div>
          <div className="p-2.5 bg-black/60 rounded-xl border border-white/5 text-[11px] font-mono text-neutral-300 truncate selection:bg-neutral-800">
            {shareUrl}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="min-h-[40px] px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-full border border-white/15 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-neutral-300" />
                  <span>Copy Link</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleSendWhatsApp}
              className="min-h-[40px] px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-full shadow-lg transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              {waSentToast ? (
                <>
                  <Check className="w-4 h-4 text-white animate-bounce" />
                  <span>Opening WhatsApp...</span>
                </>
              ) : (
                <>
                  <MessageCircle className="w-4 h-4" />
                  <span>Send via WhatsApp</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};



