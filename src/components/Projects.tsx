import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "@phosphor-icons/react";
import p1 from "@/assets/project-1.jpg";
import p2 from "@/assets/project-2.jpg";
import p3 from "@/assets/project-3.jpg";
import p4 from "@/assets/project-4.jpg";
import p5 from "@/assets/project-5.jpg";
import p6 from "@/assets/project-6.jpg";

const projects = [
  { img: p1, title: "Nebula Analytics", desc: "Realtime data dashboard with live streaming charts.", tech: ["React", "D3", "WS"] },
  { img: p2, title: "Aurora Commerce", desc: "Headless storefront with instant checkout flow.", tech: ["Next", "Stripe"] },
  { img: p3, title: "Synth AI", desc: "Conversational assistant with streaming responses.", tech: ["React", "LLM"] },
  { img: p4, title: "Pulse Audio", desc: "Music player with WebAudio reactive visualizer.", tech: ["TS", "WebAudio"] },
  { img: p5, title: "Vertex Trade", desc: "Crypto terminal with sub-second order books.", tech: ["React", "Rust"] },
  { img: p6, title: "Orbit Folio", desc: "3D portfolio template with GSAP scroll scenes.", tech: ["Three", "GSAP"] },
];

export default function Projects() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".proj-head > *",
        { opacity: 0, y: 40, filter: "blur(10px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 80%" },
        },
      );
      gsap.fromTo(
        ".proj-card",
        { opacity: 0, y: 60, scale: 0.94 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".proj-track", start: "top 85%" },
        },
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="projects" ref={root} className="relative py-28">
      <div className="pointer-events-none absolute top-1/3 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-neon-violet/15 blur-[130px]" />
      <div className="mx-auto max-w-6xl px-6">
        <div className="proj-head max-w-xl">
          <span className="text-xs tracking-[0.3em] text-accent uppercase">Selected work</span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Projects that <span className="text-gradient">move</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            A snapshot of recent builds — swipe horizontally to explore.
          </p>
        </div>
      </div>

      <div className="proj-track mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-6 [scrollbar-width:none] lg:mx-auto lg:max-w-6xl">
        {projects.map((p) => (
          <article
            key={p.title}
            className="proj-card group relative w-[82vw] shrink-0 snap-center overflow-hidden rounded-3xl glass transition-all duration-500 hover:-translate-y-2 hover:glow-ring sm:w-[380px]"
          >
            <img
              src={p.img}
              alt={`${p.title} project preview`}
              width={1024}
              height={768}
              loading="lazy"
              className="h-52 w-full object-cover opacity-85 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
            />
            <div className="p-6">
              <h3 className="text-lg font-medium">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {p.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border px-3 py-1 text-[11px] text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <a
                href="#contact"
                className="mt-6 inline-flex items-center gap-1.5 text-sm text-accent transition-all hover:gap-3"
              >
                View case study <ArrowUpRight size={16} weight="light" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
