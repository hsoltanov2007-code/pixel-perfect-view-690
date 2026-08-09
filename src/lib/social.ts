export function socialHref(
  value: string | undefined,
  kind: "whatsapp" | "telegram" | "instagram",
) {
  const v = (value ?? "").trim();
  const fallback =
    kind === "whatsapp"
      ? "https://wa.me/"
      : kind === "telegram"
        ? "https://t.me/"
        : "https://instagram.com/";
  if (!v) return fallback;
  if (/^https?:\/\//i.test(v)) return v;
  if (kind === "whatsapp") return "https://wa.me/" + v.replace(/[^\d]/g, "");
  const handle = v.replace(/^@/, "");
  return (kind === "telegram" ? "https://t.me/" : "https://instagram.com/") + handle;
}
