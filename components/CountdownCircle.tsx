'use client';

import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { useMemo } from 'react';

interface CountdownCircleProps {
  duration: number;
  onComplete?: () => void;
}

export function CountdownCircle({ duration, onComplete }: CountdownCircleProps) {
  const children = useMemo(() => ({ remainingTime }: { remainingTime: number }) => {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  return (
    <div className="flex flex-col items-center">
      <CountdownCircleTimer
        isPlaying
        duration={duration}
        colors={['#004777', '#F7B801', '#A30000', '#A30000']}
        colorsTime={[duration, duration * 0.66, duration * 0.33, 0]}
        onComplete={onComplete}
      >
        {children}
      </CountdownCircleTimer>
    </div>
  );
} 