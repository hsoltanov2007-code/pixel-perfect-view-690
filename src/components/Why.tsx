import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Lightning,
  ShieldCheck,
  CreditCard,
  Headset,
  Tag,
  ArrowsClockwise,
} from "@phosphor-icons/react";

const features = [
  { icon: Lightning, label: "Instant delivery" },
  { icon: ShieldCheck, label: "Warranty" },
  { icon: CreditCard, label: "Safe payment" },
  { icon: Headset, label: "24/7 support" },
  { icon: Tag, label: "Best prices" },
  { icon: ArrowsClockwise, label: "Easy renewal" },
];

export default function Why() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".why-visual",
        { opacity: 0, x: -80, filter: "blur(12px)" },
        {
          opacity: 1,
          x: 0,
          filter: "blur(0px)",
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 75%" },
        },
      );
      gsap.fromTo(
        ".why-copy > *",
        { opacity: 0, y: 40, filter: "blur(10px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 75%" },
        },
      );
      gsap.fromTo(
        ".why-chip",
        { opacity: 0, y: 24, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: "back.out(1.6)",
          scrollTrigger: { trigger: ".why-grid", start: "top 85%" },
        },
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="why" ref={root} className="relative py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 md:grid-cols-[320px_1fr]">
        <div className="why-visual group relative mx-auto">
          <div className="absolute -inset-4 rounded-full bg-primary/25 blur-3xl transition-all duration-500 group-hover:bg-primary/40" />
          <div className="relative grid h-60 w-60 place-items-center rounded-full glass ring-2 ring-primary/40 transition-transform duration-500 group-hover:-translate-y-2 group-hover:rotate-3 sm:h-72 sm:w-72 glow-ring">
            <span className="text-5xl font-semibold tracking-tight text-gradient sm:text-6xl">2G</span>
          </div>
        </div>

        <div className="why-copy">
          <span className="text-xs tracking-[0.3em] text-accent uppercase">Why 2G SHOP</span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Digital goods, <span className="text-gradient">zero waiting</span>
          </h2>
          <p className="mt-5 max-w-xl leading-relaxed text-muted-foreground">
            2G SHOP sells premium subscriptions, licence keys and top-ups online. Every order is
            processed automatically, backed by a warranty and real human support whenever you need
            it.
          </p>
          <div className="why-grid mt-9 grid grid-cols-3 gap-3 sm:grid-cols-6">
            {features.map((s) => (
              <div
                key={s.label}
                className="why-chip flex flex-col items-center gap-2 rounded-2xl px-2 py-4 text-center glass transition-all duration-300 hover:-translate-y-1 hover:glow-ring"
              >
                <s.icon size={26} weight="light" className="text-accent" />
                <span className="text-[11px] text-muted-foreground">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
