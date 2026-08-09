import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  getAdminSession,
  isAdmin,
  passwordMatches,
  requireAdmin,
} from "@/lib/admin.server";

const ProductInput = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(600).default(""),
  price: z.number().min(0).max(100000),
  currency: z.string().trim().max(4).default("$"),
  period: z.string().trim().max(40).default("/ month"),
  image_key: z.string().trim().max(300).nullable().default(null),
  perks: z.array(z.string().trim().max(80)).max(8).default([]),
  badge: z.string().trim().max(40).nullable().default(null),
  active: z.boolean().default(true),
  sort_order: z.number().int().min(0).max(9999).default(0),
});

export const getAdminStatus = createServerFn({ method: "GET" }).handler(
  async () => ({ admin: await isAdmin() })
);

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z.object({ password: z.string().min(1).max(200) }).parse(input)
  )
  .handler(async ({ data }) => {
    const expected = process.env["ADMIN_PASSWORD"];
    if (!expected) return { ok: false as const, reason: "not_configured" };
    if (!passwordMatches(data.password, expected)) {
      return { ok: false as const, reason: "invalid" };
    }
    const session = await getAdminSession();
    await session.update({ admin: true });
    return { ok: true as const };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(
  async () => {
    const session = await getAdminSession();
    await session.clear();
    return { ok: true as const };
  }
);

export const adminListProducts = createServerFn({ method: "GET" }).handler(
  async () => {
    await requireAdmin();
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return data ?? [];
  }
);

export const adminSaveProduct = createServerFn({ method: "POST" })
  .inputValidator((input) => ProductInput.parse(input))
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const { id, ...fields } = data;
    if (id) {
      const { error } = await supabaseAdmin
        .from("products")
        .update(fields)
        .eq("id", id);
      if (error) throw error;
      return { id };
    }
    const { data: row, error } = await supabaseAdmin
      .from("products")
      .insert(fields)
      .select("id")
      .single();
    if (error || !row) throw error ?? new Error("Could not create product");
    return { id: row.id as string };
  });

export const adminDeleteProduct = createServerFn({ method: "POST" })
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const { error } = await supabaseAdmin
      .from("products")
      .delete()
      .eq("id", data.id);
    if (error) throw error;
    return { ok: true as const };
  });

export const adminGetSettings = createServerFn({ method: "GET" }).handler(
  async () => {
    await requireAdmin();
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const { data, error } = await supabaseAdmin
      .from("site_settings")
      .select("key, value");
    if (error) throw error;
    const map: Record<string, string> = {};
    for (const row of data ?? []) map[row.key] = row.value;
    return {
      whatsapp: map["whatsapp"] ?? "",
      telegram: map["telegram"] ?? "",
      instagram: map["instagram"] ?? "",
    };
  }
);

export const adminSaveSettings = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z
      .object({
        whatsapp: z.string().trim().max(120).default(""),
        telegram: z.string().trim().max(120).default(""),
        instagram: z.string().trim().max(120).default(""),
      })
      .parse(input)
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const rows = Object.entries(data).map(([key, value]) => ({ key, value }));
    const { error } = await supabaseAdmin
      .from("site_settings")
      .upsert(rows, { onConflict: "key" });
    if (error) throw error;
    return { ok: true as const };
  });

export const adminListThreads = createServerFn({ method: "GET" }).handler(
  async () => {
    await requireAdmin();
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const { data, error } = await supabaseAdmin
      .from("chat_threads")
      .select("id, title, status, session_id, created_at, updated_at")
      .order("updated_at", { ascending: false })
      .limit(100);
    if (error) throw error;
    return data ?? [];
  }
);

export const adminGetThreadMessages = createServerFn({ method: "GET" })
  .inputValidator((input) =>
    z.object({ threadId: z.string().uuid() }).parse(input)
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const { data: rows, error } = await supabaseAdmin
      .from("chat_messages")
      .select("id, role, content, created_at")
      .eq("thread_id", data.threadId)
      .order("created_at", { ascending: true });
    if (error) throw error;
    return rows ?? [];
  });

export const adminListCarts = createServerFn({ method: "GET" }).handler(
  async () => {
    await requireAdmin();
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const { data, error } = await supabaseAdmin
      .from("carts")
      .select("id, items, total, channel, status, created_at")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw error;
    return data ?? [];
  }
);

export const adminSetOperatorOnline = createServerFn({ method: "POST" })
  .inputValidator((input) => z.object({ online: z.boolean() }).parse(input))
  .handler(async ({ data }) => {
    await requireAdmin();
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const { data: existing } = await supabaseAdmin
      .from("operator_status")
      .select("id")
      .limit(1)
      .maybeSingle();
    if (existing) {
      const { error } = await supabaseAdmin
        .from("operator_status")
        .update({ online: data.online, updated_at: new Date().toISOString() })
        .eq("id", existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabaseAdmin
        .from("operator_status")
        .insert({ online: data.online });
      if (error) throw error;
    }
    return { ok: true as const };
  });

export const adminGetOperatorStatus = createServerFn({ method: "GET" }).handler(
  async () => {
    await requireAdmin();
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const { data } = await supabaseAdmin
      .from("operator_status")
      .select("online")
      .limit(1)
      .maybeSingle();
    return { online: data?.online ?? false };
  }
);
