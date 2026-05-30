import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Send, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { ParchmentBackdrop } from "@/components/leonardo/ParchmentBackdrop";
import { QuillLoader } from "@/components/leonardo/QuillLoader";
import { TypewriterText } from "@/components/leonardo/TypewriterText";
import { AdminPanel } from "@/components/leonardo/AdminPanel";
import { askLeonardo, type ChatTurn } from "@/services/leonardoApi";
import { logConversation } from "@/services/analytics";
import { LEONARDO_CLOSING, loadSettings, type LeonardoSettings } from "@/config/leonardo";

interface Msg extends ChatTurn { id: string; isClosing?: boolean }

const SUGGESTED_PROMPTS = [
  "What do you think of our modern flying machines?",
  "How did you learn to see the world so closely?",
  "What was your greatest unfinished idea?",
  "If you lived today, what would you study?",
  "Tell me a secret from your notebooks.",
];

const greeting: Msg = {
  id: "greeting",
  role: "assistant",
  content:
    "Welcome, traveler from your century. I am Leonardo — painter, engineer, watcher of birds and water. Sit a moment. What stirs in your mind today?",
};

const Conversation = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<LeonardoSettings>(loadSettings());
  const [messages, setMessages] = useState<Msg[]>([greeting]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [startedAt] = useState(() => new Date().toISOString());

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const inactivityRef = useRef<number | null>(null);

  const userTurns = useMemo(() => messages.filter((m) => m.role === "user").length, [messages]);
  const conversationOver = messages.some((m) => m.isClosing);

  // Auto-focus input
  useEffect(() => { inputRef.current?.focus(); }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isThinking]);

  // Inactivity reset
  const resetInactivity = useCallback(() => {
    if (inactivityRef.current) window.clearTimeout(inactivityRef.current);
    inactivityRef.current = window.setTimeout(() => {
      navigate("/farewell?reason=timeout");
    }, settings.inactivityTimeoutMs);
  }, [navigate, settings.inactivityTimeoutMs]);

  useEffect(() => {
    resetInactivity();
    const events: (keyof DocumentEventMap)[] = ["pointerdown", "keydown", "touchstart"];
    events.forEach((e) => document.addEventListener(e, resetInactivity));
    return () => {
      events.forEach((e) => document.removeEventListener(e, resetInactivity));
      if (inactivityRef.current) window.clearTimeout(inactivityRef.current);
    };
  }, [resetInactivity]);

  const endConversation = useCallback(async () => {
    const endedAt = new Date().toISOString();
    await logConversation(
      {
        sessionId,
        startedAt,
        endedAt,
        durationMs: Date.now() - new Date(startedAt).getTime(),
        turns: messages.map(({ role, content }) => ({ role, content })),
      },
      settings.analyticsEnabled,
    );
    navigate("/farewell");
  }, [messages, navigate, sessionId, startedAt, settings.analyticsEnabled]);

  const send = async (overrideText?: string) => {
    const text = (overrideText ?? input).trim();
    if (!text || isThinking || conversationOver) return;

    const userMsg: Msg = { id: crypto.randomUUID(), role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setIsThinking(true);

    try {
      const history: ChatTurn[] = next
        .filter((m) => m.id !== "greeting")
        .map(({ role, content }) => ({ role, content }));

      const { reply } = await askLeonardo(history, { devMode: settings.devMode });

      const isLastTurn = userTurns + 1 >= settings.maxTurns;
      const finalReply = isLastTurn ? `${reply}\n\n${LEONARDO_CLOSING}` : reply;

      setMessages((m) => [
        ...m,
        { id: crypto.randomUUID(), role: "assistant", content: finalReply, isClosing: isLastTurn },
      ]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Leonardo is momentarily silent.";
      toast.error(msg);
    } finally {
      setIsThinking(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const showSuggestions = messages.length === 1 && !isThinking && !conversationOver;

  return (
    <main className="relative min-h-dvh flex flex-col">
      <ParchmentBackdrop />
      <AdminPanel onChange={setSettings} />

      {/* Header */}
      <header className="px-6 md:px-12 pt-6 pb-4 flex items-center justify-between gap-4 border-b border-gold/20">
        <div>
          <p className="font-display tracking-[0.25em] text-[10px] uppercase text-gold">In Conversation With</p>
          <h1 className="font-display text-2xl md:text-3xl text-ink italic">Leonardo da Vinci</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden md:inline text-sepia text-sm italic">
            {userTurns} / {settings.maxTurns} questions
          </span>
          <button
            onClick={() => navigate("/farewell")}
            className="flex items-center gap-2 text-sm font-display tracking-wider uppercase text-sepia hover:text-ink transition-colors px-3 py-2 rounded-sm hover:bg-ink/5"
            aria-label="End conversation and start new"
          >
            <RotateCcw className="h-4 w-4" />
            New Conversation
          </button>
        </div>
      </header>

      {/* Transcript */}
      <section
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 md:px-12 py-8"
        aria-live="polite"
        aria-label="Conversation transcript"
      >
        <div className="max-w-3xl mx-auto space-y-8">
          {messages.map((m, idx) => {
            const isLast = idx === messages.length - 1;
            const isLeonardo = m.role === "assistant";
            return (
              <div key={m.id} className={`animate-fade-up ${isLeonardo ? "" : "flex justify-end"}`}>
                {isLeonardo ? (
                  <div className="max-w-[90%]">
                    <p className="font-display tracking-[0.25em] text-[10px] uppercase text-gold mb-2">Leonardo</p>
                    <div className="leonardo-message">
                      {isLast && idx > 0 ? (
                        <TypewriterText text={m.content} speedMs={settings.typewriterSpeedMs} />
                      ) : (
                        m.content
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="max-w-[80%]">
                    <div className="user-message">{m.content}</div>
                  </div>
                )}
              </div>
            );
          })}

          {showSuggestions && (
            <div className="animate-fade-up pt-2">
              <p className="font-display tracking-[0.25em] text-[10px] uppercase text-gold mb-3">Or begin with…</p>
              <div className="flex flex-wrap gap-3">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => send(prompt)}
                    className="text-left font-serif italic text-base text-ink bg-parchment-deep/40 hover:bg-parchment-deep/70 border border-gold/40 hover:border-gold rounded-sm px-4 py-3 shadow-codex/40 hover:shadow-quill transition-all hover:-translate-y-0.5"
                  >
                    “{prompt}”
                  </button>
                ))}
              </div>
            </div>
          )}
          {isThinking && (
            <div className="animate-fade-in">
              <p className="font-display tracking-[0.25em] text-[10px] uppercase text-gold mb-2">Leonardo</p>
              <QuillLoader />
            </div>
          )}
          {conversationOver && (
            <div className="text-center pt-8 animate-fade-up">
              <button
                onClick={endConversation}
                className="font-display tracking-[0.25em] text-xs uppercase px-10 py-4 bg-[hsl(var(--renaissance-blue))] text-[hsl(var(--primary-foreground))] rounded-sm shadow-codex hover:scale-[1.02] transition-transform"
              >
                Conclude the Visit
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Composer */}
      <footer className="border-t border-gold/30 bg-parchment/80 backdrop-blur-sm px-4 md:px-12 py-4">
        <div className="max-w-3xl mx-auto flex items-end gap-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={isThinking || conversationOver}
            placeholder={conversationOver ? "The conversation has concluded." : "Ask Leonardo…"}
            rows={1}
            className="flex-1 resize-none bg-parchment-deep/40 border border-gold/40 rounded-sm px-5 py-4 text-lg font-serif text-ink placeholder:text-sepia/60 placeholder:italic focus:outline-none focus:ring-2 focus:ring-gold/60 focus:border-gold disabled:opacity-50 min-h-[60px] max-h-[160px]"
            aria-label="Your question for Leonardo"
            maxLength={500}
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || isThinking || conversationOver}
            className="h-[60px] w-[60px] flex items-center justify-center bg-[hsl(var(--renaissance-blue))] text-[hsl(var(--primary-foreground))] rounded-sm shadow-codex hover:shadow-quill disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            aria-label="Send question"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
        <p className="max-w-3xl mx-auto mt-2 text-center text-xs text-sepia/70 italic">
          Press Enter to send · Shift+Enter for a new line
        </p>
      </footer>
    </main>
  );
};

export default Conversation;
