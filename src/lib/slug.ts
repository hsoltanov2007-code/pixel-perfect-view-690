const translit: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
  и: "i", й: "i", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
  с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "c", ч: "ch", ш: "sh", щ: "sch",
  ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
  ə: "e", ı: "i", ö: "o", ü: "u", ğ: "g", ş: "s", ç: "c",
};

export function slugify(input: string): string {
  const lowered = (input ?? "").toLowerCase();
  let out = "";
  for (const ch of lowered) {
    out += translit[ch] ?? ch;
  }
  return out
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/** Stable, unique slug for a product across a list of products. */
export function productSlug(
  product: { id: string; title: string },
  all?: { id: string; title: string }[]
): string {
  const base = slugify(product.title) || "product";
  if (!all) return base;
  const collisions = all.filter((p) => slugify(p.title) === base);
  if (collisions.length <= 1) return base;
  return `${base}-${product.id.slice(0, 6)}`;
}
