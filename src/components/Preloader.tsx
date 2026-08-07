import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import introAsset from "@/assets/intro.mp4.asset.json";

export default function Preloader({ onDone }: { onDone: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const logoRoot = useRef<HTMLDivElement>(null);
  const doneRef = useRef(false);
  const [stage, setStage] = useState<"video" | "logo">("video");

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    onDone();
  };

  const toLogo = () => setStage((s) => (s === "video" ? "logo" : s));

  useEffect(() => {
    if (stage !== "video") return;
    const v = videoRef.current;
    if (!v) return;
    v.playbackRate = 1.3;
    v.play().catch(() => toLogo());
    const fallback = setTimeout(toLogo, 12000);
    return () => clearTimeout(fallback);
  }, [stage]);

  useEffect(() => {
    if (stage !== "logo") return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: finish });
      tl.fromTo(
        ".pre-logo",
        { opacity: 0, scale: 1.25, letterSpacing: "0.5em", filter: "blur(20px)" },
        {
          opacity: 1,
          scale: 1,
          letterSpacing: "0.02em",
          filter: "blur(0px)",
          duration: 1.5,
          ease: "power3.out",
        },
      )
        .fromTo(
          ".pre-rule",
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 1.1, ease: "power2.inOut" },
          "-=1",
        )
        .fromTo(
          ".pre-sub",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
          "-=0.8",
        )
        .to({}, { duration: 0.6 })
        .to([".pre-sub", ".pre-rule"], { opacity: 0, duration: 0.5, ease: "power2.in" })
        .to(
          ".pre-logo",
          {
            opacity: 0,
            scale: 1.15,
            letterSpacing: "0.35em",
            filter: "blur(14px)",
            duration: 1,
            ease: "power2.inOut",
          },
          "-=0.35",
        )
        .to(".preloader", { opacity: 0, duration: 0.7, ease: "power2.inOut" }, "-=0.4");
    }, logoRoot);
    const fallback = setTimeout(finish, 8000);
    return () => {
      clearTimeout(fallback);
      ctx.revert();
    };
  }, [stage]);

  return (
    <div ref={logoRoot}>
      <div className="preloader hero-bg fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-background">
        {stage === "video" ? (
          <video
            ref={videoRef}
            src={introAsset.url}
            muted
            playsInline
            autoPlay
            preload="auto"
            onEnded={toLogo}
            onError={toLogo}
            className="h-full w-full object-cover"
          />
        ) : (
          <>
            <div className="pointer-events-none absolute top-1/2 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/[0.06] blur-[130px]" />
            <h1 className="pre-logo text-gradient relative text-5xl font-semibold tracking-tight sm:text-7xl">
              2G SHOP
            </h1>
            <div className="pre-rule mt-8 h-px w-40 origin-center bg-[var(--gradient-line)] sm:w-64" />
            <span className="pre-sub mt-5 text-[10px] tracking-[0.45em] text-muted-foreground uppercase">
              Premium subscriptions
            </span>
          </>
        )}
      </div>
    </div>
  );
}
