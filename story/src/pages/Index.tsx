import React from "react";
import { StoryViewer } from "@/components/StoryViewer";

interface IndexProps {
  onClose: () => void;
}

const Index = ({ onClose }: IndexProps) => {
  return (
    <div className="w-full h-screen">
      <StoryViewer onClose={onClose} />
    </div>
  );
};
export default Index;
