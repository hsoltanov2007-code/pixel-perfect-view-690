import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  getOrCreateSessionId,
  getSessionId,
} from "@/lib/chat-session.server";

const ThreadIdInput = z.object({ threadId: z.string().uuid() });
const CreateThreadInput = z.object({
  title: z.string().trim().max(120).optional(),
});
const EscalateInput = z.object({
  threadId: z.string().uuid(),
  contactInfo: z.string().trim().max(500).optional(),
});
const SupportMessageInput = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(1).max(4000),
});

export const submitSupportMessage = createServerFn({ method: "POST" })
  .inputValidator((input) => SupportMessageInput.parse(input))
  .handler(async ({ data }) => {
    const sessionId = await getOrCreateSessionId();
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const { data: thread, error: threadError } = await supabaseAdmin
      .from("chat_threads")
      .insert({
        session_id: sessionId,
        title: `Support: ${data.name}`,
        status: "needs_operator",
      })
      .select("id")
      .single();
    if (threadError || !thread) {
      throw threadError ?? new Error("Could not save message");
    }
    const { error: messageError } = await supabaseAdmin
      .from("chat_messages")
      .insert({
        thread_id: thread.id,
        role: "user",
        content: `Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`,
      });
    if (messageError) throw messageError;
    return { ok: true };
  });

export const getThreads = createServerFn({ method: "GET" }).handler(
  async () => {
    const sessionId = await getOrCreateSessionId();
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const { data, error } = await supabaseAdmin
      .from("chat_threads")
      .select("id, title, status, created_at, updated_at")
      .eq("session_id", sessionId)
      .order("updated_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  }
);

export const createThread = createServerFn({ method: "POST" })
  .inputValidator((input) => CreateThreadInput.parse(input))
  .handler(async ({ data }) => {
    const sessionId = await getOrCreateSessionId();
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const { data: thread, error } = await supabaseAdmin
      .from("chat_threads")
      .insert({
        session_id: sessionId,
        title: data.title ?? "New chat",
      })
      .select("id")
      .single();
    if (error || !thread) throw error ?? new Error("Could not create thread");
    return thread.id;
  });

export const getThreadMessages = createServerFn({ method: "GET" })
  .inputValidator((input) => ThreadIdInput.parse(input))
  .handler(async ({ data }) => {
    const sessionId = getSessionId();
    if (!sessionId) return [];
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const { data: thread, error: threadError } = await supabaseAdmin
      .from("chat_threads")
      .select("id")
      .eq("id", data.threadId)
      .eq("session_id", sessionId)
      .single();
    if (threadError || !thread) {
      throw new Error("Thread not found");
    }
    const { data: messages, error } = await supabaseAdmin
      .from("chat_messages")
      .select("id, role, content, created_at")
      .eq("thread_id", data.threadId)
      .order("created_at", { ascending: true });
    if (error) throw error;
    return messages ?? [];
  });

export const escalateThread = createServerFn({ method: "POST" })
  .inputValidator((input) => EscalateInput.parse(input))
  .handler(async ({ data }) => {
    const sessionId = getSessionId();
    if (!sessionId) throw new Error("Session required");
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const { error: updateError } = await supabaseAdmin
      .from("chat_threads")
      .update({ status: "needs_operator" })
      .eq("id", data.threadId)
      .eq("session_id", sessionId);
    if (updateError) throw updateError;
    const { error: insertError } = await supabaseAdmin
      .from("chat_messages")
      .insert({
        thread_id: data.threadId,
        role: "system",
        content: data.contactInfo
          ? `User requested an operator. Contact info: ${data.contactInfo}`
          : "User requested an operator.",
      });
    if (insertError) throw insertError;
    return { ok: true };
  });

export const getOperatorStatus = createServerFn({ method: "GET" }).handler(
  async () => {
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const { data, error } = await supabaseAdmin
      .from("operator_status")
      .select("online")
      .order("updated_at", { ascending: false })
      .limit(1)
      .single();
    if (error || !data) return { online: false };
    return { online: data.online };
  }
);
