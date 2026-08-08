import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Lightning, ShieldCheck, Headset } from "@phosphor-icons/react";

const SPLINE_URL = "https://my.spline.design/voiceinteractionanimation-1gYdkk8IoM6Ts9W1i4oTC43k/";

const benefits = [
  { icon: Lightning, label: "Instant delivery" },
  { icon: ShieldCheck, label: "Warranty" },
  { icon: Headset, label: "24/7 support" },
];

export default function Why() {
  const root = useRef<HTMLElement>(null);
  const orbWrap = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".why-fade",
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: root.current, start: "top 78%" },
        },
      );
      gsap.fromTo(
        ".why-pill",
        { opacity: 0, y: 24, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: root.current, start: "top 70%" },
        },
      );
    }, root);
    return () => ctx.revert();
  }, []);


  return (
    <section
      id="why"
      ref={root}
      className="pointer-events-auto relative z-10 flex min-h-screen items-center justify-center overflow-hidden bg-background py-24 sm:py-32"
    >
      <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center px-6 text-center">
        {/* Orb — scaled to push the Spline watermark outside the mask */}
        <div className="why-fade relative mb-8 h-[220px] w-[220px] sm:h-[300px] sm:w-[300px]">
          <div className="absolute -inset-[15%] overflow-hidden rounded-full">
            {mounted && (
              <iframe
                src={SPLINE_URL}
                title="Why 2G SHOP"
                className="pointer-events-none absolute -inset-[15%] h-[130%] w-[130%] border-0"
                style={{ border: 0 }}
              />
            )}
          </div>
        </div>

        <span className="why-fade inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] tracking-[0.35em] text-muted-foreground uppercase">
          WHY 2G SHOP
        </span>

        <h2 className="why-fade mt-5 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
          Digital goods, <span className="text-muted-foreground">zero waiting</span>
        </h2>

        <p className="why-fade mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
          Premium subscriptions and keys, delivered instantly with warranty and real support.
        </p>

        <div className="why-fade mt-8 flex flex-wrap justify-center gap-3">
          {benefits.map((b) => (
            <div
              key={b.label}
              className="why-pill inline-flex items-center gap-2 rounded-full border border-border/60 bg-white/[0.03] px-4 py-2 text-sm text-foreground/90 backdrop-blur-sm transition-colors hover:border-border hover:bg-white/[0.06]"
            >
              <b.icon size={18} weight="light" className="text-foreground/70" />
              <span>{b.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
