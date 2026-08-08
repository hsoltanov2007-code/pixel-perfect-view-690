import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  PaperPlaneTilt,
  ChatTeardropText,
  Headset,
  Envelope,
  User,
  WhatsappLogo,
  TelegramLogo,
  InstagramLogo,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { createThread, getOperatorStatus } from "@/lib/chat.functions";

export const Route = createFileRoute("/contact/")({
  component: ContactIndex,
});

function ContactIndex() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const createThreadFn = useServerFn(createThread);
  const getStatusFn = useServerFn(getOperatorStatus);
  const root = useRef<HTMLDivElement>(null);

  const { data: statusData } = useQuery({
    queryKey: ["operator_status"],
    queryFn: () => getStatusFn(),
    refetchInterval: 30000,
  });
  const isOperatorOnline = statusData?.online ?? false;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".contact-hero",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 80%" },
        }
      );
      gsap.fromTo(
        ".contact-card",
        { opacity: 0, y: 60, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: ".contact-grid", start: "top 80%" },
        }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  const startChat = async () => {
    if (!isOperatorOnline) return;
    try {
      const id = await createThreadFn({ data: { title: "Live chat" } });
      queryClient.invalidateQueries({ queryKey: ["chat_threads"] });
      navigate({ to: "/contact/$threadId", params: { threadId: id } });
    } catch (error) {
      console.error("Failed to start chat:", error);
      toast.error("Could not start chat. Please try again.");
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Message sent — we'll get back to you soon.");
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div
      ref={root}
      className="relative min-h-[calc(100vh-4rem)] overflow-hidden px-6 py-16 md:py-24"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,oklch(1_0_0/0.08),transparent_50%)]" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-foreground/5 blur-[140px]" />

      <div className="contact-hero relative mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-glass px-4 py-1.5 text-xs tracking-[0.2em] text-accent uppercase">
          <Headset size={14} weight="light" />
          Support center
        </span>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
          How can we <span className="text-gradient">help?</span>
        </h1>
        <p className="mt-4 text-base text-muted-foreground md:text-lg">
          Choose the fastest way to reach us. Send a message for non-urgent
          requests or start a live chat when an operator is online.
        </p>
      </div>

      <div className="contact-grid relative mx-auto mt-14 grid max-w-5xl gap-5 md:grid-cols-2">
        {/* Message card */}
        <div className="contact-card group relative flex flex-col rounded-3xl border border-border bg-card/40 p-7 transition-all duration-500 hover:border-foreground/20 hover:bg-card/60 md:p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary transition-colors group-hover:bg-foreground group-hover:text-background">
            <Envelope size={22} weight="light" />
          </div>
          <h2 className="mt-5 text-xl font-medium">Send a message</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Describe your question and we'll reply by email as soon as
            possible.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-3">
            <div className="relative">
              <User
                size={16}
                weight="light"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                required
                name="name"
                placeholder="Your name"
                className="field-glass !pl-11"
              />
            </div>
            <div className="relative">
              <Envelope
                size={16}
                weight="light"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                required
                type="email"
                name="email"
                placeholder="Email address"
                className="field-glass !pl-11"
              />
            </div>
            <textarea
              required
              name="message"
              rows={4}
              placeholder="Which subscription are you interested in?"
              className="field-glass resize-none"
            />
            <button type="submit" className="btn-neon w-full !py-3">
              Send message
              <PaperPlaneTilt size={17} weight="light" />
            </button>
          </form>
        </div>

        {/* Live chat card */}
        <div className="contact-card group relative flex flex-col rounded-3xl border border-border bg-card/40 p-7 transition-all duration-500 hover:border-foreground/20 hover:bg-card/60 md:p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary transition-colors group-hover:bg-foreground group-hover:text-background">
            <ChatTeardropText size={22} weight="light" />
          </div>
          <h2 className="mt-5 text-xl font-medium">Live chat</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Talk with our AI assistant or request a human operator in real time.
          </p>

          <div className="mt-6 flex flex-1 flex-col justify-end">
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-background/50 p-4">
              <span
                className={`relative flex h-3 w-3 rounded-full ${
                  isOperatorOnline ? "bg-emerald-400" : "bg-red-400"
                }`}
              >
                {isOperatorOnline && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                )}
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {isOperatorOnline ? "Operator online" : "Operator offline"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isOperatorOnline
                    ? "Average response time under 2 minutes"
                    : "Live chat is closed. Leave a message and we'll reply soon."}
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled={!isOperatorOnline}
              onClick={startChat}
              className={`btn-neon mt-4 w-full !py-3 transition-all duration-300 ${
                !isOperatorOnline
                  ? "cursor-not-allowed opacity-40 grayscale"
                  : ""
              }`}
            >
              {isOperatorOnline ? (
                <>
                  Start live chat
                  <ChatTeardropText size={17} weight="light" />
                </>
              ) : (
                <>
                  Live chat unavailable
                  <ChatTeardropText size={17} weight="light" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="contact-social relative mx-auto mt-10 max-w-5xl">
        <div className="rounded-3xl border border-border bg-card/40 p-6 md:p-8">
          <div className="flex flex-col items-center justify-between gap-5 md:flex-row">
            <div className="text-center md:text-left">
              <h3 className="text-lg font-medium">Or reach us instantly</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Tap a messenger — we reply fastest on WhatsApp and Telegram.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {[
                {
                  Icon: WhatsappLogo,
                  label: "WhatsApp",
                  href: "https://wa.me/",
                  className: "hover:bg-[#25D366]/20 hover:border-[#25D366]/50 hover:text-[#25D366]",
                },
                {
                  Icon: TelegramLogo,
                  label: "Telegram",
                  href: "https://t.me/",
                  className: "hover:bg-[#2AABEE]/20 hover:border-[#2AABEE]/50 hover:text-[#2AABEE]",
                },
                {
                  Icon: InstagramLogo,
                  label: "Instagram",
                  href: "https://instagram.com/",
                  className: "hover:bg-[#E1306C]/20 hover:border-[#E1306C]/50 hover:text-[#E1306C]",
                },
              ].map(({ Icon, label, href, className }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className={`group inline-flex items-center gap-2 rounded-full border border-border bg-background/50 px-5 py-2.5 text-sm font-medium text-foreground backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-card/80 ${className}`}
                >
                  <Icon size={18} weight="fill" className="transition-transform duration-300 group-hover:scale-110" />
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="relative mt-8 text-center text-xs text-muted-foreground">
        Typical email reply time: within 24 hours.
      </p>
    </div>
  );
}
