import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowDown } from "@phosphor-icons/react";

export default function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ready) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        ".hero-line",
        { opacity: 0, y: 50, filter: "blur(10px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, stagger: 0.15 },
      )
        .fromTo(
          ".hero-cta",
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 },
          "-=0.5",
        )
        .fromTo(
          ".hero-spline",
          { opacity: 0, scale: 1.06 },
          { opacity: 1, scale: 1, duration: 1.6 },
          0,
        );

      gsap.to(".glow-orb", {
        y: -24,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        stagger: 0.6,
      });
    }, root);
    return () => ctx.revert();
  }, [ready]);

  return (
    <section
      id="home"
      ref={root}
      className="hero-bg relative flex h-screen min-h-[640px] w-full items-center overflow-hidden"
    >
      <div className="hero-spline absolute inset-0">
        {ready && (
          <iframe
            title="3D robot"
            src="https://my.spline.design/nexbotbyaximoriscopycopy-yfZ7bdWYajBxb40GbmUnVyOq/"
            frameBorder="0"
            className="h-full w-full"
            loading="lazy"
          />
        )}
      </div>
      {/* Softly masks the 3D viewer watermark badge */}
      <div className="pointer-events-none absolute right-0 bottom-0 z-10 h-24 w-64 bg-[radial-gradient(ellipse_at_bottom_right,var(--background)_35%,transparent_75%)] backdrop-blur-md" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/45 to-background/70" />

      {/* Beautiful fade-out into the next section */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-56 bg-gradient-to-b from-transparent via-background/80 to-background" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-px bg-[var(--gradient-line)]" />
      <div className="glow-orb pointer-events-none absolute bottom-[-6rem] left-1/2 z-10 h-64 w-[70%] -translate-x-1/2 rounded-full bg-foreground/10 blur-[120px]" />




      <div className="glow-orb pointer-events-none absolute top-24 left-[8%] h-56 w-56 rounded-full bg-foreground/10 blur-[90px]" />
      <div className="glow-orb pointer-events-none absolute right-[12%] bottom-24 h-72 w-72 rounded-full bg-foreground/10 blur-[110px]" />

      <div className="relative z-30 mx-auto w-full max-w-6xl px-6 pb-8 pt-24 text-center pointer-events-none">
        <span className="hero-line inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] tracking-[0.3em] text-muted-foreground uppercase glass">
          Instant digital delivery
        </span>
        <h1 className="hero-line mx-auto mt-4 max-w-3xl text-3xl leading-[1.05] font-semibold tracking-tight sm:text-5xl lg:text-6xl">
          <span className="text-gradient">2G SHOP</span>
          <br />
          Premium subscriptions online
        </h1>
        <p className="hero-line mx-auto mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
          Streaming, music, gaming, AI and VPN subscriptions at the best prices — delivered in
          minutes, with warranty and 24/7 support.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <a
            href="#plans"
            className="hero-cta btn-neon px-5 py-2.5 text-sm hover:-translate-y-0.5 hover:scale-[1.04] glow-strong pointer-events-auto"
          >
            Shop now
          </a>
          <a href="#why" className="hero-cta btn-ghost-neon px-5 py-2.5 text-sm hover:-translate-y-0.5 pointer-events-auto">
            Why us <ArrowDown size={14} weight="light" />
          </a>
        </div>
      </div>
    </section>
  );
}
