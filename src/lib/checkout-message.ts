export type CheckoutLocale = "ru" | "en" | "az" | "tr";

type Template = {
  greeting: string;
  total: string;
  cart: string;
};

const templates: Record<CheckoutLocale, Template> = {
  ru: {
    greeting: "Здравствуйте! Хочу купить:",
    total: "Итого",
    cart: "Корзина",
  },
  en: {
    greeting: "Hello! I would like to buy:",
    total: "Total",
    cart: "Cart",
  },
  az: {
    greeting: "Salam! Bunları almaq istəyirəm:",
    total: "Cəmi",
    cart: "Səbət",
  },
  tr: {
    greeting: "Merhaba! Şunları satın almak istiyorum:",
    total: "Toplam",
    cart: "Sepet",
  },
};

/** Language the visitor's browser/site is in, limited to supported templates. */
export function detectLocale(): CheckoutLocale {
  const raw =
    (typeof navigator !== "undefined" &&
      (navigator.language || navigator.languages?.[0])) ||
    "en";
  const code = raw.toLowerCase().split("-")[0];
  if (code === "ru" || code === "be" || code === "uk" || code === "kk") return "ru";
  if (code === "az") return "az";
  if (code === "tr") return "tr";
  return "en";
}

export function buildCheckoutMessage(opts: {
  lines: string;
  total: string;
  link: string;
  locale?: CheckoutLocale;
}): string {
  const t = templates[opts.locale ?? detectLocale()];
  return `${t.greeting}\n${opts.lines}\n\n${t.total}: ${opts.total}\n${t.cart}: ${opts.link}`;
}
