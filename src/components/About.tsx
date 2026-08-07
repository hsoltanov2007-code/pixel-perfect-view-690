import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FileHtml,
  FileCss,
  FileJs,
  Atom,
  Lightning,
  Sparkle,
} from "@phosphor-icons/react";
import profile from "@/assets/profile.jpg";

const skills = [
  { icon: FileHtml, label: "HTML" },
  { icon: FileCss, label: "CSS" },
  { icon: FileJs, label: "JavaScript" },
  { icon: Atom, label: "React" },
  { icon: Lightning, label: "GSAP" },
  { icon: Sparkle, label: "Three.js" },
];

export default function About() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".about-img",
        { opacity: 0, x: -80, filter: "blur(12px)" },
        {
          opacity: 1,
          x: 0,
          filter: "blur(0px)",
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 75%" },
        },
      );
      gsap.fromTo(
        ".about-copy > *",
        { opacity: 0, y: 40, filter: "blur(10px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 75%" },
        },
      );
      gsap.fromTo(
        ".skill-chip",
        { opacity: 0, y: 24, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: "back.out(1.6)",
          scrollTrigger: { trigger: ".skill-grid", start: "top 85%" },
        },
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={root} className="relative py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 md:grid-cols-[320px_1fr]">
        <div className="about-img group relative mx-auto">
          <div className="absolute -inset-4 rounded-full bg-primary/25 blur-3xl transition-all duration-500 group-hover:bg-primary/40" />
          <img
            src={profile}
            alt="Portrait of Milad, web developer"
            width={768}
            height={768}
            loading="lazy"
            className="relative h-60 w-60 rounded-full object-cover ring-2 ring-primary/40 transition-transform duration-500 group-hover:-translate-y-2 group-hover:rotate-3 sm:h-72 sm:w-72 glow-ring"
          />
        </div>

        <div className="about-copy">
          <span className="text-xs tracking-[0.3em] text-accent uppercase">About me</span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Building the web&rsquo;s <span className="text-gradient">next layer</span>
          </h2>
          <p className="mt-5 max-w-xl leading-relaxed text-muted-foreground">
            I&rsquo;m a front-end developer specialising in motion-rich interfaces. For the past
            six years I&rsquo;ve shipped products where design, performance and interaction meet —
            from 3D landing experiences to complex dashboards.
          </p>
          <div className="skill-grid mt-9 grid grid-cols-3 gap-3 sm:grid-cols-6">
            {skills.map((s) => (
              <div
                key={s.label}
                className="skill-chip flex flex-col items-center gap-2 rounded-2xl px-2 py-4 glass transition-all duration-300 hover:-translate-y-1 hover:glow-ring"
              >
                <s.icon size={26} weight="light" className="text-accent" />
                <span className="text-[11px] text-muted-foreground">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
