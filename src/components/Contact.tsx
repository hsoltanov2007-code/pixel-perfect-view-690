import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GithubLogo, LinkedinLogo, PaperPlaneTilt } from "@phosphor-icons/react";
import { toast } from "sonner";

export default function Contact() {
  const root = useRef<HTMLElement>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".contact-field",
        { opacity: 0, x: -50, filter: "blur(10px)" },
        {
          opacity: 1,
          x: 0,
          filter: "blur(0px)",
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 78%" },
        },
      );
      gsap.to(".contact-submit", {
        scale: 1.03,
        duration: 1.6,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    gsap.fromTo(".contact-submit", { scale: 0.94 }, { scale: 1, duration: 0.5, ease: "back.out(3)" });
    setTimeout(() => {
      setSending(false);
      toast.success("Message sent — I'll get back to you soon.");
      (e.target as HTMLFormElement).reset();
    }, 800);
  };

  return (
    <section id="contact" ref={root} className="relative py-28">
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-primary/15 blur-[140px]" />
      <div className="mx-auto max-w-2xl px-6 text-center">
        <span className="contact-field text-xs tracking-[0.3em] text-accent uppercase">
          Contact
        </span>
        <h2 className="contact-field mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Need help with an <span className="text-gradient">order?</span>
        </h2>

        <form onSubmit={onSubmit} className="mt-10 space-y-4 text-left">
          <input
            required
            name="name"
            placeholder="Your name"
            className="contact-field field-glass focus:border-primary focus:glow-ring"
          />
          <input
            required
            type="email"
            name="email"
            placeholder="Email address"
            className="contact-field field-glass focus:border-primary focus:glow-ring"
          />
          <textarea
            required
            name="message"
            rows={5}
            placeholder="Tell me about your project"
            className="contact-field field-glass resize-none focus:border-primary focus:glow-ring"
          />
          <button type="submit" disabled={sending} className="contact-submit btn-neon w-full">
            {sending ? "Sending..." : "Send message"}
            <PaperPlaneTilt size={17} weight="light" />
          </button>
        </form>

        <div className="mt-10 flex justify-center gap-4">
          {[
            { Icon: GithubLogo, href: "https://github.com", label: "GitHub" },
            { Icon: LinkedinLogo, href: "https://linkedin.com", label: "LinkedIn" },
          ].map(({ Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="rounded-full p-3 glass transition-all duration-300 hover:-translate-y-1 hover:text-accent hover:glow-ring"
            >
              <Icon size={20} weight="light" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
