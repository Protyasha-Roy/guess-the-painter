import { RefreshCw } from 'lucide-react';

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin">
        <RefreshCw className="w-8 h-8 text-blue-500" />
      </div>
    </div>
  );
}