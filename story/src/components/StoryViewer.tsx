import React, { useState } from "react";
import { X, Flag, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "./ProgressBar";
import { SubtitleEditor } from "./SubtitleEditor";

interface StorySegment {
  id: number;
  title: string;
  subtitles: Array<{
    startTime: number;
    endTime: number;
    text: string;
  }>;
}

const mockStoryData: StorySegment[] = [
  {
    id: 1,
    title: "Hong Kong",
    subtitles: [
      {
        startTime: 0,
        endTime: 10,
        text: "Hong Kong, a vibrant city with a rich history.",
      },
      {
        startTime: 10,
        endTime: 20,
        text: "A place where East meets West, tradition meets modernity.",
      },
      {
        startTime: 20,
        endTime: 30,
        text: "A city that has faced many challenges but remains resilient.",
      },
    ],
  },
  {
    id: 2,
    title: "Demonstrations",
    subtitles: [
      {
        startTime: 0,
        endTime: 10,
        text: "The streets filled with voices demanding change.",
      },
      {
        startTime: 10,
        endTime: 20,
        text: "Peaceful protests showing the power of unity.",
      },
      {
        startTime: 20,
        endTime: 30,
        text: "A movement that captured the world's attention.",
      },
    ],
  },
  {
    id: 3,
    title: "Police Response",
    subtitles: [
      {
        startTime: 0,
        endTime: 10,
        text: "The authorities' response to the protests.",
      },
      {
        startTime: 10,
        endTime: 20,
        text: "Tensions rising as the situation escalated.",
      },
      {
        startTime: 20,
        endTime: 30,
        text: "A complex situation that affected many lives.",
      },
    ],
  },
];

interface StoryViewerProps {
  onClose: () => void;
}

export const StoryViewer = ({ onClose }: StoryViewerProps) => {
  const [currentSegment, setCurrentSegment] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [subtitles, setSubtitles] = useState(mockStoryData[0].subtitles);
  const [isEditingSubtitles, setIsEditingSubtitles] = useState(false);

  const currentStory = mockStoryData[currentSegment];
  const currentSubtitle = subtitles.find(
    (sub) => currentTime >= sub.startTime && currentTime <= sub.endTime
  );

  const handleNext = () => {
    if (currentSegment < mockStoryData.length - 1) {
      setCurrentSegment((prev) => prev + 1);
      setCurrentTime(0);
      setSubtitles(mockStoryData[currentSegment + 1].subtitles);
    }
  };

  const handlePrevious = () => {
    if (currentSegment > 0) {
      setCurrentSegment((prev) => prev - 1);
      setCurrentTime(0);
      setSubtitles(mockStoryData[currentSegment - 1].subtitles);
    }
  };

  const handleSubtitleUpdate = (index: number, newText: string) => {
    const updatedSubtitles = [...subtitles];
    updatedSubtitles[index].text = newText;
    setSubtitles(updatedSubtitles);
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Content Placeholder */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white/70">
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
            <div className="w-0 h-0 border-l-[8px] border-l-white/70 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1"></div>
          </div>
          <p className="text-sm">Story Content</p>
          <p className="text-xs text-white/50 mt-2">
            Tap left/right to navigate
          </p>
        </div>
      </div>

      {/* Top Overlay */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/60 to-transparent">
        {/* Progress Bar */}
        <div className="pt-12 pb-4 px-4">
          <ProgressBar
            segments={mockStoryData.length}
            currentSegment={currentSegment}
            progress={0}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-red-600/80 flex items-center justify-center">
              <Flag className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-white font-medium text-lg tracking-wide">
              {currentStory.title}
            </h1>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full w-8 h-8 p-0"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Bottom Overlay */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 to-transparent">
        {/* Subtitles */}
        {currentSubtitle && (
          <div className="px-6 pb-6">
            <div className="bg-black/70 rounded-lg px-4 py-3 backdrop-blur-sm">
              <p
                className="text-white text-center leading-relaxed cursor-pointer transition-colors hover:text-gray-300"
                onClick={() => setIsEditingSubtitles(true)}
              >
                {currentSubtitle.text}
              </p>
            </div>
          </div>
        )}

        {/* Skip Button */}
        <div className="flex justify-end px-6 pb-8">
          <Button
            onClick={handleNext}
            className="bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-full px-4 py-2 backdrop-blur-sm transition-all duration-200"
            disabled={currentSegment >= mockStoryData.length - 1}
          >
            <span className="mr-2 text-sm font-medium">Skip</span>
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Subtitle Editor Modal */}
      {isEditingSubtitles && (
        <SubtitleEditor
          subtitles={subtitles}
          onUpdate={handleSubtitleUpdate}
          onClose={() => setIsEditingSubtitles(false)}
        />
      )}
    </div>
  );
};
