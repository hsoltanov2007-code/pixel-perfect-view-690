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
          { opacity: 0, x: 120, filter: "blur(16px)" },
          { opacity: 1, x: 0, filter: "blur(0px)", duration: 1.4 },
          "-=1",
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
      className="hero-bg relative flex min-h-screen items-center overflow-hidden pt-28 pb-16"
    >
      <div className="glow-orb pointer-events-none absolute top-24 left-[8%] h-56 w-56 rounded-full bg-primary/25 blur-[90px]" />
      <div className="glow-orb pointer-events-none absolute right-[12%] bottom-24 h-72 w-72 rounded-full bg-accent/20 blur-[110px]" />
      <div className="glow-orb pointer-events-none absolute top-1/2 left-1/2 h-64 w-64 rounded-full bg-neon-violet/20 blur-[120px]" />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 px-6 lg:grid-cols-2">
        <div>
          <span className="hero-line inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs tracking-[0.2em] text-muted-foreground uppercase glass">
            Available for work
          </span>
          <h1 className="hero-line mt-6 text-4xl leading-[1.05] font-semibold tracking-tight sm:text-6xl lg:text-7xl">
            Hi, I&rsquo;m <span className="text-gradient">Milad</span>
            <br />
            Web Developer
          </h1>
          <p className="hero-line mt-6 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
            I craft immersive, high-performance web experiences with motion, 3D and obsessive
            attention to detail.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <a
              href="#contact"
              className="hero-cta btn-neon hover:-translate-y-0.5 hover:scale-[1.04] glow-strong"
            >
              Hire Me
            </a>
            <a href="#projects" className="hero-cta btn-ghost-neon hover:-translate-y-0.5">
              View Work <ArrowDown size={16} weight="light" />
            </a>
          </div>
        </div>

        <div className="hero-spline relative h-[380px] w-full overflow-hidden rounded-3xl glass sm:h-[520px]">
          <iframe
            title="3D robot"
            src="https://my.spline.design/nexbotbyaximoriscopycopy-yfZ7bdWYajBxb40GbmUnVyOq/"
            frameBorder="0"
            className="h-full w-full"
            loading="lazy"
          />
          <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-primary/25" />
        </div>
      </div>
    </section>
  );
}
