import { createFileRoute, useParams } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
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
    onError: (error) => toast.error(error.message),
  });

  const onCopy = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    copyTimeoutRef.current = setTimeout(() => setCopiedId(null), 2000);
  };

  const onEscalate = async () => {
    await escalateFn({ data: { threadId } });
    toast.success("Operator requested — a human will join this chat soon.");
  };

  const isLoading = status === "submitted" || status === "streaming";

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <h2 className="font-medium">Live chat</h2>
          <p className="text-xs text-muted-foreground">AI assistant</p>
        </div>
        <button
          onClick={onEscalate}
          className="btn-ghost-neon !px-3 !py-1.5 text-xs"
        >
          <Headset size={14} />
          Call operator
        </button>
      </div>

      <Conversation className="flex-1">
        <ConversationContent>
          {messages.length === 0 && (
            <ConversationEmptyState
              title="Start chatting"
              description="Ask about orders, subscriptions, delivery or warranty."
            />
          )}
          {messages.map((message) => {
            const text = message.parts
              .filter((part) => part.type === "text")
              .map((part) => part.text)
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
          placeholder="Ask about your order..."
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
