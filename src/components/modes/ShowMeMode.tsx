import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  X,
  Film
} from 'lucide-react';
import { FeynmanDeck, VideoScene, AppViewMode } from '../../types/deck';
import { deriveVideoScenes } from '../../utils/deckDerivations';

interface ShowMeModeProps {
  deck: FeynmanDeck;
  onExit: () => void;
  onSwitchToMode?: (mode: AppViewMode, slideIndex?: number) => void;
}

export const ShowMeMode: React.FC<ShowMeModeProps> = ({ deck, onExit }) => {
  const scenes: VideoScene[] = deriveVideoScenes(deck);

  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
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

  // Safe fallback image if scene image is missing
  const scenePhotoUrl =
    currentScene.imageUrl ||
    deck.heroImage?.url ||
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="fixed inset-0 z-50 bg-black text-white flex flex-col select-none overflow-hidden font-sans">
      {/* Top Header Bar: Clean, Minimalist, No Unrelated Pills */}
      <div className="h-14 px-4 sm:px-6 flex items-center justify-between border-b border-white/[0.08] bg-black/90 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-2.5 truncate">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
            <Film className="w-4 h-4" />
          </div>
          <div className="truncate">
            <h1 className="text-xs sm:text-sm font-semibold text-white truncate">
              {deck.title}
            </h1>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            window.speechSynthesis?.cancel();
            onExit();
          }}
          className="min-h-[36px] flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 border border-white/10 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
          <span>Exit Video</span>
        </button>
      </div>

      {/* Main Video Screen Container - Expanded Width and Prominent Video Viewport */}
      <div className="flex-1 flex flex-col items-center justify-start p-3 sm:p-5 md:p-6 overflow-y-auto max-w-5xl mx-auto w-full">
        {/* Large Prominent 16:9 Widescreen Video Player */}
        <div className="w-full relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-black shadow-2xl shrink-0 aspect-video mb-4 group">
          <img
            src={scenePhotoUrl}
            alt={currentScene.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.01]"
          />

          {/* Vignette gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

          {/* Live Narration Subtitle Overlay (When playing) */}
          {isPlaying && (
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 pointer-events-none">
              <div className="inline-block px-4 py-2.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/15 text-xs sm:text-sm text-neutral-100 shadow-2xl max-w-2xl animate-fadeIn">
                <span className="font-medium leading-relaxed">{currentScene.narrationScript}</span>
              </div>
            </div>
          )}

          {/* Center Play / Pause Floating Button */}
          <button
            type="button"
            onClick={togglePlay}
            className={`absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity cursor-pointer ${
              isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'
            }`}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-600/90 hover:bg-blue-500 text-white flex items-center justify-center shadow-2xl backdrop-blur-md active:scale-95 transition-all">
              {isPlaying ? (
                <Pause className="w-7 h-7 sm:w-8 sm:h-8 fill-current" />
              ) : (
                <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1" />
              )}
            </div>
          </button>
        </div>

        {/* Integrated Player Controls Bar & Segmented Scrubber */}
        <div className="w-full bg-[#0d121d] border border-white/[0.08] rounded-2xl p-4 shadow-xl shrink-0 space-y-3 mb-4">
          {/* Segmented Timeline Bar (Clickable to jump between scenes) */}
          <div className="flex items-center gap-1.5 w-full">
            {scenes.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  window.speechSynthesis?.cancel();
                  setCurrentSceneIndex(idx);
                }}
                className="h-2 flex-1 rounded-full overflow-hidden bg-neutral-800 transition-all cursor-pointer relative group/seg"
                title={`Jump to Scene ${idx + 1}`}
              >
                <div
                  className={`h-full transition-all duration-300 ${
                    currentSceneIndex === idx
                      ? 'bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.7)]'
                      : currentSceneIndex > idx
                      ? 'bg-blue-900/80'
                      : 'bg-transparent'
                  }`}
                  style={{
                    width: currentSceneIndex === idx ? `${progress}%` : currentSceneIndex > idx ? '100%' : '0%',
                  }}
                />
              </button>
            ))}
          </div>

          {/* Media Player Controls Bar */}
          <div className="flex items-center justify-between pt-1">
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

            {/* Scene Counter Indicator */}
            <div className="text-xs font-mono text-neutral-400">
              <span className="text-blue-400 font-semibold">{currentScene.phaseLabel || `Scene ${currentScene.sceneNumber}`}</span>
              <span className="mx-2">•</span>
              <span>{currentSceneIndex + 1} of {scenes.length}</span>
            </div>

            {/* Right: Audio Narration & Speed */}
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

        {/* Scene Details Card */}
        <div className="w-full bg-[#0d121d] border border-white/[0.08] rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl shrink-0">
          {/* Header Line: Dynamic Phase Label + Duration */}
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-blue-400 font-bold uppercase tracking-wider">
              {currentScene.phaseLabel ? currentScene.phaseLabel.toUpperCase() : `SCENE ${currentScene.sceneNumber}`}
            </span>
            <span className="text-neutral-400">
              {currentScene.durationSeconds}s
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

          {/* Learner Focus / Watchout */}
          {currentScene.criticalWatchout && (
            <div className="border-t border-white/[0.08] mt-4 pt-3">
              <div className="text-[10px] font-bold font-mono text-neutral-400 uppercase tracking-widest mb-1">
                LEARNER FOCUS
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed font-normal">
                {currentScene.criticalWatchout}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
