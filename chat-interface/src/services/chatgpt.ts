import OpenAI from "openai";
import { PERSONA_PROMPTS } from "./personaPrompts";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Only use this in development
});

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function generateChatGPTResponse(
  messages: ChatMessage[],
  persona: string
): Promise<string> {
  console.log(`[ChatGPT] Starting conversation with ${persona}`);
  console.log(`[ChatGPT] Message history:`, messages);

  try {
    const systemMessage = {
      role: "system" as const,
      content:
        PERSONA_PROMPTS[persona] ||
        `You are ${persona}, a character with a unique story and perspective. Respond in a way that reflects your character's personality and background. Keep responses concise and engaging.`,
    };

    console.log(`[ChatGPT] System message:`, systemMessage);

    console.log(`[ChatGPT] Sending request to OpenAI API...`);
    const startTime = performance.now();

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [systemMessage, ...messages],
      temperature: 0.7,
      max_tokens: 150,
    });

    const endTime = performance.now();
    console.log(
      `[ChatGPT] Response received in ${(endTime - startTime).toFixed(2)}ms`
    );
    console.log(`[ChatGPT] Raw response:`, response);

    const content = response.choices[0]?.message?.content;
    if (!content) {
      console.warn(`[ChatGPT] No content in response:`, response);
      return "I'm not sure how to respond to that.";
    }

    console.log(`[ChatGPT] Generated response:`, content);
    return content;
  } catch (error) {
    console.error("[ChatGPT] Error details:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return "I'm having trouble connecting right now. Please try again later.";
  }
}
