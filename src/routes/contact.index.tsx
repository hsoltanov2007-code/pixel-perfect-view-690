import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { PaperPlaneTilt } from "@phosphor-icons/react";
import { MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { createThread } from "@/lib/chat.functions";

export const Route = createFileRoute("/contact/")({
  component: ContactIndex,
});

function ContactIndex() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const createThreadFn = useServerFn(createThread);

  const startChat = async () => {
    console.log("startChat clicked");
    try {
      const id = await createThreadFn({ data: { title: "Live chat" } });
      console.log("thread created", id);
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
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6 py-20">
      <div className="mx-auto w-full max-w-2xl text-center">
        <span className="text-xs tracking-[0.3em] text-accent uppercase">
          Contact
        </span>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          Need help with an{" "}
          <span className="text-gradient">order?</span>
        </h1>
        <p className="mt-4 text-muted-foreground">
          Send us a message or start a live chat with our AI assistant. We
          reply instantly.
        </p>

        <form onSubmit={onSubmit} className="mt-10 space-y-4 text-left">
          <input
            required
            name="name"
            placeholder="Your name"
            className="field-glass"
          />
          <input
            required
            type="email"
            name="email"
            placeholder="Email address"
            className="field-glass"
          />
          <textarea
            required
            name="message"
            rows={5}
            placeholder="Which subscription are you interested in?"
            className="field-glass resize-none"
          />
          <button type="submit" className="btn-neon w-full">
            Send message
            <PaperPlaneTilt size={17} weight="light" />
          </button>
        </form>

        <div className="mt-8">
          <button
            type="button"
            onClick={startChat}
            className="btn-ghost-neon inline-flex items-center gap-2"
          >
            <MessageCircle size={18} />
            Start live chat
          </button>
        </div>
      </div>
    </div>
  );
}
