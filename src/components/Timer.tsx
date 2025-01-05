import { useEffect } from 'react';
import { soundManager } from '../utils/sounds';

interface TimerProps {
  seconds: number;
  onTimeUp: () => void;
  isActive: boolean;
}

export function Timer({ seconds, isActive, onTimeUp }: TimerProps) {
  const progressPercentage = (seconds / 30) * 100;

  useEffect(() => {
    if (isActive) {
      if (seconds === 30) {
        // Start the continuous tick when timer starts
        soundManager.startTickLoop();
      } else if (seconds <= 10) {
        // Stop the continuous tick and start the last tick sound
        soundManager.stopTickLoop();
        if (seconds > 0) {
          soundManager.playSound('LAST_TICK');
        }
      }
    } else {
      // Stop the tick loop when timer is not active
      soundManager.stopTickLoop();
    }

    if (seconds === 0) {
      onTimeUp();
    }

    return () => {
      if (!isActive) {
        soundManager.stopTickLoop();
      }
    };
  }, [seconds, isActive, onTimeUp]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-bold text-gray-600">Time Remaining</div>
        <div className="text-4xl font-black">
          {seconds}s
        </div>
      </div>
      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
        <div
          className="h-full bg-black transition-all duration-1000 ease-linear"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
}