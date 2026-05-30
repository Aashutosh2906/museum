import { Link } from "react-router-dom";
import { ParchmentBackdrop } from "@/components/leonardo/ParchmentBackdrop";
import logo from "@/assets/leonardo-logo.png";

const Welcome = () => {
  return (
    <main className="relative min-h-dvh flex items-center justify-center px-6 py-12">
      <ParchmentBackdrop />

      <article className="relative max-w-3xl w-full text-center animate-fade-up">
        <div className="mb-10 flex justify-center">
          <img
            src={logo}
            alt="Leonardo da Vinci notebook sketches"
            width={1024}
            height={1024}
            className="w-40 h-40 object-contain opacity-80"
          />
        </div>

        <p className="ornament-divider font-display tracking-[0.3em] text-xs uppercase text-gold mb-8">
          <span>Leonardo da Vinci Museum of North America</span>
        </p>

        <h1 className="font-display text-6xl md:text-7xl lg:text-8xl text-ink leading-[1.05] mb-8">
          Speak with<br />
          <span className="italic font-semibold text-[hsl(var(--renaissance-blue))]">Leonardo</span>
        </h1>

        <p className="font-serif italic text-2xl md:text-3xl text-ink-soft max-w-2xl mx-auto mb-14 leading-snug">
          “Ask me anything. I have been waiting five centuries for new questions.”
        </p>

        <Link
          to="/conversation"
          className="inline-block font-display tracking-[0.25em] text-sm uppercase px-12 py-5 bg-[hsl(var(--renaissance-blue))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(225_47%_28%)] transition-all shadow-codex hover:shadow-quill rounded-sm border border-gold/40 hover:scale-[1.02]"
        >
          Begin the Conversation
        </Link>

        <p className="ornament-divider mt-16 text-gold/70 text-lg">
          <span className="font-display tracking-widest text-xs uppercase">Anno Domini MMXXVI</span>
        </p>
      </article>
    </main>
  );
};

export default Welcome;
