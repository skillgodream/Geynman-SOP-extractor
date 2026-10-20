import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  FileText,
  Sparkles,
  Check,
  AlertCircle,
  Clock,
  Layers,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { FeynmanDeck } from '../types/deck';

interface SOPInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeckGenerated: (deck: FeynmanDeck) => void;
  onSelectSample: (deckId: string) => void;
}

const SAMPLE_TEXT_SPILL = `STANDARD OPERATING PROCEDURE: HAZARDOUS CHEMICAL ACID SPILL RESPONSE (SOP-EHS-304)
1. PURPOSE & APPLICABILITY
This Standard Operating Procedure defines the mandatory response sequence for accidental spills of corrosive inorganic acids exceeding 500 mL within laboratory environments.

2. IMMEDIATE ACTIONS UPON SPILL DETECTION
2.1 Immediately yell "SPILL! EVACUATE ZONE B" to alert personnel within a 25-foot perimeter.
2.2 Do not attempt to clean spills greater than 1 Liter without HazMat assistance.
2.3 The person who discovered the spill must assume the position of Area Spotter to prevent unsuspecting workers from entering the contaminated puddle.
2.4 NEVER add water directly to concentrated sulfuric acid. Doing so causes an intense exothermic steam explosion, violently splattering boiling corrosive acid.

3. SPILL CONTAINMENT PROTOCOL
3.1 Retrieve the Class B Neutralization Kit from Wall Station 4.
3.2 Don heavy neoprene chemical gloves, splash apron, and full-face shield.
3.3 Circle the perimeter of the liquid spill using the neutralizing boom to prevent migration into floor drains.
3.4 Gradually sprinkle neutralization powder from outer edges inward until effervescence ceases and pH indicator turns yellow-green (pH 6.5 - 8.5).
3.5 Allow 15 minutes for complete chemical stabilization before sweeping into heavy-duty waste containers.`;

