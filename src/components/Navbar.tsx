import { useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { List, X, ShoppingBag } from "@phosphor-icons/react";
import { useCart } from "@/lib/cart";

const links = [
  { label: "Home", href: "#home" },
  { label: "Catalog", href: "/catalog" },
  { label: "Contact", href: "/contact" },
];

function blockKeyNav(e: React.KeyboardEvent) {
  if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
    e.preventDefault();
    e.stopPropagation();
  }
}

export default function Navbar({ alwaysVisible = false }: { alwaysVisible?: boolean }) {
  const { pathname } = useLocation();
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
      {/* top scrim for separation from the 3D background */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-background/80 via-background/40 to-transparent transition-opacity duration-700 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      />

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
          className={`pointer-events-auto mx-auto mt-4 flex max-w-6xl origin-top items-center justify-between overflow-hidden rounded-full px-5 py-3 transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-7 ${
            visible
              ? "scale-x-100 opacity-100 blur-0"
              : "scale-x-[0.12] opacity-0 blur-[2px]"
          }`}
          style={{
            clipPath: visible ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)",
            transitionDelay: visible ? "120ms" : "0ms",
            background: "oklch(0.09 0 0 / 72%)",
            backdropFilter: "blur(22px)",
            WebkitBackdropFilter: "blur(22px)",
            border: "1px solid oklch(1 0 0 / 18%)",
            boxShadow: "0 0 0 1px oklch(1 0 0 / 8%), 0 18px 50px -12px oklch(0 0 0 / 0.5)",
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
                    {l.label}
                  </Link>
                ) : l.label === "Home" && isHome ? (

                  <span
                    aria-disabled="true"
                    tabIndex={-1}
                    onKeyDown={blockKeyNav}
                    className={`cursor-default text-sm text-foreground transition-all duration-500 ${
                      visible ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
                    }`}
                    style={{ transitionDelay: visible ? `${350 + i * 70}ms` : "0ms" }}
                  >
                    {l.label}
                  </span>
                ) : l.label === "Home" ? (
                  <Link
                    to="/"
                    className={`text-sm text-muted-foreground transition-all duration-500 hover:text-foreground ${
                      visible ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
                    }`}
                    style={{ transitionDelay: visible ? `${350 + i * 70}ms` : "0ms" }}
                  >
                    {l.label}
                  </Link>
                ) : (
                  <a
                    href={alwaysVisible && l.href.startsWith("#") ? `/${l.href}` : l.href}
                    className={`text-sm text-muted-foreground transition-all duration-500 hover:text-foreground ${
                      visible ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
                    }`}
                    style={{ transitionDelay: visible ? `${350 + i * 70}ms` : "0ms" }}
                  >
                    {l.label}
                  </a>
                )}

              </li>
            ))}
          </ul>
          <Link
            to="/catalog"
            className={`hidden btn-neon !px-5 !py-2 !text-sm transition-all duration-500 md:inline-flex ${
              visible ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
            }`}
            style={{ transitionDelay: visible ? "620ms" : "0ms" }}
          >
            Shop now
          </Link>
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="rounded-full bg-foreground/10 p-2 text-foreground ring-1 ring-foreground/20 backdrop-blur-md md:hidden"
          >
            {open ? <X size={22} weight="light" /> : <List size={22} weight="light" />}
          </button>
        </nav>
      </div>


      <div
        className={`pointer-events-auto fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-background transition-transform duration-500 md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ background: "oklch(0.09 0 0 / 98%)", backdropFilter: "blur(28px)" }}
      >
        {links.map((l) =>
          l.href === "/contact" || l.href === "/catalog" ? (
            <Link
              key={l.href}
              to={l.href}
              onClick={() => setOpen(false)}
              className="text-2xl font-light text-foreground"
            >
              {l.label}
            </Link>
          ) : l.label === "Home" && isHome ? (
            <span
              key={l.href}
              aria-disabled="true"
              tabIndex={-1}
              onKeyDown={blockKeyNav}
              className="cursor-default text-2xl font-light text-foreground/50"
            >
              {l.label}
            </span>
          ) : l.label === "Home" ? (
            <Link
              key={l.href}
              to="/"
              onClick={() => setOpen(false)}
              className="text-2xl font-light text-foreground"
            >
              {l.label}
            </Link>
          ) : (
            <a
              key={l.href}
              href={alwaysVisible && l.href.startsWith("#") ? `/${l.href}` : l.href}
              onClick={() => setOpen(false)}
              className="text-2xl font-light text-foreground"
            >
              {l.label}
            </a>
          )
        )}

        <Link to="/catalog" onClick={() => setOpen(false)} className="btn-neon mt-4">
          Shop now
        </Link>
      </div>
    </header>
  );
}
