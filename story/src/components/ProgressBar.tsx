
import React from 'react';

interface ProgressBarProps {
  segments: number;
  currentSegment: number;
  progress: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  segments,
  currentSegment,
  progress
}) => {
  return (
    <div className="flex space-x-1">
      {Array.from({ length: segments }, (_, index) => (
        <div
          key={index}
          className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
        >
          <div
            className={`h-full transition-all duration-300 ease-out ${
              index < currentSegment
                ? 'w-full bg-white'
                : index === currentSegment
                ? 'bg-white'
                : 'w-0 bg-white/50'
            }`}
            style={{
              width: index === currentSegment ? `${progress}%` : 
                     index < currentSegment ? '100%' : '0%'
            }}
          />
        </div>
      ))}
    </div>
  );
};
