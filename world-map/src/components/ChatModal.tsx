
import { useState } from 'react';
import { X, MessageCircle, Volume2, VolumeX, Heart } from 'lucide-react';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  personName: string;
  personDescription: string;
}

export default function ChatModal({ isOpen, onClose, personName, personDescription }: ChatModalProps) {
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col border border-stone-200/50 dark:border-gray-700/50 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-stone-200/50 dark:border-gray-700/50 bg-gradient-to-r from-stone-50 to-amber-50/30 dark:from-gray-800 dark:to-gray-800/50 rounded-t-3xl">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-stone-400 to-stone-600 dark:from-gray-500 dark:to-gray-700 rounded-2xl flex items-center justify-center shadow-lg">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-light text-stone-800 dark:text-stone-200 flex items-center space-x-2">
                <span>Gesprek met Emily</span>
                <Heart className="w-5 h-5 text-red-400" />
              </h2>
              <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
                Over het verhaal van {personName}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsAudioEnabled(!isAudioEnabled)}
              className="p-3 hover:bg-stone-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 group"
              title={isAudioEnabled ? "Audio uitschakelen" : "Audio inschakelen"}
            >
              {isAudioEnabled ? 
                <Volume2 className="w-5 h-5 text-stone-600 dark:text-stone-300 group-hover:text-stone-800 dark:group-hover:text-stone-100" /> :
                <VolumeX className="w-5 h-5 text-stone-600 dark:text-stone-300 group-hover:text-stone-800 dark:group-hover:text-stone-100" />
              }
            </button>
            <button
              onClick={onClose}
              className="p-3 hover:bg-stone-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 group"
              title="Gesprek sluiten"
            >
              <X className="w-5 h-5 text-stone-600 dark:text-stone-300 group-hover:text-stone-800 dark:group-hover:text-stone-100" />
            </button>
          </div>
        </div>

        {/* Context Banner */}
        <div className="p-6 bg-gradient-to-r from-blue-50/50 to-stone-50/50 dark:from-blue-900/20 dark:to-gray-800/50 border-b border-stone-200/50 dark:border-gray-700/50">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                <span className="font-medium">Verhaal context:</span> {personDescription}
              </p>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 leading-relaxed">
                Emily is getraind om empathisch en respectvol te reageren op gevoelige onderwerpen. 
                Dit gesprek wordt met zorg en integriteit gevoerd.
              </p>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="flex-1 p-6 bg-stone-25 dark:bg-gray-800/30">
          <div className="w-full h-full rounded-2xl overflow-hidden shadow-inner border border-stone-200/50 dark:border-gray-700/50">
            <iframe
              src="https://i488316.hera.fontysict.net"
              width="100%"
              height="100%"
              style={{ border: 'none' }}
              className="bg-white dark:bg-gray-900"
              title={`Empathisch gesprek met Emily over ${personName}`}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-stone-200/50 dark:border-gray-700/50 bg-gradient-to-r from-stone-50/50 to-amber-50/30 dark:from-gray-800/50 dark:to-gray-800/30 rounded-b-3xl">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>Veilige en vertrouwelijke omgeving</span>
              </span>
              <span>🎧 Audio en tekst beschikbaar</span>
            </div>
            <span className="text-stone-400 dark:text-stone-500">Druk op ESC om te sluiten</span>
          </div>
        </div>
      </div>
    </div>
  );
}
