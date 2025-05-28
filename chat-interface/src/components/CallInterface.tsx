
import { useState, useEffect } from "react";
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CallInterfaceProps {
  onEndCall: () => void;
}

const CallInterface = ({ onEndCall }: CallInterfaceProps) => {
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 text-white relative overflow-hidden">
      {/* Background animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-purple-800/50 to-pink-900/50 animate-pulse"></div>
      
      {/* Header */}
      <div className="relative z-10 p-6 text-center">
        <p className="text-sm text-purple-200 mb-2">Calling...</p>
        <h1 className="text-2xl font-semibold mb-1">Emily</h1>
        <p className="text-purple-200">{formatDuration(callDuration)}</p>
      </div>

      {/* Avatar Section */}
      <div className="relative z-10 flex-1 flex items-center justify-center">
        <div className="relative">
          {/* Pulse rings */}
          <div className="absolute inset-0 rounded-full border-4 border-white/20 animate-ping scale-110"></div>
          <div className="absolute inset-0 rounded-full border-4 border-white/10 animate-ping scale-125" style={{ animationDelay: '0.5s' }}></div>
          
          {/* Avatar */}
          <Avatar className="h-40 w-40 ring-4 ring-white/30">
            <AvatarImage src="/placeholder.svg" alt="Emily" />
            <AvatarFallback className="bg-purple-300 text-purple-800 text-4xl">EM</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Call Controls */}
      <div className="relative z-10 p-6">
        <div className="flex justify-center space-x-6 mb-6">
          {/* Mute Button */}
          <Button
            onClick={() => setIsMuted(!isMuted)}
            variant="ghost"
            size="icon"
            className={`h-14 w-14 rounded-full ${
              isMuted 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-white/20 hover:bg-white/30 text-white'
            } transition-all duration-200`}
          >
            {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
          </Button>

          {/* End Call Button */}
          <Button
            onClick={onEndCall}
            variant="ghost"
            size="icon"
            className="h-16 w-16 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all duration-200 shadow-lg"
          >
            <PhoneOff className="h-8 w-8" />
          </Button>

          {/* Video Button */}
          <Button
            onClick={() => setIsVideoOn(!isVideoOn)}
            variant="ghost"
            size="icon"
            className={`h-14 w-14 rounded-full ${
              isVideoOn 
                ? 'bg-green-500 hover:bg-green-600 text-white' 
                : 'bg-white/20 hover:bg-white/30 text-white'
            } transition-all duration-200`}
          >
            {isVideoOn ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
          </Button>
        </div>

        {/* Status indicator */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-purple-200">Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallInterface;
