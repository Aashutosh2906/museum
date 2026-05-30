/**
 * Clean API service layer for Leonardo's responses.
 * Backed by a Lovable Cloud edge function (no API keys in the frontend).
 */
import { supabase } from "@/integrations/supabase/client";
import { LEONARDO_SYSTEM_PROMPT, pickMockResponse } from "@/config/leonardo";

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export interface LeonardoResponse {
  reply: string;
  mocked?: boolean;
}

export async function askLeonardo(
  messages: ChatTurn[],
  opts: { devMode: boolean }
): Promise<LeonardoResponse> {
  if (opts.devMode) {
    // Simulated thinking time, then a canned response.
    await new Promise((r) => setTimeout(r, 900 + Math.random() * 700));
    const userCount = messages.filter((m) => m.role === "user").length;
    return { reply: pickMockResponse(userCount), mocked: true };
  }

  const { data, error } = await supabase.functions.invoke("chat-with-leonardo", {
    body: { messages, systemPrompt: LEONARDO_SYSTEM_PROMPT },
  });

  if (error) {
    console.error("askLeonardo error", error);
    throw new Error(error.message || "Leonardo is momentarily silent.");
  }
  if (!data?.reply) {
    throw new Error("Leonardo's quill paused without writing.");
  }
  return { reply: data.reply as string };
}
