import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoadingScreen from "./components/LoadingScreen";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SUCCESS_MESSAGES } from "@/config/constants";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const handleResetChats = () => {
    localStorage.removeItem("chat_history");
    toast({
      title: SUCCESS_MESSAGES.CHAT_HISTORY_CLEARED,
      description: SUCCESS_MESSAGES.CHAT_HISTORY_RESET,
    });
    // Force a reload to update the UI
    window.location.reload();
  };

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <div className="mobile-viewport-container">
            <div className="mobile-viewport">
              {isLoading ? (
                <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />
              ) : (
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              )}
            </div>
          </div>
          <Button
            onClick={handleResetChats}
            variant="destructive"
            size="icon"
            className="fixed bottom-4 right-4 rounded-full shadow-lg"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
