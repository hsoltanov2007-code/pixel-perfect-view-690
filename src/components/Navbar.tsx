import { useEffect, useState } from "react";
import { List, X } from "@phosphor-icons/react";

const links = [
  { label: "Home", href: "#home" },
  { label: "Plans", href: "#plans" },
  { label: "Why us", href: "#why" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const heroHeight = window.innerHeight * 0.5;
      setVisible(window.scrollY > heroHeight);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      {/* light beam rising out of the bot */}
      <div
        aria-hidden
        className={`absolute left-1/2 top-0 h-40 w-px -translate-x-1/2 bg-gradient-to-b from-foreground/50 to-transparent transition-all duration-700 ease-out ${
          visible ? "opacity-0 scale-y-0" : "opacity-0"
        }`}
      />
      <div
        className={`px-4 transition-[transform,opacity] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          visible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
        }`}
      >
        <nav
          className={`pointer-events-auto mx-auto mt-4 flex max-w-6xl origin-top items-center justify-between overflow-hidden rounded-full px-5 py-3 glass transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-7 ${
            visible
              ? "scale-x-100 opacity-100 blur-0"
              : "scale-x-[0.12] opacity-0 blur-[2px]"
          }`}
          style={{
            clipPath: visible ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)",
            transitionDelay: visible ? "120ms" : "0ms",
          }}
        >
          <a href="#home" className="text-lg font-semibold tracking-tight text-gradient">
            2G SHOP
          </a>
          <ul className="hidden items-center gap-8 md:flex">
            {links.map((l, i) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className={`text-sm text-muted-foreground transition-all duration-500 hover:text-foreground ${
                    visible ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
                  }`}
                  style={{ transitionDelay: visible ? `${350 + i * 70}ms` : "0ms" }}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#plans"
            className={`hidden btn-neon !px-5 !py-2 !text-sm transition-all duration-500 md:inline-flex ${
              visible ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
            }`}
            style={{ transitionDelay: visible ? "620ms" : "0ms" }}
          >
            Shop now
          </a>
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="rounded-full p-2 text-foreground md:hidden"
          >
            {open ? <X size={22} weight="light" /> : <List size={22} weight="light" />}
          </button>
        </nav>
      </div>


      <div
        className={`fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-background/95 backdrop-blur-xl transition-transform duration-500 md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            className="text-2xl font-light text-foreground"
          >
            {l.label}
          </a>
        ))}
        <a href="#plans" onClick={() => setOpen(false)} className="btn-neon mt-4">
          Shop now
        </a>
      </div>
    </header>
  );
}
