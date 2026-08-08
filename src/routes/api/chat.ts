import { createFileRoute } from "@tanstack/react-router";
import {
  convertToModelMessages,
  streamText,
  type ModelMessage,
  type UIMessage,
} from "ai";
import { getCookie } from "@tanstack/react-start/server";
import {
  createLovableAiGatewayProvider,
  getLovableAiGatewayRunId,
} from "@/lib/ai-gateway.server";

const SYSTEM_PROMPT = `You are a helpful support assistant for 2G SHOP, an online store that sells premium digital subscriptions (streaming, music, gaming, AI, VPN) at the best prices with instant delivery, warranty and 24/7 support.

Answer questions about orders, subscriptions, delivery times, warranty, payments and general support. Keep replies concise, friendly and useful. If the user asks to speak to a human, says the issue is urgent, or you cannot solve the problem, tell them they can click "Call operator" and a human will join the chat.`;

type ChatRequestBody = {
  messages?: UIMessage[];
  threadId?: string;
};

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          console.log("[chat] request received");
          const body = (await request.json()) as ChatRequestBody;
          if (!Array.isArray(body.messages) || body.messages.length === 0) {
            return new Response("Messages are required", { status: 400 });
          }
          if (!body.threadId) {
            return new Response("Thread ID is required", { status: 400 });
          }

          const sessionId = getCookie("chat_session_id");
          console.log("[chat] sessionId", sessionId);
          if (!sessionId) {
            return new Response("Session required", { status: 401 });
          }

          const { supabaseAdmin } = await import(
            "@/integrations/supabase/client.server"
          );

          console.log("[chat] looking up thread", body.threadId);
          const { data: thread, error: threadError } = await supabaseAdmin
            .from("chat_threads")
            .select("id, status")
            .eq("id", body.threadId)
            .eq("session_id", sessionId)
            .single();
          console.log("[chat] thread result", thread, threadError);
          if (threadError || !thread) {
            return new Response("Thread not found", { status: 404 });
          }
          if (
            thread.status === "needs_operator" ||
            thread.status === "operator_joined"
          ) {
            return new Response("Operator handling — AI chat paused", {
              status: 403,
            });
          }

          const userMessage = body.messages[body.messages.length - 1] as UIMessage;
          const userText = userMessage.parts
            .filter((part) => part.type === "text")
            .map((part) => part.text)
            .join("");

          if (userMessage.role === "user" && userText.trim()) {
            await supabaseAdmin.from("chat_messages").insert({
              thread_id: body.threadId,
              role: "user",
              content: userText,
            });
          }

          const key = process.env["LOVABLE_API_KEY"];
          console.log("[chat] key present", Boolean(key));
          if (!key) {
            return new Response("Missing LOVABLE_API_KEY", { status: 500 });
          }

          const initialRunId = getLovableAiGatewayRunId(request);
          const gateway = createLovableAiGatewayProvider(key, initialRunId);
          const model = gateway("google/gemini-3.6-flash");

          const history = body.messages.slice(0, -1);
          const messages: ModelMessage[] = [
            { role: "system", content: SYSTEM_PROMPT },
            ...(await convertToModelMessages(history as UIMessage[])),
            { role: "user", content: userText },
          ];
          console.log("[chat] starting streamText");

          const result = streamText({ model, messages });

          const response = result.toUIMessageStreamResponse({
            originalMessages: body.messages,
            onEnd: async (event) => {
              const assistantText = event.responseMessage.parts
                .filter((part) => part.type === "text")
                .map((part) => part.text)
                .join("");
              if (assistantText && body.threadId) {
                await supabaseAdmin.from("chat_messages").insert({
                  thread_id: body.threadId,
                  role: "assistant",
                  content: assistantText,
                });
              }
            },
          });
          console.log("[chat] returning streaming response");

          return withLovableAiGatewayRunIdHeader(response, gateway);
        } catch (error) {
          console.error("[chat] handler error", error);
          return new Response(
            error instanceof Error ? error.message : "Chat error",
            { status: 500 }
          );
        }
      },
    },
  },
});
