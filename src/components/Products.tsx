import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, ArrowRight } from "@phosphor-icons/react";
import { toast } from "sonner";
import p1 from "@/assets/project-1.jpg";
import p2 from "@/assets/project-2.jpg";
import p3 from "@/assets/project-3.jpg";

function StarField({ count = 10 }: { count?: number }) {
  const stars = Array.from({ length: count }, (_, i) => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 1.5 + 0.5,
    delay: Math.random() * 4,
    duration: Math.random() * 2 + 2,
  }));
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[1.75rem]">
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-cosmos-star animate-star-twinkle"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
            boxShadow: `0 0 ${s.size * 3}px currentColor`,
          }}
        />
      ))}
    </div>
  );
}

const items = [
  {
    img: p1,
    title: "Streaming Pro",
    price: "$4.99",
    period: "/ month",
    desc: "4K streaming subscription, instant delivery to your inbox.",
    perks: ["4K + HDR", "Works worldwide", "Instant activation"],
    badge: "Popular",
  },
  {
    img: p2,
    title: "Music Unlimited",
    price: "$3.49",
    period: "/ month",
    desc: "Ad-free music on every device with offline downloads.",
    perks: ["Ad-free", "Offline mode", "Up to 6 devices"],
    badge: "Best value",
  },
  {
    img: p3,
    title: "AI Assistant Plus",
    price: "$9.99",
    period: "/ month",
    desc: "Premium AI access with priority speed and higher limits.",
    perks: ["Priority speed", "Higher limits", "Early features"],
    badge: "Enterprise",
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
          scrollTrigger: { trigger: root.current, start: "top 85%" },
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
          scrollTrigger: { trigger: root.current, start: "top 70%" },
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
      {/* Deep space wash behind cards so the fixed robot fades out */}
      <div
        className="pointer-events-none absolute inset-0 -top-32"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, oklch(0.03 0.01 270 / 0.65) 18%, oklch(0.03 0.01 270 / 0.92) 45%, oklch(0.03 0.01 270 / 0.98) 100%)",
        }}
      />
      <div className="pointer-events-none absolute top-1/4 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-foreground/10 blur-[130px]" />
      <div className="product-grid relative mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-3">
        {items.map((p) => (
          <article
            key={p.title}
            className="product-card pointer-events-auto group relative"
          >
            {/* Soft nebula halo */}
            <div className="pointer-events-none absolute -inset-6 rounded-[3rem] bg-[radial-gradient(ellipse_at_50%_0%,var(--cosmos-nebula),transparent_65%)] opacity-10 blur-2xl transition-opacity duration-700 group-hover:opacity-20" />

            {/* Card body */}
            <div className="cosmos-card-surface relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-white/6 backdrop-blur-2xl transition-all duration-700 ease-out group-hover:-translate-y-1.5 group-hover:border-white/10">
              {/* Starfield */}
              <div className="cosmos-starfield pointer-events-none absolute inset-0 opacity-40 transition-opacity duration-700 group-hover:opacity-70" />
              <StarField count={10} />
              {/* Distant nebula wash */}
              <div className="cosmos-drift pointer-events-none absolute -top-24 -right-16 h-56 w-56 rounded-full bg-cosmos-nebula/15 blur-3xl" />

              {/* Image */}
              <div className="relative h-44 w-full overflow-hidden p-3">
                <div className="absolute top-5 left-5 z-20">
                  <span className="rounded-full border border-white/10 bg-black/45 px-3 py-1 text-[10px] font-medium tracking-[0.18em] text-cosmos-star uppercase backdrop-blur-md">
                    {p.badge}
                  </span>
                </div>
                <div className="relative h-full w-full overflow-hidden rounded-2xl">
                  <img
                    src={p.img}
                    alt={`${p.title} subscription`}
                    width={1024}
                    height={768}
                    loading="lazy"
                    className="h-full w-full object-cover opacity-70 saturate-50 transition-all duration-1000 ease-out group-hover:scale-105 group-hover:opacity-90"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(to_top,oklch(0.05_0.02_270/0.98),transparent_60%)]" />
                  <div className="absolute inset-0 bg-black/25" />
                </div>
              </div>

              {/* Content */}
              <div className="relative flex flex-1 flex-col px-6 pb-6">
                <div className="mb-3 flex items-end justify-between gap-3">
                  <div>
                    <h3 className="font-display text-xl font-semibold tracking-tight text-foreground">
                      {p.title}
                    </h3>
                    <p className="text-[10px] tracking-[0.16em] text-cosmos-dust uppercase">
                      2G SHOP
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-display text-xl font-semibold tracking-tight text-foreground">
                      {p.price}
                    </span>
                    <span className="block text-[10px] text-muted-foreground">/month</span>
                  </div>
                </div>

                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                  {p.desc}
                </p>

                <ul className="mb-6 space-y-2">
                  {p.perks.map((t) => (
                    <li
                      key={t}
                      className="flex items-center gap-3 text-[13px] text-foreground/75"
                    >
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5">
                        <Check size={11} weight="bold" className="text-cosmos-star" />
                      </div>
                      {t}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={() => {
                    add({
                      id: p.id,
                      title: p.title,
                      price: Number(p.price),
                      currency: p.currency,
                      period: p.period,
                    });
                    toast.success(`${p.title} добавлен в корзину`);
                  }}
                  className="group/btn mt-auto flex w-full items-center justify-center gap-2 rounded-xl border border-white/8 bg-white/5 py-3 text-sm font-medium tracking-wide text-foreground backdrop-blur-md transition-all duration-500 hover:border-white/20 hover:bg-white/10 active:scale-[0.98]"
                >
                  Buy now
                  <ArrowRight
                    size={16}
                    weight="bold"
                    className="transition-transform duration-300 group-hover/btn:translate-x-1"
                  />
                </button>
              </div>

              {/* Horizon hairline */}
              <div className="cosmos-hairline pointer-events-none absolute inset-x-0 bottom-0 h-px opacity-60" />
            </div>
          </article>
        ))}
      </div>

      <div className="product-cta relative mt-10 flex justify-center px-6">
        <Link
          to="/catalog"
          className="pointer-events-auto group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-foreground px-8 py-4 text-sm font-semibold text-background shadow-[0_0_0_1px_oklch(1_0_0/0.25),0_12px_40px_-10px_oklch(1_0_0/0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_0_1px_oklch(1_0_0/0.35),0_20px_60px_-16px_oklch(1_0_0/0.45)]"
        >
          <span className="relative z-10">Посмотреть каталог</span>
          <ArrowRight size={18} weight="bold" className="relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
          <span className="absolute inset-0 -z-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_ease-in-out]" />
        </Link>
      </div>
    </section>
  );
}
