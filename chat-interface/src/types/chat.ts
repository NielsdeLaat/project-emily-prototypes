export interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  personaName: string;
}

export interface Persona {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  color: string;
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ChatState {
  messages: Message[];
  inputValue: string;
  isTyping: boolean;
  isInCall: boolean;
  showExampleQuestions: boolean;
  isClosing: boolean;
  exampleQuestions: string[];
  isLoadingQuestions: boolean;
  questionsError: boolean;
}

export interface ChatActions {
  sendMessage: (text: string) => Promise<void>;
  setInputValue: (value: string) => void;
  toggleExampleQuestions: () => Promise<void>;
  selectExampleQuestion: (question: string) => void;
  startCall: () => void;
  endCall: () => void;
}
