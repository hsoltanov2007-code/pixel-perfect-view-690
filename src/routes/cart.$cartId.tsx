import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "@phosphor-icons/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCartById } from "@/lib/shop.functions";
import { formatPrice } from "@/lib/product-image";

type CartItem = {
  id: string;
  title: string;
  price: number;
  currency: string;
  period: string;
  qty: number;
};

const cartQuery = (id: string) =>
  queryOptions({
    queryKey: ["cart", id],
    queryFn: () => getCartById({ data: { id } }),
  });

export const Route = createFileRoute("/cart/$cartId")({
  head: () => ({
    meta: [
      { title: "Корзина покупателя — 2G SHOP" },
      {
        name: "description",
        content: "Список товаров, выбранных покупателем в 2G SHOP.",
      },
      { property: "og:title", content: "Корзина покупателя — 2G SHOP" },
      {
        property: "og:description",
        content: "Список товаров, выбранных покупателем в 2G SHOP.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(cartQuery(params.cartId)),
  component: SharedCartPage,
  errorComponent: () => <CartFallback message="Не удалось загрузить корзину" />,
  notFoundComponent: () => <CartFallback message="Корзина не найдена" />,
});

function CartFallback({ message }: { message: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
      <div>
        <h1 className="font-display text-2xl font-semibold">{message}</h1>
        <Link to="/" className="mt-4 inline-block text-sm text-muted-foreground hover:text-foreground">
          На главную
        </Link>
      </div>
    </div>
  );
}

function SharedCartPage() {
  const { cartId } = Route.useParams();
  const { data } = useSuspenseQuery(cartQuery(cartId));

  if (!data) return <CartFallback message="Корзина не найдена" />;

  const items = (data.items as unknown as CartItem[]) ?? [];

  return (
    <div className="relative min-h-screen bg-background">
      <Navbar alwaysVisible />
      <main className="relative z-10 mx-auto max-w-3xl px-6 pb-24 pt-32">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={16} weight="light" /> На главную
        </Link>
        <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Корзина покупателя
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Создана {new Date(data.created_at as string).toLocaleString()}
          {data.channel ? ` · ${data.channel}` : ""}
        </p>

        <ul className="mt-8 space-y-3">
          {items.map((i, idx) => (
            <li
              key={`${i.id}-${idx}`}
              className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-5 py-4"
            >
              <div>
                <p className="font-medium">{i.title}</p>
                <p className="text-xs text-muted-foreground">
                  {formatPrice(i.price, i.currency)} {i.period} · × {i.qty}
                </p>
              </div>
              <span className="text-sm font-medium">
                {formatPrice(i.price * i.qty, i.currency)}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-4">
          <span className="text-sm text-muted-foreground">Итого</span>
          <span className="font-display text-xl font-semibold">
            {formatPrice(Number(data.total))}
          </span>
        </div>
      </main>
      <Footer />
    </div>
  );
}
