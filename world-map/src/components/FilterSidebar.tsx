
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';

interface FilterSidebarProps {
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

const categories = [
  'LGBTQ+ vluchteling',
  'Politieke dissident', 
  'Ex-gevangene',
  'Journalisten in ballingschap'
];

export default function FilterSidebar({ selectedCategories, onCategoryChange, isCollapsed, onToggle }: FilterSidebarProps) {
  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  const clearFilters = () => {
    onCategoryChange([]);
  };

  return (
    <div className={`bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-r border-stone-200/50 dark:border-gray-700/50 transition-all duration-500 ease-out ${isCollapsed ? 'w-12' : 'w-80'} flex-shrink-0 shadow-lg`}>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute top-6 -right-4 bg-white/90 dark:bg-gray-800/90 border border-stone-200 dark:border-gray-600 rounded-full p-2.5 shadow-xl hover:scale-110 hover:shadow-2xl transition-all duration-300 z-10 backdrop-blur-sm"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4 text-stone-600 dark:text-gray-300" /> : <ChevronLeft className="w-4 h-4 text-stone-600 dark:text-gray-300" />}
      </button>

      {!isCollapsed && (
        <div className="p-8 h-full">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-stone-400 to-stone-600 dark:from-gray-500 dark:to-gray-700 rounded-lg flex items-center justify-center">
              <Filter className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-light text-stone-800 dark:text-stone-200">Verhaaltypen</h2>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm text-stone-600 dark:text-stone-400 mb-4 leading-relaxed">
                Selecteer welke verhalen je wilt ontdekken op de wereldbol.
              </p>
              <div className="space-y-3">
                {categories.map((category) => (
                  <label key={category} className="flex items-start space-x-3 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => handleCategoryToggle(category)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded border-2 transition-all duration-200 ${
                        selectedCategories.includes(category)
                          ? 'bg-stone-600 dark:bg-stone-400 border-stone-600 dark:border-stone-400'
                          : 'border-stone-300 dark:border-gray-600 group-hover:border-stone-400 dark:group-hover:border-gray-500'
                      }`}>
                        {selectedCategories.includes(category) && (
                          <svg className="w-3 h-3 text-white dark:text-stone-900 m-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed group-hover:text-stone-900 dark:group-hover:text-stone-100 transition-colors duration-200">
                      {category}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {selectedCategories.length > 0 && (
              <button
                onClick={clearFilters}
                className="w-full px-4 py-3 text-sm bg-stone-100 dark:bg-gray-800 text-stone-700 dark:text-stone-300 rounded-xl hover:bg-stone-200 dark:hover:bg-gray-700 transition-all duration-200 font-medium"
              >
                Wis alle filters ({selectedCategories.length})
              </button>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-stone-200/50 dark:border-gray-700/50">
            <div className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              <p className="mb-2">💬 Voer empathische gesprekken met mensen wereldwijd</p>
              <p>🔒 Alle gesprekken zijn veilig en vertrouwelijk</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
