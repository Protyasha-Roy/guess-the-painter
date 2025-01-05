import { Check, X } from 'lucide-react';

interface GameFeedbackProps {
  type: 'correct' | 'incorrect' | 'wrong-guess' | null;
  message: string;
}

export function GameFeedback({ type, message }: GameFeedbackProps) {
  if (!type) return null;

  const styles = {
    'correct': 'bg-green-100 text-green-700',
    'incorrect': 'bg-red-100 text-red-700',
    'wrong-guess': 'bg-yellow-100 text-yellow-700'
  };

  return (
    <div className={`p-4 rounded-lg ${styles[type]}`}>
      <div className="flex items-center gap-2">
        {type === 'correct' ? (
          <Check className="w-5 h-5" />
        ) : (
          <X className="w-5 h-5" />
        )}
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
}