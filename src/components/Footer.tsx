import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GithubLogo, LinkedinLogo } from "@phosphor-icons/react";

export default function Footer() {
  const root = useRef<HTMLElement>(null);

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
        <span className="text-lg font-semibold text-gradient">Milad</span>
        <nav className="flex gap-6 text-sm text-muted-foreground">
          <a href="#home" className="transition-colors hover:text-foreground">Home</a>
          <a href="#about" className="transition-colors hover:text-foreground">About</a>
          <a href="#projects" className="transition-colors hover:text-foreground">Projects</a>
          <a href="#contact" className="transition-colors hover:text-foreground">Contact</a>
        </nav>
        <div className="flex gap-3">
          <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub" className="rounded-full p-2 glass transition-colors hover:text-accent">
            <GithubLogo size={18} weight="light" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="rounded-full p-2 glass transition-colors hover:text-accent">
            <LinkedinLogo size={18} weight="light" />
          </a>
        </div>
      </div>
      <p className="relative mt-8 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} Milad. Crafted with GSAP.
      </p>
    </footer>
  );
}
