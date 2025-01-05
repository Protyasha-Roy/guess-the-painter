import { useState, useEffect, useCallback } from 'react';
import { Painting, GameStats } from '../types';
import { fetchRandomPainting } from '../utils/wikidata';
import { getUserStats, updateUserStats, incrementTotalPaintings } from '../utils/supabase';
import { Timer } from './Timer';
import { PaintingDisplay } from './PaintingDisplay';
import { GuessInput } from './GuessInput';
import { LoadingSpinner } from './LoadingSpinner';
import { GameStats as GameStatsDisplay } from './GameStats';
import { Leaderboard } from './Leaderboard';
import Login from './Login';
import { soundManager } from '../utils/sounds';
import { SoundToggle } from './SoundToggle';
import { trackEvent } from '../utils/analytics';

export function Game() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [painting, setPainting] = useState<Painting | null>(null);
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong-guess' | 'waiting' | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [stats, setStats] = useState<GameStats>({
    totalPaintings: 0,
    totalGuesses: 0,
    correctGuesses: 0,
    wrongGuesses: 0,
    score: 0,
    rank: 0
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [mobileView, setMobileView] = useState('stats');
  const [username, setUsername] = useState('');

  // Check if user is logged in
  useEffect(() => {
    const currentUser = localStorage.getItem('current-user');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      setIsLoggedIn(true);
      setUsername(user.username);
      // Load user stats and a new painting
      getUserStats(user.id).then(userStats => {
        if (userStats) {
          setStats(userStats);
        }
      });
      loadNewPainting(); // Load a new painting when user signs in
    }
  }, []);

  const loadNewPainting = async () => {
    setImageLoading(true);
    setFeedback(null);
    setGuess('');
    setTimeLeft(30);
    
    try {
      // Set painting to null first to trigger loading state
      setPainting(null);
      const newPainting = await fetchRandomPainting();
      setPainting(newPainting);
      soundManager.playSound('START');
      trackEvent('load_painting', {
        artist: newPainting.artist,
        title: newPainting.title
      });
      // Increment total paintings in stats
      const currentUser = localStorage.getItem('current-user');
      if (currentUser) {
        const user = JSON.parse(currentUser);
        const newStats = await incrementTotalPaintings(user.id);
        if (newStats) {
          setStats(newStats);
        }
      }
    } catch (error) {
      console.error('Error loading painting:', error);
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setIsTimerActive(true);
  };

  useEffect(() => {
    loadNewPainting();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timeLeft > 0 && isTimerActive) {
      timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      handleTimeUp();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, isTimerActive]);

  const handleTimeUp = useCallback(() => {
    setIsTimerActive(false);
    soundManager.stopTickLoop();
    soundManager.playSound('GAMEOVER');
    if (painting) {
      trackEvent('time_up', {
        artist: painting.artist,
        title: painting.title
      });
      const currentUser = localStorage.getItem('current-user');
      if (currentUser) {
        const user = JSON.parse(currentUser);
        updateUserStats(user.id, false).then(newStats => {
          if (newStats) {
            setStats(newStats);
          }
        });
      }
    }
  }, [painting]);

  const handleGuess = async () => {
    if (!painting || !isTimerActive || !guess.trim()) return;
    
    const isCorrect = guess.toLowerCase() === painting.artist.toLowerCase();
    const currentUser = localStorage.getItem('current-user');
    
    trackEvent('make_guess', {
      correct: isCorrect,
      artist: painting.artist,
      timeLeft: timeLeft,
      guessText: guess.toLowerCase()
    });
    
    if (currentUser) {
      const user = JSON.parse(currentUser);
      const newStats = await updateUserStats(user.id, isCorrect);
      if (newStats) {
        setStats(newStats);
      }
    }
    
    if (isCorrect) {
      setFeedback('correct');
      setIsTimerActive(false);
      soundManager.stopTickLoop();
      soundManager.playSound('CORRECT');
    } else {
      setFeedback('wrong-guess');
      setGuess('');
      soundManager.playSound('WRONG');
      // Reset feedback after 2 seconds
      setTimeout(() => setFeedback(null), 2000);
    }
  };

  const handleLogin = async (userData: { id: string; username: string }) => {
    try {
      localStorage.setItem('current-user', JSON.stringify(userData));
      setIsLoggedIn(true);
      setUsername(userData.username);
      
      trackEvent('user_login', {
        username: userData.username
      });
      
      const stats = await getUserStats(userData.id);
      if (stats) {
        setStats(stats);
        trackEvent('load_stats', {
          totalGuesses: stats.totalGuesses,
          correctGuesses: stats.correctGuesses,
          score: stats.score
        });
      }
      
      loadNewPainting(); // Load a new painting when user signs in
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const handleLogout = () => {
    soundManager.stopTickLoop();
    soundManager.stopAllSounds();
    localStorage.removeItem('current-user');
    setIsLoggedIn(false);
    setUsername('');
    setStats({
      totalPaintings: 0,
      totalGuesses: 0,
      correctGuesses: 0,
      wrongGuesses: 0,
      score: 0,
      rank: 0
    });
    trackEvent('user_logout');
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#FFF5E4] p-2 sm:p-4 md:p-8 overflow-x-hidden">
      <div className="grid lg:grid-cols-[250px_1fr_250px] xl:grid-cols-[300px_1fr_300px] gap-2 sm:gap-4 md:gap-8 max-w-[1600px] mx-auto">
        {/* Left Column - Title and How to Play */}
        <div className="hidden lg:block lg:space-y-8">
          <div className="text-center">
            <h1 className="text-xl md:text-3xl font-black uppercase">
              Guess The Painter
            </h1>
          </div>

          <div className="border-[3px] border-black bg-white p-3 md:p-4 shadow-neo">
            <h2 className="text-lg md:text-xl font-black uppercase mb-3 border-b-[3px] border-black pb-2">How to Play</h2>
            <ul className="list-disc pl-4 space-y-1 text-sm">
              <li>You have 30 seconds to guess the painter of each artwork</li>
              <li>Type your guess in the input field and press Enter or Click the 'Guess' button</li>
              <li>Get 10 points for each correct guess</li>
              <li>Wrong guesses don't affect your score</li>
            </ul>
            <h2 className="text-lg md:text-xl font-black uppercase mb-3 border-b-[3px] border-black pb-2">Tips</h2>
            <ul className="list-disc pl-4 space-y-1 text-sm">
              <li>Most paintings are from old artists</li>
              <li>Try to guess the artist's full name</li>
              <li>Spelling must be correct (but not case sensitive)</li>
              <li>Sometimes it might have short names instead of full form names. So, if you are confident about an artist, and it's saying wrong guess then keep trying with full name, or surname</li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              <div>
                created by <a href="https://protyasharoy.onrender.com" target="_blank" rel="noopener noreferrer" className="font-medium text-orange-500 hover:underline">Protyasha Roy</a>
              </div>
              <button
                onClick={handleLogout}
                className="bg-white border-[3px] border-black px-4 py-1 font-bold text-sm shadow-neo hover:bg-gray-100 transition-colors"
              >
                Logout
              </button>
            </div>
            <div className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Guess The Painter. All rights reserved.
            </div>
          </div>
        </div>

        {/* Mobile Title and Menu Toggle */}
        <div className="lg:hidden space-y-2 sm:space-y-3 mb-2 sm:mb-3">
          <div className="text-center">
            <h1 className="text-xl md:text-3xl font-black uppercase">
              Guess The Painter
            </h1>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              <div>
                created by <a href="https://protyasharoy.onrender.com" target="_blank" rel="noopener noreferrer" className="font-medium text-orange-500 hover:underline">Protyasha Roy</a>
              </div>
              <button
                onClick={handleLogout}
                className="bg-white border-[3px] border-black px-4 py-1 font-bold text-sm shadow-neo hover:bg-gray-100 transition-colors"
              >
                Logout
              </button>
            </div>
            <div className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Guess The Painter. All rights reserved.
            </div>
          </div>
          <button
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className="w-full bg-white border-[3px] border-black p-2 font-black text-base flex justify-center items-center gap-2 shadow-neo"
          >
            {isDrawerOpen ? 'Hide Menu ▼' : 'Show Menu ▲'}
          </button>
        </div>

        {/* Main Game Area */}
        <div className="space-y-2 sm:space-y-4 md:space-y-8 order-1 lg:order-2">
          <div className="border-[3px] border-black bg-white p-3 sm:p-4 md:p-6 shadow-neo space-y-2 sm:space-y-4 md:space-y-6">
            <div className="relative min-h-[200px]">
              {(!painting || imageLoading) && (
                <div className="absolute inset-0 flex items-center justify-center bg-white">
                  <LoadingSpinner />
                </div>
              )}
              {painting && (
                <PaintingDisplay 
                  painting={painting} 
                  onImageLoad={handleImageLoad}
                  showTitle={feedback === 'correct' || timeLeft === 0}
                />
              )}
            </div>

            <div className="space-y-2 sm:space-y-4">
              <div className="relative">
                {feedback === 'wrong-guess' && timeLeft > 0 && !imageLoading && (
                  <div className="mb-2 text-center py-2 px-4 bg-orange-500 text-white border-[3px] border-black shadow-neo font-bold">
                    Wrong guess! Try again!
                  </div>
                )}
                <Timer seconds={timeLeft} onTimeUp={handleTimeUp} isActive={!imageLoading} />
              </div>

              <GuessInput
                guess={guess}
                onChange={setGuess}
                onSubmit={handleGuess}
                disabled={timeLeft === 0 || imageLoading || feedback === 'correct'}
              />
            </div>

            {(feedback === 'correct' || timeLeft === 0) && (
              <button
                onClick={loadNewPainting}
                className="w-full px-6 py-4 bg-orange-500 text-white font-black uppercase border-[3px] border-black shadow-neo hover:bg-orange-600 transition-colors"
              >
                Next Painting
              </button>
            )}
          </div>
        </div>

        {/* Right Column - Stats */}
        <div className="hidden lg:block order-3 space-y-8">
          <div className="border-[3px] border-black bg-white p-4 md:p-6 shadow-neo">
            <div className="flex items-center justify-between mb-4 border-b-[3px] border-black pb-2">
              <h2 className="text-xl md:text-2xl font-black uppercase">Your Stats</h2>
              <SoundToggle />
            </div>
            <div className="text-lg font-bold mb-4 text-orange-500">{username}</div>
            <GameStatsDisplay stats={stats} />
          </div>
          <Leaderboard key={stats.score} /> {/* Add key to force refresh */}
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 max-w-[100vw] overflow-x-hidden">
        <div className={`bg-white border-t-[3px] border-black p-2 sm:p-4 transition-all duration-300 ${
          isDrawerOpen ? 'max-h-[80vh] opacity-100 overflow-y-auto' : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="flex gap-1 sm:gap-2 mb-3">
            <button 
              onClick={() => setMobileView('stats')}
              className={`flex-1 py-2 font-black text-base border-[3px] border-black transition-colors ${
                mobileView === 'stats' 
                ? 'bg-[#93FFD8]' 
                : 'bg-white hover:bg-gray-100'
              }`}
            >
              Game Stats
            </button>
            <button 
              onClick={() => setMobileView('leaderboard')}
              className={`flex-1 py-2 font-black text-base border-[3px] border-black transition-colors ${
                mobileView === 'leaderboard' 
                ? 'bg-[#93FFD8]' 
                : 'bg-white hover:bg-gray-100'
              }`}
            >
              Leaderboard
            </button>
            <button 
              onClick={() => setMobileView('rules')}
              className={`flex-1 py-2 font-black text-base border-[3px] border-black transition-colors ${
                mobileView === 'rules' 
                ? 'bg-[#93FFD8]' 
                : 'bg-white hover:bg-gray-100'
              }`}
            >
              Rules
            </button>
          </div>
          
          {mobileView === 'stats' ? (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-black uppercase">Your Stats</h2>
                  <SoundToggle />
                </div>
                <div className="text-lg font-bold mb-4 text-orange-500">{username}</div>
                <GameStatsDisplay stats={stats} compact />
              </div>
            </div>
          ) : mobileView === 'leaderboard' ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-black uppercase mb-4">Leaderboard</h2>
                <Leaderboard key={stats.score} /> {/* Add key to force refresh */}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <ul className="list-disc pl-4 space-y-1 text-sm">
                <li>You have 30 seconds to guess the painter of each artwork</li>
                <li>Type your guess in the input field and press Enter</li>
                <li>Get 10 points for each correct guess</li>
                <li>Wrong guesses don't affect your score</li>
              </ul>
              <h2 className="text-lg md:text-xl font-black uppercase mb-3 border-b-[3px] border-black pb-2">Tips</h2>
              <ul className="list-disc pl-4 space-y-1 text-sm">
                <li>Most paintings are from old artists</li>
                <li>Try to guess the artist's full name</li>
                <li>Spelling must be correct (but not case sensitive)</li>
                <li>Sometimes it might have short names instead of full form names. So, if you are confident about an artist, and it's saying wrong guess then keep trying with full name, or surname</li>
              </ul>
            </div>
          )}
          <div className="text-center text-sm border-t-2 border-black/10 pt-4">
            &copy; {new Date().getFullYear()} Guess The Painter. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}