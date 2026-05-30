import parchment from "@/assets/parchment-texture.jpg";
import sketches from "@/assets/leonardo-sketches.png";
import geometry from "@/assets/leonardo-geometry.png";

/** Full-bleed parchment background with subtle floating sketches. */
export const ParchmentBackdrop = ({ withSketches = true }: { withSketches?: boolean }) => (
  <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden parchment-surface">
    <img
      src={parchment}
      alt=""
      aria-hidden="true"
      className="absolute inset-0 h-full w-full object-cover opacity-60 mix-blend-multiply"
    />
    {withSketches && (
      <>
        <img
          src={sketches}
          alt=""
          aria-hidden="true"
          loading="lazy"
          width={1024}
          height={1024}
          className="absolute -left-24 top-10 w-[28rem] opacity-[0.10] rotate-[-8deg] animate-float mix-blend-multiply"
        />
        <img
          src={sketches}
          alt=""
          aria-hidden="true"
          loading="lazy"
          width={1024}
          height={1024}
          className="absolute -right-32 bottom-0 w-[32rem] opacity-[0.08] rotate-[12deg] animate-float mix-blend-multiply"
          style={{ animationDelay: "2s" }}
        />
        <img
          src={geometry}
          alt=""
          aria-hidden="true"
          loading="lazy"
          width={1024}
          height={1024}
          className="absolute -right-16 top-12 w-[22rem] opacity-[0.09] rotate-[6deg] animate-float mix-blend-multiply"
          style={{ animationDelay: "1s" }}
        />
        <img
          src={geometry}
          alt=""
          aria-hidden="true"
          loading="lazy"
          width={1024}
          height={1024}
          className="absolute -left-20 bottom-8 w-[20rem] opacity-[0.07] rotate-[-14deg] animate-float mix-blend-multiply"
          style={{ animationDelay: "3s" }}
        />
      </>
    )}
    {/* vignette */}
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,hsl(28_40%_25%/0.18)_100%)]" />
  </div>
);
