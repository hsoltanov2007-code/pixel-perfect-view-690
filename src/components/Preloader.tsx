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
          <div
            className="relative z-10 flex items-center justify-center"
            style={{ perspective: "1100px" }}
          >
            <div
              className="pre-logo relative"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* extruded depth layers */}
              {Array.from({ length: 14 }).map((_, i) => (
                <span
                  key={i}
                  aria-hidden
                  className="absolute inset-0 block text-[26vw] leading-none font-semibold tracking-tight sm:text-[18vw]"
                  style={{
                    transform: `translate3d(${-(i + 1) * 0.09}em, ${(i + 1) * 0.045}em, ${-(i + 1) * 6}px)`,
                    color: `oklch(${0.42 - i * 0.026} 0 0)`,
                    transformStyle: "preserve-3d",
                  }}
                >
                  2G
                </span>
              ))}
              {/* front face */}
              <span
                className="relative block text-[26vw] leading-none font-semibold tracking-tight sm:text-[18vw]"
                style={{
                  backgroundImage:
                    "linear-gradient(160deg, oklch(1 0 0) 0%, oklch(0.86 0 0) 32%, oklch(0.5 0 0) 52%, oklch(0.95 0 0) 70%, oklch(0.7 0 0) 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  filter: "drop-shadow(0 0 60px rgba(255,255,255,0.35))",
                  transformStyle: "preserve-3d",
                }}
              >
                2G
              </span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
