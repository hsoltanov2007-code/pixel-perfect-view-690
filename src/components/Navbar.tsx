import { useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { List, X, ShoppingBag } from "@phosphor-icons/react";
import { useCart } from "@/lib/cart";
import { useI18n } from "@/lib/i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const links = [
  { key: "nav.home", id: "home", href: "#home" },
  { key: "nav.catalog", id: "catalog", href: "/catalog" },
  { key: "nav.contact", id: "contact", href: "/contact" },
];

function blockKeyNav(e: React.KeyboardEvent) {
  if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
    e.preventDefault();
    e.stopPropagation();
  }
}

export default function Navbar({ alwaysVisible = false }: { alwaysVisible?: boolean }) {
  const { pathname } = useLocation();
  const { count, setOpen: setCartOpen } = useCart();
  const { t } = useI18n();
  const isHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(alwaysVisible);

  useEffect(() => {
    if (alwaysVisible) {
      setVisible(true);
      return;
    }
    let frame = 0;
    const apply = () => {
      frame = 0;
      const heroHeight = window.innerHeight * 0.5;
      setVisible(window.scrollY > heroHeight);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [alwaysVisible]);


  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">

      {/* light beam rising out of the bot */}
      <div
        aria-hidden
        className={`absolute left-1/2 top-0 h-32 w-px origin-bottom -translate-x-1/2 bg-gradient-to-b from-transparent via-foreground/50 to-transparent transition-all duration-700 ease-out ${
          visible ? "scale-y-100 opacity-60" : "scale-y-0 opacity-0"
        }`}
      />

      <div
        className={`px-4 transition-[transform,opacity] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          visible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
        }`}
      >
        <nav
          className={`pointer-events-auto mx-auto mt-4 flex max-w-6xl origin-top items-center justify-between overflow-hidden rounded-full border border-border/80 bg-background/95 px-5 py-3 shadow-glow backdrop-blur-2xl transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-7 ${
            visible
              ? "scale-x-100 opacity-100 blur-0"
              : "scale-x-[0.12] opacity-0 blur-[2px]"
          }`}
          style={{
            clipPath: visible ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)",
            transitionDelay: visible ? "120ms" : "0ms",
          }}
        >
          {isHome ? (
            <span
              aria-disabled="true"
              tabIndex={-1}
              onKeyDown={blockKeyNav}
              className="cursor-default text-lg font-semibold tracking-tight text-gradient"
            >
              2G SHOP
            </span>
          ) : (
            <Link
              to="/"
              className="text-lg font-semibold tracking-tight text-gradient"
            >
              2G SHOP
            </Link>
          )}

          <ul className="hidden items-center gap-8 md:flex">
            {links.map((l, i) => (
              <li key={l.href}>
                {l.href === "/contact" || l.href === "/catalog" ? (
                  <Link
                    to={l.href}
                    className={`text-sm text-muted-foreground transition-all duration-500 hover:text-foreground ${
                      visible ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
                    }`}
                    style={{ transitionDelay: visible ? `${350 + i * 70}ms` : "0ms" }}
                  >
                    {t(l.key)}
                  </Link>
                ) : l.id === "home" && isHome ? (

                  <span
                    aria-disabled="true"
                    tabIndex={-1}
                    onKeyDown={blockKeyNav}
                    className={`cursor-default text-sm text-foreground transition-all duration-500 ${
                      visible ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
                    }`}
                    style={{ transitionDelay: visible ? `${350 + i * 70}ms` : "0ms" }}
                  >
                    {t(l.key)}
                  </span>
                ) : l.id === "home" ? (
                  <Link
                    to="/"
                    className={`text-sm text-muted-foreground transition-all duration-500 hover:text-foreground ${
                      visible ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
                    }`}
                    style={{ transitionDelay: visible ? `${350 + i * 70}ms` : "0ms" }}
                  >
                    {t(l.key)}
                  </Link>
                ) : (
                  <a
                    href={alwaysVisible && l.href.startsWith("#") ? `/${l.href}` : l.href}
                    className={`text-sm text-muted-foreground transition-all duration-500 hover:text-foreground ${
                      visible ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
                    }`}
                    style={{ transitionDelay: visible ? `${350 + i * 70}ms` : "0ms" }}
                  >
                    {t(l.key)}
                  </a>
                )}

              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <div
              className={`transition-all duration-500 ${
                visible ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
              }`}
              style={{ transitionDelay: visible ? "500ms" : "0ms" }}
            >
              <LanguageSwitcher compact />
            </div>
            <button
              aria-label={t("nav.openCart")}
              onClick={() => setCartOpen(true)}
              className={`relative rounded-full bg-foreground/10 p-2 text-foreground ring-1 ring-foreground/20 backdrop-blur-md transition-all duration-500 ${
                visible ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
              }`}
              style={{ transitionDelay: visible ? "560ms" : "0ms" }}
            >
              <ShoppingBag size={20} weight="light" />
              {count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-semibold text-background">
                  {count}
                </span>
              )}
            </button>
            <Link
              to="/catalog"
              className={`hidden btn-neon !px-5 !py-2 !text-sm transition-all duration-500 md:inline-flex ${
                visible ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
              }`}
              style={{ transitionDelay: visible ? "620ms" : "0ms" }}
            >
              {t("nav.shopNow")}
            </Link>
          </div>
          <button
            aria-label={t("nav.toggleMenu")}
            onClick={() => setOpen((v) => !v)}
            className="rounded-full bg-foreground/10 p-2 text-foreground ring-1 ring-foreground/20 backdrop-blur-md md:hidden"
          >
            {open ? <X size={22} weight="light" /> : <List size={22} weight="light" />}
          </button>
        </nav>
      </div>


      <div
        className={`pointer-events-auto absolute right-4 top-full z-40 mt-3 w-56 origin-top-right rounded-2xl p-2 transition-all duration-300 md:hidden ${
          open ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 -translate-y-2 pointer-events-none"
        }`}
        style={{
          background: "oklch(0.09 0 0 / 80%)",
          backdropFilter: "blur(22px)",
          WebkitBackdropFilter: "blur(22px)",
          border: "1px solid oklch(1 0 0 / 18%)",
          boxShadow: "0 18px 50px -12px oklch(0 0 0 / 0.5)",
        }}
      >
        <ul className="flex flex-col gap-1">
          {links.map((l) =>
            l.href === "/contact" || l.href === "/catalog" ? (
              <li key={l.href}>
                <Link
                  to={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-foreground/10"
                >
                  {t(l.key)}
                </Link>
              </li>
            ) : l.id === "home" && isHome ? (
              <li key={l.href}>
                <span
                  aria-disabled="true"
                  tabIndex={-1}
                  onKeyDown={blockKeyNav}
                  className="block cursor-default rounded-xl px-4 py-3 text-sm font-medium text-foreground/50"
                >
                  {t(l.key)}
                </span>
              </li>
            ) : l.id === "home" ? (
              <li key={l.href}>
                <Link
                  to="/"
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-foreground/10"
                >
                  {t(l.key)}
                </Link>
              </li>
            ) : (
              <li key={l.href}>
                <a
                  href={alwaysVisible && l.href.startsWith("#") ? `/${l.href}` : l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-foreground/10"
                >
                  {t(l.key)}
                </a>
              </li>
            )
          )}
          <li className="border-t border-foreground/10 pt-1">
            <Link
              to="/catalog"
              onClick={() => setOpen(false)}
              className="block rounded-xl px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-foreground/10"
            >
              {t("nav.shopNow")}
            </Link>
          </li>
        </ul>
        <div className="mt-1 border-t border-foreground/10 px-3 py-2">
          <LanguageSwitcher compact />
        </div>
      </div>
    </header>
  );
}
