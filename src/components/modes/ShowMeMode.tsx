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
import { FeynmanDeck, VideoScene } from '../../types/deck';
import { deriveVideoScenes } from '../../utils/deckDerivations';
import { CardVisual } from '../visuals/CardVisual';

interface ShowMeModeProps {
  deck: FeynmanDeck;
  onExit: () => void;
}

export const ShowMeMode: React.FC<ShowMeModeProps> = ({ deck, onExit }) => {
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
      <div className="h-14 px-4 sm:px-6 flex items-center justify-between border-b border-white/[0.08] bg-black/80 backdrop-blur-xl">
        <div className="flex items-center gap-2.5 truncate">
          <div className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center font-bold text-xs">
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

      {/* Main Video Viewport (Cinematic 16:9 Canvas) */}
      <div className="flex-1 flex items-center justify-center p-3 sm:p-6 md:p-8 overflow-y-auto">
        <div className="w-full max-w-5xl bg-neutral-950 border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl flex flex-col">
          {/* Top Scene Progress Bar */}
          <div className="w-full h-1 bg-neutral-900">
            <div
              className="h-full bg-white transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Video Stage 2-Column Split: Visual Graphic (Exact 60% width, NO text overlays) + Scene Details (40% width) */}
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 p-6 sm:p-8 items-stretch">
            {/* Visual Stage (Exact 60% of width on desktop) — Pure Video Screen with ZERO text overlays */}
            <div className="lg:col-span-6 w-full relative rounded-2xl overflow-hidden border border-white/[0.08] bg-black shadow-2xl flex flex-col justify-center min-h-[320px] sm:min-h-[400px]">
              <CardVisual
                image={{
                  diagramType: currentScene.diagramType || 'flowchart',
                }}
                onUpdateImage={() => {}}
                defaultDiagram={currentScene.diagramType || 'flowchart'}
                titleContext={currentScene.title}
                cleanVideoMode={true}
              />
            </div>

            {/* Scene Details Column (Exact 40% of width) */}
            <div className="lg:col-span-4 flex flex-col justify-center space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 uppercase tracking-wider">
                <span className="text-white font-bold">SCENE {currentScene.sceneNumber} OF {scenes.length}</span>
                <span>·</span>
                <span className="text-neutral-400">{currentScene.phaseLabel}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                {currentScene.title}
              </h2>

              <div className="space-y-3 pt-3 border-t border-white/[0.08] text-xs">
                <div>
                  <span className="font-semibold text-neutral-400 block mb-1 uppercase tracking-wider text-[10px]">
                    Required Action:
                  </span>
                  <p className="text-neutral-200 font-normal leading-relaxed bg-neutral-900/60 p-3 rounded-xl border border-white/5">
                    {currentScene.keyAction}
                  </p>
                </div>

                {currentScene.criticalWatchout && (
                  <div className="p-3.5 rounded-2xl bg-neutral-900 border border-red-500/30 text-red-300">
                    <span className="font-bold block mb-0.5 uppercase tracking-wider text-[10px] text-red-400">
                      Watchout:
                    </span>
                    {currentScene.criticalWatchout}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Scene Playlist Strip */}
          <div className="px-6 py-3 border-t border-white/[0.08] bg-black/60 flex items-center gap-2 overflow-x-auto scrollbar-none">
            {scenes.map((scene, idx) => (
              <button
                key={scene.id}
                type="button"
                onClick={() => {
                  window.speechSynthesis?.cancel();
                  setCurrentSceneIndex(idx);
                }}
                className={`min-h-[44px] px-3.5 py-1.5 rounded-full text-left border transition-all shrink-0 flex items-center gap-2.5 cursor-pointer ${
                  currentSceneIndex === idx
                    ? 'border-white bg-white text-black font-semibold'
                    : 'border-white/[0.08] hover:border-white/20 bg-neutral-900 text-neutral-400'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    currentSceneIndex === idx ? 'bg-black text-white' : 'bg-neutral-800 text-neutral-300'
                  }`}
                >
                  {scene.sceneNumber}
                </div>
                <div className="truncate max-w-[140px] text-xs">
                  {scene.title}
                </div>
              </button>
            ))}
          </div>

          {/* Media Player Controls Bar */}
          <div className="px-6 py-4 border-t border-white/[0.08] bg-neutral-950 flex items-center justify-between gap-4">
            {/* Left: Play/Pause and Skip buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentSceneIndex === 0}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center text-neutral-400 hover:text-white disabled:opacity-30 rounded-full transition-colors active:scale-95 cursor-pointer"
                aria-label="Previous scene"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={togglePlay}
                className="min-h-[48px] min-w-[48px] rounded-full bg-white hover:bg-neutral-200 text-black flex items-center justify-center shadow-lg active:scale-95 transition-transform cursor-pointer"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={currentSceneIndex === scenes.length - 1}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center text-neutral-400 hover:text-white disabled:opacity-30 rounded-full transition-colors active:scale-95 cursor-pointer"
                aria-label="Next scene"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            {/* Center: Timestamp info */}
            <div className="text-xs text-neutral-400 font-mono hidden sm:block">
              Scene {currentSceneIndex + 1} / {scenes.length} · ~{currentScene.durationSeconds}s
            </div>

            {/* Right: Audio narration & Speed controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className={`min-h-[40px] min-w-[40px] flex items-center justify-center rounded-full transition-colors cursor-pointer ${
                  isMuted ? 'text-red-400 bg-red-950/30 border border-red-500/30' : 'text-neutral-300 hover:text-white bg-neutral-900 border border-white/10'
                }`}
                title={isMuted ? 'Unmute voice' : 'Mute voice'}
                aria-label="Toggle audio"
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
                className="min-h-[40px] px-3 py-1 text-xs font-mono font-bold bg-neutral-900 hover:bg-neutral-800 text-white border border-white/10 rounded-full cursor-pointer"
                title="Playback speed"
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
