import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const CartItemInput = z.object({
  id: z.string().max(64),
  title: z.string().trim().min(1).max(120),
  price: z.number().min(0).max(100000),
  currency: z.string().max(4).default("AZN"),
  period: z.string().max(40).default(""),
  qty: z.number().int().min(1).max(99),
});

const CreateCartInput = z.object({
  items: z.array(CartItemInput).min(1).max(50),
  channel: z.enum(["whatsapp", "telegram", "instagram"]),
});

export const getPublicProducts = createServerFn({ method: "GET" }).handler(
  async () => {
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const { data, error } = await supabaseAdmin
      .from("products")
      .select(
        "id, title, description, price, currency, period, image_key, perks, badge, sort_order"
      )
      .eq("active", true)
      .order("sort_order", { ascending: true });
    if (error) throw error;

    const products = data ?? [];
    const storagePaths = products
      .map((p) => p.image_key)
      .filter((k): k is string => typeof k === "string" && k.startsWith("storage:"))
      .map((k) => k.replace("storage:", ""));

    if (storagePaths.length === 0) return products;

    const { data: signed } = await supabaseAdmin.storage
      .from("product-images")
      .createSignedUrls(storagePaths, 60 * 60 * 24 * 365);

    const urlMap = new Map(
      (signed ?? []).map((s) => [s.path, s.signedUrl]).filter((t): t is [string, string] => !!t[1])
    );

    return products.map((p) => {
      if (!p.image_key?.startsWith("storage:")) return p;
      const path = p.image_key.replace("storage:", "");
      const signedUrl = urlMap.get(path);
      if (!signedUrl) return p;
      return { ...p, image_key: signedUrl };
    });
  }
);

export const getPublicContacts = createServerFn({ method: "GET" }).handler(
  async () => {
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

export const createCartLink = createServerFn({ method: "POST" })
  .inputValidator((input) => CreateCartInput.parse(input))
  .handler(async ({ data }) => {
    const total = data.items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const { data: cart, error } = await supabaseAdmin
      .from("carts")
      .insert({
        items: data.items,
        total: Math.round(total * 100) / 100,
        channel: data.channel,
      })
      .select("id")
      .single();
    if (error || !cart) throw error ?? new Error("Could not create cart");
    return { id: cart.id as string };
  });

export const getCartById = createServerFn({ method: "GET" })
  .inputValidator((input) => z.object({ id: z.string().max(64) }).parse(input))
  .handler(async ({ data }) => {
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        data.id
      );
    if (!isUuid) return null;
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const { data: cart, error } = await supabaseAdmin
      .from("carts")
      .select("id, items, total, channel, created_at")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw error;
    return cart;
  });
