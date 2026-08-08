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
    img: p1,
    title: "Gaming Pass",
    price: "$7.99",
    period: "/ month",
    desc: "Access a growing library of premium games and online multiplayer.",
    perks: ["100+ titles", "Online multiplayer", "New releases"],
  },
  {
    img: p2,
    title: "VPN Shield",
    price: "$2.99",
    period: "/ month",
    desc: "Fast, secure VPN with no logs and global server coverage.",
    perks: ["No logs", "50+ locations", "Unlimited bandwidth"],
  },
  {
    img: p3,
    title: "Creative Cloud",
    price: "$14.99",
    period: "/ month",
    desc: "Full suite of design, video and photo editing tools.",
    perks: ["20+ apps", "100GB cloud", "Premium fonts"],
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
          <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
            Full <span className="text-gradient">catalog</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground md:text-lg">
            Best-price subscriptions and digital keys, delivered in minutes with warranty and 24/7 support.
          </p>
        </div>

        <div className="catalog-grid relative mx-auto mt-14 grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {catalogItems.map((p) => (
            <article
              key={p.title}
              className="catalog-card pointer-events-auto group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card/80 shadow-[0_30px_80px_-20px_hsl(0_0%_0%/0.9)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:glow-ring"
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
      </main>

      <div className="pointer-events-auto relative z-10 bg-background">
        <Footer />
      </div>
    </div>
  );
}
