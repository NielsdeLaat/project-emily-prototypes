import React, { useState, useRef, useEffect } from "react";
import { X, Flag, SkipForward, Play, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "./ProgressBar";
import { stories, StorySegment } from "@/data/stories";

interface StoryViewerProps {
  onClose: () => void;
  storyId: number;
  onBack: () => void;
}

export const StoryViewer = ({ onClose, storyId, onBack }: StoryViewerProps) => {
  const [currentSegment, setCurrentSegment] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const story = stories.find((s) => s.id === storyId);
  if (!story) {
    return null;
  }

  const currentStory = story.segments[currentSegment];
  const currentSubtitle = currentStory.subtitles.find(
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
    if (currentSegment < story.segments.length - 1) {
      // Play next video segment
      setCurrentSegment((prev) => prev + 1);
      setCurrentTime(0);
    } else {
      window.location.href = "https://project-emily-chat-interface.vercel.app/";
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
    window.location.href = "https://project-emily-chat-interface.vercel.app/";
  };

  const handlePrevious = () => {
    if (currentSegment > 0) {
      setCurrentSegment((prev) => prev - 1);
      setCurrentTime(0);
    }
  };

  const handleProgressBarClick = (segmentIndex: number) => {
    setCurrentSegment(segmentIndex);
    setCurrentTime(0);
  };

  const handleVideoClick = () => {
    if (!isPlaying) {
      handlePlayClick();
    } else {
      // Only advance to next segment when clicking video
      if (currentSegment < story.segments.length - 1) {
        setCurrentSegment((prev) => prev + 1);
        setCurrentTime(0);
      }
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
            segments={story.segments.length}
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
            <div className="flex flex-col">
              <h2 className="text-white/60 text-sm tracking-wide">
                {story.title}
              </h2>
              <h1 className="text-white font-medium text-lg tracking-wide">
                {currentStory.title}
              </h1>
            </div>
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
          >
            <span className="mr-2 text-sm font-medium">Skip</span>
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
