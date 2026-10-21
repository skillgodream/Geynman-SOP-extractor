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
  ArrowRight,
  Loader2
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

  // AI Text-to-Image State
  const [aiPrompt, setAiPrompt] = useState(titleContext || '');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const activeDiagram = image?.diagramType || defaultDiagram;

  const handleGenerateAiImage = async () => {
    const promptText = aiPrompt.trim() || titleContext || 'Operational SOP procedure visual';
    setIsGeneratingAi(true);
    setAiError(null);

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText }),
      });

      const data = await res.json();
      if (data.success && data.imageUrl) {
        setUrlInput(data.imageUrl);
        if (!captionInput) setCaptionInput(`AI Generated: ${promptText}`);
      } else {
        setAiError(data.error || 'Could not generate AI image.');
      }
    } catch (err: any) {
      setAiError('Failed to connect to AI image generator.');
    } finally {
      setIsGeneratingAi(false);
    }
  };

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

  // Default professional photographic images corresponding to each domain type instead of neon vector drawings
  const defaultPhotoMap: Record<string, string> = {
    cold_chain: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=1200&q=80',
    protein_origami: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1200&q=80',
    cleanroom: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
    incident_triage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    warehouse: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    flowchart: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80'
  };

  // Prioritize custom user image URL, then domain-specific photo mapping, then generic flowchart photo
  const activePhotoUrl =
    image?.url || defaultPhotoMap[activeDiagram] || defaultPhotoMap[defaultDiagram] || defaultPhotoMap.flowchart;

  return (
    <div className="relative group w-full overflow-hidden rounded-2xl bg-neutral-950 border border-white/[0.08] transition-all flex flex-col justify-between">
      {/* Visual Content: Professional Photographic Picture */}
      {activePhotoUrl && (
        <div className="relative w-full aspect-video sm:aspect-4/3 overflow-hidden bg-black">
          <img
            src={activePhotoUrl}
            alt={image?.alt || titleContext || 'Professional SOP visual photo'}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
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
              {/* Option A: ✨ AI Text-to-Image Generation (Imagen 3) */}
              <div className="p-3.5 rounded-2xl bg-blue-950/40 border border-blue-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-blue-400 text-xs">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    <span>Generate AI Image from Text Prompt (Imagen)</span>
                  </div>
                  <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">
                    Gemini AI
                  </span>
                </div>

                <p className="text-[11px] text-neutral-400">
                  Describe any workplace scene, equipment, or SOP action to generate a custom visual.
                </p>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="e.g. Operator checking calibrated temperature sensor"
                    className="flex-1 p-2.5 bg-neutral-900 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleGenerateAiImage}
                    disabled={isGeneratingAi}
                    className="min-h-[38px] px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shrink-0 flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer shadow-md"
                  >
                    {isGeneratingAi ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Generate AI Image</span>
                      </>
                    )}
                  </button>
                </div>

                {aiError && <p className="text-[11px] text-rose-400">{aiError}</p>}
              </div>

              {/* Option B: Select High-Fidelity Domain Schematic */}
              <div>
                <label className="block font-semibold mb-2 text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                  2. Choose Domain Schematic (Zero Broken Links)
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
