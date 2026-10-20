import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  FileText,
  ArrowLeft,
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle2,
  X
} from 'lucide-react';
import { FeynmanDeck } from '../types/deck';

interface UploadScreenProps {
  onBack: () => void;
  onDeckGenerated: (deck: FeynmanDeck) => void;
}

const GENERATION_STEPS = [
  'Analyzing procedural document structure',
  'Extracting core mental model & intuitive analogy',
  'Pinpointing non-negotiable red lines & golden rules',
  'Formulating clear emergency step sequence',
  'Generating active recall scenario dilemma quizzes',
  'Assembling visual Feynman learning cards'
];

export const UploadScreen: React.FC<UploadScreenProps> = ({
  onBack,
  onDeckGenerated,
}) => {
  const [mode, setMode] = useState<'file' | 'text'>('file');
  const [file, setFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState('');

  // Dropdown Configurations (Matching Screenshot 1)
  const [learnerLevel, setLearnerLevel] = useState(
    'Operational Staff & New Hires (Maximum Simplification)'
  );
  const [instructionalFocus, setInstructionalFocus] = useState(
    'High-Stakes Safety & Failure Prevention'
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Animate generation steps while backend API is processing
  useEffect(() => {
    if (!isGenerating) {
      setGenerationStep(0);
      return;
    }

    const interval = setInterval(() => {
      setGenerationStep((prev) => (prev < GENERATION_STEPS.length - 1 ? prev + 1 : prev));
    }, 1100);

    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setErrorMsg(null);
    }
  };

  const handleGenerate = async () => {
    if (mode === 'file' && !file) {
      setErrorMsg('Please select a PDF or document file to convert.');
      return;
    }
    if (mode === 'text' && !pastedText.trim()) {
      setErrorMsg('Please paste or type document text.');
      return;
    }

    setIsGenerating(true);
    setGenerationStep(0);
    setErrorMsg(null);

    try {
      const bodyData: any = {
        instructionalStyle: 'feynman',
        targetAudience: learnerLevel,
        instructionalFocus: instructionalFocus,
      };

      if (mode === 'file' && file) {
        if (file.type === 'application/pdf') {
          const arrayBuffer = await file.arrayBuffer();
          const bytes = new Uint8Array(arrayBuffer);
          let binary = '';
          for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          bodyData.pdfBase64 = btoa(binary);
          bodyData.mimeType = 'application/pdf';
        } else {
          const text = await file.text();
          bodyData.documentText = text;
        }
      } else {
        bodyData.documentText = pastedText;
      }

      const res = await fetch('/api/deck/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed to synthesize Feynman training deck.');
      }

      const resData = await res.json();
      const newDeck: FeynmanDeck = resData.deck || resData;
      onDeckGenerated(newDeck);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error converting document. Please try again or paste text.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans antialiased selection:bg-neutral-800 selection:text-white">
      {/* Top Header — Clean Apple Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-black/85 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="min-h-[44px] flex items-center gap-1.5 text-xs font-medium text-neutral-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Back to Ingestion Sources"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          {/* Changed text from 'Upload & Convert SOP' to 'Ingestion' */}
          <span className="text-xs font-semibold tracking-tight text-white uppercase font-mono">
            Ingestion
          </span>

          <div className="w-12" />
        </div>
      </header>

      {/* Main Form */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col justify-center">
        {/* Main Card (Apple Black Theme matching Screenshot 1) */}
        <div className="border border-white/[0.08] bg-neutral-950 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* Title Header — Changed text to 'Choose Your Ingestion Source' */}
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Choose Your Ingestion Source
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              Upload any PDF or paste raw text. The AI simplifies the critical 20% into intuitive visual cards.
            </p>
          </div>

          {/* Sub-Switch: Upload PDF or Paste Text */}
          <div className="p-1 bg-neutral-900 border border-white/[0.08] rounded-xl flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                setMode('file');
                setErrorMsg(null);
              }}
              className={`min-h-[38px] flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                mode === 'file'
                  ? 'bg-neutral-800 text-white shadow-sm border border-white/10'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload PDF</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('text');
                setErrorMsg(null);
              }}
              className={`min-h-[38px] flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                mode === 'text'
                  ? 'bg-neutral-800 text-white shadow-sm border border-white/10'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Paste Text</span>
            </button>
          </div>

          {/* Upload Dropzone */}
          {mode === 'file' ? (
            <div className="border border-dashed border-white/20 bg-neutral-900/30 rounded-2xl p-8 sm:p-10 flex flex-col items-center justify-center text-center transition-colors hover:border-white/30">
              {/* Only the upload icon in the big card is colored blue */}
              <div className="w-14 h-14 rounded-2xl bg-neutral-900/90 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4 shadow-inner">
                <Upload className="w-6 h-6 text-blue-400" />
              </div>

              {file ? (
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900 border border-white/10 text-xs font-medium text-white">
                    <FileText className="w-4 h-4 text-neutral-400" />
                    <span>{file.name}</span>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="text-neutral-500 hover:text-white ml-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-[11px] text-neutral-500 font-mono">
                    {(file.size / 1024).toFixed(1)} KB · Ready to convert
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <h3 className="text-sm sm:text-base font-semibold text-white">
                    Tap or drag document PDF here
                  </h3>
                  <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                    Operating procedures, safety runbooks, checklists, or engineering manuals
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="min-h-[44px] px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-full border border-white/10 shadow-sm transition-all active:scale-95 cursor-pointer"
                    >
                      Browse Files
                    </button>
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,.md,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste operating procedure text, checklists, safety warnings, or operational runbooks here..."
                rows={7}
                className="w-full text-xs sm:text-sm bg-neutral-900/50 border border-white/10 rounded-2xl p-4 text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-white/30 transition-colors font-mono leading-relaxed"
              />
              <div className="flex items-center justify-between text-[11px] text-neutral-500 px-1 font-mono">
                <span>{pastedText.length} characters</span>
                {pastedText && (
                  <button
                    type="button"
                    onClick={() => setPastedText('')}
                    className="hover:text-white cursor-pointer"
                  >
                    Clear text
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Configuration Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Target Learner Level */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-neutral-400">
                Target Learner Level
              </label>
              <select
                value={learnerLevel}
                onChange={(e) => setLearnerLevel(e.target.value)}
                className="w-full text-xs bg-neutral-900 border border-white/10 rounded-xl px-3 py-2.5 text-neutral-200 focus:outline-none focus:border-white/30 transition-colors cursor-pointer"
              >
                <option value="Operational Staff & New Hires (Maximum Simplification)">
                  Operational Staff & New Hires
                </option>
                <option value="Cross-Functional Teams & Supervisors">
                  Cross-Functional Teams & Supervisors
                </option>
                <option value="Auditors & Compliance Officers">
                  Auditors & Compliance Officers
                </option>
              </select>
            </div>

            {/* Instructional Focus */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-neutral-400">
                Instructional Focus
              </label>
              <select
                value={instructionalFocus}
                onChange={(e) => setInstructionalFocus(e.target.value)}
                className="w-full text-xs bg-neutral-900 border border-white/10 rounded-xl px-3 py-2.5 text-neutral-200 focus:outline-none focus:border-white/30 transition-colors cursor-pointer"
              >
                <option value="High-Stakes Safety & Failure Prevention">
                  High-Stakes Safety & Red Lines
                </option>
                <option value="Core Mental Models & Why-It-Works">
                  Core Mental Models & Why-It-Works
                </option>
                <option value="Troubleshooting & Rapid Recovery">
                  Troubleshooting & Rapid Recovery
                </option>
              </select>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-neutral-900 border border-red-500/30 text-xs text-red-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              <div className="flex-1 leading-relaxed">{errorMsg}</div>
            </div>
          )}

          {/* Action Footer */}
          <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/[0.08]">
            <button
              type="button"
              onClick={onBack}
              className="min-h-[48px] px-6 py-2.5 text-xs sm:text-sm font-medium text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="min-h-[48px] px-7 py-3 bg-white hover:bg-neutral-200 disabled:opacity-40 text-black text-xs sm:text-sm font-semibold rounded-full flex items-center justify-center gap-2 shadow-2xl transition-all active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Feynman Deck</span>
            </button>
          </div>
        </div>
      </main>

      {/* Apple Translucent Generation Card Modal */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xl transition-all animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-neutral-950/80 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6">
            {/* Top ambient highlight line */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />

            {/* Glowing Icon & Title */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center mx-auto text-blue-400 shadow-lg mb-3">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Synthesizing Feynman Deck
              </h2>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto leading-relaxed">
                Applying Feynman principles to distill operational complexity into visual cards.
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-sky-300 transition-all duration-700 ease-out"
                style={{
                  width: `${Math.min(100, ((generationStep + 1) / GENERATION_STEPS.length) * 100)}%`,
                }}
              />
            </div>

            {/* Animated Step Breakdown */}
            <div className="space-y-3 pt-1">
              {GENERATION_STEPS.map((step, idx) => {
                const isCompleted = idx < generationStep;
                const isCurrent = idx === generationStep;

                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 p-2.5 rounded-xl transition-all duration-300 ${
                      isCurrent
                        ? 'bg-neutral-900/90 border border-white/10 text-white'
                        : isCompleted
                        ? 'text-neutral-300'
                        : 'text-neutral-600'
                    }`}
                  >
                    <div className="shrink-0 flex items-center justify-center w-5 h-5">
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : isCurrent ? (
                        <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-neutral-700" />
                      )}
                    </div>
                    <span
                      className={`text-xs ${
                        isCurrent
                          ? 'font-semibold text-white'
                          : isCompleted
                          ? 'text-neutral-300'
                          : 'text-neutral-500'
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="text-center text-[11px] font-mono text-neutral-500 pt-2">
              Step {generationStep + 1} of {GENERATION_STEPS.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
