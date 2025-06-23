import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PERSONA_AVATARS } from "@/config/avatars";
import CallButton from "./CallButton";
import type { Persona } from "@/types/chat";

interface ChatHeaderProps {
  persona: Persona;
  onBack: () => void;
  onCall: () => void;
}

const ChatHeader = ({ persona, onBack, onCall }: ChatHeaderProps) => {
  return (
    <div className="bg-emilyBlue text-white p-4 flex items-center justify-between shadow-[0_4px_6px_-1px_rgba(0,0,0,0.2)] relative z-10">
      <div className="flex items-center space-x-3">
        <Button
          onClick={onBack}
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20 mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Avatar className="h-10 w-10 ring-2 ring-white/20">
          <AvatarImage src={PERSONA_AVATARS[persona.id]} alt={persona.name} />
          <AvatarFallback className="bg-white/20 text-white">
            {persona.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="font-semibold text-lg">{persona.name}</h1>
          <p className="text-sm text-white/80">Online</p>
        </div>
      </div>
      <CallButton onCall={onCall} />
    </div>
  );
};

export default ChatHeader;
