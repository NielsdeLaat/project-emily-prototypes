import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { stories } from "@/data/stories";
import { Button } from "@/components/ui/button";

// Initialize React Query client for data fetching
const queryClient = new QueryClient();

// Animation duration in milliseconds
const ANIMATION_DURATION = 300;

const App = () => {
  // State for controlling phone visibility and animation
  const [showPhone, setShowPhone] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedStory, setSelectedStory] = useState<number | null>(null);

  // Handle closing the phone view with animation
  const handleClose = () => {
    setIsAnimating(true);
    const container = document.querySelector(".mobile-viewport-container");
    container?.classList.add("slide-out");
    container?.classList.remove("slide-in");

    setTimeout(() => {
      setShowPhone(false);
      setIsAnimating(false);
      setSelectedStory(null);
    }, ANIMATION_DURATION);
  };

  // Handle showing the phone view with animation
  const handleShow = () => {
    setShowPhone(true);
    const container = document.querySelector(".mobile-viewport-container");
    container?.classList.add("slide-in");
    container?.classList.remove("slide-out");
  };

  const handleStorySelect = (storyId: number) => {
    setSelectedStory(storyId);
    handleShow();
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* Toast notifications */}
        <Toaster />
        <Sonner />

        {/* Story Selection Buttons */}
        {!showPhone && (
          <div className="fixed inset-0 flex items-center justify-center">
            <div className="max-w-2xl w-full p-8">
              <h1 className="text-4xl font-bold text-center mb-12 text-white">
                Choose a Story
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stories.map((story) => (
                  <Button
                    key={story.id}
                    onClick={() => handleStorySelect(story.id)}
                    className="h-40 text-lg font-medium bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:shadow-xl"
                  >
                    {story.title}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mobile viewport container with slide animation */}
        <div
          className={`mobile-viewport-container ${
            showPhone ? "slide-in" : "slide-out"
          }`}
          style={{ display: isAnimating || showPhone ? "flex" : "none" }}
        >
          <div className="mobile-viewport">
            <BrowserRouter>
              <Routes>
                <Route
                  path="/"
                  element={
                    <Index
                      onClose={handleClose}
                      onShowPhone={handleShow}
                      selectedStory={selectedStory}
                    />
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </div>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
