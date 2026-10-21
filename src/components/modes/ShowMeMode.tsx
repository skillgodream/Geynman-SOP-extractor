import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  X,
  Share2,
  Check,
  Film
} from 'lucide-react';
import { FeynmanDeck, VideoScene, AppViewMode } from '../../types/deck';
import { deriveVideoScenes } from '../../utils/deckDerivations';
import { CardVisual } from '../visuals/CardVisual';
import { ModePills } from '../ModePills';

interface ShowMeModeProps {
  deck: FeynmanDeck;
  onExit: () => void;
  onSwitchToMode?: (mode: AppViewMode, slideIndex?: number) => void;
}

export const ShowMeMode: React.FC<ShowMeModeProps> = ({ deck, onExit, onSwitchToMode }) => {
  const scenes: VideoScene[] = deriveVideoScenes(deck);

  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [progress, setProgress] = useState(0);

  const currentScene = scenes[currentSceneIndex] || scenes[0];

  // Audio Speech Synthesis Narration ref
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Trigger speech narration when scene changes or play is pressed
  useEffect(() => {
    if (!isPlaying) {
      window.speechSynthesis?.cancel();
      return;
    }

    if (isMuted || !window.speechSynthesis) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(currentScene.narrationScript);
    utterance.rate = playbackSpeed;
    utterance.pitch = 1.0;
    utterance.lang = 'en-US';

    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(
      (v) =>
        v.lang.startsWith('en') &&
        (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Premium'))
    );
    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onend = () => {
      if (currentSceneIndex < scenes.length - 1) {
        setTimeout(() => {
          setCurrentSceneIndex((prev) => prev + 1);
        }, 800);
      } else {
        setIsPlaying(false);
      }
    };

    speechUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);

    return () => {
      window.speechSynthesis?.cancel();
    };
  }, [currentSceneIndex, isPlaying, isMuted, playbackSpeed, scenes.length, currentScene.narrationScript]);

  // Scene timer progress simulation when playing
  useEffect(() => {
    if (!isPlaying) return;

    setProgress(0);
    const interval = 100;
    const totalMs = (currentScene.durationSeconds * 1000) / playbackSpeed;
    const step = (interval / totalMs) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [currentSceneIndex, isPlaying, playbackSpeed, currentScene.durationSeconds]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrev = () => {
    window.speechSynthesis?.cancel();
    setCurrentSceneIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    window.speechSynthesis?.cancel();
    setCurrentSceneIndex((prev) => Math.min(scenes.length - 1, prev + 1));
  };

  const handleCopyVideoPrompt = () => {
    const promptText = `PROMPT FOR AI VIDEO GENERATION (VEO / SORA / RUNWAY):
Topic: ${deck.title}
Scene ${currentScene.sceneNumber}: "${currentScene.title}"
Visual Scene Description: ${currentScene.visualPrompt}
Key Action: ${currentScene.keyAction}
Cinematic Style: Photorealistic 4K documentary, precision operational workplace, smooth camera push-in, shallow depth of field, clear instructional focus.
Narration Audio Voiceover: "${currentScene.narrationScript}"`;

    navigator.clipboard.writeText(promptText);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black text-white flex flex-col select-none overflow-hidden font-sans">
      {/* Top Header Bar */}
      <div className="h-14 px-4 sm:px-6 flex items-center justify-between border-b border-white/[0.08] bg-black/90 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-2.5 truncate">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
            <Film className="w-4 h-4" />
          </div>
          <div className="truncate">
            <div className="text-xs sm:text-sm font-semibold text-white truncate">
              {deck.title}
            </div>
            <div className="text-[10px] sm:text-xs text-neutral-400 font-mono">
              SHOW ME · Text-to-Video Walkthrough
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyVideoPrompt}
            className="min-h-[38px] flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-xs font-medium text-neutral-200 border border-white/10 transition-colors cursor-pointer"
            title="Copy AI Video Generation Prompt for this scene"
          >
            {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Export Prompt</span>
          </button>

          <button
            type="button"
            onClick={() => {
              window.speechSynthesis?.cancel();
              onExit();
            }}
            className="min-h-[38px] flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 border border-white/10 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span>Exit Video</span>
          </button>
        </div>
      </div>

      {/* Mode Pills Sub-Bar */}
      {onSwitchToMode && (
        <div className="px-4 py-1.5 border-b border-white/[0.08] bg-neutral-950/90 backdrop-blur-md flex items-center justify-center shrink-0">
          <ModePills
            activeMode="show_me"
            slideIndex={currentSceneIndex + 1}
            onSelectMode={(mode, idx) => {
              window.speechSynthesis?.cancel();
              onSwitchToMode(mode, idx);
            }}
          />
        </div>
      )}

      {/* Main Video Screen Container (Matching Screenshot Layout) */}
      <div className="flex-1 flex flex-col items-center justify-start p-3 sm:p-5 md:p-6 overflow-y-auto max-w-3xl mx-auto w-full">
        {/* Top Video Stage Screen Card */}
        <div className="w-full relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-black shadow-2xl shrink-0 min-h-[260px] sm:min-h-[340px] md:min-h-[380px] flex items-center justify-center mb-4">
          <CardVisual
            image={{
              diagramType: currentScene.diagramType || 'flowchart',
              url: currentScene.imageUrl,
            }}
            onUpdateImage={() => {}}
            defaultDiagram={currentScene.diagramType || 'flowchart'}
            titleContext={currentScene.title}
            cleanVideoMode={true}
          />
        </div>

        {/* Scene Details Card (Matching Screenshot Styling) */}
        <div className="w-full bg-[#0d121d] border border-white/[0.08] rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl mb-4 shrink-0">
          {/* Header Line: Dynamic Phase Label + Scene Counter */}
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-blue-400 font-bold uppercase tracking-wider">
              {currentScene.phaseLabel ? currentScene.phaseLabel.toUpperCase() : `SCENE ${currentScene.sceneNumber}`}
            </span>
            <span className="text-neutral-400">
              Scene {currentScene.sceneNumber} of {scenes.length} • {currentScene.durationSeconds}s
            </span>
          </div>

          {/* Big Bold Title */}
          <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight mb-2">
            {currentScene.title}
          </h2>

          {/* Action Description */}
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
            {currentScene.keyAction}
          </p>

          {/* Learner Focus / Watchout Divider & Section */}
          <div className="border-t border-white/[0.08] mt-4 pt-3">
            <div className="text-[10px] font-bold font-mono text-neutral-400 uppercase tracking-widest mb-1">
              LEARNER FOCUS
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed font-normal">
              {currentScene.criticalWatchout || 'Ensures compliance with standard operational quality and safety guidelines.'}
            </p>
          </div>
        </div>

        {/* Bottom Progress Segment Bar & Pill Scene Playlist (Matching Screenshot) */}
        <div className="w-full bg-[#0d121d]/80 border border-white/[0.08] rounded-2xl p-4 shadow-xl shrink-0 space-y-3">
          {/* Segmented Scene Bar */}
          <div className="flex items-center gap-1.5 w-full">
            {scenes.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  currentSceneIndex === idx
                    ? 'bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.6)]'
                    : currentSceneIndex > idx
                    ? 'bg-blue-900/60'
                    : 'bg-neutral-800'
                }`}
              />
            ))}
          </div>

          {/* Horizontal Pill Playlist */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pt-1">
            {scenes.map((scene, idx) => {
              const isActive = currentSceneIndex === idx;
              return (
                <button
                  key={scene.id}
                  type="button"
                  onClick={() => {
                    window.speechSynthesis?.cancel();
                    setCurrentSceneIndex(idx);
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-mono font-semibold shrink-0 flex items-center gap-2 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-neutral-900 text-neutral-400 hover:text-white border border-white/10'
                  }`}
                >
                  <span>{String(scene.sceneNumber).padStart(2, '0')}.</span>
                  <span className="truncate max-w-[150px]">{scene.title}</span>
                </button>
              );
            })}
          </div>

          {/* Media Player Controls Bar */}
          <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentSceneIndex === 0}
                className="p-2 text-neutral-400 hover:text-white disabled:opacity-30 rounded-full transition-colors cursor-pointer"
                aria-label="Previous scene"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-md active:scale-95 transition-transform cursor-pointer"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={currentSceneIndex === scenes.length - 1}
                className="p-2 text-neutral-400 hover:text-white disabled:opacity-30 rounded-full transition-colors cursor-pointer"
                aria-label="Next scene"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className={`p-2 rounded-full transition-colors cursor-pointer ${
                  isMuted ? 'text-red-400 bg-red-950/30' : 'text-neutral-300 hover:text-white'
                }`}
                title={isMuted ? 'Unmute voice' : 'Mute voice'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  const speeds = [1, 1.25, 1.5];
                  const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
                  setPlaybackSpeed(speeds[nextIdx]);
                }}
                className="px-2.5 py-1 text-xs font-mono font-bold bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-white/10 rounded-full cursor-pointer"
              >
                {playbackSpeed}x
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
