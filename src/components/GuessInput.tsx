interface GuessInputProps {
  guess: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export function GuessInput({ guess, onChange, onSubmit, disabled }: GuessInputProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
      <input
        type="text"
        value={guess}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="Enter painter's name..."
        className="w-full sm:flex-1 px-4 py-3 border-[3px] border-black text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <button
        type="submit"
        disabled={disabled}
        className="w-full sm:w-auto px-6 py-3 bg-orange-500 text-white font-black uppercase border-[3px] border-black shadow-neo hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Guess
      </button>
    </form>
  );
}

export type { GuessInputProps };