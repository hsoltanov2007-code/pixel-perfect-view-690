import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Lightning, ShieldCheck, Headset } from "@phosphor-icons/react";

const features = [
  { icon: Lightning, label: "Instant delivery" },
  { icon: ShieldCheck, label: "Warranty" },
  { icon: Headset, label: "24/7 support" },
];

export default function Why() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".why-visual",
        { opacity: 0, scale: 0.85, filter: "blur(14px)" },
        {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 78%" },
        },
      );
      gsap.fromTo(
        ".why-copy > *",
        { opacity: 0, y: 30, filter: "blur(8px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 72%" },
        },
      );
      gsap.fromTo(
        ".why-chip",
        { opacity: 0, y: 20, scale: 0.92 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.55,
          stagger: 0.06,
          ease: "power3.out",
          scrollTrigger: { trigger: ".why-grid", start: "top 88%" },
        },
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="why" ref={root} className="relative py-24">
      <div className="mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
        <div className="why-visual relative">
          <div className="absolute -inset-8 rounded-full bg-primary/15 blur-[70px]" />
          <div className="relative grid h-44 w-44 place-items-center rounded-full border border-foreground/10 bg-foreground/[0.04] backdrop-blur-md shadow-[0_0_60px_-20px_hsl(0_0%_100%_/0.12)]">
            <span className="text-4xl font-semibold tracking-tight text-3d">2G</span>
          </div>
        </div>

        <div className="why-copy mt-10">
          <span className="text-[11px] tracking-[0.25em] text-accent uppercase">Why 2G SHOP</span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Digital goods, <span className="text-gradient">zero waiting</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            Premium subscriptions and keys, delivered instantly with warranty and real support.
          </p>
        </div>

        <div className="why-grid mt-10 flex flex-wrap justify-center gap-3">
          {features.map((s) => (
            <div
              key={s.label}
              className="why-chip flex items-center gap-2.5 rounded-full border border-border/60 bg-card/60 px-5 py-2.5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/20"
            >
              <s.icon size={18} weight="light" className="text-accent" />
              <span className="text-xs font-medium text-foreground/80">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
