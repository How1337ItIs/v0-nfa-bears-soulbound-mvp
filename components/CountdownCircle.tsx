'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

const CountdownCircleTimer = dynamic(
  () => import('react-countdown-circle-timer').then(mod => mod.CountdownCircleTimer),
  { ssr: false }
);

interface CountdownCircleProps {
  duration: number;
  onComplete?: () => void;
}

export function CountdownCircle({ duration, onComplete }: CountdownCircleProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex flex-col items-center">
        <div className="w-32 h-32 rounded-full bg-gray-100 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <CountdownCircleTimer
        isPlaying
        duration={duration}
        colors={['#004777', '#F7B801', '#A30000', '#A30000']}
        colorsTime={[duration, duration * 0.66, duration * 0.33, 0]}
        onComplete={onComplete}
      >
        {({ remainingTime }) => {
          const minutes = Math.floor(remainingTime / 60);
          const seconds = remainingTime % 60;
          return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }}
      </CountdownCircleTimer>
    </div>
  );
} 