import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, Lightning, ArrowRight } from "@phosphor-icons/react";
import { toast } from "sonner";
import p1 from "@/assets/project-1.jpg";
import p2 from "@/assets/project-2.jpg";
import p3 from "@/assets/project-3.jpg";

const items = [
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
];

export default function Products() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".product-card");
      const grid = root.current?.querySelector(".product-grid") as HTMLElement | null;

      gsap.set(cards, { transformOrigin: "50% 50%" });
      gsap.fromTo(
        cards,
        {
          opacity: 0,
          scale: 0.12,
          filter: "blur(16px)",
          // all cards start stacked on the exact same point (grid center)
          x: (i: number, el: HTMLElement) => {
            if (!grid) return 0;
            const g = grid.getBoundingClientRect();
            const r = el.getBoundingClientRect();
            return g.left + g.width / 2 - (r.left + r.width / 2);
          },
          y: (i: number, el: HTMLElement) => {
            if (!grid) return 0;
            const g = grid.getBoundingClientRect();
            const r = el.getBoundingClientRect();
            return g.top + g.height / 2 - (r.top + r.height / 2);
          },
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.42,
          stagger: 0.04,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 28%" },
        },
      );

      gsap.fromTo(
        ".product-cta",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          delay: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 60%" },
        },
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="products"
      ref={root}
      className="pointer-events-none relative z-10 -mt-[52rem] pt-0 pb-16"
    >
      <div className="pointer-events-none absolute top-1/4 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-foreground/10 blur-[130px]" />
      <div className="product-grid relative mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-3">
        {items.map((p) => (
          <article
            key={p.title}
            className="product-card pointer-events-auto group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-[0_30px_80px_-20px_hsl(0_0%_0%/0.9)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:glow-ring"
          >
            <img
              src={p.img}
              alt={`${p.title} subscription`}
              width={1024}
              height={768}
              loading="lazy"
              className="h-44 w-full object-cover transition-all duration-500 group-hover:scale-105"
            />
            <div className="flex flex-1 flex-col p-6">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-lg font-medium">{p.title}</h3>
                <span className="text-lg font-semibold text-gradient">
                  {p.price}
                  <span className="text-xs text-muted-foreground">{p.period}</span>
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-foreground/70">{p.desc}</p>
              <ul className="mt-4 space-y-2">
                {p.perks.map((t) => (
                  <li key={t} className="flex items-center gap-2 text-[13px] text-foreground/80">
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

      <div className="product-cta relative mt-10 flex justify-center px-6">
        <button
          onClick={() => toast("Full catalog is coming soon.")}
          className="pointer-events-auto group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-foreground px-8 py-4 text-sm font-semibold text-background shadow-[0_0_0_1px_oklch(1_0_0/0.25),0_12px_40px_-10px_oklch(1_0_0/0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_0_1px_oklch(1_0_0/0.35),0_20px_60px_-16px_oklch(1_0_0/0.45)]"
        >
          <span className="relative z-10">Посмотреть каталог</span>
          <ArrowRight size={18} weight="bold" className="relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
          <span className="absolute inset-0 -z-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_ease-in-out]" />
        </button>
      </div>
    </section>
  );
}
