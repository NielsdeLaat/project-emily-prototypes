import React, { useState, useRef, useEffect } from "react";
import { X, Flag, SkipForward, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "./ProgressBar";

interface StorySegment {
  id: number;
  title: string;
  videoUrl: string;
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
    videoUrl: "/videos/hongkong.mp4",
    subtitles: [
      {
        startTime: 0,
        endTime: 3,
        text: "Hong Kong, a vibrant city with a rich history.",
      },
      {
        startTime: 3,
        endTime: 6,
        text: "A place where East meets West, tradition meets modernity.",
      },
      {
        startTime: 6,
        endTime: 11,
        text: "A city that has faced many challenges but remains resilient.",
      },
    ],
  },
  {
    id: 2,
    title: "Demonstrations",
    videoUrl: "/videos/demonstrations.mp4",
    subtitles: [
      {
        startTime: 0,
        endTime: 6,
        text: "The streets filled with voices demanding change.",
      },
      {
        startTime: 6,
        endTime: 12,
        text: "Peaceful protests showing the power of unity.",
      },
      {
        startTime: 12,
        endTime: 17,
        text: "A movement that captured the world's attention.",
      },
    ],
  },
  {
    id: 3,
    title: "Police Response",
    videoUrl: "/videos/police.mp4",
    subtitles: [
      {
        startTime: 0,
        endTime: 5,
        text: "The authorities' response to the protests.",
      },
      {
        startTime: 5,
        endTime: 10,
        text: "Tensions rising as the situation escalated.",
      },
      {
        startTime: 10,
        endTime: 14,
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
  const [videoDuration, setVideoDuration] = useState(0);
  const [subtitles, setSubtitles] = useState(mockStoryData[0].subtitles);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentStory = mockStoryData[currentSegment];
  const currentSubtitle = subtitles.find(
    (sub) => currentTime >= sub.startTime && currentTime <= sub.endTime
  );

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      // Start muted to allow autoplay
      videoRef.current.muted = true;
      const playPromise = videoRef.current.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            setIsPlaying(false);
          });
      }
    }
  }, [currentSegment]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
    }
  };

  const handleVideoEnd = () => {
    if (currentSegment < mockStoryData.length - 1) {
      handleNext();
    }
  };

  const handlePlayClick = async () => {
    if (videoRef.current) {
      try {
        // Try to unmute when user interacts
        videoRef.current.muted = false;
        await videoRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("Error playing video:", error);
      }
    }
  };

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

  const handleProgressBarClick = (segmentIndex: number) => {
    setCurrentSegment(segmentIndex);
    setCurrentTime(0);
    setSubtitles(mockStoryData[segmentIndex].subtitles);
  };

  const handleVideoClick = () => {
    if (!isPlaying) {
      handlePlayClick();
    } else {
      handleNext();
    }
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Video Player */}
      <video
        ref={videoRef}
        src={currentStory.videoUrl}
        className="absolute inset-0 w-full h-full object-cover"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleVideoEnd}
        onClick={handleVideoClick}
        playsInline
        muted
      />

      {/* Play Button Overlay */}
      {!isPlaying && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/50 cursor-pointer"
          onClick={handlePlayClick}
        >
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <Play className="w-10 h-10 text-white" />
          </div>
        </div>
      )}

      {/* Top Overlay */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/60 to-transparent">
        {/* Progress Bar */}
        <div className="pt-12 pb-4 px-4">
          <ProgressBar
            segments={mockStoryData.length}
            currentSegment={currentSegment}
            progress={videoDuration > 0 ? currentTime / videoDuration : 0}
            onSegmentClick={handleProgressBarClick}
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
              <p className="text-white text-center leading-relaxed">
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
    </div>
  );
};
