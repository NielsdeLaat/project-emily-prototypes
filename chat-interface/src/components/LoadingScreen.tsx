import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LoadingScreen = ({ onLoadingComplete }: LoadingScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Show loading animation for 1 second

    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    setIsVisible(false);
    setTimeout(onLoadingComplete, 500); // Wait for fade out animation
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 z-50 flex items-center justify-center"
    >
      <div className="h-full w-full bg-white">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-emilyBlue text-white p-4">
            <h1 className="font-semibold text-lg text-center">StoryChat</h1>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-50">
            <div className="text-sm text-gray-600 space-y-4 text-center mb-8">
              <h2 className="text-lg font-semibold">Gebruik van AI</h2>
              <p>
                Om anoniemiteit en veiligheid te garanderen, gebruiken we AI om
                de verhalen van deze mensen te vertellen.
              </p>
            </div>

            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="w-16 h-16 mb-6"
                >
                  <div className="w-full h-full rounded-full border-4 border-emilyBlue border-t-transparent animate-spin" />
                </motion.div>
              ) : (
                <motion.div
                  key="button"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Button
                    onClick={handleContinue}
                    className="bg-emilyBlue text-white hover:opacity-90 transition-all duration-200"
                  >
                    Ik begrijp het
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
