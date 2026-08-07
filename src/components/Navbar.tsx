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
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <nav className="mx-auto mt-4 flex max-w-6xl items-center justify-between rounded-full px-5 py-3 glass sm:px-7">
        <a href="#home" className="text-lg font-semibold tracking-tight text-gradient">
          2G SHOP
        </a>
        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a href="#plans" className="hidden btn-neon !px-5 !py-2 !text-sm md:inline-flex">
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
