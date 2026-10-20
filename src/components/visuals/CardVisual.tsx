import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Edit3,
  Check,
  Upload,
  Link,
  Layers,
  Sparkles,
  Maximize2,
  X,
  Shield,
  Thermometer,
  Activity,
  Cpu,
  ArrowRight
} from 'lucide-react';
import { CardImage } from '../../types/deck';

interface CardVisualProps {
  image?: CardImage;
  onUpdateImage: (newImage: CardImage) => void;
  defaultDiagram?: CardImage['diagramType'];
  titleContext?: string;
  cleanVideoMode?: boolean;
}

export const CardVisual: React.FC<CardVisualProps> = ({
  image,
  onUpdateImage,
  defaultDiagram = 'flowchart',
  titleContext = '',
  cleanVideoMode = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [urlInput, setUrlInput] = useState(image?.url || '');
  const [captionInput, setCaptionInput] = useState(image?.caption || '');
  const [selectedDiagram, setSelectedDiagram] = useState<CardImage['diagramType']>(
    image?.diagramType || defaultDiagram
  );
  const [selectedLayout, setSelectedLayout] = useState<'split' | 'hero'>(
    image?.layout === 'hero' ? 'hero' : 'split'
  );

  const activeDiagram = image?.diagramType || defaultDiagram;

  const handleSave = () => {
    onUpdateImage({
      url: urlInput.trim() || undefined,
      caption: captionInput.trim() || undefined,
      diagramType: selectedDiagram,
      layout: selectedLayout,
    });
    setIsModalOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUrlInput(reader.result as string);
        setSelectedDiagram('custom');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative group w-full overflow-hidden rounded-2xl bg-neutral-950 border border-white/[0.08] transition-all flex flex-col justify-between">
      {/* Visual Content: Custom Image OR High-Fidelity Vector Schematic */}
      {image?.url ? (
        <div className="relative w-full aspect-video sm:aspect-4/3 overflow-hidden bg-black">
          <img
            src={image.url}
            alt={image.alt || 'SOP visual diagram'}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
        </div>
      ) : activeDiagram === 'cold_chain' ? (
        <div className="w-full p-6 sm:p-7 bg-neutral-950 text-white flex flex-col justify-between min-h-[260px]">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-400 border-b border-white/[0.08] pb-2">
            <span className="flex items-center gap-1.5 text-neutral-200 font-semibold">
              <Thermometer className="w-4 h-4 text-neutral-400" />
              <span>COLD-CHAIN SENSOR GAUGING</span>
            </span>
            <span className="text-emerald-400">● 5.0°C NOMINAL</span>
          </div>

          {/* Precision SVG gauge */}
          <div className="py-4 flex flex-col items-center justify-center">
            <svg viewBox="0 0 240 120" className="w-48 sm:w-56 overflow-visible">
              {/* Arc background */}
              <path
                d="M 20 110 A 100 100 0 0 1 220 110"
                fill="none"
                stroke="#1e293b"
                strokeWidth="16"
                strokeLinecap="round"
              />
              {/* Danger sub-zero freezing (<2°C) */}
              <path
                d="M 20 110 A 100 100 0 0 1 50 55"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="16"
                strokeLinecap="round"
              />
              {/* Optimal 2°C - 8°C zone */}
              <path
                d="M 50 55 A 100 100 0 0 1 190 55"
                fill="none"
                stroke="#10b981"
                strokeWidth="16"
              />
              {/* Danger heat excursion (>8°C) */}
              <path
                d="M 190 55 A 100 100 0 0 1 220 110"
                fill="none"
                stroke="#ef4444"
                strokeWidth="16"
                strokeLinecap="round"
              />
              {/* Needle pointing to 5°C */}
              <line
                x1="120"
                y1="110"
                x2="120"
                y2="28"
                stroke="#f59e0b"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <circle cx="120" cy="110" r="8" fill="#f59e0b" />
            </svg>

            <div className="flex items-center justify-between w-full text-[11px] font-mono text-slate-400 px-2 mt-1">
              <span className="text-sky-400 font-bold">&lt; 2°C Freezing</span>
              <span className="text-emerald-400 font-bold">2°C – 8°C Target</span>
              <span className="text-red-400 font-bold">&gt; 8°C Excursion</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 flex items-center justify-between">
            <span>Calibrated Liquid Glycol Probe</span>
            <span className="text-amber-400">Target Setpoint: 5.0°C</span>
          </div>
        </div>
      ) : activeDiagram === 'protein_origami' ? (
        /* Protein Origami folding comparison */
        <div className="w-full p-6 sm:p-7 bg-slate-900 text-white flex flex-col justify-between min-h-[260px]">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-2">
            <span className="text-amber-400 font-semibold">MOLECULAR MENTAL MODEL</span>
            <span className="text-slate-400">Protein Conformation</span>
          </div>

          <div className="grid grid-cols-2 gap-4 py-4">
            {/* Intact active protein */}
            <div className="text-center p-3 rounded-xl bg-slate-800/60 border border-emerald-500/30">
              <div className="w-10 h-10 mx-auto mb-2 text-emerald-400 flex items-center justify-center">
                <svg viewBox="0 0 40 40" className="w-full h-full fill-none stroke-current stroke-2">
                  <polygon points="20,5 35,15 30,35 10,35 5,15" />
                  <line x1="20" y1="5" x2="30" y2="35" />
                  <line x1="20" y1="5" x2="10" y2="35" />
                  <line x1="5" y1="15" x2="35" y2="15" />
                </svg>
              </div>
              <div className="text-xs font-bold text-emerald-400">Folded & Potent</div>
              <div className="text-[10px] text-slate-400 mt-0.5">3D receptor lock fits perfectly</div>
            </div>

            {/* Denatured protein */}
            <div className="text-center p-3 rounded-xl bg-slate-800/60 border border-red-500/30">
              <div className="w-10 h-10 mx-auto mb-2 text-red-400 flex items-center justify-center">
                <svg viewBox="0 0 40 40" className="w-full h-full fill-none stroke-current stroke-2">
                  <path d="M 5,20 Q 15,5 20,25 T 35,15" strokeDasharray="3 3" />
                  <circle cx="10" cy="18" r="2" fill="currentColor" />
                  <circle cx="28" cy="22" r="2" fill="currentColor" />
                </svg>
              </div>
              <div className="text-xs font-bold text-red-400">Denatured (Melted)</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Heat permanently destroys shape</div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 border-t border-slate-800 pt-2 text-center">
            Feynman Rule: Paper origami does not refold itself once crushed.
          </div>
        </div>
      ) : activeDiagram === 'cleanroom' ? (
        /* Cleanroom Demarcation Bench & Airlock Flow */
        <div className="w-full p-6 sm:p-7 bg-slate-900 text-white flex flex-col justify-between min-h-[260px]">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-2">
            <span className="text-blue-400 font-semibold">ASEPTIC BOUNDARY SCHEMATIC</span>
            <span className="text-emerald-400">+15 Pa Pressure Outflow</span>
          </div>

          <div className="py-4">
            <div className="relative h-24 rounded-xl border border-slate-700 bg-slate-950 overflow-hidden flex items-stretch text-xs font-mono">
              {/* Dirty Pre-Gowning Zone */}
              <div className="w-1/2 p-3 bg-red-950/20 flex flex-col justify-between border-r-2 border-dashed border-amber-400">
                <span className="text-red-400 font-bold">DIRTY SIDE (CNC)</span>
                <span className="text-[10px] text-slate-400">Street Shoes & Pre-Donning</span>
              </div>

              {/* The Demarcation Bench Line */}
              <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-4 bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-[9px] uppercase tracking-tighter writing-vertical">
                BENCH
              </div>

              {/* Clean Class 5 Zone */}
              <div className="w-1/2 p-3 bg-emerald-950/20 flex flex-col justify-between pl-4">
                <span className="text-emerald-400 font-bold">CLEAN SIDE (ISO 5)</span>
                <span className="text-[10px] text-slate-400">Sterile Booties ONLY</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 border-t border-slate-800 pt-2 flex items-center justify-between">
            <span>Don bootie & swing leg over bench</span>
            <span className="text-amber-400">Zero Floor Contact Rule</span>
          </div>
        </div>
      ) : activeDiagram === 'incident_triage' ? (
        /* SRE Incident War Room & Rollback Topology */
        <div className="w-full p-6 sm:p-7 bg-slate-900 text-white flex flex-col justify-between min-h-[260px]">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-2">
            <span className="text-orange-400 font-semibold">INCIDENT COMMAND TOPOLOGY</span>
            <span className="text-red-400">P1 ACTIVE BRIDGE</span>
          </div>

          <div className="py-4 space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/80 border border-amber-500/30">
              <span className="text-amber-400 font-bold">INCIDENT COMMANDER (IC)</span>
              <span className="text-slate-300">Single Voice / Coordinates</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-lg bg-slate-800/60 border border-blue-500/20">
                <div className="text-blue-400 font-bold text-[11px]">OPS LEAD</div>
                <div className="text-[10px] text-slate-400">Executes Rollback</div>
              </div>

              <div className="p-2 rounded-lg bg-slate-800/60 border border-purple-500/20">
                <div className="text-purple-400 font-bold text-[11px]">COMMS LEAD</div>
                <div className="text-[10px] text-slate-400">Shields Bridge / VPs</div>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 border-t border-slate-800 pt-2 flex items-center justify-between">
            <span>Rule: Mitigate First, Root Cause Later</span>
            <span className="text-emerald-400">15m Status SLA</span>
          </div>
        </div>
      ) : (
        /* Connected Workflow Nodes Flowchart */
        <div className="w-full p-6 sm:p-7 bg-slate-900 text-white flex flex-col justify-between min-h-[260px]">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-2">
            <span className="text-amber-400 font-semibold">SOP EXECUTION FLOWCHART</span>
            <span className="text-slate-400">Instructional Sequence</span>
          </div>

          <div className="py-4 flex items-center justify-between gap-1 overflow-x-auto">
            <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-center shrink-0 w-20">
              <div className="text-[10px] text-amber-400 font-bold">STAGE 1</div>
              <div className="text-[11px] font-semibold text-white mt-0.5">Trigger</div>
            </div>

            <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />

            <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-center shrink-0 w-20">
              <div className="text-[10px] text-blue-400 font-bold">STAGE 2</div>
              <div className="text-[11px] font-semibold text-white mt-0.5">Action</div>
            </div>

            <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />

            <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-center shrink-0 w-20">
              <div className="text-[10px] text-red-400 font-bold">WATCHOUT</div>
              <div className="text-[11px] font-semibold text-white mt-0.5">Safety</div>
            </div>

            <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />

            <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-center shrink-0 w-20">
              <div className="text-[10px] text-emerald-400 font-bold">VERIFY</div>
              <div className="text-[11px] font-semibold text-white mt-0.5">Sign-Off</div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 border-t border-slate-800 pt-2 flex items-center justify-between">
            <span>Visual Scaffold (Dual Coding)</span>
            <span className="text-amber-400">Miller's Law (Chunked)</span>
          </div>
        </div>
      )}

      {/* Caption strip (if present) */}
      {!cleanVideoMode && image?.caption && (
        <div className="px-4 py-2 bg-slate-900/90 border-t border-slate-800 text-[11px] text-slate-400 text-center">
          {image.caption}
        </div>
      )}

      {/* Change Image Button overlay */}
      {!cleanVideoMode && (
        <div className="absolute top-3 right-3 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="min-h-[36px] flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 text-white border border-slate-700 hover:border-amber-400 text-xs font-semibold shadow-md active:scale-95 transition-all"
          >
            <Edit3 className="w-3.5 h-3.5 text-amber-400" />
            <span>Change Picture / Diagram</span>
          </button>
        </div>
      )}

      {/* Image / Diagram Configuration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn text-slate-900 dark:text-white">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold">Slide Visual & Picture Settings</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Option A: Select High-Fidelity Domain Schematic */}
              <div>
                <label className="block font-semibold mb-2 text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                  1. Choose Domain Schematic (Zero Broken Links)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDiagram('cold_chain');
                      setUrlInput('');
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      selectedDiagram === 'cold_chain' && !urlInput
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30 font-semibold'
                        : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="text-amber-500 font-bold">Cold Chain Gauge</div>
                    <div className="text-[10px] text-slate-400">2°C–8°C safe zone sensor</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDiagram('protein_origami');
                      setUrlInput('');
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      selectedDiagram === 'protein_origami' && !urlInput
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30 font-semibold'
                        : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="text-emerald-500 font-bold">Protein Origami</div>
                    <div className="text-[10px] text-slate-400">Folded vs Denatured state</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDiagram('cleanroom');
                      setUrlInput('');
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      selectedDiagram === 'cleanroom' && !urlInput
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30 font-semibold'
                        : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="text-blue-500 font-bold">Cleanroom Airlock</div>
                    <div className="text-[10px] text-slate-400">Demarcation bench schematic</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDiagram('incident_triage');
                      setUrlInput('');
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      selectedDiagram === 'incident_triage' && !urlInput
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30 font-semibold'
                        : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="text-orange-500 font-bold">Incident Command</div>
                    <div className="text-[10px] text-slate-400">SRE IC & Ops topology</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDiagram('flowchart');
                      setUrlInput('');
                    }}
                    className={`col-span-2 p-2.5 rounded-xl border text-left transition-all ${
                      selectedDiagram === 'flowchart' && !urlInput
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30 font-semibold'
                        : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="text-purple-500 font-bold">SOP Step Flowchart</div>
                    <div className="text-[10px] text-slate-400">Connected trigger to verification</div>
                  </button>
                </div>
              </div>

              {/* Option B: Upload Custom Equipment Photo or Diagram */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                  2. Or Upload Local SOP Photo / Screenshot
                </label>
                <label className="min-h-[44px] flex items-center justify-center gap-2 px-4 py-2 border border-dashed border-slate-300 dark:border-slate-700 hover:border-amber-400 rounded-xl cursor-pointer text-slate-600 dark:text-slate-300 font-medium">
                  <Upload className="w-4 h-4 text-amber-500" />
                  <span>Choose file from device (PNG, JPG, SVG)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Option C: Image URL */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                  3. Or Paste Image URL
                </label>
                <div className="flex items-center gap-2">
                  <Link className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://example.com/cleanroom-diagram.png"
                    className="flex-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* Caption */}
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300 text-[11px]">
                  Visual Caption (Optional)
                </label>
                <input
                  type="text"
                  value={captionInput}
                  onChange={(e) => setCaptionInput(e.target.value)}
                  placeholder="e.g. Figure 1.1: Temperature probe placement"
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-5 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 text-xs font-semibold bg-amber-400 text-slate-950 rounded-lg hover:bg-amber-300"
              >
                Apply Visual Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
