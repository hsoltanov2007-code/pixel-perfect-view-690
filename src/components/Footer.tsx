import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TelegramLogo, InstagramLogo } from "@phosphor-icons/react";
import { useI18n } from "@/lib/i18n";
import { legalLabels } from "@/lib/legal";
import { getPublicContacts } from "@/lib/shop.functions";
import LanguageSwitcher from "@/components/LanguageSwitcher";

function socialHref(value: string | undefined, base: string, fallback: string) {
  const v = (value ?? "").trim();
  if (!v) return fallback;
  if (/^https?:\/\//i.test(v)) return v;
  return base + v.replace(/^@/, "");
}

export default function Footer() {
  const { t, lang } = useI18n();
  const root = useRef<HTMLElement>(null);
  const { data: contacts } = useQuery({
    queryKey: ["public-contacts"],
    queryFn: () => getPublicContacts(),
    staleTime: 5 * 60 * 1000,
  });
  const tgHref = socialHref(
    contacts?.footer_telegram || contacts?.telegram,
    "https://t.me/",
    "https://t.me",
  );
  const igHref = socialHref(
    contacts?.footer_instagram || contacts?.instagram,
    "https://instagram.com/",
    "https://instagram.com",
  );

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".footer-inner",
        { opacity: 0, y: 60, filter: "blur(10px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 92%" },
        },
      );
      gsap.to(".particle", {
        y: -18,
        opacity: 0.8,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        stagger: { each: 0.3, from: "random" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <footer ref={root} className="relative overflow-hidden border-t border-border py-12">
      {Array.from({ length: 14 }).map((_, i) => (
        <span
          key={i}
          className="particle pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-accent/40 blur-[1px]"
          style={{ left: `${(i * 7 + 4) % 100}%`, top: `${(i * 23) % 90}%` }}
        />
      ))}
      <div className="footer-inner relative mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 sm:flex-row sm:justify-between">
        <span className="text-lg font-semibold text-gradient">2G SHOP</span>
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <a href="/#home" className="transition-colors hover:text-foreground">{t("nav.home")}</a>
          <Link to="/catalog" className="transition-colors hover:text-foreground">{t("nav.catalog")}</Link>
          <Link to="/contact" className="transition-colors hover:text-foreground">{t("nav.contact")}</Link>
          <Link to="/privacy" className="transition-colors hover:text-foreground">{legalLabels[lang].privacy}</Link>
          <Link to="/terms" className="transition-colors hover:text-foreground">{legalLabels[lang].terms}</Link>
          <Link to="/refund" className="transition-colors hover:text-foreground">{legalLabels[lang].refund}</Link>
        </nav>
        <div className="flex items-center gap-3">
          <LanguageSwitcher compact />
          <a href={tgHref} target="_blank" rel="noreferrer" aria-label="Telegram" className="rounded-full p-2 glass transition-colors hover:text-accent">
            <TelegramLogo size={18} weight="light" />
          </a>
          <a href={igHref} target="_blank" rel="noreferrer" aria-label="Instagram" className="rounded-full p-2 glass transition-colors hover:text-accent">
            <InstagramLogo size={18} weight="light" />
          </a>
        </div>
      </div>
      <p className="relative mt-8 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} 2G SHOP. {t("footer.rights")}
      </p>
    </footer>
  );
}
