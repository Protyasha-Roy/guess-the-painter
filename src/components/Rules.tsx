import React from 'react';
import { Info } from 'lucide-react';

export function Rules() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <Info className="w-5 h-5 text-blue-500" />
        <h2 className="text-lg font-semibold text-blue-900">How to Play</h2>
      </div>
      <ul className="space-y-2 text-blue-800">
        <li>• You have 30 seconds to guess each painting's artist</li>
        <li>• Keep guessing until you get it right or time runs out</li>
        <li>• Enter the artist's full name exactly as it appears</li>
        <li>• Spelling must be correct (not case sensitive)</li>
        <li>• Score points for each correct guess</li>
      </ul>
    </div>
  );
}