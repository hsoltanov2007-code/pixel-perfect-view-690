import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { PlusIcon, MessageSquareIcon, HeadsetIcon } from "lucide-react";
import { toast } from "sonner";
import { getThreads, createThread } from "@/lib/chat.functions";
import Footer from "@/components/Footer";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — 2G SHOP" },
      {
        name: "description",
        content:
          "Get in touch with 2G SHOP. Send a message or start a live AI chat for instant support with your order.",
      },
      { property: "og:title", content: "Contact — 2G SHOP" },
      {
        property: "og:description",
        content:
          "Get in touch with 2G SHOP. Send a message or start a live AI chat for instant support.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactLayout,
});

function ContactLayout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: threads = [] } = useQuery({
    queryKey: ["chat_threads"],
    queryFn: () => getThreads(),
  });
  const createThreadFn = useServerFn(createThread);

  const startNewChat = async () => {
    console.log("sidebar startNewChat clicked");
    try {
      const id = await createThreadFn({ data: { title: "Live chat" } });
      console.log("sidebar thread created", id);
      queryClient.invalidateQueries({ queryKey: ["chat_threads"] });
      navigate({ to: "/contact/$threadId", params: { threadId: id } });
    } catch (error) {
      console.error("sidebar startNewChat failed:", error);
      toast.error("Could not start chat. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col md:flex-row">
        <aside className="hidden w-72 flex-col border-r border-border bg-card/30 p-5 md:flex">
          <Link
            to="/contact"
            className="text-xl font-semibold tracking-tight text-gradient"
          >
            2G SHOP
          </Link>
          <p className="mt-1 text-xs text-muted-foreground">Support center</p>

          <button
            type="button"
            onClick={startNewChat}
            className="btn-neon mt-6 inline-flex w-full items-center justify-center gap-2 !py-2.5 text-sm"
          >
            <PlusIcon size={16} />
            New live chat
          </button>

          <div className="mt-6 flex-1 space-y-1 overflow-auto">
            {threads.map((thread) => (
              <Link
                key={thread.id}
                to="/contact/$threadId"
                params={{ threadId: thread.id }}
                activeProps={{ className: "bg-primary/10 text-foreground" }}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-primary/5 hover:text-foreground"
              >
                <MessageSquareIcon size={15} />
                <span className="truncate">{thread.title || "Chat"}</span>
                {thread.status === "needs_operator" && (
                  <HeadsetIcon size={13} className="ml-auto text-accent" />
                )}
              </Link>
            ))}
          </div>
        </aside>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}
