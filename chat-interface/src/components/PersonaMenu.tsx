import { ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PERSONA_AVATARS } from "@/config/avatars";
import { PERSONAS } from "@/config/personas";
import InfoDialog from "./InfoDialog";
import { getLastMessage } from "@/services/chatHistory";
import type { Persona } from "@/types/chat";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { saveChatHistory } from "@/services/chatHistory";
import { useState } from "react";

interface PersonaMenuProps {
  onSelectPersona: (persona: Persona) => void;
}

const PersonaMenu = ({ onSelectPersona }: PersonaMenuProps) => {
  const [swipeStartX, setSwipeStartX] = useState<Record<string, number>>({});
  const [swipeDelta, setSwipeDelta] = useState<Record<string, number>>({});
  const [dialogPersona, setDialogPersona] = useState<Persona | null>(null);

  // Helper to reset chat history for a persona
  const handleDeletePersonaHistory = (persona: Persona) => {
    saveChatHistory(persona.id, []);
    setDialogPersona(null);
  };

  // Touch and mouse event handlers
  const handleTouchStart = (
    id: string,
    e: React.TouchEvent | React.MouseEvent
  ) => {
    const clientX =
      "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    setSwipeStartX((prev) => ({ ...prev, [id]: clientX }));
    setSwipeDelta((prev) => ({ ...prev, [id]: 0 }));
  };
  const handleTouchMove = (
    id: string,
    e: React.TouchEvent | React.MouseEvent
  ) => {
    let clientX;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
    } else if ((e as React.MouseEvent).buttons) {
      clientX = (e as React.MouseEvent).clientX;
    } else {
      return;
    }
    const startX = swipeStartX[id];
    if (startX !== undefined) {
      const deltaX = clientX - startX;
      setSwipeDelta((prev) => ({ ...prev, [id]: deltaX < 0 ? deltaX : 0 }));
    }
  };
  const handleTouchEnd = (persona: Persona) => {
    const deltaX = swipeDelta[persona.id];
    if (deltaX !== undefined && deltaX < -80) {
      setDialogPersona(persona);
    }
    setSwipeStartX((prev) => ({ ...prev, [persona.id]: 0 }));
    setSwipeDelta((prev) => ({ ...prev, [persona.id]: 0 }));
  };

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
              onClick={() => {
                window.location.href = "https://globe-progress.vercel.app/";
              }}
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
        {PERSONAS.map((persona) => {
          const lastMessage = getLastMessage(persona.id);
          const swipeX = swipeDelta[persona.id] || 0;
          return (
            <div key={persona.id} className="relative">
              {/* Swipe background */}
              <div
                className="absolute inset-0 flex items-center justify-end pr-6 transition-colors duration-200"
                style={{
                  background: swipeX < 0 ? "#ef4444" : "transparent",
                  zIndex: 0,
                }}
              >
                {swipeX < 0 && <Trash2 className="h-7 w-7 text-white" />}
              </div>
              {/* Foreground chat button */}
              <div
                className="relative z-10"
                style={{
                  transform: swipeX < 0 ? `translateX(${swipeX}px)` : "none",
                  transition: swipeX === 0 ? "transform 0.2s" : undefined,
                }}
                onTouchStart={(e) => handleTouchStart(persona.id, e)}
                onTouchMove={(e) => handleTouchMove(persona.id, e)}
                onTouchEnd={() => handleTouchEnd(persona)}
                onMouseDown={(e) => handleTouchStart(persona.id, e)}
                onMouseMove={(e) => handleTouchMove(persona.id, e)}
                onMouseUp={() => handleTouchEnd(persona)}
                onMouseLeave={() => handleTouchEnd(persona)}
              >
                <Button
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
                          src={PERSONA_AVATARS[persona.id]}
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
              </div>
              {/* Confirmation dialog for this persona */}
              {dialogPersona?.id === persona.id && (
                <AlertDialog open={true}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Chatgeschiedenis verwijderen?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Weet je zeker dat je de chatgeschiedenis met{" "}
                        <b>{persona.name}</b> wilt verwijderen? Dit kan niet
                        ongedaan worden gemaakt.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setDialogPersona(null)}>
                        Annuleren
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeletePersonaHistory(persona)}
                        autoFocus
                        className="bg-emilyBlue text-white hover:bg-emilyBlue/90"
                      >
                        Verwijderen
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PersonaMenu;
