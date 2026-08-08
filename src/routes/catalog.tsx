import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, Lightning, ArrowLeft } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import CatalogSplineBackground from "@/components/CatalogSplineBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import p1 from "@/assets/project-1.jpg";
import p2 from "@/assets/project-2.jpg";
import p3 from "@/assets/project-3.jpg";

const catalogItems = [
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
  {
    img: p1,
    title: "Gaming Pass",
    price: "$7.99",
    period: "/ month",
    desc: "Access a growing library of premium games and online multiplayer.",
    perks: ["100+ titles", "Online multiplayer", "New releases"],
    badge: "Gaming",
  },
  {
    img: p2,
    title: "VPN Shield",
    price: "$2.99",
    period: "/ month",
    desc: "Fast, secure VPN with no logs and global server coverage.",
    perks: ["No logs", "50+ locations", "Unlimited bandwidth"],
    badge: "Secure",
  },
  {
    img: p3,
    title: "Creative Cloud",
    price: "$14.99",
    period: "/ month",
    desc: "Full suite of design, video and photo editing tools.",
    perks: ["20+ apps", "100GB cloud", "Premium fonts"],
    badge: "Creative",
  },
];

export const Route = createFileRoute("/catalog")({
  head: () => ({
    meta: [
      { title: "Catalog — 2G SHOP" },
      {
        name: "description",
        content:
          "Browse the full catalog at 2G SHOP: streaming, music, gaming, AI, VPN and creative subscriptions at the best prices.",
      },
      { property: "og:title", content: "Catalog — 2G SHOP" },
      {
        property: "og:description",
        content:
          "Premium subscriptions and digital goods at the best prices, delivered instantly.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CatalogPage,
});

function CatalogPage() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".catalog-hero > *",
        { opacity: 0, y: 30, filter: "blur(8px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: ".catalog-hero", start: "top 80%" },
        }
      );

      gsap.fromTo(
        ".catalog-card",
        { opacity: 0, y: 50, scale: 0.96, filter: "blur(10px)" },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.55,
          stagger: 0.06,
          ease: "power3.out",
          scrollTrigger: { trigger: ".catalog-grid", start: "top 75%" },
        }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="pointer-events-none relative min-h-screen">
      <CatalogSplineBackground />
      <Navbar alwaysVisible />

      <main className="relative z-10 px-6 pb-24 pt-32">
        <div className="catalog-hero mx-auto max-w-3xl text-center">
          <Link
            to="/"
            className="pointer-events-auto inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft size={16} weight="light" />
            Back to home
          </Link>
          <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
            Full <span className="text-gradient">catalog</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground md:text-lg">
            Best-price subscriptions and digital keys, delivered in minutes with warranty and 24/7 support.
          </p>
        </div>

        <div className="catalog-grid relative mx-auto mt-14 grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-3">
          {catalogItems.map((p) => (
            <article
              key={p.title}
              className="catalog-card pointer-events-auto group relative"
            >
              {/* Ambient glow */}
              <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-r from-neon-violet/20 via-neon-cyan/20 to-neon-violet/20 opacity-50 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

              {/* Card body */}
              <div className="relative flex h-full flex-col overflow-hidden rounded-[2.5rem] border border-white/5 bg-card/80 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl transition-all duration-500 group-hover:-translate-y-2">
                {/* Image container */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={p.img}
                    alt={`${p.title} subscription`}
                    width={1024}
                    height={768}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                      maskImage: "radial-gradient(ellipse at center, black, transparent)",
                    }}
                  />

                  {/* Badge */}
                  <div className="absolute top-5 left-5 flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 backdrop-blur-xl">
                    <span className="h-1.5 w-1.5 rounded-full bg-neon-violet shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                    <span className="text-[10px] font-bold tracking-widest text-foreground uppercase">
                      {p.badge}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-8 pt-4">
                  {/* Title & price */}
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-2xl font-semibold tracking-tight leading-tight">
                      {p.title}
                    </h3>
                    <div className="text-right">
                      <div className="font-display text-2xl font-semibold flex items-baseline gap-0.5">
                        {p.price}
                        <span className="text-muted-foreground font-normal">/</span>
                      </div>
                      <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                        month
                      </span>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {p.desc}
                  </p>

                  {/* Perks */}
                  <ul className="mt-6 space-y-3">
                    {p.perks.map((t) => (
                      <li key={t} className="flex items-center gap-3 text-sm text-foreground/85">
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-neon-violet/20 bg-neon-violet/10">
                          <Check size={12} weight="bold" className="text-neon-violet" />
                        </div>
                        {t}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <button
                    onClick={() => toast.success(`${p.title} added — we'll contact you to finish checkout.`)}
                    className="group/btn relative mt-auto w-full overflow-hidden rounded-2xl bg-white py-4 text-sm font-bold tracking-tight text-black transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.4)] active:scale-[0.98]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-neon-violet to-neon-cyan opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100" />
                    <span className="relative z-10 flex items-center justify-center gap-2 transition-colors duration-300 group-hover/btn:text-white">
                      Buy now <Lightning size={16} weight="fill" />
                    </span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      <div className="pointer-events-auto relative z-10 bg-background">
        <Footer />
      </div>
    </div>
  );
}
