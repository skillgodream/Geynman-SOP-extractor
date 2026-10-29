import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  ArrowLeft,
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon
} from 'lucide-react';
import { FeynmanDeck } from '../types/deck';
import { safeFetchJson } from '../utils/apiClient';

interface ScanScreenProps {
  onBack: () => void;
  onDeckGenerated: (deck: FeynmanDeck) => void;
}

const GENERATION_STEPS = [
  'Performing high-definition OCR image analysis',
  'Extracting core mental model & intuitive analogy',
  'Pinpointing non-negotiable red lines & golden rules',
  'Formulating clear emergency step sequence',
  'Generating active recall scenario dilemma quizzes',
  'Assembling visual Feynman learning cards'
];

export const ScanScreen: React.FC<ScanScreenProps> = ({
  onBack,
  onDeckGenerated,
}) => {
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const [scannedFilename, setScannedFilename] = useState<string | null>(null);

  // Configurations
  const [learnerLevel, setLearnerLevel] = useState(
    'Operational Staff & New Hires (Maximum Simplification)'
  );
  const [instructionalFocus, setInstructionalFocus] = useState(
    'High-Stakes Safety & Failure Prevention'
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Animate generation steps while backend OCR and synthesis runs
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

// Compress and downscale camera photos to max 1600px canvas JPEG so payloads remain under serverless limits (~350KB)
const compressImage = (dataUrl: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const maxDim = 1600;
      let width = img.width;
      let height = img.height;

      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      } else {
        resolve(dataUrl);
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
};

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        const rawResult = reader.result as string;
        const compressed = await compressImage(rawResult);
        setScannedImage(compressed);
        setScannedFilename(file.name);
        setErrorMsg(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!scannedImage) {
      setErrorMsg('Please capture or choose an image of the physical document.');
      return;
    }

    setIsGenerating(true);
    setGenerationStep(0);
    setErrorMsg(null);

    try {
      const base64Data = scannedImage.split(',')[1] || scannedImage;
      const mimeMatch = scannedImage.match(/^data:(image\/[a-zA-Z]+);base64,/);

      const resData = await safeFetchJson<{ deck?: FeynmanDeck } & FeynmanDeck>('/api/deck/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pdfBase64: base64Data,
          mimeType: mimeMatch ? mimeMatch[1] : 'image/jpeg',
          fileName: 'Scanned_SOP_Document.jpg',
          targetAudience: learnerLevel,
          instructionalFocus: instructionalFocus,
        }),
      });

      const newDeck: FeynmanDeck = resData.deck || resData;
      onDeckGenerated(newDeck);
    } catch (err: any) {
      setErrorMsg(err.message || 'OCR document analysis failed. You can retake or upload PDF.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans antialiased selection:bg-neutral-800 selection:text-white">
      {/* Top Header */}
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

          <span className="text-xs font-semibold tracking-tight text-white uppercase font-mono">
            Ingestion
          </span>

          <div className="w-12" />
        </div>
      </header>

      {/* Main Container (Header-safe scroll alignment) */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col">
        <div className="my-auto border border-white/[0.08] bg-neutral-950 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* Title Header */}
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Scan Document or Placard
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              Capture binders, operating checklists, or equipment labels with your device camera.
            </p>
          </div>

          {/* Scanner Viewport */}
          <div className="border border-dashed border-white/20 bg-neutral-900/30 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center">
            {scannedImage ? (
              <div className="w-full space-y-4">
                <div className="relative w-full aspect-4/3 rounded-xl overflow-hidden border border-white/10 bg-black">
                  <img
                    src={scannedImage}
                    alt="Captured document"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-[10px] font-mono text-neutral-300 border border-white/10">
                    Ready for OCR
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
                  <span className="truncate">{scannedFilename || 'Document image captured'}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setScannedImage(null);
                      setScannedFilename(null);
                    }}
                    className="text-neutral-300 hover:text-white underline cursor-pointer"
                  >
                    Retake Photo
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-6 flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-neutral-900/90 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4 shadow-inner">
                  <Camera className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                  Capture Physical Document
                </h3>
                <p className="text-xs text-neutral-400 max-w-xs mb-6">
                  Point camera at physical binder pages, runbook checklists, or placards.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="min-h-[48px] flex-1 px-5 py-2.5 bg-white hover:bg-neutral-200 text-black text-xs font-semibold rounded-full flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Take Photo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="min-h-[48px] flex-1 px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-white/10 text-xs font-medium rounded-full flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Photo Library</span>
                  </button>
                </div>

                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleCapture}
                  className="hidden"
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleCapture}
                  className="hidden"
                />
              </div>
            )}
          </div>

          {/* Form Options */}
          <div className="space-y-4 pt-2 border-t border-white/[0.08]">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-400">
                Target Learner Level
              </label>
              <select
                value={learnerLevel}
                onChange={(e) => setLearnerLevel(e.target.value)}
                className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-white/30 cursor-pointer appearance-none"
              >
                <option value="Operational Staff & New Hires (Maximum Simplification)">
                  Operational Staff & New Hires
                </option>
                <option value="Cross-Functional Leads & Supervisors">
                  Cross-Functional Leads & Supervisors
                </option>
                <option value="Auditors & Compliance Officers">
                  Auditors & Compliance Officers
                </option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-400">
                Instructional Focus
              </label>
              <select
                value={instructionalFocus}
                onChange={(e) => setInstructionalFocus(e.target.value)}
                className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-white/30 cursor-pointer appearance-none"
              >
                <option value="High-Stakes Safety & Failure Prevention">
                  High-Stakes Safety & Red Lines
                </option>
                <option value="Step-by-Step Procedure & Precision">
                  Step-by-Step Procedure & Precision
                </option>
                <option value="Core Mental Models & Why-It-Works">
                  Core Mental Models & Why-It-Works
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

          {/* Footer Actions */}
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
              disabled={isGenerating || !scannedImage}
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
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />

            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center mx-auto text-blue-400 shadow-lg mb-3">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Synthesizing Feynman Deck
              </h2>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto leading-relaxed">
                Analyzing scanned image & distilling procedural complexity into visual cards.
              </p>
            </div>

            <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-sky-300 transition-all duration-700 ease-out"
                style={{
                  width: `${Math.min(100, ((generationStep + 1) / GENERATION_STEPS.length) * 100)}%`,
                }}
              />
            </div>

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
