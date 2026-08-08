import { getCookie, setCookie } from "@tanstack/react-start/server";

const SESSION_COOKIE = "chat_session_id";
const ONE_YEAR = 60 * 60 * 24 * 365;

const isSecure = process.env["NODE_ENV"] === "production";

export async function getOrCreateSessionId(): Promise<string> {
  let sessionId = getCookie(SESSION_COOKIE);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    setCookie(SESSION_COOKIE, sessionId, {
      httpOnly: true,
      secure: isSecure,
      sameSite: "lax",
      maxAge: ONE_YEAR,
      path: "/",
    });
  }
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { error } = await supabaseAdmin
    .from("chat_sessions")
    .upsert({ session_id: sessionId }, { onConflict: "session_id" });
  if (error) {
    console.error("Failed to ensure chat session:", error);
  }
  return sessionId;
}

export function getSessionId(): string | undefined {
  return getCookie(SESSION_COOKIE);
}

export function setSessionId(sessionId: string): void {
  setCookie(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: isSecure,
    sameSite: "lax",
    maxAge: ONE_YEAR,
    path: "/",
  });
}
