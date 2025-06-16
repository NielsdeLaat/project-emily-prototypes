import React from "react";
import { StoryViewer } from "@/components/StoryViewer";
import { stories } from "@/data/stories";
import { Button } from "@/components/ui/button";

interface IndexProps {
  onClose: () => void;
  onShowPhone: () => void;
  selectedStory: number | null;
}

const Index = ({ onClose, onShowPhone, selectedStory }: IndexProps) => {
  const handleStorySelect = (storyId: number) => {
    onShowPhone();
  };

  if (selectedStory !== null) {
    return (
      <div className="w-full h-screen">
        <StoryViewer
          onClose={onClose}
          storyId={selectedStory}
          onBack={() => onShowPhone()}
        />
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-2xl w-full p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Choose a Story</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stories.map((story) => (
            <Button
              key={story.id}
              onClick={() => handleStorySelect(story.id)}
              className="h-32 text-lg font-medium bg-white hover:bg-gray-50 text-gray-900 shadow-sm border border-gray-200"
            >
              {story.title}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
