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
import { safeFetchJson } from '../../utils/apiClient';

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
  const [apiKeyInput, setApiKeyInput] = useState(() => {
    try {
      return localStorage.getItem('user_image_api_key') || '';
    } catch {
      return '';
    }
  });
  const [showApiKeyField, setShowApiKeyField] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [providerTag, setProviderTag] = useState<string | null>(null);

  const activeDiagram = image?.diagramType || defaultDiagram;

  const handleGenerateAiImage = async (customPrompt?: string) => {
    const promptToUse = customPrompt || aiPrompt;
    const promptText = promptToUse.trim() || titleContext || 'Operational SOP procedure visual';
    setIsGeneratingAi(true);
    setAiError(null);
    setProviderTag(null);

    try {
      const data = await safeFetchJson<{
        success: boolean;
        imageUrl?: string;
        fallbackUrl?: string;
        provider?: string;
        sanitizedPrompt?: string;
        error?: string;
      }>('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          apiKey: apiKeyInput.trim() || undefined,
        }),
      });

      if (data.success && data.imageUrl) {
        setUrlInput(data.imageUrl);
        if (data.provider) setProviderTag(data.provider);
        if (data.sanitizedPrompt && data.sanitizedPrompt !== promptText) {
          setAiPrompt(data.sanitizedPrompt);
        }
        if (apiKeyInput.trim()) {
          try {
            localStorage.setItem('user_image_api_key', apiKeyInput.trim());
          } catch {}
        }
        if (!captionInput) setCaptionInput(`AI Visual: ${promptText}`);
      } else {
        const fallback = data.fallbackUrl || resolveFallbackPhoto();
        setUrlInput(fallback);
        setProviderTag('High-Res Stock Photo (Fallback)');
        setAiError(data.error || 'AI image generator refused or timed out. Loaded relevant high-res stock photo.');
      }
    } catch (err: any) {
      const fallback = resolveFallbackPhoto();
      setUrlInput(fallback);
      setProviderTag('High-Res Stock Photo (Fallback)');
      setAiError(err?.message || 'Loaded high-res stock photo fallback.');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleApplyPresetPrompt = (presetText: string) => {
    setAiPrompt(presetText);
    handleGenerateAiImage(presetText);
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
        setProviderTag('User Uploaded File');
      };
      reader.readAsDataURL(file);
    }
  };

  // Comprehensive contextual topic matching for cards without an explicit URL
  const resolveFallbackPhoto = (): string => {
    const query = `${aiPrompt} ${titleContext} ${activeDiagram} ${defaultDiagram}`.toLowerCase();

    if (query.includes('price') || query.includes('shelf') || query.includes('tag') || query.includes('retail') || query.includes('discount') || query.includes('markdown') || query.includes('v-mart')) {
      return 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80';
    }
    if (query.includes('pos') || query.includes('register') || query.includes('checkout') || query.includes('cashier')) {
      return 'https://images.unsplash.com/photo-1556742049-0a670f4a4591?auto=format&fit=crop&w=1200&q=80';
    }
    if (query.includes('cold') || query.includes('refrigerat') || query.includes('temperature') || query.includes('probe')) {
      return 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=1200&q=80';
    }
    if (query.includes('protein') || query.includes('vaccine') || query.includes('vial') || query.includes('pharma')) {
      return 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1200&q=80';
    }
    if (query.includes('cooler') || query.includes('insulated') || query.includes('pack') || query.includes('dry ice')) {
      return 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1200&q=80';
    }
    if (query.includes('quarantine') || query.includes('red line') || query.includes('isolate') || query.includes('lockout')) {
      return 'https://images.unsplash.com/photo-1583912267550-d44d9c9a29d6?auto=format&fit=crop&w=1200&q=80';
    }
    if (query.includes('incident') || query.includes('triage') || query.includes('sev-1') || query.includes('outage')) {
      return 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80';
    }
    if (query.includes('war room') || query.includes('bridge') || query.includes('communication') || query.includes('commander')) {
      return 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80';
    }
    if (query.includes('server') || query.includes('cluster') || query.includes('datacenter') || query.includes('cloud')) {
      return 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80';
    }
    if (query.includes('cleanroom') || query.includes('airlock') || query.includes('sticky mat') || query.includes('gown')) {
      return 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80';
    }
    if (query.includes('glove') || query.includes('sterile') || query.includes('sanitize') || query.includes('disinfect')) {
      return 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80';
    }
    if (query.includes('bunny suit') || query.includes('coverall') || query.includes('bench') || query.includes('boot')) {
      return 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80';
    }
    if (query.includes('pressure') || query.includes('manometer') || query.includes('pascal') || query.includes('airflow')) {
      return 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80';
    }
    if (query.includes('warehouse') || query.includes('pick') || query.includes('pack') || query.includes('scanner') || query.includes('barcode')) {
      return 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80';
    }
    if (query.includes('forklift') || query.includes('pallet') || query.includes('dock') || query.includes('cargo')) {
      return 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1200&q=80';
    }
    if (query.includes('checklist') || query.includes('sign-off') || query.includes('audit') || query.includes('ledger')) {
      return 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80';
    }
    if (query.includes('dilemma') || query.includes('quiz') || query.includes('decision') || query.includes('alarm')) {
      return 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80';
    }

    return 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80';
  };

  // Prioritize custom user image URL, then contextual photo resolution
  const activePhotoUrl = image?.url || resolveFallbackPhoto();

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

      {/* Change / Generate Image Button overlay */}
      {!cleanVideoMode && (
        <div className="absolute top-3 right-3 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="min-h-[36px] flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 text-white border border-slate-700 hover:border-sky-400 text-xs font-medium shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Replace / Generate Image</span>
          </button>
        </div>
      )}

      {/* Simplified Prompt -> Generate -> Preview -> Approve Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn text-white">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Generate Slide Image with AI</h3>
                  <p className="text-xs text-slate-400">Enter your prompt, preview the picture, and approve to replace.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 py-4 overflow-y-auto pr-1">
              {/* Step 1: Prompt Input Box */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  1. Image Prompt
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    onKeyDown={(e) => {
                      e.stopPropagation();
                      if (e.key === 'Enter' && !isGeneratingAi) {
                        e.preventDefault();
                        handleGenerateAiImage();
                      }
                    }}
                    placeholder="e.g. Retail store promotional shelf with discount price tags"
                    className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-700 focus:border-sky-500 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => handleGenerateAiImage()}
                    disabled={isGeneratingAi}
                    className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs rounded-xl flex items-center gap-2 shrink-0 transition-all cursor-pointer disabled:opacity-50 shadow-lg shadow-sky-600/20"
                  >
                    {isGeneratingAi ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Generate</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Quick Preset Prompts for 1-Click Generation */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mr-1">Quick Ideas:</span>
                  <button
                    type="button"
                    onClick={() => handleApplyPresetPrompt('Retail shelf with markdown discount price tag')}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                  >
                    🏷️ Retail Price Tag
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPresetPrompt('POS register terminal cash counter checkout')}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                  >
                    💻 POS Register
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPresetPrompt('Warehouse merchandise inventory barcode scanner')}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                  >
                    📦 Warehouse
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPresetPrompt('Quality audit compliance checklist sign-off')}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                  >
                    📋 Checklist
                  </button>
                </div>

                {aiError && (
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center justify-between gap-2">
                    <span>{aiError}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const fallback = resolveFallbackPhoto();
                        setUrlInput(fallback);
                        setProviderTag('Guaranteed Stock Photo');
                        setAiError(null);
                      }}
                      className="underline hover:text-white text-[11px] shrink-0 cursor-pointer"
                    >
                      Use Guaranteed Photo
                    </button>
                  </div>
                )}
              </div>

              {/* Step 2: Live Picture Preview Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    2. Picture Preview
                  </label>
                  {urlInput && (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono">
                        {providerTag ? providerTag : 'Ready to Apply'}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const fallback = resolveFallbackPhoto();
                          setUrlInput(fallback);
                          setProviderTag('Guaranteed Stock Photo');
                        }}
                        className="text-[10px] text-sky-400 hover:underline cursor-pointer"
                      >
                        Switch to Stock Photo
                      </button>
                    </div>
                  )}
                </div>

                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center group">
                  {isGeneratingAi ? (
                    <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
                      <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
                      <div>
                        <p className="text-xs font-medium text-slate-200">Creating your image with AI...</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Synthesizing high-quality promotional visual</p>
                      </div>
                    </div>
                  ) : urlInput ? (
                    <img
                      src={urlInput}
                      alt="Preview of generated image"
                      className="w-full h-full object-cover"
                      onError={() => {
                        const fallback = resolveFallbackPhoto();
                        setUrlInput(fallback);
                        setProviderTag('Stock Photo (Fallback)');
                        setAiError('Image provider returned refusal or failed to load. Automatically loaded high-definition stock photo.');
                      }}
                    />
                  ) : activePhotoUrl ? (
                    <img
                      src={activePhotoUrl}
                      alt="Current picture preview"
                      className="w-full h-full object-cover opacity-80"
                    />
                  ) : (
                    <div className="p-6 text-center text-slate-500 text-xs">
                      No image generated yet. Enter a prompt above and click Generate.
                    </div>
                  )}
                </div>
              </div>

              {/* Optional Caption Input */}
              <div className="space-y-1">
                <label className="block text-[11px] text-slate-400">
                  Caption / Label (Optional)
                </label>
                <input
                  type="text"
                  value={captionInput}
                  onChange={(e) => setCaptionInput(e.target.value)}
                  onKeyDown={(e) => e.stopPropagation()}
                  placeholder="e.g. Promotional merchandise shelf display"
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-slate-600"
                />
              </div>

              {/* Advanced / Alternative Sources Accordion */}
              <details className="pt-2 border-t border-slate-800 text-xs group/accordion">
                <summary className="cursor-pointer text-slate-400 hover:text-slate-200 font-medium py-1 flex items-center justify-between select-none">
                  <span>Other Options (Upload file, paste image link, or pick diagram)</span>
                  <span className="text-[10px] text-slate-500 group-open/accordion:rotate-180 transition-transform">▼</span>
                </summary>
                
                <div className="mt-3 space-y-3 pl-1">
                  {/* File Upload */}
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">Upload Local Image File</label>
                    <label className="flex items-center justify-center gap-2 p-2.5 border border-dashed border-slate-700 hover:border-slate-500 rounded-xl cursor-pointer text-slate-400 text-xs">
                      <Upload className="w-4 h-4 text-sky-400" />
                      <span>Choose image file from computer</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Direct Image URL */}
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">Direct Image URL</label>
                    <div className="flex items-center gap-2">
                      <Link className="w-4 h-4 text-slate-500 shrink-0" />
                      <input
                        type="url"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        onKeyDown={(e) => e.stopPropagation()}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="flex-1 p-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200"
                      />
                    </div>
                  </div>

                  {/* External API Key toggle */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setShowApiKeyField(!showApiKeyField)}
                      className="text-[11px] text-sky-400 hover:underline cursor-pointer"
                    >
                      {showApiKeyField ? 'Hide Custom OpenAI / Gemini Key' : 'Use Custom OpenAI DALL-E or Gemini Key?'}
                    </button>
                    {showApiKeyField && (
                      <div className="mt-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                        <input
                          type="password"
                          value={apiKeyInput}
                          onChange={(e) => setApiKeyInput(e.target.value)}
                          placeholder="sk-... or AIzaSy..."
                          className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-slate-200"
                        />
                        <p className="text-[10px] text-slate-500">
                          Leave blank to use the default free AI image generator.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </details>
            </div>

            {/* Footer Action Bar */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800 mt-auto">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!urlInput && !image?.url}
                className="px-5 py-2.5 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>Approve & Replace Image</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
