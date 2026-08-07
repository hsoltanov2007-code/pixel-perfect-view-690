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
    const fallback = setTimeout(finish, 14000);
    return () => clearTimeout(fallback);
  }, []);

  // Reveal the logo for the last ~3 seconds of playback
  const onTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || !v.duration || showLogo) return;
    const remaining = (v.duration - v.currentTime) / (v.playbackRate || 1);
    if (remaining <= 3) setShowLogo(true);
  };

  useEffect(() => {
    if (!showLogo) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
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
          duration: 1.6,
          ease: "power4.out",
        },
      );
      gsap.to(".pre-logo", { rotateY: 10, duration: 1.6, ease: "sine.inOut", delay: 1.4 });
    }, root);
    return () => ctx.revert();
  }, [showLogo]);

  const onEnded = () => {
    const ctx = gsap.context(() => {
      gsap
        .timeline({ onComplete: finish })
        .to(".pre-logo", {
          opacity: 0,
          scale: 1.5,
          z: 500,
          filter: "blur(16px)",
          duration: 0.8,
          ease: "power2.in",
        })
        .to(".preloader", { opacity: 0, duration: 0.7, ease: "power2.inOut" }, "-=0.5");
    }, root);
    void ctx;
  };

  return (
    <div ref={root}>
      <div className="preloader fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-background">
        <video
          ref={videoRef}
          src={introAsset.url}
          muted
          playsInline
          autoPlay
          preload="auto"
          onTimeUpdate={onTimeUpdate}
          onEnded={onEnded}
          onError={finish}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-background/40" />
        {showLogo && (
          <div className="relative z-10 flex items-center justify-center">
            <span
              className="pre-logo block text-[24vw] leading-none font-semibold tracking-tight sm:text-[16vw]"
              style={{
                color: "oklch(0.98 0 0)",
                textShadow:
                  "0 1px 0 oklch(0.72 0 0), 0 2px 0 oklch(0.62 0 0), 0 3px 0 oklch(0.52 0 0), 0 4px 0 oklch(0.42 0 0), 0 5px 0 oklch(0.32 0 0), 0 6px 0 oklch(0.24 0 0), 0 7px 0 oklch(0.18 0 0), 0 8px 0 oklch(0.13 0 0), 0 18px 30px rgba(0,0,0,0.55), 0 0 70px rgba(255,255,255,0.18)",
              }}
            >
              2G
            </span>
          </div>
        )}


      </div>
    </div>
  );
}
