
import { useState, useEffect } from 'react';
import Globe from '../components/Globe';
import FilterSidebar from '../components/FilterSidebar';
import ChatModal from '../components/ChatModal';
import ThemeToggle from '../components/ThemeToggle';

interface StoryPin {
  id: string;
  position: [number, number, number];
  country: string;
  person: {
    name: string;
    age: number;
    description: string;
    category: string;
  };
  conversations: number;
}

const Index = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedPin, setSelectedPin] = useState<StoryPin | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Handle dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedPin) {
        setSelectedPin(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedPin]);

  const handlePinClick = (pin: StoryPin) => {
    setSelectedPin(pin);
  };

  const closeChatModal = () => {
    setSelectedPin(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-blue-50/50 dark:from-gray-900 dark:via-slate-900 dark:to-blue-950 transition-all duration-700">
      {/* Theme Toggle */}
      <ThemeToggle isDark={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} />
      
      {/* Main Layout */}
      <div className="flex h-screen w-full">
        {/* Filter Sidebar */}
        <FilterSidebar
          selectedCategories={selectedCategories}
          onCategoryChange={setSelectedCategories}
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Main Globe Area */}
        <div className="flex-1 relative overflow-hidden">
          {/* Header Overlay */}
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-30 text-center">
            <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md rounded-2xl px-8 py-6 shadow-xl border border-stone-200/50 dark:border-gray-700/50">
              <h1 className="text-3xl md:text-4xl font-extralight text-stone-800 dark:text-stone-200 mb-3 tracking-wide">
                Verhalen van Moed
              </h1>
              <p className="text-sm text-stone-600 dark:text-stone-400 max-w-lg mx-auto leading-relaxed">
                Ontdek persoonlijke verhalen van mensen wereldwijd. 
                Draai de wereldbol en klik op een verhaal om een empathisch gesprek aan te gaan.
              </p>
            </div>
          </div>

          {/* Instructions */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-xl px-6 py-3 text-center border border-stone-200/50 dark:border-gray-600/50 shadow-lg">
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                🖱️ Klik en sleep om te draaien • 🔍 Scroll om in/uit te zoomen • 💬 Hover over landen en verhalen voor meer informatie
              </p>
            </div>
          </div>

          {/* Globe Component */}
          <Globe
            selectedCategories={selectedCategories}
            onPinClick={handlePinClick}
            isDark={isDarkMode}
          />

          {/* Stats Overlay */}
          <div className="absolute top-8 right-8 z-30">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-xl p-5 shadow-xl border border-stone-200/50 dark:border-gray-600/50">
              <h3 className="text-sm font-medium text-stone-800 dark:text-stone-200 mb-3">Platform Statistieken</h3>
              <div className="space-y-2 text-xs text-stone-600 dark:text-stone-400">
                <div className="flex items-center space-x-2">
                  <span className="text-base">🌍</span>
                  <span>4 verhalen beschikbaar</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-base">💬</span>
                  <span>4.418+ gesprekken gevoerd</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-base">🤖</span>
                  <span>AI-begeleiding door Emily</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      {selectedPin && (
        <ChatModal
          isOpen={!!selectedPin}
          onClose={closeChatModal}
          personName={selectedPin.person.name}
          personDescription={selectedPin.person.description}
        />
      )}
    </div>
  );
};

export default Index;
