import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { X, Minus, Plus, ShoppingBag, WhatsappLogo, TelegramLogo, InstagramLogo, Copy } from "@phosphor-icons/react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/product-image";
import { createCartLink, getPublicContacts } from "@/lib/shop.functions";
import { buildCheckoutMessage } from "@/lib/checkout-message";

type Channel = "whatsapp" | "telegram" | "instagram";

export default function CartDrawer() {
  const { items, count, total, open, setOpen, remove, setQty, clear } = useCart();
  const [choosing, setChoosing] = useState(false);
  const [busy, setBusy] = useState(false);
  const createLink = useServerFn(createCartLink);

  const { data: contacts } = useQuery({
    queryKey: ["public-contacts"],
    queryFn: () => getPublicContacts(),
    staleTime: 5 * 60 * 1000,
  });

  async function checkout(channel: Channel) {
    if (!items.length || busy) return;
    setBusy(true);
    try {
      const { id } = await createLink({ data: { items, channel } });
      const link = `${window.location.origin}/cart/${id}`;
      const lines = items
        .map((i) => `• ${i.title} × ${i.qty} — ${formatPrice(i.price * i.qty, i.currency)}`)
        .join("\n");
      const text = buildCheckoutMessage({
        lines,
        total: formatPrice(total),
        link,
      });

      let url = "";
      if (channel === "whatsapp") {
        const phone = (contacts?.whatsapp ?? "").replace(/[^\d]/g, "");
        if (!phone) throw new Error("WhatsApp не настроен");
        url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
      } else if (channel === "telegram") {
        const handle = (contacts?.telegram ?? "").replace(/^@/, "").trim();
        if (!handle) throw new Error("Telegram не настроен");
        url = `https://t.me/${encodeURIComponent(handle)}?text=${encodeURIComponent(text)}`;
      } else {
        const handle = (contacts?.instagram ?? "").replace(/^@/, "").trim();
        if (!handle) throw new Error("Instagram не настроен");
        try {
          await navigator.clipboard.writeText(text);
          toast.success("Текст заказа скопирован — вставьте его в директ");
        } catch {
          /* ignore */
        }
        url = `https://ig.me/m/${encodeURIComponent(handle)}`;
      }

      window.open(url, "_blank", "noopener,noreferrer");
      clear();
      setChoosing(false);
      setOpen(false);
      toast.success("Корзина отправлена и очищена");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Не удалось оформить заказ");
    } finally {
      setBusy(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <button
        aria-label="Close cart"
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />
      <aside className="relative flex h-full w-full max-w-md flex-col border-l border-white/10 bg-[oklch(0.09_0_0/0.96)] backdrop-blur-2xl">
        <header className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} weight="light" />
            <h2 className="font-display text-lg font-semibold">Корзина</h2>
            <span className="text-sm text-muted-foreground">({count})</span>
          </div>
          <button onClick={() => setOpen(false)} aria-label="Close">
            <X size={20} weight="light" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {items.length === 0 ? (
            <p className="mt-16 text-center text-sm text-muted-foreground">
              Корзина пуста
            </p>
          ) : (
            <ul className="space-y-4">
              {items.map((i) => (
                <li
                  key={i.id}
                  className="rounded-2xl border border-white/8 bg-white/[0.03] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{i.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatPrice(i.price, i.currency)} {i.period}
                      </p>
                    </div>
                    <button
                      onClick={() => remove(i.id)}
                      aria-label={`Remove ${i.title}`}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <X size={16} weight="light" />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-3 rounded-full border border-white/10 px-3 py-1">
                      <button onClick={() => setQty(i.id, i.qty - 1)} aria-label="Minus">
                        <Minus size={14} weight="light" />
                      </button>
                      <span className="min-w-4 text-center text-sm">{i.qty}</span>
                      <button onClick={() => setQty(i.id, i.qty + 1)} aria-label="Plus">
                        <Plus size={14} weight="light" />
                      </button>
                    </div>
                    <span className="text-sm font-medium">
                      {formatPrice(i.price * i.qty, i.currency)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <footer className="border-t border-white/10 px-6 py-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Итого</span>
            <span className="font-display text-xl font-semibold">
              {formatPrice(total)}
            </span>
          </div>

          {!choosing ? (
            <button
              disabled={!items.length}
              onClick={() => setChoosing(true)}
              className="mt-4 w-full rounded-full bg-foreground py-3 text-sm font-semibold text-background transition-opacity disabled:opacity-40"
            >
              Купить
            </button>
          ) : (
            <div className="mt-4 space-y-2">
              <p className="text-xs text-muted-foreground">
                Выберите, куда написать — текст заказа подставится автоматически.
              </p>
              <div className="grid grid-cols-3 gap-2">
                <ChannelButton
                  disabled={busy || !contacts?.whatsapp}
                  onClick={() => checkout("whatsapp")}
                  icon={<WhatsappLogo size={20} weight="light" />}
                  label="WhatsApp"
                />
                <ChannelButton
                  disabled={busy || !contacts?.telegram}
                  onClick={() => checkout("telegram")}
                  icon={<TelegramLogo size={20} weight="light" />}
                  label="Telegram"
                />
                <ChannelButton
                  disabled={busy || !contacts?.instagram}
                  onClick={() => checkout("instagram")}
                  icon={<InstagramLogo size={20} weight="light" />}
                  label="Instagram"
                />
              </div>
              <button
                onClick={() => setChoosing(false)}
                className="w-full pt-1 text-xs text-muted-foreground hover:text-foreground"
              >
                Назад
              </button>
            </div>
          )}
        </footer>
      </aside>
    </div>
  );
}

function ChannelButton({
  icon,
  label,
  onClick,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex flex-col items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.04] py-3 text-xs transition-colors hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-30"
    >
      {icon}
      {label}
    </button>
  );
}

export function CopyLinkButton({ url }: { url: string }) {
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(url);
        toast.success("Ссылка скопирована");
      }}
      className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs text-muted-foreground hover:text-foreground"
    >
      <Copy size={14} weight="light" /> Скопировать ссылку
    </button>
  );
}
