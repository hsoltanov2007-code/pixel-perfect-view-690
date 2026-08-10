import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, ArrowRight, ArrowLeft } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import CatalogSplineBackground from "@/components/CatalogSplineBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cart";
import { getPublicProducts } from "@/lib/shop.functions";
import {
  formatPrice,
  productImage,
  localizePerks,
} from "@/lib/product-image";
import { LocalizedDescription } from "@/components/LocalizedDescription";
import { productSlug } from "@/lib/slug";
import { useI18n } from "@/lib/i18n";
import { useIsMobile } from "@/hooks/use-mobile";

function StarField({ count = 12 }: { count?: number }) {
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
      { property: "og:url", content: "https://2gshop.com/catalog" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://2gshop.com/catalog" }],
  }),
  component: CatalogPage,
});

function CatalogPage() {
  const { t: tr, lang } = useI18n();
  const root = useRef<HTMLDivElement>(null);
  const { add } = useCart();
  const isMobile = useIsMobile();
  const { data } = useQuery({
    queryKey: ["public-products"],
    queryFn: () => getPublicProducts(),
  });
  const products = data ?? [];

  useEffect(() => {
    if (products.length === 0) return;
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
  }, [products.length]);

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
            {tr("catalog.back")}
          </Link>
          <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
            {tr("catalog.title")} <span className="text-gradient">{tr("catalog.titleAccent")}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground md:text-lg">
            {tr("catalog.subtitle")}
          </p>
        </div>

        {products.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "ItemList",
                itemListElement: products.map((p, i) => ({
                  "@type": "ListItem",
                  position: i + 1,
                  item: {
                    "@type": "Product",
                    name: p.title,
                    url: `https://2gshop.com/p/${productSlug(p, products)}`,
                    offers: {
                      "@type": "Offer",
                      price: p.price,
                      priceCurrency: "AZN",
                      availability: "https://schema.org/InStock",
                    },
                  },
                })),
              }),
            }}
          />
        )}

        <h2 className="sr-only">{tr("catalog.title")} {tr("catalog.titleAccent")}</h2>
        <div className="catalog-grid relative mx-auto mt-14 grid max-w-6xl grid-cols-2 gap-3 sm:gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {products.map((p) => (
            <article
              key={p.id}
              className="catalog-card will-change-[opacity,transform] pointer-events-auto group relative"
            >
              {/* Soft nebula halo */}
              <div className="pointer-events-none absolute -inset-6 rounded-[3rem] bg-[radial-gradient(ellipse_at_50%_0%,var(--cosmos-nebula),transparent_65%)] opacity-10 blur-2xl transition-opacity duration-700 group-hover:opacity-20" />

              {/* Card body */}
              <div className="cosmos-card-surface relative flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-white/6 backdrop-blur-2xl transition-all duration-700 ease-out group-hover:-translate-y-1.5 group-hover:border-white/10 sm:rounded-[1.75rem]">
                {/* Starfield */}
                <div className="cosmos-starfield pointer-events-none absolute inset-0 opacity-40 transition-opacity duration-700 group-hover:opacity-70" />
                <StarField count={isMobile ? 4 : 7} />
                {/* Distant nebula wash */}
                <div className="cosmos-drift pointer-events-none absolute -top-24 -right-16 h-56 w-56 rounded-full bg-cosmos-nebula/15 blur-3xl" />

                {/* Image */}
                <div className="relative h-28 w-full overflow-hidden p-2 sm:h-48 sm:p-3">
                  <div className="relative h-full w-full overflow-hidden rounded-2xl">
                    <img
                      src={productImage(p.image_key)}
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
                <div className="relative flex flex-1 flex-col px-3 pb-4 sm:px-6 sm:pb-8">
                  <div className="mb-2 flex items-end justify-between gap-2 sm:mb-4 sm:gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate font-display text-base font-semibold tracking-tight text-foreground sm:text-2xl">
                        <Link
                          to="/p/$slug"
                          params={{ slug: productSlug(p, products) }}
                          className="transition-colors hover:text-cosmos-star"
                        >
                          {p.title}
                        </Link>
                      </h3>
                      <p className="text-[10px] tracking-[0.12em] text-cosmos-dust uppercase sm:text-xs sm:tracking-[0.16em]">
                        2G SHOP
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="font-display text-base font-semibold tracking-tight text-foreground sm:text-2xl">
                        {formatPrice(Number(p.price), p.currency)}
                      </span>
                      <span className="block text-[10px] text-muted-foreground sm:text-xs">
                        {p.period}
                      </span>
                    </div>
                  </div>

                  <LocalizedDescription
                    description={p.description}
                    className="mb-3 text-xs leading-relaxed text-muted-foreground sm:mb-6 sm:text-sm"
                  />


                  <ul className="mb-4 hidden space-y-3 sm:mb-8 sm:block">
                    {localizePerks(p.perks, lang).map((t) => (
                      <li
                        key={t}
                        className="flex items-center gap-3 text-sm text-foreground/75"
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
                      toast.success(tr("products.added", { title: p.title }));
                    }}
                    className="group/btn mt-auto flex w-full items-center justify-center gap-1.5 rounded-lg border border-white/8 bg-white/5 py-2.5 text-xs font-medium tracking-wide text-foreground backdrop-blur-md transition-all duration-500 hover:border-white/20 hover:bg-white/10 active:scale-[0.98] sm:gap-2 sm:rounded-xl sm:py-4 sm:text-sm"
                  >
                    {tr("products.add")}
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
      </main>

      <div className="pointer-events-auto relative z-10 bg-background">
        <Footer />
      </div>
    </div>
  );
}
