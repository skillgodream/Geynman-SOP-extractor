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
            text: 'I ran into an issue while generating that explanation. Please try asking again.',
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
    <div className="fixed inset-0 z-50 flex flex-col md:flex-row md:justify-end bg-black/80 backdrop-blur-md animate-fadeIn font-sans">
      {/* Backdrop click to dismiss */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Main Container */}
      <div className="relative z-10 w-full h-full md:w-[480px] bg-neutral-950 border-l border-white/[0.08] shadow-2xl flex flex-col overflow-hidden animate-slideUp md:animate-slideLeft transition-colors">
        {/* Mobile top drag handle */}
        <div className="md:hidden pt-3 pb-1">
          <div className="w-10 h-1 bg-neutral-700 rounded-full mx-auto" />
        </div>

        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">
                KOYA Mentor
              </div>
              <div className="text-xs text-neutral-400">
                Frontline SOP Assistant
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-neutral-400 hover:text-white rounded-full transition-colors cursor-pointer"
            aria-label="Close tutor"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Context Banner */}
        {activeCard && (
          <div className="px-4 py-2 bg-neutral-900 border-b border-white/[0.08] text-xs text-neutral-300 flex items-center gap-2">
            <Lightbulb className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="truncate">
              Focus: <strong className="text-white">{activeCard.title}</strong>
            </span>
          </div>
        )}

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-6 sm:py-8">
              <div className="w-12 h-12 rounded-full bg-neutral-900 border border-white/10 text-blue-400 flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-white mb-1">
                Have a doubt about this procedure?
              </h4>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto mb-4 font-normal">
                Ask anything about the SOP steps, rules, or analogies. KOYA explains the logic instantly.
              </p>

              <div className="space-y-2 text-left max-w-sm mx-auto">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-1">
                  Quick Prompts (Tap to ask):
                </div>
                {QUICK_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(q)}
                    className="w-full text-left p-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-xs text-neutral-300 hover:text-white transition-colors cursor-pointer"
                  >
                    "{q}"
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white font-medium shadow-md'
                      : 'bg-neutral-900 text-neutral-200 border border-white/10'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-neutral-400 p-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
              <span>Checking SOP rules and generating explanation...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-white/[0.08] bg-black">
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
              placeholder="Ask anything about this SOP..."
              disabled={isLoading}
              className="flex-1 min-h-[44px] bg-neutral-900 border border-white/10 rounded-full px-4 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500/50"
            />
            <button
              type="submit"
              disabled={!inputQuestion.trim() || isLoading}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-30 shadow-md transition-all cursor-pointer"
              aria-label="Send"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
