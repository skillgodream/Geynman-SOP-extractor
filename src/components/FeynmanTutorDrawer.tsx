import React, { useState } from 'react';
import { X, Send, Sparkles, MessageSquare, Lightbulb, Loader2 } from 'lucide-react';
import { DeckCard, FeynmanDeck } from '../types/deck';

interface FeynmanTutorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeCard: DeckCard | null;
  deck: FeynmanDeck | null;
}

interface Message {
  sender: 'user' | 'tutor';
  text: string;
}

export const FeynmanTutorDrawer: React.FC<FeynmanTutorDrawerProps> = ({
  isOpen,
  onClose,
  activeCard,
  deck,
}) => {
  const [inputQuestion, setInputQuestion] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (questionText?: string) => {
    const query = questionText || inputQuestion.trim();
    if (!query || isLoading) return;

    const userMsg: Message = { sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/deck/ask-feynman', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: query,
          cardContext: activeCard,
          deckContext: deck,
        }),
      });

      const data = await res.json();
      if (data.success && data.answer) {
        setMessages((prev) => [...prev, { sender: 'tutor', text: data.answer }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'tutor',
            text: 'I ran into an issue while generating that explanation. Please try asking again!',
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'tutor',
          text: 'Unable to reach the Feynman Tutor right now. Please check your connection and try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const QUICK_QUESTIONS = [
    'Explain this like I am 10 years old.',
    'Give me another vivid real-world analogy.',
    'What is the catastrophic worst-case if I skip this?',
    'What is the easiest mistake newcomers make here?',
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col md:flex-row md:justify-end bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      {/* Backdrop click to dismiss on mobile */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Main Container: Mobile full sheet / Desktop right drawer */}
      <div className="relative z-10 w-full h-full md:w-[480px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-slideUp md:animate-slideLeft transition-colors">
        {/* Mobile top drag handle */}
        <div className="md:hidden pt-3 pb-1">
          <div className="w-10 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto" />
        </div>

        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-sm shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                Feynman Interactive Tutor
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Clear intuitions · Zero jargon · Touch-friendly
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
            aria-label="Close tutor"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Context Banner */}
        {activeCard && (
          <div className="px-4 py-2 bg-amber-50/80 dark:bg-amber-950/30 border-b border-amber-200/60 dark:border-amber-900/40 text-xs text-amber-950 dark:text-amber-200 flex items-center gap-2">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="truncate">
              Focus: <strong>{activeCard.title}</strong>
            </span>
          </div>
        )}

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-6 sm:py-8">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                Have a doubt about this step?
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto mb-4">
                Ask in plain English. The Feynman Tutor explains the "why" and "how" without confusing terminology.
              </p>

              <div className="space-y-2 text-left max-w-sm mx-auto">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Quick Prompts (Tap to ask):
                </div>
                {QUICK_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(q)}
                    className="w-full min-h-[44px] text-left p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500/50 bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-700 dark:text-slate-300 active:scale-[0.99] transition-transform flex items-center"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[88%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-amber-400 text-slate-950 font-medium rounded-br-none'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200/60 dark:border-slate-700/60'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 py-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Feynman Tutor is crafting an intuitive answer...</span>
            </div>
          )}
        </div>

        {/* Input Bar with 48px touch heights */}
        <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900 pb-safe">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              placeholder="Ask anything about this procedure..."
              disabled={isLoading}
              className="flex-1 min-h-[46px] px-3.5 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuestion.trim()}
              className="min-h-[46px] min-w-[46px] flex items-center justify-center text-slate-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors shrink-0 shadow-sm"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
