import React from "react";

interface ProgressBarProps {
  segments: number;
  currentSegment: number;
  progress: number;
  onSegmentClick?: (segmentIndex: number) => void;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  segments,
  currentSegment,
  progress,
  onSegmentClick,
}) => {
  return (
    <div className="flex space-x-1 px-4">
      {Array.from({ length: segments }, (_, index) => (
        <div
          key={index}
          className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer hover:bg-white/30 transition-colors"
          onClick={() => onSegmentClick?.(index)}
        >
          <div
            className={`h-full transition-all duration-100 ease-linear ${
              index < currentSegment
                ? "w-full bg-white"
                : index === currentSegment
                ? "bg-white"
                : "w-0 bg-white/50"
            }`}
            style={{
              width:
                index === currentSegment
                  ? `${progress * 100}%`
                  : index < currentSegment
                  ? "100%"
                  : "0%",
            }}
          />
        </div>
      ))}
    </div>
  );
};
