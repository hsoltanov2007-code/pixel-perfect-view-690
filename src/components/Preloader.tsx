import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const LETTERS = ["2", "G", " ", "S", "H", "O", "P"];

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
      gsap.set(".pre-letter", { yPercent: 120, opacity: 0 });
      gsap.set(".pre-ring", { scale: 0.6, opacity: 0 });
      gsap.set(".pre-shard", { scaleX: 0, transformOrigin: "left center" });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to(".pre-ring", {
        scale: 1,
        opacity: 1,
        duration: 1.2,
        stagger: 0.12,
        ease: "power2.out",
      })
        .to(
          ".pre-letter",
          { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.07 },
          0.15,
        )
        .to(".pre-shard", { scaleX: 1, duration: 0.9, stagger: 0.08 }, 0.4)
        .to(
          counter,
          {
            v: 100,
            duration: 1.7,
            ease: "power2.inOut",
            onUpdate: () => setPct(Math.round(counter.v)),
          },
          0.3,
        )
        .to(".progress-bar", { width: "100%", duration: 1.7, ease: "power2.inOut" }, 0.3)
        // exit
        .to(".pre-meta", { opacity: 0, y: 14, duration: 0.4 }, "+=0.1")
        .to(
          ".pre-letter",
          { yPercent: -120, opacity: 0, duration: 0.6, stagger: 0.04, ease: "power3.in" },
          "-=0.2",
        )
        .to(".pre-ring", { scale: 1.5, opacity: 0, duration: 0.8, ease: "power2.in" }, "<")
        .to(
          ".pre-curtain",
          {
            scaleY: 0,
            transformOrigin: "top center",
            duration: 0.9,
            stagger: 0.08,
            ease: "power4.inOut",
          },
          "-=0.35",
        )
        .to(
          ".preloader",
          { opacity: 0, duration: 0.3, onComplete: finish },
          "-=0.25",
        );

      gsap.to(".pre-ring-spin", {
        rotate: 360,
        duration: 9,
        repeat: -1,
        ease: "none",
        transformOrigin: "50% 50%",
      });
    }, root);

    const fallback = setTimeout(finish, 6500);
    return () => {
      clearTimeout(fallback);
      ctx.revert();
    };
  }, [onDone]);

  return (
    <div ref={root}>
      <div className="preloader hero-bg fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-background">
        {/* exit curtains */}
        <div className="pointer-events-none absolute inset-0 z-[2] flex">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="pre-curtain h-full flex-1 bg-background" />
          ))}
        </div>

        {/* rotating rings */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="pre-ring pre-ring-spin h-[26rem] w-[26rem] rounded-full border border-border" />
          <div className="pre-ring absolute h-[18rem] w-[18rem] rounded-full border border-border/70" />
          <div className="pre-ring absolute h-[34rem] w-[34rem] rounded-full border border-border/40 blur-[1px]" />
          <div className="pre-ring absolute h-56 w-56 rounded-full bg-foreground/10 blur-[90px]" />
        </div>

        {/* horizontal shards */}
        <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 space-y-6 px-10">
          <div className="pre-shard h-px w-full bg-[var(--gradient-line)] opacity-40" />
          <div className="pre-shard h-px w-2/3 bg-[var(--gradient-line)] opacity-25" />
        </div>

        <h1 className="relative z-[3] flex overflow-hidden text-5xl font-semibold tracking-tight sm:text-7xl">
          {LETTERS.map((ch, i) => (
            <span key={i} className="overflow-hidden">
              <span className="pre-letter text-gradient inline-block whitespace-pre">{ch}</span>
            </span>
          ))}
        </h1>

        <div className="pre-meta relative z-[3] mt-10 w-56 sm:w-72">
          <div className="h-[3px] w-full overflow-hidden rounded-full bg-secondary">
            <div className="progress-bar glow-strong h-full w-0 rounded-full bg-primary" />
          </div>
          <div className="mt-3 flex justify-between text-[11px] tracking-[0.25em] text-muted-foreground uppercase">
            <span>Loading experience</span>
            <span>{pct}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
