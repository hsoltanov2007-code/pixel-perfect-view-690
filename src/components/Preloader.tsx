import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import introAsset from "@/assets/intro.mp4.asset.json";

export default function Preloader({ onDone }: { onDone: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const doneRef = useRef(false);
  const [showLogo, setShowLogo] = useState(false);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    onDone();
  };

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.playbackRate = 1.3;
    v.play().catch(() => setShowLogo(true));
    const fallback = setTimeout(() => setShowLogo(true), 12000);
    return () => clearTimeout(fallback);
  }, []);

  useEffect(() => {
    if (!showLogo) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: finish });
      tl.fromTo(
        ".pre-logo",
        {
          opacity: 0,
          scale: 0.6,
          rotateX: -75,
          rotateY: 25,
          z: -400,
          filter: "blur(24px)",
        },
        {
          opacity: 1,
          scale: 1,
          rotateX: 0,
          rotateY: 0,
          z: 0,
          filter: "blur(0px)",
          duration: 1.8,
          ease: "power4.out",
        },
      )
        .to(".pre-logo", { rotateY: 12, duration: 1.2, ease: "sine.inOut" }, "-=0.4")
        .to(
          ".pre-logo",
          {
            opacity: 0,
            scale: 1.6,
            z: 600,
            filter: "blur(18px)",
            duration: 1,
            ease: "power2.in",
          },
          "+=0.2",
        )
        .to(".preloader", { opacity: 0, duration: 0.7, ease: "power2.inOut" }, "-=0.5");
    }, root);
    const fallback = setTimeout(finish, 9000);
    return () => {
      clearTimeout(fallback);
      ctx.revert();
    };
  }, [showLogo]);

  return (
    <div ref={root}>
      <div className="preloader fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-background">
        <video
          ref={videoRef}
          src={introAsset.url}
          muted
          playsInline
          autoPlay
          loop
          preload="auto"
          onEnded={() => setShowLogo(true)}
          onError={() => setShowLogo(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-background/40" />
        {showLogo && (
          <div
            className="relative z-10 flex items-center justify-center"
            style={{ perspective: "900px" }}
          >
            <span
              className="pre-logo text-gradient block text-[26vw] leading-none font-semibold tracking-tight sm:text-[18vw]"
              style={{ transformStyle: "preserve-3d", textShadow: "0 0 60px rgba(255,255,255,0.25)" }}
            >
              2G
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
