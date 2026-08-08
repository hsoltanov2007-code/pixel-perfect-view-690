import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Lightning, ShieldCheck, Headset } from "@phosphor-icons/react";

const benefits = [
  {
    icon: Lightning,
    title: "Instant delivery",
    description: "Your subscription arrives within minutes after payment — no waiting, no hassle.",
  },
  {
    icon: ShieldCheck,
    title: "Warranty included",
    description: "Every product comes with a replacement guarantee for complete peace of mind.",
  },
  {
    icon: Headset,
    title: "24/7 support",
    description: "Our team is always online to help with setup, issues, or any questions.",
  },
];

export default function Why() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".why-pill",
        { opacity: 0, y: 40, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: root.current, start: "top 82%" },
        },
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="why"
      ref={root}
      className="pointer-events-auto relative z-10 bg-background py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] tracking-[0.25em] text-foreground/80 uppercase glass">
            Why 2G SHOP
          </span>
          <h2 className="mx-auto mt-4 max-w-xl text-2xl font-semibold tracking-tight sm:text-3xl">
            Trusted by thousands for premium digital goods
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="why-pill group relative overflow-hidden rounded-2xl border border-border/60 bg-card/40 p-6 backdrop-blur-md transition-colors hover:border-border"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative flex flex-col items-center text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-foreground/5 ring-1 ring-border">
                  <b.icon size={24} weight="light" className="text-accent" />
                </div>
                <h3 className="text-base font-semibold tracking-tight">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {b.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
