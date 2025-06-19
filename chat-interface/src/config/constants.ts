// Animation constants
export const ANIMATION_DELAYS = {
  TYPING_DOT_1: "0s",
  TYPING_DOT_2: "0.1s",
  TYPING_DOT_3: "0.2s",
  EXAMPLE_QUESTION_STAGGER: 0.05,
} as const;

// Timing constants
export const TIMING = {
  EXAMPLE_QUESTIONS_CLOSE_DELAY: 300,
  SCROLL_BEHAVIOR: "smooth" as const,
} as const;

// UI constants
export const UI = {
  MAX_QUESTION_LENGTH: 40,
  MAX_EXAMPLE_QUESTIONS: 3,
  MESSAGE_ID_OFFSET: 1,
  INITIAL_MESSAGE_DELAY: 300000, // 5 minutes in milliseconds
} as const;

// API constants
export const API = {
  MODEL: "gpt-3.5-turbo",
  TEMPERATURE: 0.7,
  MAX_TOKENS: 150,
  EXAMPLE_QUESTIONS_TEMPERATURE: 0.8,
  EXAMPLE_QUESTIONS_MAX_TOKENS: 300,
} as const;

// Error messages
export const ERROR_MESSAGES = {
  API_ERROR:
    "Ik heb op dit moment problemen met verbinden. Probeer het later nog eens.",
  NO_RESPONSE:
    "Er is iets misgegaan met het sturen van je bericht. Probeer het nog eens.",
  EXAMPLE_QUESTIONS_UNAVAILABLE:
    "Voorbeeldvragen zijn op dit moment niet beschikbaar",
  AI_RESPONSE_FAILED: "Failed to get response from AI. Please try again.",
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  CALL_STARTED: "Je belt nu met",
  CALL_ENDED: "Je hebt opgehangen.",
  CHAT_HISTORY_CLEARED: "Chatgeschiedenis verwijderd.",
  CHAT_HISTORY_RESET: "Alle chatgeschiedenis gereset.",
} as const;

// Loading messages
export const LOADING_MESSAGES = {
  QUESTIONS_LOADING: "Vragen laden...",
} as const;
