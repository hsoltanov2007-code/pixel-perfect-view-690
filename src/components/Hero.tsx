import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowDown } from "@phosphor-icons/react";

export default function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const vh = window.innerHeight;
      setProgress(window.scrollY / vh);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".scroll-hint",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, delay: 1.4, ease: "power3.out" },
      );
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

  const clamp = (v: number) => Math.min(1, Math.max(0, v));
  // fade in between 0.12vh and 0.62vh, hold, then fade back out by 1.55vh
  const fadeIn = clamp((progress - 0.12) / 0.5);
  const fadeOut = 1 - clamp((progress - 1.05) / 0.5);
  const textOpacity = Math.min(fadeIn, fadeOut);
  const hintOpacity = 1 - clamp(progress * 3);



  return (
    <section
      id="home"
      ref={root}
      className="relative w-full"
      style={{ height: "260vh" }}
    >
      <div className="sticky top-0 flex h-screen min-h-[640px] w-full items-center overflow-hidden">
        {/* Scroll hint — visible only at the very top */}
        <div
          className="scroll-hint pointer-events-none absolute inset-x-0 bottom-10 z-30 flex flex-col items-center gap-3"
          style={{ opacity: hintOpacity }}
        >
          <span className="text-[10px] tracking-[0.35em] text-muted-foreground uppercase">
            Scroll down
          </span>
          <div className="flex h-9 w-[22px] items-start justify-center rounded-full border border-border pt-2">
            <span className="scroll-dot h-1.5 w-1.5 rounded-full bg-foreground/70" />
          </div>
        </div>


        {/* Readability scrim behind the copy */}
        <div
          className="pointer-events-none absolute inset-0 z-20"
          style={{
            opacity: textOpacity,
            background:
              "radial-gradient(ellipse 46% 34% at 50% 50%, color-mix(in oklab, var(--background) 82%, transparent) 0%, color-mix(in oklab, var(--background) 55%, transparent) 55%, transparent 100%)",
          }}
        />

        {/* Content reveals on scroll */}
        <div
          className="pointer-events-none relative z-30 mx-auto w-full max-w-6xl px-6 pt-24 pb-8 text-center"
          style={{
            opacity: textOpacity,
            transform: `translateY(${(1 - textOpacity) * 40}px)`,
            filter: `blur(${(1 - textOpacity) * 10}px)`,
          }}
        >
          <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[9px] tracking-[0.3em] text-foreground/80 uppercase glass">
            Instant digital delivery
          </span>
          <h1 className="mx-auto mt-3 max-w-2xl text-2xl leading-[1.08] font-semibold tracking-tight [text-shadow:0_2px_24px_color-mix(in_oklab,var(--background)_90%,transparent)] sm:text-3xl lg:text-4xl">
            <span className="text-gradient">2G SHOP</span>
            <br />
            Premium subscriptions online
          </h1>
          <p className="mx-auto mt-3 max-w-md text-xs leading-relaxed text-foreground/70 [text-shadow:0_1px_16px_color-mix(in_oklab,var(--background)_90%,transparent)] sm:text-sm">
            Best-price streaming, music, gaming, AI and VPN subscriptions — delivered in minutes with warranty and 24/7 support.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <a
              href="#plans"
              className="btn-neon glow-strong px-4 py-2 text-xs hover:-translate-y-0.5 hover:scale-[1.04]"
              style={{ pointerEvents: textOpacity > 0.6 ? "auto" : "none" }}
            >
              Shop now
            </a>
            <a
              href="#why"
              className="btn-ghost-neon px-4 py-2 text-xs hover:-translate-y-0.5"
              style={{ pointerEvents: textOpacity > 0.6 ? "auto" : "none" }}
            >
              Why us <ArrowDown size={13} weight="light" />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
