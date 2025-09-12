'use client';

import { useState, useRef } from 'react';
import { Music, X } from 'lucide-react';
import GratefulDeadMusicPlayer from './GratefulDeadMusicPlayer';
import AudioReactiveSystem, { AudioData } from '../lib/audio-reactive';

interface FloatingMusicPlayerProps {
  onAudioSystemChange?: (audioSystem: AudioReactiveSystem | null) => void;
  onAudioDataChange?: (audioData: AudioData | null) => void;
}

export default function FloatingMusicPlayer({ onAudioSystemChange, onAudioDataChange }: FloatingMusicPlayerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const audioSystemRef = useRef<AudioReactiveSystem | null>(null);
  const animationRef = useRef<number>();

  const handleAudioElement = (audioElement: HTMLAudioElement | null) => {
    if (audioElement && !audioSystemRef.current) {
      const audioSystem = new AudioReactiveSystem();
      audioSystem.initializeAudio(audioElement).then((success) => {
        if (success) {
          audioSystemRef.current = audioSystem;
          if (onAudioSystemChange) {
            onAudioSystemChange(audioSystem);
          }
          startAudioDataLoop();
        }
      });
    }
  };

  // Removed microphone functionality - focusing only on track audio reactivity

  const startAudioDataLoop = () => {
    const updateAudioData = () => {
      if (audioSystemRef.current && onAudioDataChange) {
        const audioData = audioSystemRef.current.getAudioData();
        onAudioDataChange(audioData);
      }
      animationRef.current = requestAnimationFrame(updateAudioData);
    };
    updateAudioData();
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all duration-300 glassmorphic-flow"
        title="Open Music Player"
      >
        <Music className="w-6 h-6" />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full animate-pulse opacity-50"></div>
      </button>
    );
  }

  return (
    <div className={`fixed z-50 transition-all duration-300 ${
      isMinimized 
        ? 'bottom-4 right-4 w-80'
        : 'bottom-4 right-4 w-80 md:w-96'
    }`}>
      <div className="glassmorphic-flow border border-white/20 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-3 bg-black/20">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Music className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">Grateful Dead Player</h3>
              <p className="text-white/60 text-xs">Audio Reactive Visuals</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white/70 hover:text-white transition-colors"
              title={isMinimized ? "Expand" : "Minimize"}
            >
              <div className="w-4 h-1 bg-current rounded"></div>
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Music Player */}
        {!isMinimized && (
          <div className="p-1">
            <GratefulDeadMusicPlayer 
              onAudioElement={handleAudioElement}
            />
          </div>
        )}

        {isMinimized && (
          <div className="px-4 pb-3">
            <div className="text-center">
              <p className="text-white/60 text-xs">Click to expand player</p>
            </div>
          </div>
        )}
      </div>

      {/* Info tooltip */}
      <div className="absolute -top-12 right-0 bg-black/80 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Enable audio for reactive visuals
      </div>
    </div>
  );
}