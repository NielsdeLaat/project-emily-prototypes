import { useState, useRef, useEffect } from "react";
import { Send, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MessageBubble from "./MessageBubble";
import CallButton from "./CallButton";
import CallInterface from "./CallInterface";
import { useToast } from "@/hooks/use-toast";
import type { Persona } from "./PersonaMenu";
import { generateChatGPTResponse } from "@/services/chatgpt";
import { PERSONA_AVATARS } from "@/config/avatars";
import { saveChatHistory, getChatHistory } from "@/services/chatHistory";
import type { Message } from "@/types/chat";

interface ChatInterfaceProps {
  persona: Persona;
  onBack: () => void;
}

const ChatInterface = ({ persona, onBack }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const history = getChatHistory(persona.id);
    if (history.length > 0) return history;

    return [
      {
        id: "1",
        text: getInitialMessage(persona.name),
        sender: "ai",
        timestamp: new Date(Date.now() - 300000),
        personaName: persona.name,
      },
    ];
  });

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    saveChatHistory(persona.id, messages);
  }, [messages, persona.id]);

  function getInitialMessage(name: string): string {
    const greetings: Record<string, string> = {
      Emily:
        "Hoi, ik ben Emily. Ik ben 24 jaar oud en gevlucht uit Hongkong na de protesten van 2019. In Taipei bouw ik met mijn vriend Jason aan een nieuw leven.",
      Jason:
        "Er waren jaren waarin ik mezelf verbood te praten over wat er gebeurde. Tot ik besefte dat zwijgen hen juist sterker maakte.",
      Kellan:
        "In mijn land leer je al jong om te zwijgen over wie je bent. Elke dag voelt als toneelspelen — maar dit is mijn echte stem",
      Jessica:
        "Ze zeiden dat mijn verhaal niet mocht, dat het vertrouwelijk was. Maar wie beschermt er eigenlijk wie als niemand luistert?",
      Kevin:
        "Mijn opa vertelde verhalen die nergens zijn opgeschreven. Als ik zwijg, verdwijnt niet alleen zijn stem — maar ook ons bestaan.",
    };
    return greetings[name] || `Hi! I'm ${name}. How can I help you today?`;
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
      personaName: persona.name,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      // Convert messages to ChatGPT format
      const chatMessages = messages.map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      }));

      // Add the new user message
      chatMessages.push({
        role: "user",
        content: inputValue,
      });

      // Get response from ChatGPT
      const response = await generateChatGPTResponse(
        chatMessages,
        persona.name
      );

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: "ai",
        timestamp: new Date(),
        personaName: persona.name,
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error getting ChatGPT response:", error);
      toast({
        title: "Error",
        description: "Failed to get response from AI. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleCall = () => {
    setIsInCall(true);
    toast({
      title: "Call started",
      description: `You are now connected with ${persona.name}`,
    });
  };

  const handleEndCall = () => {
    setIsInCall(false);
    toast({
      title: "Call ended",
      description: "The call has been disconnected",
    });
  };

  // Show call interface if in call
  if (isInCall) {
    return <CallInterface onEndCall={handleEndCall} />;
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="bg-emilyBlue text-white p-4 flex items-center justify-between">
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
            <AvatarImage
              src={PERSONA_AVATARS[persona.name]}
              alt={persona.name}
            />
            <AvatarFallback className="bg-white/20 text-white">
              {persona.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-lg">{persona.name}</h1>
            <p className="text-sm text-white/80">Online</p>
          </div>
        </div>
        <CallButton onCall={handleCall} />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {isTyping && (
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={PERSONA_AVATARS[persona.name]}
                alt={persona.name}
              />
              <AvatarFallback className="bg-purple-100 text-purple-600 text-xs">
                {persona.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="bg-white rounded-2xl px-4 py-2 shadow-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 rounded-full border-gray-300 focus:border-purple-500 focus:ring-purple-500"
          />
          <Button
            onClick={handleSendMessage}
            className="rounded-full bg-emilyBlue hover:opacity-90 transition-all duration-200"
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
