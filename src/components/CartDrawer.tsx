import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  X,
  Minus,
  Plus,
  ShoppingBag,
  TelegramLogo,
  InstagramLogo,
  Copy,
  ArrowRight,
  ShieldCheck,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import gsap from "gsap";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/product-image";
import { createCartLink, getPublicContacts } from "@/lib/shop.functions";
import { buildCheckoutMessage } from "@/lib/checkout-message";
import { useI18n } from "@/lib/i18n";

type Channel = "whatsapp" | "telegram" | "instagram";

const gradients = [
  "from-indigo-600/30 to-violet-600/20",
  "from-cyan-600/25 to-indigo-600/20",
  "from-violet-600/30 to-fuchsia-600/20",
  "from-emerald-600/20 to-cyan-600/20",
  "from-amber-600/20 to-rose-600/20",
];

function itemGradient(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  const idx = Math.abs(hash) % gradients.length;
  return gradients[idx];
}

export default function CartDrawer() {
  const { items, count, total, open, setOpen, remove, setQty, clear } = useCart();
  const { t, lang } = useI18n();
  const [choosing, setChoosing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [igText, setIgText] = useState<string | null>(null);
  const [igUrl, setIgUrl] = useState<string | null>(null);
  const createLink = useServerFn(createCartLink);

  const drawerRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<HTMLUListElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  const { data: contacts } = useQuery({
    queryKey: ["public-contacts"],
    queryFn: () => getPublicContacts(),
    staleTime: 5 * 60 * 1000,
  });

  // Lock body scroll while drawer is open
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // GSAP entrance animation
  useLayoutEffect(() => {
    if (!open || !drawerRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(drawerRef.current, { xPercent: 100 }, { xPercent: 0, duration: 0.55 });
      if (itemsRef.current) {
        const cards = itemsRef.current.querySelectorAll("li");
        tl.fromTo(
          cards,
          { opacity: 0, y: 24, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.08 },
          "-=0.3"
        );
      }
      if (footerRef.current) {
        tl.fromTo(
          footerRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.4 },
          "-=0.25"
        );
      }
    });
    return () => ctx.revert();
  }, [open]);

  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(ta);
        return ok;
      } catch {
        return false;
      }
    }
  }

  async function checkout(channel: Channel) {
    if (!items.length || busy) return;
    setBusy(true);
    try {
      const { id } = await createLink({ data: { items, channel } });
      const link = `https://2gshop.com/cart/${id}`;
      const lines = items
        .map((i) => `• ${i.title} × ${i.qty} — ${formatPrice(i.price * i.qty, i.currency)}`)
        .join("\n");
      const text = buildCheckoutMessage({
        lines,
        total: formatPrice(total),
        link,
        locale: lang,
      });

      let url = "";
      if (channel === "whatsapp") {
        const phone = (contacts?.whatsapp ?? "").replace(/[^\d]/g, "");
        if (!phone) throw new Error(t("cart.notConfigured", { channel: "WhatsApp" }));
        url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
      } else if (channel === "telegram") {
        const handle = (contacts?.telegram ?? "").replace(/^@/, "").trim();
        if (!handle) throw new Error(t("cart.notConfigured", { channel: "Telegram" }));
        url = `https://t.me/${encodeURIComponent(handle)}?text=${encodeURIComponent(text)}`;
      } else {
        const handle = (contacts?.instagram ?? "").replace(/^@/, "").trim();
        if (!handle) throw new Error(t("cart.notConfigured", { channel: "Instagram" }));
        // Instagram can't prefill DM text — show the message so it can be copied.
        const copied = await copyText(text);
        if (copied) toast.success(t("cart.copied"));
        setIgText(text);
        setIgUrl(`https://ig.me/m/${encodeURIComponent(handle)}`);
        setBusy(false);
        return;
      }

      window.open(url, "_blank", "noopener,noreferrer");
      clear();
      setChoosing(false);
      setOpen(false);
      toast.success(t("cart.sent"));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("cart.failed"));
    } finally {
      setBusy(false);
    }
  }


  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <button
        aria-label={t("cart.close")}
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />
      <aside
        ref={drawerRef}
        className="relative flex h-full w-full max-w-md flex-col border-l border-white/10 bg-[oklch(0.09_0_0/0.98)] shadow-2xl will-change-transform"
        style={{
          boxShadow: "0 0 60px -20px oklch(0.2 0.08 285 / 0.8), 0 0 0 1px oklch(1 0 0 / 6%)",
        }}
      >
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[oklch(0.09_0_0/0.8)] px-6 py-5 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 shadow-[0_0_20px_rgba(79,70,229,0.35)]">
              <span className="font-['Rajdhani'] text-lg font-bold tracking-tighter text-white">2G</span>
            </div>
            <div>
              <h2 className="font-['Rajdhani'] text-xl font-bold uppercase tracking-widest text-foreground">
                {t("cart.vaultTitle")}
              </h2>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {t("cart.title")} // {count.toString().padStart(2, "0")}
              </p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label={t("cart.close")}
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
          >
            <X size={22} weight="light" />
          </button>
        </header>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {items.length === 0 ? (
            <div className="mt-20 flex flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
                <ShoppingBag size={28} weight="light" className="text-muted-foreground" />
              </div>
              <p className="mt-4 text-sm text-muted-foreground">{t("cart.empty")}</p>
            </div>
          ) : (
            <ul ref={itemsRef} className="space-y-5">
              {items.map((i) => (
                <li
                  key={i.id}
                  className="group relative rounded-2xl border border-white/8 bg-white/[0.03] p-4 transition-all duration-300 hover:border-indigo-500/30 hover:bg-white/[0.05]"
                >
                  {/* hover glow */}
                  <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-indigo-500/0 to-violet-500/0 opacity-0 blur transition-opacity duration-500 group-hover:from-indigo-500/20 group-hover:to-violet-500/20 group-hover:opacity-100" />
                  <div className="relative flex gap-4">
                    <div
                      className={`flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br ${itemGradient(i.id)}`}
                    >
                      <ShoppingBag size={24} weight="light" className="text-white/40" />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-display text-[15px] font-semibold leading-tight text-foreground">
                            {i.title}
                          </h3>
                          <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-indigo-400/80">
                            {i.period}
                          </p>
                        </div>
                        <span className="font-['Rajdhani'] text-lg font-bold text-indigo-400">
                          {formatPrice(i.price, i.currency)}
                        </span>
                      </div>

                      <div className="mt-auto flex items-center justify-between pt-4">
                        <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-black/40 px-1 py-1">
                          <button
                            onClick={() => setQty(i.id, i.qty - 1)}
                            aria-label={t("cart.decrease")}
                            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
                          >
                            <Minus size={12} weight="light" />
                          </button>
                          <span className="min-w-[1.5rem] text-center font-['Rajdhani'] text-sm text-foreground">
                            {String(i.qty).padStart(2, "0")}
                          </span>
                          <button
                            onClick={() => setQty(i.id, i.qty + 1)}
                            aria-label={t("cart.increase")}
                            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
                          >
                            <Plus size={12} weight="light" />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="font-['Rajdhani'] text-sm font-bold text-foreground">
                            {formatPrice(i.price * i.qty, i.currency)}
                          </p>
                          <button
                            onClick={() => remove(i.id)}
                            aria-label={t("cart.remove", { title: i.title })}
                            className="text-[10px] uppercase tracking-tighter text-muted-foreground transition-colors hover:text-rose-500"
                          >
                            {t("cart.remove", { title: "" }).replace(/\s+/g, "")}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <footer
          ref={footerRef}
          className="border-t border-white/10 bg-[oklch(0.09_0_0/0.9)] px-6 py-6 backdrop-blur-xl"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="uppercase tracking-widest">{t("cart.subtotal")}</span>
              <span className="font-['Rajdhani']">{formatPrice(total)}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="uppercase tracking-widest">{t("cart.fee")}</span>
              <span className="font-['Rajdhani']">{formatPrice(0)}</span>
            </div>
            <div className="flex items-end justify-between border-t border-white/10 pt-3">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-foreground">
                {t("cart.total")}
              </span>
              <span className="font-['Rajdhani'] text-3xl font-bold leading-none tracking-tight text-foreground">
                {formatPrice(total)}
              </span>
            </div>
          </div>

          {igText ? (
            <div className="mt-5 space-y-3">
              <p className="text-xs text-muted-foreground">{t("cart.igHint")}</p>
              <textarea
                readOnly
                value={igText}
                onFocus={(e) => e.currentTarget.select()}
                className="h-28 w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] p-3 text-[11px] leading-relaxed text-foreground/90 outline-none focus:border-indigo-500/40"
              />
              <button
                onClick={async () => {
                  const ok = await copyText(igText);
                  if (ok) toast.success(t("cart.copied"));
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] py-3 text-xs uppercase tracking-widest text-foreground transition-colors hover:bg-white/[0.09]"
              >
                <Copy size={14} weight="bold" />
                {t("cart.igCopy")}
              </button>
              <button
                onClick={() => {
                  if (igUrl) window.open(igUrl, "_blank", "noopener,noreferrer");
                  clear();
                  setIgText(null);
                  setIgUrl(null);
                  setChoosing(false);
                  setOpen(false);
                  toast.success(t("cart.sent"));
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3.5 font-['Rajdhani'] text-sm font-bold uppercase tracking-[0.2em] text-white"
              >
                <InstagramLogo size={18} weight="light" />
                {t("cart.igOpen")}
              </button>
              <button
                onClick={() => {
                  setIgText(null);
                  setIgUrl(null);
                }}
                className="w-full pt-1 text-xs text-muted-foreground hover:text-foreground"
              >
                {t("cart.back")}
              </button>
            </div>
          ) : !choosing ? (
            <button
              disabled={!items.length}
              onClick={() => setChoosing(true)}
              className="group relative mt-5 w-full overflow-hidden rounded-xl disabled:opacity-40"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 transition-transform duration-300 group-hover:scale-105" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_oklch(1_0_0/0.2)_0%,_transparent_70%)] opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative flex items-center justify-center gap-3 py-4">
                <span className="font-['Rajdhani'] text-sm font-bold uppercase tracking-[0.25em] text-white">
                  {t("cart.checkout")}
                </span>
                <ArrowRight
                  size={18}
                  weight="bold"
                  className="text-white transition-transform group-hover:translate-x-1"
                />
              </div>
            </button>
          ) : (
            <div className="mt-5 space-y-3">
              <p className="text-xs text-muted-foreground">{t("cart.choose")}</p>
              <div className="grid grid-cols-3 gap-2">
                <ChannelButton
                  disabled={busy || !contacts?.whatsapp}
                  onClick={() => checkout("whatsapp")}
                  icon={<WhatsappLogo size={22} weight="light" />}
                  label="WhatsApp"
                />
                <ChannelButton
                  disabled={busy || !contacts?.telegram}
                  onClick={() => checkout("telegram")}
                  icon={<TelegramLogo size={22} weight="light" />}
                  label="Telegram"
                />
                <ChannelButton
                  disabled={busy || !contacts?.instagram}
                  onClick={() => checkout("instagram")}
                  icon={<InstagramLogo size={22} weight="light" />}
                  label="Instagram"
                />
              </div>
              <button
                onClick={() => setChoosing(false)}
                className="w-full pt-1 text-xs text-muted-foreground hover:text-foreground"
              >
                {t("cart.back")}
              </button>
            </div>
          )}

          <div className="mt-4 flex items-center justify-center gap-2">
            <ShieldCheck size={12} weight="fill" className="text-emerald-500" />
            <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-muted-foreground/70">
              {t("cart.secure")}
            </p>
          </div>
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
      className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] py-3 text-xs transition-all hover:border-indigo-500/30 hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-30"
    >
      {icon}
      <span className="text-[10px] uppercase tracking-wider">{label}</span>
    </button>
  );
}

export function CopyLinkButton({ url }: { url: string }) {
  const { t } = useI18n();
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(url);
        toast.success(t("cart.linkCopied"));
      }}
      className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs text-muted-foreground hover:text-foreground"
    >
      <Copy size={14} weight="light" /> {t("cart.copyLink")}
    </button>
  );
}
