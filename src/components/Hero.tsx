import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowDown } from "@phosphor-icons/react";

export default function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

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

  const textOpacity = Math.min(1, progress);
  const hintOpacity = 1 - Math.min(1, progress * 2.2);

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
