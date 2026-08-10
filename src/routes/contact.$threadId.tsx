import { createFileRoute, useParams } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { Copy, Check, Headset } from "lucide-react";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
  MessageActions,
  MessageAction,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputSubmit,
  PromptInputFooter,
} from "@/components/ai-elements/prompt-input";
import { getThreadMessages, escalateThread } from "@/lib/chat.functions";

const messagesQueryOptions = (threadId: string) =>
  queryOptions({
    queryKey: ["chat_messages", threadId],
    queryFn: () => getThreadMessages({ data: { threadId } }),
  });

export const Route = createFileRoute("/contact/$threadId")({
  head: () => ({
    meta: [
      { title: "Live chat with support — 2G SHOP" },
      {
        name: "description",
        content:
          "Your private live chat with the 2G SHOP support team — ask about subscriptions, orders, delivery and refunds.",
      },
      { property: "og:title", content: "Live chat with support — 2G SHOP" },
      {
        property: "og:description",
        content:
          "Private live chat with the 2G SHOP support team about your subscription order.",
      },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: async ({ params, context }) => {
    await context.queryClient.ensureQueryData(
      messagesQueryOptions(params.threadId)
    );
    return { threadId: params.threadId };
  },
  component: ChatThreadPage,
});

function ChatThreadPage() {
  const { threadId } = useParams({ from: "/contact/$threadId" });
  return <ChatThread key={threadId} threadId={threadId} />;
}

function ChatThread({ threadId }: { threadId: string }) {
  const { t } = useI18n();
  const { data: serverMessages = [] } = useSuspenseQuery(
    messagesQueryOptions(threadId)
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const escalateFn = useServerFn(escalateThread);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const initialMessages: UIMessage[] = serverMessages.map((m) => ({
    id: m.id,
    role: m.role as "user" | "assistant" | "system",
    parts: [{ type: "text" as const, text: m.content }],
  }));

  const transport = new DefaultChatTransport({
    api: "/api/chat",
    body: { threadId },
  });

  const { messages, status, sendMessage, stop } = useChat({
    id: threadId,
    messages: initialMessages,
    transport,
    onError: (error: Error) => toast.error(error.message),
  });

  const onCopy = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    copyTimeoutRef.current = setTimeout(() => setCopiedId(null), 2000);
  };

  const onEscalate = async () => {
    await escalateFn({ data: { threadId } });
    toast.success(t("contact.operatorRequested"));
  };

  const isLoading = status === "submitted" || status === "streaming";

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <h2 className="font-medium">{t("contact.chatTitle")}</h2>
          <p className="text-xs text-muted-foreground">{t("contact.aiAssistant")}</p>
        </div>
        <button
          onClick={onEscalate}
          className="btn-ghost-neon !px-3 !py-1.5 text-xs"
        >
          <Headset size={14} />
          {t("chat.callOperator")}
        </button>
      </div>

      <Conversation className="flex-1">
        <ConversationContent>
          {messages.length === 0 && (
            <ConversationEmptyState
              title={t("chat.empty")}
              description={t("chat.emptyDesc")}
            />
          )}
          {messages.map((message: UIMessage) => {
            const text = message.parts
              .filter((part: { type: string; text?: string }) => part.type === "text")
              .map((part: { type: string; text?: string }) => part.text)
              .join("");
            return (
              <Message key={message.id} from={message.role}>
                <MessageContent>
                  <MessageResponse>{text}</MessageResponse>
                </MessageContent>
                <MessageActions>
                  <MessageAction
                    onClick={() => onCopy(message.id, text)}
                    tooltip={copiedId === message.id ? "Copied" : "Copy"}
                    label={copiedId === message.id ? "Copied" : "Copy"}
                  >
                    {copiedId === message.id ? (
                      <Check size={14} />
                    ) : (
                      <Copy size={14} />
                    )}
                  </MessageAction>
                </MessageActions>
              </Message>
            );
          })}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <PromptInput
        onSubmit={({ text }) => {
          console.log("PromptInput onSubmit text:", JSON.stringify(text));
          sendMessage({ text });
        }}
        className="border-t border-border p-3"
      >
        <PromptInputTextarea
          name="message"
          placeholder={t("contact.askPlaceholder")}
          disabled={isLoading}
        />
        <PromptInputFooter className="justify-end">
          <PromptInputSubmit
            type="submit"
            status={status}
            onStop={stop}
            disabled={isLoading}
            onClick={(e) => {
              const form = (e.currentTarget as HTMLButtonElement).form;
              form?.requestSubmit();
            }}
          />
        </PromptInputFooter>
      </PromptInput>
    </div>
  );
}
