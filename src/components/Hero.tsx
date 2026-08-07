import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowDown } from "@phosphor-icons/react";

export default function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const vh = window.innerHeight;
      setProgress(Math.min(1, Math.max(0, window.scrollY / (vh * 0.75))));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const ctx = gsap.context(() => {
      gsap.to(".glow-orb", {
        y: -24,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        stagger: 0.6,
      });
      gsap.to(".scroll-dot", {
        y: 10,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    }, root);
    return () => ctx.revert();
  }, [ready]);

  const revealed = ready && loaded;
  const textOpacity = progress;
  const hintOpacity = revealed ? 1 - Math.min(1, progress * 2.2) : 0;


  return (
    <section
      id="home"
      ref={root}
      className="hero-bg relative w-full"
      style={{ height: "185vh" }}
    >
      <div className="sticky top-0 flex h-screen min-h-[640px] w-full items-center overflow-hidden">
        <div
          className="hero-spline absolute inset-0 transition-opacity duration-[1400ms] ease-out"
          style={{ opacity: revealed ? 1 : 0 }}
        >
          <iframe
            title="3D robot"
            src="https://my.spline.design/nexbotbyaximoriscopycopy-yfZ7bdWYajBxb40GbmUnVyOq/"
            frameBorder="0"
            className="h-full w-full"
            onLoad={() => setLoaded(true)}
          />
        </div>
        {/* Soft veil that lifts as the scene appears */}
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-background transition-opacity duration-[1200ms] ease-out"
          style={{ opacity: revealed ? 0 : 1 }}
        />

        {/* Softly masks the 3D viewer watermark badge */}
        <div className="pointer-events-none absolute right-0 bottom-0 z-10 h-24 w-64 bg-[radial-gradient(ellipse_at_bottom_right,var(--background)_35%,transparent_75%)] backdrop-blur-md" />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/45 to-background/70 transition-opacity duration-300"
          style={{ opacity: 0.25 + textOpacity * 0.75 }}
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-56 bg-gradient-to-b from-transparent via-background/80 to-background" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-px bg-[var(--gradient-line)]" />
        <div className="glow-orb pointer-events-none absolute bottom-[-6rem] left-1/2 z-10 h-64 w-[70%] -translate-x-1/2 rounded-full bg-foreground/10 blur-[120px]" />
        <div className="glow-orb pointer-events-none absolute top-24 left-[8%] h-56 w-56 rounded-full bg-foreground/10 blur-[90px]" />
        <div className="glow-orb pointer-events-none absolute right-[12%] bottom-24 h-72 w-72 rounded-full bg-foreground/10 blur-[110px]" />

        {/* Scroll hint — visible only at the very top */}
        <div
          className="scroll-hint pointer-events-none absolute inset-x-0 bottom-10 z-30 flex flex-col items-center gap-3 transition-opacity duration-700 ease-out"
          style={{ opacity: hintOpacity }}
        >
          <span className="text-[10px] tracking-[0.35em] text-muted-foreground uppercase">
            Scroll down
          </span>
          <div className="flex h-9 w-[22px] items-start justify-center rounded-full border border-border pt-2">
            <span className="scroll-dot h-1.5 w-1.5 rounded-full bg-foreground/70" />
          </div>
        </div>

        {/* Content reveals on scroll */}
        <div
          className="pointer-events-none relative z-30 mx-auto w-full max-w-6xl px-6 pt-24 pb-8 text-center"
          style={{
            opacity: textOpacity,
            transform: `translateY(${(1 - textOpacity) * 40}px)`,
            filter: `blur(${(1 - textOpacity) * 10}px)`,
          }}
        >
          <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] tracking-[0.3em] text-muted-foreground uppercase glass">
            Instant digital delivery
          </span>
          <h1 className="mx-auto mt-4 max-w-3xl text-3xl leading-[1.05] font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            <span className="text-gradient">2G SHOP</span>
            <br />
            Premium subscriptions online
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
            Streaming, music, gaming, AI and VPN subscriptions at the best prices — delivered in
            minutes, with warranty and 24/7 support.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a
              href="#plans"
              className="btn-neon glow-strong px-5 py-2.5 text-sm hover:-translate-y-0.5 hover:scale-[1.04]"
              style={{ pointerEvents: textOpacity > 0.6 ? "auto" : "none" }}
            >
              Shop now
            </a>
            <a
              href="#why"
              className="btn-ghost-neon px-5 py-2.5 text-sm hover:-translate-y-0.5"
              style={{ pointerEvents: textOpacity > 0.6 ? "auto" : "none" }}
            >
              Why us <ArrowDown size={14} weight="light" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
