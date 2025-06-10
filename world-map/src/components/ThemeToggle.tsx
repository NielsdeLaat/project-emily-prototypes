
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export default function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="fixed top-6 right-6 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-stone-200/50 dark:border-gray-600/50 hover:scale-110 hover:shadow-2xl transition-all duration-300 group"
      title={isDark ? "Schakel naar lichte modus" : "Schakel naar donkere modus"}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-amber-500 group-hover:text-amber-400 transition-colors duration-200" />
      ) : (
        <Moon className="w-5 h-5 text-stone-600 group-hover:text-stone-800 transition-colors duration-200" />
      )}
    </button>
  );
}
