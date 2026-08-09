export function socialHref(
  value: string | undefined,
  kind: "telegram" | "instagram",
) {
  const v = (value ?? "").trim();
  const fallback = kind === "telegram" ? "https://t.me/" : "https://instagram.com/";
  if (!v) return fallback;
  if (/^https?:\/\//i.test(v)) return v;
  const handle = v.replace(/^@/, "");
  return (kind === "telegram" ? "https://t.me/" : "https://instagram.com/") + handle;
}
