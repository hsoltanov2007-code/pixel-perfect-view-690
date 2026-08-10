import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Check } from "@phosphor-icons/react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CatalogSplineBackground from "@/components/CatalogSplineBackground";
import { LocalizedDescription } from "@/components/LocalizedDescription";
import { useCart } from "@/lib/cart";
import { useI18n } from "@/lib/i18n";
import { getProductBySlug } from "@/lib/shop.functions";
import {
  formatPrice,
  localizeDescription,
  localizePerks,
  productImage,
} from "@/lib/product-image";

const BASE_URL = "https://2gshop.com";

export const Route = createFileRoute("/p/$slug")({
  loader: async ({ params }) => {
    const product = await getProductBySlug({ data: { slug: params.slug } });
    if (!product) throw notFound();
    return { product };
  },
  head: ({ params, loaderData }) => {
    const url = `${BASE_URL}/p/${params.slug}`;
    if (!loaderData) {
      return {
        meta: [
          { title: "Unavailable — 2G SHOP" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const p = loaderData.product;
    const price = formatPrice(Number(p.price), p.currency);
    const short =
      localizeDescription(p.description, "az")
        .split(/\n|\.\s/)[0]
        ?.trim() ?? "";
    const title = `${p.title} — ${price}${p.period ? ` ${p.period}` : ""} | 2G SHOP`;
    const description = `${p.title} ${price}${p.period ? ` ${p.period}` : ""}. ${short}`.slice(
      0,
      158
    );
    const image = p.image_key?.startsWith("http") ? p.image_key : undefined;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
        ...(image
          ? [
              { property: "og:image", content: image },
              { name: "twitter:image", content: image },
            ]
          : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: p.title,
            description: localizeDescription(p.description, "az"),
            ...(image ? { image } : {}),
            brand: { "@type": "Brand", name: "2G SHOP" },
            offers: {
              "@type": "Offer",
              url,
              price: Number(p.price),
              priceCurrency: "AZN",
              availability: "https://schema.org/InStock",
            },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "2G SHOP",
                item: BASE_URL,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Catalog",
                item: `${BASE_URL}/catalog`,
              },
              { "@type": "ListItem", position: 3, name: p.title, item: url },
            ],
          }),
        },
      ],
    };
  },
  component: ProductPage,
  errorComponent: ProductMissing,
  notFoundComponent: ProductMissing,
});

function ProductMissing() {
  return (
    <div className="relative min-h-screen">
      <Navbar alwaysVisible />
      <main className="relative z-10 mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-6 px-6 text-center">
        <h1 className="font-display text-3xl font-semibold">404</h1>
        <p className="text-muted-foreground">
          Bu məhsul tapılmadı / Товар не найден / Product not found
        </p>
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm"
        >
          Catalog
          <ArrowRight size={16} weight="bold" />
        </Link>
      </main>
    </div>
  );
}

function ProductPage() {
  const { slug } = Route.useParams();
  const initial = Route.useLoaderData();
  const { t: tr, lang } = useI18n();
  const { add, setOpen } = useCart();

  const { data } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProductBySlug({ data: { slug } }),
    initialData: initial.product,
  });

  const p = data ?? initial.product;
  const perks = localizePerks(p.perks, lang);

  const addToCart = () => {
    add({
      id: p.id,
      title: p.title,
      price: Number(p.price),
      currency: p.currency,
      period: p.period,
    });
    toast.success(tr("products.added", { title: p.title }));
  };

  return (
    <div className="pointer-events-none relative min-h-screen">
      <CatalogSplineBackground />
      <Navbar alwaysVisible />

      <main className="relative z-10 px-6 pb-24 pt-32">
        <div className="mx-auto max-w-5xl">
          <Link
            to="/catalog"
            className="pointer-events-auto inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft size={16} weight="light" />
            {tr("catalog.title")} {tr("catalog.titleAccent")}
          </Link>

          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <div className="cosmos-card-surface pointer-events-auto relative overflow-hidden rounded-[1.75rem] border border-white/6 p-3 backdrop-blur-2xl">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
                <img
                  src={productImage(p.image_key)}
                  alt={`${p.title} — 2G SHOP`}
                  className="h-full w-full object-cover opacity-80 saturate-50"
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_top,oklch(0.05_0.02_270/0.9),transparent_60%)]" />
              </div>
            </div>

            <div className="pointer-events-auto flex flex-col">
              <p className="text-[10px] uppercase tracking-[0.22em] text-cosmos-dust">
                2G SHOP
              </p>
              <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                {p.title}
              </h1>

              <div className="mt-4 flex items-end gap-2">
                <span className="font-display text-3xl font-semibold">
                  {formatPrice(Number(p.price), p.currency)}
                </span>
                <span className="pb-1 text-sm text-muted-foreground">
                  {p.period}
                </span>
              </div>

              <LocalizedDescription
                description={p.description}
                className="mt-5 text-sm leading-relaxed text-muted-foreground"
              />

              {perks.length > 0 && (
                <ul className="mt-6 space-y-3">
                  {perks.map((t) => (
                    <li
                      key={t}
                      className="flex items-center gap-3 text-sm text-foreground/80"
                    >
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5">
                        <Check size={11} weight="bold" className="text-cosmos-star" />
                      </div>
                      {t}
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={addToCart}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/8 bg-white/5 py-4 text-sm font-medium text-foreground backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10 active:scale-[0.98]"
                >
                  {tr("products.add")}
                  <ArrowRight size={16} weight="bold" />
                </button>
                <button
                  onClick={() => {
                    addToCart();
                    setOpen(true);
                  }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/12 py-4 text-sm font-semibold text-foreground backdrop-blur-md transition-all hover:bg-white/20 active:scale-[0.98]"
                >
                  {tr("cart.buy")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="pointer-events-auto relative z-10 bg-background">
        <Footer />
      </div>
    </div>
  );
}
