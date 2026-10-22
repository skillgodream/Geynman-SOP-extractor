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

  // Fast chunked buffer to base64 converter
  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    const chunkSize = 8192;
    for (let i = 0; i < len; i += chunkSize) {
      const chunk = bytes.subarray(i, Math.min(i + chunkSize, len));
      binary += String.fromCharCode.apply(null, chunk as unknown as number[]);
    }
    return btoa(binary);
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
      const storedKey = (() => {
        try {
          return localStorage.getItem('user_gemini_api_key') || '';
        } catch {
          return '';
        }
      })();

      const bodyData: any = {
        instructionalStyle: 'feynman',
        targetAudience: learnerLevel,
        instructionalFocus: instructionalFocus,
        apiKey: storedKey || undefined,
      };

      if (mode === 'file' && file) {
        bodyData.fileName = file.name;
        if (file.type === 'application/pdf') {
          const arrayBuffer = await file.arrayBuffer();
          let base64 = arrayBufferToBase64(arrayBuffer);
          // Safely cap base64 size to 3.5MB max length to stay well under serverless request limits
          if (base64.length > 3500000) {
            base64 = base64.slice(0, 3500000);
          }
          bodyData.pdfBase64 = base64;
          bodyData.mimeType = 'application/pdf';
        } else {
          const text = await file.text();
          bodyData.documentText = text;
        }
      } else {
        bodyData.documentText = pastedText;
        bodyData.fileName = 'Pasted_Standard_Operating_Procedure';
      }

      const res = await fetch('/api/deck/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(storedKey ? { 'x-api-key': storedKey } : {}),
        },
        body: JSON.stringify(bodyData),
      });

      if (!res.ok) {
        let errorDetail = '';
        try {
          const errJson = await res.json();
          errorDetail = errJson.error || '';
        } catch {
          const text = await res.text().catch(() => '');
          if (res.status === 404) {
            errorDetail = 'Backend API route returned 404. If deploying on Vercel, please trigger a redeploy so Vercel deploys the new serverless function in /api/index.ts.';
          } else if (res.status === 504) {
            errorDetail = 'Request timed out (504). Please try with a smaller document or paste text.';
          } else {
            errorDetail = `Server error (${res.status}): ${text.slice(0, 120)}`;
          }
        }
        throw new Error(errorDetail || 'Failed to synthesize Feynman training deck.');
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

      {/* Main Form (Header-safe scroll alignment) */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col">
        {/* Main Card (Apple Black Theme matching Screenshot 1) */}
        <div className="my-auto border border-white/[0.08] bg-neutral-950 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
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

      {/* Apple Translucent Generation Card Modal matching Screenshot IMG_7864 */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl transition-all animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-[#18181b]/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-[0_30px_90px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col items-center text-center space-y-6">
            
            {/* Circular Spinner */}
            <div className="relative w-20 h-20 flex items-center justify-center my-2">
              <div className="absolute inset-0 rounded-full border-4 border-neutral-800" />
              <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
              <div className="absolute inset-2 rounded-full bg-neutral-900/40" />
            </div>

            {/* Heading & Subtitle */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Analyzing document...
              </h2>
              <p className="text-sm text-neutral-400 leading-relaxed max-w-xs">
                Building your operational training experience.
              </p>
            </div>

            {/* Cancel Button */}
            <div className="pt-2 w-full">
              <button
                type="button"
                onClick={() => setIsGenerating(false)}
                className="w-full min-h-[44px] px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-full border border-white/10 shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
