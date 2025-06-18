import { useState, useRef, useEffect, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Message, Persona, ChatState, ChatActions } from "@/types/chat";
import { getInitialMessage } from "@/config/personas";
import { saveChatHistory, getChatHistory } from "@/services/chatHistory";
import {
  generateChatGPTResponse,
  generateExampleQuestions,
} from "@/services/chatgpt";
import {
  TIMING,
  UI,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from "@/config/constants";

export const useChat = (persona: Persona): ChatState & ChatActions => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const history = getChatHistory(persona.id);
    if (history.length > 0) return history;

    return [
      {
        id: "1",
        text: getInitialMessage(persona.name),
        sender: "ai",
        timestamp: new Date(Date.now() - UI.INITIAL_MESSAGE_DELAY),
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
  const [lastGeneratedHistoryHash, setLastGeneratedHistoryHash] =
    useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Create a hash of the current chat history to track changes
  const currentHistoryHash = useMemo(() => {
    return messages.map((msg) => `${msg.id}:${msg.text}`).join("|");
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: TIMING.SCROLL_BEHAVIOR,
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    saveChatHistory(persona.id, messages);
  }, [messages, persona.id]);

  const loadExampleQuestions = async (forceRegenerate = false) => {
    // Only regenerate if history changed or forced
    if (
      !forceRegenerate &&
      currentHistoryHash === lastGeneratedHistoryHash &&
      exampleQuestions.length > 0
    ) {
      return; // Use cached questions
    }

    setIsLoadingQuestions(true);
    setQuestionsError(false);
    setExampleQuestions([]);

    try {
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
        setLastGeneratedHistoryHash(currentHistoryHash);
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

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date(),
      personaName: persona.name,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const chatMessages = messages.map((msg) => ({
        role:
          msg.sender === "user" ? ("user" as const) : ("assistant" as const),
        content: msg.text,
      }));

      chatMessages.push({
        role: "user" as const,
        content: text,
      });

      const response = await generateChatGPTResponse(
        chatMessages,
        persona.name
      );

      const aiResponse: Message = {
        id: (Date.now() + UI.MESSAGE_ID_OFFSET).toString(),
        text: response,
        sender: "ai",
        timestamp: new Date(),
        personaName: persona.name,
      };

      setMessages((prev) => [...prev, aiResponse]);

      // Regenerate questions after new messages if panel is open
      if (showExampleQuestions) {
        await loadExampleQuestions(true);
      }
    } catch (error) {
      console.error("Error getting ChatGPT response:", error);
      toast({
        title: "Error",
        description: ERROR_MESSAGES.AI_RESPONSE_FAILED,
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
    }
  };

  const toggleExampleQuestions = async () => {
    if (showExampleQuestions) {
      setIsClosing(true);
      setTimeout(() => {
        setShowExampleQuestions(false);
        setIsClosing(false);
      }, TIMING.EXAMPLE_QUESTIONS_CLOSE_DELAY);
    } else {
      setShowExampleQuestions(true);
      // Only load questions if we don't have cached ones for current history
      await loadExampleQuestions();
    }
  };

  const selectExampleQuestion = (question: string) => {
    setInputValue(question);
    setShowExampleQuestions(false);
  };

  const startCall = () => {
    setIsInCall(true);
    toast({
      title: "Call started",
      description: `${SUCCESS_MESSAGES.CALL_STARTED} ${persona.name}`,
    });
  };

  const endCall = () => {
    setIsInCall(false);
    toast({
      title: "Call ended",
      description: SUCCESS_MESSAGES.CALL_ENDED,
    });
  };

  return {
    // State
    messages,
    inputValue,
    isTyping,
    isInCall,
    showExampleQuestions,
    isClosing,
    exampleQuestions,
    isLoadingQuestions,
    questionsError,
    // Actions
    sendMessage,
    setInputValue,
    toggleExampleQuestions,
    selectExampleQuestion,
    startCall,
    endCall,
  };
};
