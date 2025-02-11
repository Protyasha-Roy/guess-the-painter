import { Painting } from '../types';
import { Loader } from './Loader';
import { useState } from 'react';

interface PaintingDisplayProps {
  painting: Painting;
  onImageLoad: () => void;
  showTitle: boolean;
}

export function PaintingDisplay({ painting, onImageLoad, showTitle }: PaintingDisplayProps) {
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = () => {
    setIsLoading(false);
    onImageLoad();
  };

  return (
    <div className="space-y-2 sm:space-y-4">
      <div className="relative border-[3px] border-black bg-white shadow-neo overflow-hidden aspect-video max-w-full">
        {isLoading && <Loader />}
        <img
          src={painting.imageUrl}
          alt={painting.title}
          onLoad={handleImageLoad}
          className="w-full h-full object-contain max-w-full"
        />
      </div>
      
      {showTitle && (
        <div className="border-[3px] border-black bg-[#FFF5E4] p-3 sm:p-4 shadow-neo">
          <h2 className="text-lg sm:text-xl font-black break-words">{painting.title}</h2>
          <p className="text-base sm:text-lg font-bold break-words">by {painting.artist}</p>
          {painting.year && (
            <p className="text-xs sm:text-sm font-bold opacity-75">{painting.year}</p>
          )}
        </div>
      )}
    </div>
  );
}