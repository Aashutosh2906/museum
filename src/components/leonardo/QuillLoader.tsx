import { Feather } from "lucide-react";

export const QuillLoader = () => (
  <div className="quill-loader" aria-live="polite" aria-label="Leonardo is composing a reply">
    <Feather className="h-5 w-5 text-gold animate-quill-write" />
    <span className="text-sepia">Leonardo dips his quill…</span>
    <span className="flex gap-1 ml-1">
      <span className="h-2 w-2 rounded-full bg-sepia/70 animate-ink-drop" />
      <span className="h-2 w-2 rounded-full bg-sepia/70 animate-ink-drop" style={{ animationDelay: "0.2s" }} />
      <span className="h-2 w-2 rounded-full bg-sepia/70 animate-ink-drop" style={{ animationDelay: "0.4s" }} />
    </span>
  </div>
);
