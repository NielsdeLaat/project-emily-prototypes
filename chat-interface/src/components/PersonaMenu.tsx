import { ArrowLeft, MessageCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PERSONA_AVATARS } from "@/config/avatars";
import InfoDialog from "./InfoDialog";
import { getLastMessage } from "@/services/chatHistory";

interface Persona {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  color: string;
}

interface PersonaMenuProps {
  onSelectPersona: (persona: Persona) => void;
}

const personas: Persona[] = [
  {
    id: "emily",
    name: "Emily",
    description: "Start een gesprek!",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "jason",
    name: "Jason",
    description: "Start een gesprek!",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "kellan",
    name: "Kellan",
    description: "Start een gesprek!",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "jessica",
    name: "Jessica",
    description: "Start een gesprek!",
    color: "from-orange-500 to-red-500",
  },
  {
    id: "kevin",
    name: "Kevin",
    description: "Start een gesprek!",
    color: "from-indigo-500 to-purple-500",
  },
];

const PersonaMenu = ({ onSelectPersona }: PersonaMenuProps) => {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="bg-emilyBlue text-white p-4 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Back Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                window.open(
                  "https://project-emily-prototypes-flame.vercel.app/",
                  "_blank"
                )
              }
              className="text-white hover:bg-white/20 rounded-full w-10 h-10 p-0 mr-2"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div>
              <h1 className="font-semibold text-xl">Met wie wil je praten?</h1>
              <p className="text-sm text-slate-200">
                Selecteer met wie je wilt praten.
              </p>
            </div>
          </div>
          <InfoDialog />
        </div>
      </div>

      {/* Personas List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {personas.map((persona) => {
          const lastMessage = getLastMessage(persona.id);
          return (
            <Button
              key={persona.id}
              onClick={() => onSelectPersona(persona)}
              variant="ghost"
              className="w-full h-auto p-4 hover:bg-white hover:shadow-md transition-all duration-200 border border-gray-200"
            >
              <div className="flex items-center space-x-4 w-full">
                <div
                  className={`bg-gradient-to-r ${persona.color} p-0 rounded-full`}
                >
                  <Avatar className="h-12 w-12 ring-2 ring-white/20">
                    <AvatarImage
                      src={PERSONA_AVATARS[persona.name]}
                      alt={persona.name}
                    />
                    <AvatarFallback className="bg-white/20 text-white font-semibold">
                      {persona.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="text-left flex-1">
                  <h3 className="font-semibold text-lg text-gray-800">
                    {persona.name}
                  </h3>
                  <p className="text-sm text-gray-600 truncate max-w-[250px]">
                    {lastMessage || persona.description}
                  </p>
                </div>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default PersonaMenu;
export type { Persona };
