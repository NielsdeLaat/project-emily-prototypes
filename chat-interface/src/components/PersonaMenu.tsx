import { ArrowLeft, MessageCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
    description: "Fled Hong Kong after demonstrations.",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "jason",
    name: "Jason",
    description: "Survivor of religious childhood abuse.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "kellan",
    name: "Kellan",
    description: "Has to hide his sexuality.",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "jessica",
    name: "Jessica",
    description: "Her Story of systemic neglect was silenced.",
    color: "from-orange-500 to-red-500",
  },
  {
    id: "kevin",
    name: "Kevin",
    description: "Indigenous activist fighting for recognition.",
    color: "from-indigo-500 to-purple-500",
  },
];

const PersonaMenu = ({ onSelectPersona }: PersonaMenuProps) => {
  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white shadow-2xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-600 to-slate-700 text-white p-4">
        <div className="flex items-center space-x-3">
          <MessageCircle className="h-8 w-8" />
          <div>
            <h1 className="font-semibold text-xl">Who will you talk to?</h1>
            <p className="text-sm text-slate-200">
              Select who you'd like to chat with
            </p>
          </div>
        </div>
      </div>

      {/* Personas List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {personas.map((persona) => (
          <Button
            key={persona.id}
            onClick={() => onSelectPersona(persona)}
            variant="ghost"
            className="w-full h-auto p-4 hover:bg-white hover:shadow-md transition-all duration-200 border border-gray-200"
          >
            <div className="flex items-center space-x-4 w-full">
              <div
                className={`bg-gradient-to-r ${persona.color} p-3 rounded-full`}
              >
                <Avatar className="h-12 w-12 ring-2 ring-white/20">
                  <AvatarImage src="/placeholder.svg" alt={persona.name} />
                  <AvatarFallback className="bg-white/20 text-white font-semibold">
                    {persona.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="text-left flex-1">
                <h3 className="font-semibold text-lg text-gray-800">
                  {persona.name}
                </h3>
                <p className="text-sm text-gray-600">{persona.description}</p>
              </div>
              <div className="text-gray-400">
                <User className="h-5 w-5" />
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default PersonaMenu;
export type { Persona };
