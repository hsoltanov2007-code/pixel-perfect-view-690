import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Lightning, ShieldCheck, Headset } from "@phosphor-icons/react";

const features = [
  { icon: Lightning, label: "Instant delivery" },
  { icon: ShieldCheck, label: "Warranty" },
  { icon: Headset, label: "24/7 support" },
];

export default function Why() {
  const root = useRef<HTMLElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".why-visual",
        { opacity: 0, scale: 0.85, filter: "blur(14px)" },
        {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 78%" },
        },
      );
      gsap.fromTo(
        ".why-copy > *",
        { opacity: 0, y: 30, filter: "blur(8px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 72%" },
        },
      );
      gsap.fromTo(
        ".why-chip",
        { opacity: 0, y: 20, scale: 0.92 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.55,
          stagger: 0.06,
          ease: "power3.out",
          scrollTrigger: { trigger: ".why-grid", start: "top 88%" },
        },
      );
    }, root);
    return () => ctx.revert();
  }, []);

  // Mouse-reactive parallax on the orb: keeps the Spline "looking at" the cursor
  // without allowing native zoom/pan interactions.
  useEffect(() => {
    const orb = orbRef.current;
    if (!orb) return;
    let frame = 0;
    let rx = 0;
    let ry = 0;
    const inner = orb.querySelector(".why-orb-inner") as HTMLElement | null;
    const apply = () => {
      frame = 0;
      if (inner) {
        inner.style.transform = `perspective(600px) rotateX(${ry}deg) rotateY(${rx}deg) translate3d(0,0,0)`;
      }
    };
    const onMove = (e: MouseEvent) => {
      const rect = orb.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      rx = ((e.clientX - cx) / (window.innerWidth / 2)) * 8;
      ry = ((e.clientY - cy) / (window.innerHeight / 2)) * -8;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section id="why" ref={root} className="relative py-24">
      <div className="mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
        <div
          ref={orbRef}
          className="why-visual relative h-64 w-64 overflow-hidden rounded-full border border-foreground/10 bg-foreground/[0.03] shadow-[0_0_80px_-30px_hsl(0_0%_100%_/0.15)]"
        >
          <div className="why-orb-inner absolute inset-0 transition-transform duration-200 ease-out will-change-transform">
            <iframe
              src="https://my.spline.design/voiceinteractionanimation-1gYdkk8IoM6Ts9W1i4oTC43k/"
              frameBorder={0}
              title="2G interaction"
              tabIndex={-1}
              scrolling="no"
              className="pointer-events-auto absolute left-1/2 top-1/2 h-[190%] w-[190%] -translate-x-1/2 -translate-y-[46%] border-0"
            />
          </div>
          {/* Masks the Spline watermark badge */}
          <div className="pointer-events-none absolute right-0 bottom-0 h-16 w-28 bg-[radial-gradient(ellipse_at_bottom_right,var(--background)_55%,transparent_85%)]" />
        </div>



        <div className="why-copy mt-10">
          <span className="text-[11px] tracking-[0.25em] text-accent uppercase">Why 2G SHOP</span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Digital goods, <span className="text-gradient">zero waiting</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            Premium subscriptions and keys, delivered instantly with warranty and real support.
          </p>
        </div>

        <div className="why-grid mt-10 flex flex-wrap justify-center gap-3">
          {features.map((s) => (
            <div
              key={s.label}
              className="why-chip flex items-center gap-2.5 rounded-full border border-border/60 bg-card/60 px-5 py-2.5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/20"
            >
              <s.icon size={18} weight="light" className="text-accent" />
              <span className="text-xs font-medium text-foreground/80">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
