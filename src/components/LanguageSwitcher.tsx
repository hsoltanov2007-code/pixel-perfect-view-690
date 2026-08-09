import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Globe, Check } from "@phosphor-icons/react";
import { LANGS, LANG_LABELS, LANG_NAMES, useI18n } from "@/lib/i18n";

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
            aria-pressed={lang === l}
            className={`rounded-full px-3 py-1 text-xs font-medium tracking-wide transition-colors ${
              lang === l
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {LANG_LABELS[l]}
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
        className="flex items-center gap-1.5 rounded-full bg-foreground/10 px-3 py-2 text-xs font-medium text-foreground ring-1 ring-foreground/20 backdrop-blur-md transition-colors hover:bg-foreground/15"
      >
        <Globe size={16} weight="light" />
        {LANG_LABELS[lang]}
      </button>

      {open &&
        pos &&
        typeof document !== "undefined" &&
        createPortal(
          <ul
            role="listbox"
            onMouseDown={(e) => e.stopPropagation()}
            style={{ top: pos.top, right: pos.right }}
            className="fixed z-[999] w-40 overflow-hidden rounded-2xl border border-white/10 bg-[oklch(0.09_0_0/0.96)] p-1 shadow-[0_20px_60px_-20px_oklch(0_0_0/0.8)] backdrop-blur-2xl"
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
                  {LANG_NAMES[l]}
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
