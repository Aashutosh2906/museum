/**
 * Analytics architecture — prepared but disabled by default.
 * Wire into a backend table when the museum chooses to enable logging.
 */
import type { ChatTurn } from "./leonardoApi";

export interface ConversationLog {
  sessionId: string;
  startedAt: string;
  endedAt: string;
  durationMs: number;
  turns: ChatTurn[];
  rating?: 1 | 2 | 3 | 4 | 5;
}

export async function logConversation(_log: ConversationLog, enabled: boolean) {
  if (!enabled) return;
  // Intentional no-op placeholder. To enable: persist to a 'conversations' table.
  // Example:
  // await supabase.from('conversations').insert({ ... });
}
