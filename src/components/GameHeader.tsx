interface GameHeaderProps {
  score: number;
  onLogout: () => void;
}

export function GameHeader({ score, onLogout }: GameHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h1 className="text-3xl font-bold text-gray-800 font-serif">
        Guess the Painter
      </h1>
      <div className="flex items-center gap-4">
        <div className="px-4 py-2 bg-gray-800 text-white rounded-lg">
          Score: {score}
        </div>
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export type { GameHeaderProps };