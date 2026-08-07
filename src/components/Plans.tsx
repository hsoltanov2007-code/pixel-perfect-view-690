import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, Lightning } from "@phosphor-icons/react";
import { toast } from "sonner";
import p1 from "@/assets/project-1.jpg";
import p2 from "@/assets/project-2.jpg";
import p3 from "@/assets/project-3.jpg";
import p4 from "@/assets/project-4.jpg";
import p5 from "@/assets/project-5.jpg";
import p6 from "@/assets/project-6.jpg";

const plans = [
  {
    img: p1,
    title: "Streaming Pro",
    price: "$4.99",
    period: "/ month",
    desc: "4K streaming subscription, instant delivery to your inbox.",
    perks: ["4K + HDR", "Works worldwide", "Instant activation"],
  },
  {
    img: p2,
    title: "Music Unlimited",
    price: "$3.49",
    period: "/ month",
    desc: "Ad-free music on every device with offline downloads.",
    perks: ["Ad-free", "Offline mode", "Up to 6 devices"],
  },
  {
    img: p3,
    title: "AI Assistant Plus",
    price: "$9.99",
    period: "/ month",
    desc: "Premium AI access with priority speed and higher limits.",
    perks: ["Priority speed", "Higher limits", "Early features"],
  },
  {
    img: p4,
    title: "Game Pass",
    price: "$7.99",
    period: "/ month",
    desc: "Hundreds of games, cloud saves and day-one releases.",
    perks: ["300+ games", "Cloud saves", "Day-one titles"],
  },
  {
    img: p5,
    title: "VPN Shield",
    price: "$2.99",
    period: "/ month",
    desc: "Fast, private and secure browsing from 80+ locations.",
    perks: ["80+ locations", "No logs", "10 devices"],
  },
  {
    img: p6,
    title: "Creator Suite",
    price: "$12.99",
    period: "/ month",
    desc: "Design, edit and publish with a full pro toolkit.",
    perks: ["Pro editing", "Cloud storage", "Team sharing"],
  },
];

export default function Plans() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".plan-head > *",
        { opacity: 0, y: 40, filter: "blur(10px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 80%" },
        },
      );
      gsap.fromTo(
        ".plan-card",
        { opacity: 0, y: 60, scale: 0.94 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".plan-track", start: "top 85%" },
        },
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="plans" ref={root} className="relative py-28">
      <div className="pointer-events-none absolute top-1/3 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-neon-violet/15 blur-[130px]" />
      <div className="mx-auto max-w-6xl px-6">
        <div className="plan-head max-w-xl">
          <span className="text-xs tracking-[0.3em] text-accent uppercase">Store</span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Subscriptions that <span className="text-gradient">deliver instantly</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Official digital subscriptions and licence keys — activated in minutes, 24/7 support.
          </p>
        </div>
      </div>

      <div className="plan-track mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-6 [scrollbar-width:none] lg:mx-auto lg:max-w-6xl">
        {plans.map((p) => (
          <article
            key={p.title}
            className="plan-card group relative flex w-[82vw] shrink-0 snap-center flex-col overflow-hidden rounded-3xl glass transition-all duration-500 hover:-translate-y-2 hover:glow-ring sm:w-[380px]"
          >
            <img
              src={p.img}
              alt={`${p.title} subscription`}
              width={1024}
              height={768}
              loading="lazy"
              className="h-48 w-full object-cover opacity-85 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
            />
            <div className="flex flex-1 flex-col p-6">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-lg font-medium">{p.title}</h3>
                <span className="text-lg font-semibold text-gradient">
                  {p.price}
                  <span className="text-xs text-muted-foreground">{p.period}</span>
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
              <ul className="mt-4 space-y-2">
                {p.perks.map((t) => (
                  <li key={t} className="flex items-center gap-2 text-[13px] text-muted-foreground">
                    <Check size={15} weight="light" className="text-accent" />
                    {t}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => toast.success(`${p.title} added — we'll contact you to finish checkout.`)}
                className="btn-neon mt-6 w-full !py-2.5 !text-sm hover:-translate-y-0.5"
              >
                Buy now <Lightning size={16} weight="light" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