export const SOPInputModal: React.FC<SOPInputModalProps> = ({
  isOpen,
  onClose,
  onDeckGenerated,
  onSelectSample,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste' | 'samples'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string>('');
  const [docText, setDocText] = useState<string>('');
  const [audienceLevel, setAudienceLevel] = useState<string>('Operational Staff & New Hires');
  const [focusArea, setFocusArea] = useState<string>('Critical Safety Red-Lines & Failure Prevention');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStage, setGenerationStage] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (selectedFile: File) => {
    setErrorMsg(null);
    if (!selectedFile) return;

    if (
      selectedFile.type !== 'application/pdf' &&
      !selectedFile.name.endsWith('.pdf') &&
      !selectedFile.type.includes('text')
    ) {
      setErrorMsg('Please upload a PDF document or text file.');
      return;
    }

    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setFileBase64(result);
    };
    reader.onerror = () => {
      setErrorMsg('Failed to read the file.');
    };

    if (selectedFile.type === 'application/pdf' || selectedFile.name.endsWith('.pdf')) {
      reader.readAsDataURL(selectedFile);
    } else {
      const textReader = new FileReader();
      textReader.onload = () => {
        setDocText(textReader.result as string);
      };
      textReader.readAsText(selectedFile);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleGenerate = async () => {
    if (!file && !docText.trim()) {
      setErrorMsg('Please upload a PDF or paste your SOP document text.');
      return;
    }

    setIsGenerating(true);
    setErrorMsg(null);

    setGenerationStage('Extracting core principles and stripping bureaucratic jargon...');
    const stageTimer1 = setTimeout(() => {
      setGenerationStage('Constructing vivid Feynman mental models and concrete analogies...');
    }, 1800);
    const stageTimer2 = setTimeout(() => {
      setGenerationStage('Pinpointing non-negotiable red lines & failure modes...');
    }, 3600);
    const stageTimer3 = setTimeout(() => {
      setGenerationStage('Applying Miller’s Law to chunk workflow steps...');
    }, 5400);

    try {
      const payload: any = {
        audienceLevel,
        focusArea,
      };

      if (fileBase64 && file?.type === 'application/pdf') {
        payload.pdfBase64 = fileBase64;
        payload.mimeType = 'application/pdf';
      }
      if (docText.trim()) {
        payload.documentText = docText;
      }

      const res = await fetch('/api/deck/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate training deck.');
      }

      const deck: FeynmanDeck = {
        ...data.deck,
        id: `deck-${Date.now()}`,
      };

      onDeckGenerated(deck);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong during generation.');
    } finally {
      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      clearTimeout(stageTimer3);
      setIsGenerating(false);
      setGenerationStage('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      {/* Mobile backdrop tap to dismiss */}
      <div className="fixed inset-0" onClick={isGenerating ? undefined : onClose} aria-hidden="true" />

      {/* Main Bottom Sheet (Mobile) / Modal (Desktop) */}
      <div className="relative z-10 w-full max-w-2xl max-h-[92vh] sm:max-h-[90vh] bg-white dark:bg-slate-900 border-t sm:border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slideUp sm:animate-fadeIn">
        {/* Mobile Drag Handle */}
        <div className="sm:hidden pt-3 pb-1">
          <div className="w-10 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto" />
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-7 flex-1">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
                <span>Feynman Engine</span>
                <span aria-hidden="true">·</span>
                <span>Gamma Style</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Convert SOP to Training Deck
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Upload any PDF or paste raw text. The AI simplifies the critical 20% into intuitive visual cards.
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={isGenerating}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors disabled:opacity-50"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Segmented Tab Switcher with 44px touch targets */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-5">
            <button
              onClick={() => setActiveTab('upload')}
              className={`min-h-[42px] flex items-center justify-center gap-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'upload'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Upload PDF</span>
            </button>

            <button
              onClick={() => setActiveTab('paste')}
              className={`min-h-[42px] flex items-center justify-center gap-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'paste'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Paste Text</span>
            </button>

            <button
              onClick={() => setActiveTab('samples')}
              className={`min-h-[42px] flex items-center justify-center gap-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'samples'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Sample SOPs</span>
            </button>
          </div>

          {/* Tab 1: Upload PDF */}
          {activeTab === 'upload' && (
            <div className="space-y-4 mb-4">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all active:scale-[0.99] ${
                  isDragging
                    ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20'
                    : file
                    ? 'border-emerald-500/50 bg-emerald-50/20 dark:bg-emerald-950/10'
                    : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-800/40'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                />

                {file ? (
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="font-semibold text-slate-900 dark:text-white text-sm truncate max-w-xs">
                      {file.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {(file.size / 1024 / 1024).toFixed(2)} MB · PDF ready for conversion
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                        setFileBase64('');
                      }}
                      className="mt-3 min-h-[44px] px-3 py-1 text-xs text-red-600 dark:text-red-400 hover:underline flex items-center"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div className="font-semibold text-slate-900 dark:text-white text-sm">
                      Tap or drag SOP PDF here
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Clinical SOPs, safety runbooks, checklists, or engineering manuals
                    </div>
                    <div className="mt-3 min-h-[44px] px-4 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg shadow-sm flex items-center">
                      Browse Files
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: Paste SOP Text */}
          {activeTab === 'paste' && (
            <div className="space-y-3 mb-4">
              <div className="relative">
                <textarea
                  value={docText}
                  onChange={(e) => setDocText(e.target.value)}
                  placeholder="Paste your SOP or manual text here..."
                  rows={6}
                  className="w-full px-3.5 py-3 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white font-mono leading-relaxed resize-none"
                />
                <button
                  type="button"
                  onClick={() => setDocText(SAMPLE_TEXT_SPILL)}
                  className="absolute top-2 right-2 px-2.5 py-1 text-[11px] font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 rounded-md"
                >
                  Insert Sample SOP
                </button>
              </div>
              <div className="text-right text-[11px] text-slate-400">
                {docText.length} characters
              </div>
            </div>
          )}

          {/* Tab 3: Pre-built SOPs (Touch Rows) */}
          {activeTab === 'samples' && (
            <div className="space-y-2.5 mb-4">
              <div
                onClick={() => {
                  onSelectSample('deck-cold-chain');
                  onClose();
                }}
                className="min-h-[58px] p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500/60 bg-slate-50/50 dark:bg-slate-800/40 cursor-pointer active:scale-[0.99] transition-all flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm">
                    Cold Chain Biologics & Excursion SOP
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Biopharma · "The Melting Ice Cream Analogy" · 7 min
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>

              <div
                onClick={() => {
                  onSelectSample('deck-incident-response');
                  onClose();
                }}
                className="min-h-[58px] p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500/60 bg-slate-50/50 dark:bg-slate-800/40 cursor-pointer active:scale-[0.99] transition-all flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm">
                    P1 Incident Triage & Sev-1 Outage Protocol
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Engineering & SRE · "The Trauma Center Chief" · 8 min
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>

              <div
                onClick={() => {
                  onSelectSample('deck-cleanroom-sop');
                  onClose();
                }}
                className="min-h-[58px] p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500/60 bg-slate-50/50 dark:bg-slate-800/40 cursor-pointer active:scale-[0.99] transition-all flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm">
                    Cleanroom ISO Class 5 Gowning & Entry SOP
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    GMP Manufacturing · "The Inverted Suit" · 6 min
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          )}

          {/* Options */}
          {activeTab !== 'samples' && (
            <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Learner Level
                </label>
                <select
                  value={audienceLevel}
                  onChange={(e) => setAudienceLevel(e.target.value)}
                  className="w-full min-h-[44px] px-3 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                >
                  <option value="Operational Staff & New Hires">Operational Staff & New Hires (Maximum Simplification)</option>
                  <option value="Mid-Level Practitioners & Technicians">Mid-Level Practitioners & Technicians</option>
                  <option value="Supervisors & Compliance Leads">Supervisors & Compliance Leads</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Instructional Focus
                </label>
                <select
                  value={focusArea}
                  onChange={(e) => setFocusArea(e.target.value)}
                  className="w-full min-h-[44px] px-3 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                >
                  <option value="Critical Safety Red-Lines & Failure Prevention">High-Stakes Safety & Failure Prevention</option>
                  <option value="Fast Execution & Cognitive Flow">Speed & Operational Execution Flow</option>
                  <option value="Audit Readiness & Defect Elimination">Audit Compliance & Defect Elimination</option>
                </select>
              </div>
            </div>
          )}

          {/* Error notice */}
          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-xs text-red-600 dark:text-red-400 flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Generation Progress Indicator */}
          {isGenerating && (
            <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 animate-pulse mb-3">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 text-xs font-semibold uppercase tracking-wider mb-1.5">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Applying Feynman Instructional Architecture</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                {generationStage}
              </p>
            </div>
          )}
        </div>

        {/* Sticky Bottom Actions in Natural Thumb Zone */}
        {activeTab !== 'samples' && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-3 pb-safe">
            <button
              type="button"
              onClick={onClose}
              disabled={isGenerating}
              className="min-h-[48px] px-4 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating || (!file && !docText.trim())}
              className="flex-1 min-h-[48px] flex items-center justify-center gap-2 px-5 text-xs sm:text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-md active:scale-[0.98] transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGenerating ? 'Synthesizing Deck...' : 'Generate Feynman Deck'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
