import { useEffect, useState } from 'react';
import { soundManager } from '../utils/sounds';

export function SoundToggle() {
  const [isMuted, setIsMuted] = useState(() => {
    const savedMute = localStorage.getItem('sound-muted');
    return savedMute === 'true';
  });

  useEffect(() => {
    if (isMuted) {
      soundManager.toggleMute();
    }
  }, []); // Apply initial mute state

  const toggleMute = () => {
    const newMuteState = soundManager.toggleMute();
    setIsMuted(newMuteState);
    localStorage.setItem('sound-muted', newMuteState.toString());
  };

  return (
    <button
      onClick={toggleMute}
      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
      aria-label={isMuted ? "Unmute sound effects" : "Mute sound effects"}
    >
      {isMuted ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="3" x2="21" y2="21"></line>
          <path d="M18.63 13A3 3 0 0 0 19 12"></path>
          <path d="M21 12a9 9 0 0 0-7.72-8.61"></path>
          <path d="M9 9h-.01"></path>
          <path d="M11 5a3 3 0 0 1 4.01 2.22"></path>
          <path d="M17.73 17.73a9 9 0 0 1-12.66-1.08"></path>
          <path d="M3 13H5L9 9"></path>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        </svg>
      )}
    </button>
  );
}
