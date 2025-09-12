'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';
import { GRATEFUL_DEAD_PLAYLIST } from '../lib/audio-reactive';

interface MusicPlayerProps {
  onAudioElement?: (element: HTMLAudioElement | null) => void;
  className?: string;
}

export default function GratefulDeadMusicPlayer({ 
  onAudioElement, 
  className = "" 
}: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const track = GRATEFUL_DEAD_PLAYLIST[currentTrack];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => nextTrack();

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    // Pass audio element to parent for audio reactive system
    if (onAudioElement) {
      onAudioElement(audio);
    }

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [onAudioElement]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % GRATEFUL_DEAD_PLAYLIST.length);
    setIsPlaying(false);
  };

  const previousTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + GRATEFUL_DEAD_PLAYLIST.length) % GRATEFUL_DEAD_PLAYLIST.length);
    setIsPlaying(false);
  };


  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'fiery': return 'from-red-500 to-orange-500';
      case 'cosmic': return 'from-purple-500 to-indigo-500';
      case 'flowing': return 'from-blue-500 to-cyan-500';
      case 'bright': return 'from-yellow-400 to-green-400';
      case 'gentle': return 'from-blue-300 to-white';
      case 'mystical': return 'from-purple-600 to-pink-500';
      case 'driving': return 'from-gray-600 to-blue-600';
      case 'joyful': return 'from-pink-400 to-yellow-400';
      default: return 'from-purple-500 to-pink-500';
    }
  };

  return (
    <div className={`glassmorphic-flow p-4 rounded-xl border border-white/20 backdrop-blur-md ${className}`}>
      {/* Hidden audio element - would need actual Grateful Dead tracks */}
      <audio
        ref={audioRef}
        src={`/music/gratefulDeadSample.mp3`} // Placeholder - would need real tracks
        crossOrigin="anonymous"
      />
      
      {/* Track Info */}
      <div className="mb-4">
        <div className="flex items-center space-x-3 mb-2">
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${getMoodColor(track.mood)} flex items-center justify-center`}>
            <span className="text-white font-bold text-lg">🎵</span>
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold text-sm">{track.title}</h3>
            <p className="text-white/70 text-xs">{track.artist} • {track.album}</p>
          </div>
          <div className="text-right text-xs text-white/60">
            <div>{formatTime(currentTime)} / {formatTime(duration)}</div>
            <div className="text-xs opacity-75">{track.bpm} BPM</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-white/20 rounded-full h-1">
          <div 
            className={`bg-gradient-to-r ${getMoodColor(track.mood)} h-1 rounded-full transition-all duration-300`}
            style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-4 mb-4">
        <button
          onClick={previousTrack}
          className="w-8 h-8 rounded-full glassmorphic-flow border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:scale-110 transition-all"
        >
          <SkipBack className="w-4 h-4" />
        </button>
        
        <button
          onClick={togglePlay}
          className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-all bg-gradient-to-r ${getMoodColor(track.mood)} hover:scale-110 shadow-lg
          }`}
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
        </button>
        
        <button
          onClick={nextTrack}
          className="w-8 h-8 rounded-full glassmorphic-flow border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:scale-110 transition-all"
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>

      {/* Audio Options */}
      <div className="flex items-center justify-between">
        {/* Volume Control */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="text-white/70 hover:text-white transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-16 h-1 bg-white/20 rounded-lg appearance-none slider"
          />
        </div>

      </div>

      {/* Track Description */}
      <div className="mt-3 pt-3 border-t border-white/10">
        <p className="text-white/60 text-xs leading-relaxed">{track.description}</p>
        <div className="flex items-center space-x-3 mt-2 text-xs text-white/50">
          <span className="capitalize">Mood: {track.mood}</span>
          <span>•</span>
          <span>{track.bpm} BPM</span>
          <span>•</span>
          <span>{track.duration}</span>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        
        .slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
      `}</style>
    </div>
  );
}