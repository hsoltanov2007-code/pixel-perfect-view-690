import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Preloader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      onDone();
    };
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.fromTo(
        ".pre-logo",
        { opacity: 0, y: 24, letterSpacing: "0.5em", filter: "blur(16px)" },
        {
          opacity: 1,
          y: 0,
          letterSpacing: "0.02em",
          filter: "blur(0px)",
          duration: 1.5,
          ease: "power3.out",
        },
      )
        .fromTo(
          ".pre-sub",
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" },
          "-=0.7",
        )
        .fromTo(
          ".pre-rule",
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 1.2, ease: "power2.inOut" },
          "-=1.1",
        )
        .to({}, { duration: 0.5 })
        .to([".pre-sub", ".pre-rule"], { opacity: 0, duration: 0.5, ease: "power2.in" })
        .to(
          ".pre-logo",
          { opacity: 0, letterSpacing: "0.35em", filter: "blur(12px)", duration: 0.9, ease: "power2.inOut" },
          "-=0.35",
        )
        .to(
          ".preloader",
          {
            opacity: 0,
            duration: 0.8,
            ease: "power2.inOut",
            onComplete: finish,
          },
          "-=0.4",
        );
    }, root);
    const fallback = setTimeout(finish, 6000);
    return () => {
      clearTimeout(fallback);
      ctx.revert();
    };
  }, [onDone]);

  return (
    <div ref={root}>
      <div className="preloader hero-bg fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/[0.06] blur-[130px]" />
        <h1 className="pre-logo relative text-gradient text-5xl font-semibold tracking-tight sm:text-7xl">
          2G SHOP
        </h1>
        <div className="pre-rule mt-8 h-px w-40 origin-center bg-[var(--gradient-line)] sm:w-64" />
        <span className="pre-sub mt-5 text-[10px] tracking-[0.45em] text-muted-foreground uppercase">
          Premium subscriptions
        </span>
      </div>
    </div>
  );
}
