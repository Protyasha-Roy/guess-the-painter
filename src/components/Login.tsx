import { useState } from 'react';
import { loginUser, registerUser } from '../utils/supabase';
import bannerImage from '../images/guess-the-painter-banner.webp';

interface LoginProps {
  onLogin: (userData: { id: string; username: string }) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePlayAsGuest = () => {
    const guestUser = { id: 'guest', username: 'Guest' };
    localStorage.setItem('current-user', JSON.stringify(guestUser));
    onLogin(guestUser);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      setIsLoading(false);
      return;
    }

    try {
      const user = isRegistering 
        ? await registerUser(username.trim(), password)
        : await loginUser(username.trim(), password);

      if (user && user.id && user.username) {
        onLogin(user);
      } else {
        setError(isRegistering ? 'Username already taken' : 'Invalid username or password');
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError('An error occurred. Please try again.');
    }

    setIsLoading(false);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ 
        backgroundImage: `url(${bannerImage})`,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backgroundBlendMode: 'overlay'
      }}
    >
      <div className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2 drop-shadow-lg">
            Guess The Painter
          </h1>
          <div className="text-white/80">
            created by <a href="https://protyasharoy.onrender.com" target="_blank" rel="noopener noreferrer" className="font-medium text-orange-500 underline transition-colors">Protyasha Roy</a>
            <div className="flex justify-center mt-1">
            <a href="https://github.com/Protyasha-Roy/guess-the-painter" target="_blank" rel="noopener noreferrer" className="inline-flex">
                <svg height="20" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="20" data-view-component="true" className="fill-white/80 hover:fill-orange-500 transition-colors">
                  <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-md bg-white/20 p-8 rounded-lg shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-2 py-2 bg-white/10 border border-white/30 text-white placeholder-white/50 rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                placeholder="Enter username"
                disabled={isLoading}
              />
            </div>

            <div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-2 py-2 bg-white/10 border border-white/30 text-white placeholder-white/50 rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                placeholder="Enter password"
                disabled={isLoading}
              />
            </div>

            {error && (
              <p className="text-[#FF9393] text-sm">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-orange-600/40 border border-white/30 backdrop-blur-sm text-white py-3 rounded-lg font-medium hover:bg-orange-600/50 transition-all focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed mb-3"
              disabled={isLoading}
            >
              {isLoading ? 'Please wait...' : isRegistering ? 'Register' : 'Login'}
            </button>

            <button
              type="button"
              onClick={handlePlayAsGuest}
              className="w-full bg-white/10 border border-white/30 backdrop-blur-sm text-white py-3 rounded-lg font-medium hover:bg-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-white/50 mb-3"
            >
              Play as Guest
            </button>

            <button
              type="button"
              className="text-white/80 hover:text-white text-sm underline transition-colors"
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering ? 'Already have an account? Login' : 'Don\'t have an account? Register'}
            </button>

            <p className="mt-4 text-sm text-white/60 text-center">
              Note: Guest stats are saved locally and will be lost if browser data is cleared.
              <br />
              Register to compete on the leaderboard and save stats permanently!
            </p>
          </form>

          <p className="mt-6 text-sm text-center text-white/80">
            Sign in is required to store leaderboard data.
          </p>
        </div>

        <div className="text-white text-sm mt-2 text-center">
          &copy; {new Date().getFullYear()} Guess The Painter. All rights reserved.
        </div>
      </div>
    </div>
  );
}
