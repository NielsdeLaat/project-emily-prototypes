import { useState, useRef, useEffect } from "react";
import { Send, ArrowLeft, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MessageBubble from "./MessageBubble";
import CallButton from "./CallButton";
import CallInterface from "./CallInterface";
import { useToast } from "@/hooks/use-toast";
import type { Persona } from "./PersonaMenu";
import {
  generateChatGPTResponse,
  generateExampleQuestions,
} from "@/services/chatgpt";
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
  const [showExampleQuestions, setShowExampleQuestions] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [exampleQuestions, setExampleQuestions] = useState<string[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [questionsError, setQuestionsError] = useState(false);
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

  // Load AI-generated example questions
  const loadExampleQuestions = async () => {
    setIsLoadingQuestions(true);
    setQuestionsError(false);
    setExampleQuestions([]); // Clear existing questions to force regeneration

    try {
      // Convert messages to ChatGPT format
      const chatMessages = messages.map((msg) => ({
        role:
          msg.sender === "user" ? ("user" as const) : ("assistant" as const),
        content: msg.text,
      }));

      const questions = await generateExampleQuestions(
        chatMessages,
        persona.name
      );
      if (questions.length > 0) {
        setExampleQuestions(questions);
      } else {
        setQuestionsError(true);
      }
    } catch (error) {
      console.error("Error loading example questions:", error);
      setQuestionsError(true);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const handleExampleQuestionClick = (question: string) => {
    setInputValue(question);
    setShowExampleQuestions(false);
  };

  const handleToggleExampleQuestions = async () => {
    if (showExampleQuestions) {
      // Start closing animation
      setIsClosing(true);
      // Hide after animation completes
      setTimeout(() => {
        setShowExampleQuestions(false);
        setIsClosing(false);
      }, 300);
    } else {
      setShowExampleQuestions(true);
      // Always regenerate questions when opened
      await loadExampleQuestions();
    }
  };

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
        role:
          msg.sender === "user" ? ("user" as const) : ("assistant" as const),
        content: msg.text,
      }));

      // Add the new user message
      chatMessages.push({
        role: "user" as const,
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

      // Regenerate example questions after new response
      if (showExampleQuestions) {
        await loadExampleQuestions();
      }
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
    <div className="flex flex-col h-full bg-white relative">
      {/* Header */}
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

      {/* Example Questions - Positioned absolutely above input */}
      {showExampleQuestions && (
        <div
          className={`border-t border-gray-200 bg-white z-20 ${
            isClosing ? "closing-animation" : ""
          }`}
          style={{
            animation: isClosing
              ? "slideUpFadeOut 0.3s ease-in forwards"
              : "slideDownFadeIn 0.3s ease-out forwards",
          }}
        >
          <div className="p-4 pb-6">
            <div className="flex flex-col gap-2 w-full">
              <p className="text-sm text-gray-600 mb-2 font-medium flex items-center">
                <Lightbulb className="h-4 w-4 mr-1 text-gray-500" />
                Voorbeeld vragen:
              </p>
              {isLoadingQuestions ? (
                <div className="flex items-center space-x-2 text-gray-500">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                  <span className="text-sm">Vragen laden...</span>
                </div>
              ) : questionsError ? (
                <div className="text-gray-500 text-sm">
                  Voorbeeldvragen zijn op dit moment niet beschikbaar
                </div>
              ) : (
                exampleQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleExampleQuestionClick(question)}
                    className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-full hover:bg-gray-100 hover:border-gray-400 transition-colors duration-200 text-gray-700 break-words text-balance w-full shadow-sm"
                    style={{
                      animation: isClosing
                        ? `slideOutToRight 0.3s ease-in ${
                            (exampleQuestions.length - 1 - index) * 0.05
                          }s forwards`
                        : `slideInFromLeft 0.4s ease-out ${
                            index * 0.05
                          }s forwards`,
                      opacity: isClosing ? 1 : 0,
                      transform: isClosing
                        ? "translateX(0)"
                        : "translateX(-10px)",
                    }}
                  >
                    {question}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="pr-4 pl-4 bg-white border-t border-gray-200">
        <div className="flex space-x-2 p-4">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 rounded-full border-gray-300 focus:border-purple-500 focus:ring-purple-500"
          />
          <Button
            onClick={handleToggleExampleQuestions}
            variant="outline"
            size="icon"
            className="rounded-full border-gray-300 hover:bg-gray-50"
            title="Show example questions"
          >
            <Lightbulb className="h-4 w-4 text-gray-600" />
          </Button>
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
