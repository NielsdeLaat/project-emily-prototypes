
import { useState } from "react";
import ChatInterface from "../components/ChatInterface";
import PersonaMenu from "../components/PersonaMenu";
import type { Persona } from "../components/PersonaMenu";

const Index = () => {
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);

  const handleSelectPersona = (persona: Persona) => {
    setSelectedPersona(persona);
  };

  const handleBack = () => {
    setSelectedPersona(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {selectedPersona ? (
        <ChatInterface persona={selectedPersona} onBack={handleBack} />
      ) : (
        <PersonaMenu onSelectPersona={handleSelectPersona} />
      )}
    </div>
  );
};

export default Index;
