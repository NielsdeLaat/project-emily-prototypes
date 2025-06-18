import type { Message } from "@/types/chat";

const CHAT_HISTORY_KEY = "chat_history";

export const saveChatHistory = (personaId: string, messages: Message[]) => {
  const allHistory = getAllChatHistory();
  allHistory[personaId] = messages;
  localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(allHistory));
};

export const getChatHistory = (personaId: string): Message[] => {
  const allHistory = getAllChatHistory();
  const messages = allHistory[personaId] || [];
  // Convert string timestamps back to Date objects
  return messages.map((message) => ({
    ...message,
    timestamp: new Date(message.timestamp),
  }));
};

export const getLastMessage = (personaId: string): string | null => {
  const messages = getChatHistory(personaId);
  if (messages.length === 0) return null;
  return messages[messages.length - 1].text;
};

const getAllChatHistory = (): Record<string, Message[]> => {
  const history = localStorage.getItem(CHAT_HISTORY_KEY);
  return history ? JSON.parse(history) : {};
};
