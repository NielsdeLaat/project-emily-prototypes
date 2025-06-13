import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Initialize React Query client for data fetching
const queryClient = new QueryClient();

// Animation duration in milliseconds
const ANIMATION_DURATION = 300;

const App = () => {
  // State for controlling phone visibility and animation
  const [showPhone, setShowPhone] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle closing the phone view with animation
  const handleClose = () => {
    setIsAnimating(true);
    const container = document.querySelector(".mobile-viewport-container");
    container?.classList.add("slide-out");
    container?.classList.remove("slide-in");

    setTimeout(() => {
      setShowPhone(false);
      setIsAnimating(false);
    }, ANIMATION_DURATION);
  };

  // Handle showing the phone view with animation
  const handleShow = () => {
    setShowPhone(true);
    const container = document.querySelector(".mobile-viewport-container");
    container?.classList.add("slide-in");
    container?.classList.remove("slide-out");
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* Toast notifications */}
        <Toaster />
        <Sonner />

        {/* Show phone button when phone is hidden */}
        {!showPhone && (
          <button
            onClick={handleShow}
            className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg transition-colors"
          >
            Show Phone View
          </button>
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
                <Route path="/" element={<Index onClose={handleClose} />} />
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
