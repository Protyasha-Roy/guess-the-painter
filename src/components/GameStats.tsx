import type { GameStats } from '../types';

interface GameStatsProps {
    stats: GameStats;
    compact?: boolean;
}

export function GameStats({ stats, compact = false }: GameStatsProps) {
    const Content = () => (
        <div className="space-y-2">
            {stats.rank && (
                <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-600">Rank:</span>
                    <span className="text-black font-black">#{stats.rank || 'N/A'}</span>
                </div>
            )}
            <div className="flex justify-between items-center">
                <span className="font-bold text-gray-600">Score:</span>
                <span className="text-black font-black">{stats.score}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="font-bold text-gray-600">Paintings:</span>
                <span className="text-black font-black">{stats.totalPaintings}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="font-bold text-gray-600">Total Guesses:</span>
                <span className="text-black font-black">{stats.totalGuesses}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="font-bold text-gray-600">Correct:</span>
                <span className="text-black font-black">{stats.correctGuesses}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="font-bold text-gray-600">Wrong:</span>
                <span className="text-black font-black">{stats.wrongGuesses}</span>
            </div>
        </div>
    );

    if (compact) {
        return (
            <div>
                <Content />
            </div>
        );
    }

    return (
        <div>
            <Content />
        </div>
    );
}