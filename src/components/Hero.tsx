import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowDown } from "@phosphor-icons/react";

const clamp = (v: number) => Math.min(1, Math.max(0, v));

export default function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Scroll-driven styles are written imperatively via rAF so scrolling never
  // triggers React re-renders (that was the source of the jank on reload).
  useEffect(() => {
    let frame = 0;
    const apply = () => {
      frame = 0;
      const vh = window.innerHeight;
      const progress = window.scrollY / vh;
      const fadeIn = clamp((progress - 0.1) / 0.45);
      const fadeOut = 1 - clamp((progress - 0.95) / 0.5);
      const textOpacity = Math.min(fadeIn, fadeOut);
      const hintOpacity = 1 - clamp(progress * 3);

      if (hintRef.current) hintRef.current.style.opacity = String(hintOpacity);
      if (scrimRef.current) scrimRef.current.style.opacity = String(textOpacity);
      if (contentRef.current) {
        const s = contentRef.current.style;
        s.opacity = String(textOpacity);
        s.transform = `translate3d(0, ${(1 - textOpacity) * 16}px, 0)`;
        s.filter = textOpacity > 0.985 ? "none" : `blur(${(1 - textOpacity) * 3}px)`;
      }
      if (ctaRef.current) {
        ctaRef.current.style.pointerEvents = textOpacity > 0.6 ? "auto" : "none";
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const ctx = gsap.context(() => {
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





  return (
    <section
      id="home"
      ref={root}
      className="pointer-events-none relative w-full"
      style={{ height: "260vh" }}
    >
      <div className="sticky top-0 flex h-screen min-h-[640px] w-full items-center overflow-hidden">
        {/* Scroll hint — visible only at the very top */}
        <div
          ref={hintRef}
          className="scroll-hint pointer-events-none absolute inset-x-0 bottom-10 z-30 flex flex-col items-center gap-3 will-change-[opacity]"
          style={{ opacity: 1 }}
        >
          <span className="text-[10px] tracking-[0.35em] text-muted-foreground uppercase">
            Scroll down
          </span>
          <div className="flex h-9 w-[22px] items-start justify-center rounded-full border border-border pt-2">
            <span className="scroll-dot h-1.5 w-1.5 rounded-full bg-foreground/70" />
          </div>
        </div>


        {/* Readability scrim — darker behind the copy, transparent around the robot */}
        <div
          ref={scrimRef}
          className="pointer-events-none absolute inset-0 z-20 will-change-[opacity]"
          style={{
            opacity: 0,
            background:
              "radial-gradient(ellipse 42% 30% at 50% 52%, color-mix(in oklab, var(--background) 88%, transparent) 0%, color-mix(in oklab, var(--background) 60%, transparent) 50%, transparent 100%)",
          }}
        />

        {/* Content reveals on scroll */}
        <div
          ref={contentRef}
          className="pointer-events-none relative z-30 mx-auto w-full max-w-3xl px-6 pt-20 pb-8 text-center will-change-[opacity,transform]"
          style={{ opacity: 0, transform: "translate3d(0,16px,0)" }}
        >
          <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[9px] tracking-[0.3em] text-foreground/90 uppercase glass">
            Instant digital delivery
          </span>
          <h1 className="mx-auto mt-4 max-w-2xl text-3xl leading-[1.05] font-semibold tracking-tight [text-shadow:0_2px_30px_color-mix(in_oklab,var(--background)_95%,transparent)] sm:text-4xl lg:text-5xl">
            <span className="text-gradient">2G SHOP</span>
            <br />
            Premium subscriptions online
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-foreground/85 [text-shadow:0_1px_20px_color-mix(in_oklab,var(--background)_95%,transparent)] sm:text-base">
            Best-price streaming, music, gaming, AI and VPN subscriptions — delivered in minutes with warranty and 24/7 support.
          </p>
          <div ref={ctaRef} className="mt-6 flex flex-wrap justify-center gap-3" style={{ pointerEvents: "none" }}>
            <a
              href="#plans"
              className="btn-neon glow-strong px-5 py-2.5 text-sm hover:-translate-y-0.5 hover:scale-[1.04]"
            >
              Shop now
            </a>
            <a
              href="#why"
              className="btn-ghost-neon px-5 py-2.5 text-sm hover:-translate-y-0.5"
            >
              Why us <ArrowDown size={14} weight="light" />
            </a>
          </div>
        </div>


      </div>
    </section>
  );
}
