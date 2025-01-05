import { useState } from 'react';
import { loginUser, registerUser } from '../utils/supabase';
import bannerImage from '../images/guess-the-painter-banner.webp';

interface LoginProps {
  onLogin: (userData: { id: string; username: string }) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      // Try to login first
      let user = await loginUser(username, password);
      
      if (!user) {
        // If login fails, try to register
        user = await registerUser(username, password);
      }

      if (user) {
        onLogin(user);
      } else {
        setError('Failed to login or register');
      }
    } catch (err) {
      setError('An error occurred');
      console.error('Login error:', err);
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
              className="w-full bg-orange-600/40 border border-white/30 backdrop-blur-sm text-white py-3 rounded-lg font-medium hover:bg-orange-600/50 transition-all focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Please wait...' : 'Start Playing'}
            </button>
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
