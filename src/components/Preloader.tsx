import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function Preloader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      onDone();
    };
    const counter = { v: 0 };
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.fromTo(
        ".pre-logo",
        { opacity: 0, y: 30, filter: "blur(14px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9, ease: "power3.out" },
      )
        .to(
          counter,
          {
            v: 100,
            duration: 1.4,
            ease: "power2.out",
            onUpdate: () => setPct(Math.round(counter.v)),
          },
          "-=0.5",
        )
        .to(".progress-bar", { width: "100%", duration: 1.4, ease: "power2.out" }, "<")
        .to(".pre-meta", { opacity: 0, duration: 0.4 })
        .to(".preloader", {
          opacity: 0,
          scale: 0.92,
          filter: "blur(8px)",
          duration: 0.9,
          ease: "power2.inOut",
          onComplete: finish,
        });
    }, root);
    const fallback = setTimeout(finish, 4200);
    return () => {
      clearTimeout(fallback);
      ctx.revert();
    };
  }, [onDone]);

  return (
    <div ref={root}>
      <div className="preloader hero-bg fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background">
        <h1 className="pre-logo text-gradient text-5xl font-semibold tracking-tight sm:text-7xl">
          2G SHOP
        </h1>
        <div className="pre-meta mt-10 w-56 sm:w-72">
          <div className="h-[3px] w-full overflow-hidden rounded-full bg-secondary">
            <div className="progress-bar glow-strong h-full w-0 rounded-full bg-primary" />
          </div>
          <div className="mt-3 flex justify-between text-[11px] tracking-[0.25em] text-muted-foreground uppercase">
            <span>Loading</span>
            <span>{pct}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
