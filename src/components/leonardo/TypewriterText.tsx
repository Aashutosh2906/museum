import { useEffect, useState } from "react";

interface Props {
  text: string;
  speedMs: number;
  onDone?: () => void;
}

export const TypewriterText = ({ text, speedMs, onDone }: Props) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(0);
  }, [text]);

  useEffect(() => {
    if (count >= text.length) {
      onDone?.();
      return;
    }
    const id = window.setTimeout(() => setCount((c) => c + 1), speedMs);
    return () => window.clearTimeout(id);
  }, [count, text, speedMs, onDone]);

  const done = count >= text.length;

  return (
    <span>
      {text.slice(0, count)}
      {!done && <span className="typewriter-caret" aria-hidden="true" />}
    </span>
  );
};
