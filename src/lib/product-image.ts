import p1 from "@/assets/project-1.jpg";
import p2 from "@/assets/project-2.jpg";
import p3 from "@/assets/project-3.jpg";
import p4 from "@/assets/project-4.jpg";
import p5 from "@/assets/project-5.jpg";
import p6 from "@/assets/project-6.jpg";

const map: Record<string, string> = {
  "project-1": p1,
  "project-2": p2,
  "project-3": p3,
  "project-4": p4,
  "project-5": p5,
  "project-6": p6,
};

export const imageKeys = Object.keys(map);

export function productImage(key?: string | null): string {
  if (!key) return p1;
  if (key.startsWith("http") || key.startsWith("/")) return key;
  return map[key] ?? p1;
}

export function formatPrice(price: number, currency = "AZN"): string {
  return `${price.toFixed(2)} ${currency}`;
}

export function localizeDescription(
  description: string,
  lang: string
): string {
  if (!description) return "";

  const regex = /\b(RU|AZ|EN):\s*/gi;
  const matches = Array.from(description.matchAll(regex));
  if (matches.length === 0) return description;

  const blocks: Record<string, string> = {};
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    if (!match || match.index === undefined) continue;
    const code = match[1].toLowerCase();
    const start = match.index + match[0].length;
    const end =
      i < matches.length - 1 ? matches[i + 1]?.index ?? description.length : description.length;
    blocks[code] = description.slice(start, end).trim();
  }

  return (
    blocks[lang.toLowerCase()] ??
    blocks["ru"] ??
    blocks["az"] ??
    blocks["en"] ??
    description
  );
}
