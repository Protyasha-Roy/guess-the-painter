import { useEffect, useState } from 'react';
import { getLeaderboard } from '../utils/supabase';
import { LoadingSpinner } from './LoadingSpinner';

interface LeaderboardEntry {
  username: string;
  score: number;
  rank: number;
  total_paintings: number;
  correct_guesses: number;
  wrong_guesses: number;
  total_guesses: number;
}

interface LeaderboardProps {
  compact?: boolean;
}

export function Leaderboard({ compact = false }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    setLoading(true);
    const data = await getLeaderboard();
    if (data) {
      setLeaderboard(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const Content = () => {
    if (loading) {
      return <LoadingSpinner />;
    }

    if (leaderboard.length === 0) {
      return <p className="text-center text-gray-500">No entries yet</p>;
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-sm font-black uppercase">
              <th className="text-left pb-2">User</th>
              <th className="text-center pb-2"><span className="text-gray-600">P</span></th>
              <th className="text-center pb-2"><span className="text-gray-600">G</span></th>
              <th className="text-center pb-2"><span className="text-gray-600">C</span></th>
              <th className="text-center pb-2"><span className="text-gray-600">W</span></th>
              <th className="text-center pb-2"><span className="text-gray-600">S</span></th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry) => (
              <tr key={entry.username} className="text-sm border-t-2 border-black/10">
                <td className="py-2">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-gray-600">#{entry.rank}</span>
                    <span className="font-bold">{entry.username}</span>
                  </div>
                </td>
                <td className="text-center py-2 text-black">{entry.total_paintings}</td>
                <td className="text-center py-2 text-black">{entry.total_guesses}</td>
                <td className="text-center py-2 text-black">{entry.correct_guesses}</td>
                <td className="text-center py-2 text-black">{entry.wrong_guesses}</td>
                <td className="text-center py-2 font-bold text-black">{entry.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (compact) {
    return (
      <div>
        <h2 className="text-lg font-black uppercase mb-3 flex items-center justify-between">
          Leaderboard
          <button 
            onClick={fetchLeaderboard} 
            disabled={loading}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
            </svg>
          </button>
        </h2>
        <Content />
      </div>
    );
  }

  return (
    <div className="border-[3px] border-black bg-white p-4 md:p-6 shadow-neo">
      <h2 className="text-xl md:text-2xl font-black uppercase mb-4 border-b-[3px] border-black pb-2 flex items-center justify-between">
        Leaderboard
        <button 
          onClick={fetchLeaderboard} 
          disabled={loading}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
          </svg>
        </button>
      </h2>
      <Content />
    </div>
  );
}
