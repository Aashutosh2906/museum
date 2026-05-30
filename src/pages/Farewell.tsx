import { Link, useSearchParams } from "react-router-dom";
import { ParchmentBackdrop } from "@/components/leonardo/ParchmentBackdrop";
import sketches from "@/assets/leonardo-sketches.png";

const Farewell = () => {
  const [params] = useSearchParams();
  const wasTimeout = params.get("reason") === "timeout";

  return (
    <main className="relative min-h-dvh flex items-center justify-center px-6 py-12">
      <ParchmentBackdrop />

      <article className="relative max-w-2xl w-full text-center animate-fade-up">
        <div className="mb-8 flex justify-center">
          <img
            src={sketches}
            alt=""
            width={1024}
            height={1024}
            className="w-32 h-32 object-contain opacity-70"
          />
        </div>

        <p className="ornament-divider font-display tracking-[0.3em] text-xs uppercase text-gold mb-6">
          <span>Until We Meet Again</span>
        </p>

        <h1 className="font-display text-5xl md:text-6xl text-ink italic mb-8 leading-tight">
          {wasTimeout ? "The quill rests…" : "Farewell, traveler."}
        </h1>

        <blockquote className="font-serif italic text-xl md:text-2xl text-ink-soft leading-relaxed mb-12 border-l-2 border-gold/50 pl-6 text-left">
          “Learning never exhausts the mind. Go now — observe the light on the water,
          the curve of a leaf, the breath of one you love. Return when a new question
          has formed in you.”
          <footer className="mt-3 not-italic text-sm font-display tracking-widest uppercase text-gold">
            — Leonardo
          </footer>
        </blockquote>

        <Link
          to="/conversation"
          className="inline-block font-display tracking-[0.25em] text-sm uppercase px-12 py-5 bg-[hsl(var(--renaissance-blue))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(225_47%_28%)] transition-all shadow-codex hover:shadow-quill rounded-sm border border-gold/40 hover:scale-[1.02]"
        >
          Begin a New Conversation
        </Link>

        <div className="mt-6">
          <Link to="/" className="text-sm font-display tracking-widest uppercase text-sepia hover:text-ink transition-colors">
            Return to the Entrance
          </Link>
        </div>
      </article>
    </main>
  );
};

export default Farewell;
