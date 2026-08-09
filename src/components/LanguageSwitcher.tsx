import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check } from "@phosphor-icons/react";
import { LANGS, LANG_NAMES, type Lang, useI18n } from "@/lib/i18n";

const LANG_FLAGS: Record<Lang, string> = {
  ru: "",
  az: "",
  en: "",
};

export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { lang, setLang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; right: number } | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const place = () => {
    const r = btnRef.current?.getBoundingClientRect();
    if (r) setPos({ top: r.bottom + 8, right: window.innerWidth - r.right });
  };

  useEffect(() => {
    if (!open) return;
    place();
    const onScroll = () => place();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (compact) {
    return (
      <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1">
        {LANGS.map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            aria-label={LANG_NAMES[l]}
            aria-pressed={lang === l}
            className={`flex h-8 w-8 items-center justify-center rounded-full text-lg transition-all ${
              lang === l
                ? "bg-foreground text-background shadow-[0_0_12px_rgba(255,255,255,0.15)]"
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
            }`}
          >
            <span aria-hidden="true">{l.toUpperCase()}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        ref={btnRef}
        type="button"
        aria-label={t("nav.language")}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground/10 text-lg text-foreground ring-1 ring-foreground/20 backdrop-blur-md transition-colors hover:bg-foreground/15"
      >
        <span aria-hidden="true">{lang.toUpperCase()}</span>
      </button>

      {open &&
        pos &&
        typeof document !== "undefined" &&
        createPortal(
          <ul
            role="listbox"
            onMouseDown={(e) => e.stopPropagation()}
            style={{
              top: pos.top,
              right: pos.right,
              zIndex: 2147483647,
              background: "oklch(0.11 0 0)",
              boxShadow:
                "0 0 0 1px oklch(1 0 0 / 0.16), 0 24px 70px -12px oklch(0 0 0 / 0.9)",
            }}
            className="fixed w-44 overflow-hidden rounded-2xl p-1 backdrop-blur-2xl"
          >
            {LANGS.map((l) => (
              <li key={l}>
                <button
                  role="option"
                  aria-selected={lang === l}
                  onClick={() => {
                    setLang(l);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors ${
                    lang === l
                      ? "bg-white/10 text-foreground"
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    {LANG_NAMES[l]}
                  </span>
                  {lang === l && <Check size={14} weight="bold" />}
                </button>
              </li>
            ))}
          </ul>,
          document.body,
        )}
    </div>
  );
}
