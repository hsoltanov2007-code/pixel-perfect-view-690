import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useServerFn } from "@tanstack/react-start";
import { getLangCookie, setLangCookie } from "./i18n.functions";

export const LANGS = ["ru", "az", "en"] as const;
export type Lang = (typeof LANGS)[number];

export const LANG_LABELS: Record<Lang, string> = {
  ru: "RU",
  az: "AZ",
  en: "EN",
};

export const LANG_NAMES: Record<Lang, string> = {
  ru: "Русский",
  az: "Azərbaycan",
  en: "English",
};

const STORAGE_KEY = "2g_lang";

type Dict = Record<string, string>;

const ru: Dict = {
  "nav.home": "Главная",
  "nav.catalog": "Каталог",
  "nav.contact": "Контакты",
  "nav.shopNow": "Купить",
  "nav.openCart": "Открыть корзину",
  "nav.toggleMenu": "Меню",
  "nav.language": "Язык",

  "hero.badge": "Мгновенная выдача",
  "hero.title": "Премиум-подписки онлайн",
  "hero.subtitle":
    "Стриминг, музыка, игры, AI и VPN по лучшей цене — выдача за минуты, гарантия и поддержка 24/7.",
  "hero.cta": "Перейти к покупкам",
  "hero.scroll": "Листайте вниз",

  "products.heading": "Популярные подписки",
  "products.eyebrow": "Популярное",
  "products.add": "В корзину",
  "products.added": "{title} добавлен в корзину",
  "products.viewCatalog": "Посмотреть каталог",

  "why.eyebrow": "ПОЧЕМУ 2G SHOP",
  "why.title": "Цифровые товары,",
  "why.titleAccent": "без ожидания",
  "why.subtitle":
    "Премиум-подписки и ключи с мгновенной выдачей, гарантией и живой поддержкой.",
  "why.instant": "Мгновенная выдача",
  "why.warranty": "Гарантия",
  "why.support": "Поддержка 24/7",

  "catalog.back": "На главную",
  "catalog.title": "Полный",
  "catalog.titleAccent": "каталог",
  "catalog.subtitle":
    "Подписки и цифровые ключи по лучшей цене — выдача за минуты, гарантия и поддержка 24/7.",

  "cart.title": "Корзина",
  "cart.empty": "Корзина пуста",
  "cart.total": "Итого",
  "cart.buy": "Купить",
  "cart.close": "Закрыть",
  "cart.remove": "Удалить {title}",
  "cart.decrease": "Уменьшить",
  "cart.increase": "Увеличить",
  "cart.choose": "Выберите, куда написать — текст заказа подставится автоматически.",
  "cart.back": "Назад",
  "cart.notConfigured": "{channel} не настроен",
  "cart.copied": "Текст заказа скопирован — вставьте его в директ",
  "cart.igHint":
    "Instagram не поддерживает автотекст. Скопируйте сообщение и вставьте его в директ.",
  "cart.igCopy": "Скопировать сообщение",
  "cart.igOpen": "Открыть Instagram",
  "cart.sent": "Корзина отправлена и очищена",
  "cart.failed": "Не удалось оформить заказ",
  "cart.copyLink": "Скопировать ссылку",
  "cart.linkCopied": "Ссылка скопирована",
  "cart.vaultTitle": "Ваша ячейка",
  "cart.subtotal": "Подытог",
  "cart.fee": "Комиссия",
  "cart.secure": "Защищённое соединение активно",
  "cart.checkout": "Оформить заказ",

  "shared.title": "Корзина покупателя",
  "shared.created": "Создана",
  "shared.notFound": "Корзина не найдена",
  "shared.loadError": "Не удалось загрузить корзину",
  "shared.home": "На главную",

  "contact.eyebrow": "Центр поддержки",
  "contact.title": "Чем можем",
  "contact.titleAccent": "помочь?",
  "contact.subtitle":
    "Выберите удобный способ связи: напишите сообщение или начните живой чат, когда оператор онлайн.",
  "contact.messageTitle": "Написать сообщение",
  "contact.messageDesc": "Опишите вопрос — ответим на почту в ближайшее время.",
  "contact.name": "Ваше имя",
  "contact.email": "Электронная почта",
  "contact.message": "Какая подписка вас интересует?",
  "contact.send": "Отправить",
  "contact.sent": "Сообщение отправлено — скоро ответим.",
  "contact.chatTitle": "Живой чат",
  "contact.chatDesc":
    "Общайтесь с AI-ассистентом или вызовите живого оператора в реальном времени.",
  "contact.online": "Оператор онлайн",
  "contact.offline": "Оператор офлайн",
  "contact.onlineHint": "Среднее время ответа — меньше 2 минут",
  "contact.offlineHint": "Живой чат закрыт. Оставьте сообщение — мы ответим.",
  "contact.start": "Начать чат",
  "contact.unavailable": "Чат недоступен",
  "contact.chatError": "Не удалось открыть чат. Попробуйте ещё раз.",
  "contact.aiAssistant": "AI-ассистент",
  "contact.askPlaceholder": "Спросите о заказе...",
  "contact.operatorRequested": "Оператор вызван — скоро подключится к чату.",

  "chat.callOperator": "Вызвать оператора",
  "chat.empty": "Начните диалог",
  "chat.emptyDesc": "Спросите о заказе, подписке, доставке или гарантии.",
  "footer.rights": "Все права защищены.",
};

const az: Dict = {
  "nav.home": "Ana səhifə",
  "nav.catalog": "Kataloq",
  "nav.contact": "Əlaqə",
  "nav.shopNow": "Al",
  "nav.openCart": "Səbəti aç",
  "nav.toggleMenu": "Menyu",
  "nav.language": "Dil",

  "hero.badge": "Ani çatdırılma",
  "hero.title": "Premium abunəliklər onlayn",
  "hero.subtitle":
    "Striminq, musiqi, oyun, AI və VPN abunəlikləri ən sərfəli qiymətə — dəqiqələr içində, zəmanət və 24/7 dəstəklə.",
  "hero.cta": "Alış-verişə başla",
  "hero.scroll": "Aşağı sürüşdürün",

  "products.heading": "Populyar abunəliklər",
  "products.eyebrow": "Populyar",
  "products.add": "Səbətə at",
  "products.added": "{title} səbətə əlavə olundu",
  "products.viewCatalog": "Kataloqa bax",

  "why.eyebrow": "NİYƏ 2G SHOP",
  "why.title": "Rəqəmsal məhsullar,",
  "why.titleAccent": "gözləmədən",
  "why.subtitle":
    "Premium abunəliklər və açarlar ani çatdırılma, zəmanət və canlı dəstəklə.",
  "why.instant": "Ani çatdırılma",
  "why.warranty": "Zəmanət",
  "why.support": "24/7 dəstək",

  "catalog.back": "Ana səhifəyə",
  "catalog.title": "Tam",
  "catalog.titleAccent": "kataloq",
  "catalog.subtitle":
    "Ən sərfəli qiymətə abunəliklər və rəqəmsal açarlar — dəqiqələr içində, zəmanət və 24/7 dəstəklə.",

  "cart.title": "Səbət",
  "cart.empty": "Səbət boşdur",
  "cart.total": "Cəmi",
  "cart.buy": "Al",
  "cart.close": "Bağla",
  "cart.remove": "{title} sil",
  "cart.decrease": "Azalt",
  "cart.increase": "Artır",
  "cart.choose": "Hara yazmaq istədiyinizi seçin — sifariş mətni avtomatik əlavə olunacaq.",
  "cart.back": "Geri",
  "cart.notConfigured": "{channel} konfiqurasiya olunmayıb",
  "cart.copied": "Sifariş mətni kopyalandı — direct-ə yapışdırın",
  "cart.igHint":
    "Instagram mətni avtomatik doldurmur. Mesajı kopyalayıb direct-ə yapışdırın.",
  "cart.igCopy": "Mesajı kopyala",
  "cart.igOpen": "Instagram-ı aç",
  "cart.sent": "Səbət göndərildi və təmizləndi",
  "cart.failed": "Sifariş rəsmiləşdirilmədi",
  "cart.copyLink": "Linki kopyala",
  "cart.linkCopied": "Link kopyalandı",
  "cart.vaultTitle": "Sizin seyfiniz",
  "cart.subtotal": "Aralıq cəm",
  "cart.fee": "Xidmət haqqı",
  "cart.secure": "Qorunan bağlantı aktivdir",
  "cart.checkout": "Sifarişi rəsmiləşdir",

  "shared.title": "Müştəri səbəti",
  "shared.created": "Yaradılıb",
  "shared.notFound": "Səbət tapılmadı",
  "shared.loadError": "Səbəti yükləmək mümkün olmadı",
  "shared.home": "Ana səhifəyə",

  "contact.eyebrow": "Dəstək mərkəzi",
  "contact.title": "Sizə necə",
  "contact.titleAccent": "kömək edək?",
  "contact.subtitle":
    "Ən rahat əlaqə üsulunu seçin: mesaj göndərin və ya operator onlayn olanda canlı çat başladın.",
  "contact.messageTitle": "Mesaj göndər",
  "contact.messageDesc": "Sualınızı yazın — e-poçtla ən qısa zamanda cavab verəcəyik.",
  "contact.name": "Adınız",
  "contact.email": "E-poçt ünvanı",
  "contact.message": "Hansı abunəlik sizi maraqlandırır?",
  "contact.send": "Göndər",
  "contact.sent": "Mesaj göndərildi — tezliklə cavab verəcəyik.",
  "contact.chatTitle": "Canlı çat",
  "contact.chatDesc":
    "AI assistentlə danışın və ya real vaxtda canlı operator çağırın.",
  "contact.online": "Operator onlayndır",
  "contact.offline": "Operator oflayndır",
  "contact.onlineHint": "Orta cavab müddəti 2 dəqiqədən azdır",
  "contact.offlineHint": "Canlı çat bağlıdır. Mesaj yazın — cavab verəcəyik.",
  "contact.start": "Çatı başlat",
  "contact.unavailable": "Canlı çat əlçatmazdır",
  "contact.chatError": "Çatı başlatmaq mümkün olmadı. Yenidən cəhd edin.",
  "contact.aiAssistant": "AI assistent",
  "contact.askPlaceholder": "Sifarişiniz haqqında soruşun...",
  "contact.operatorRequested": "Operator çağırıldı — tezliklə qoşulacaq.",

  "chat.callOperator": "Operator çağır",
  "chat.empty": "Söhbətə başlayın",
  "chat.emptyDesc": "Sifariş, abunəlik, çatdırılma və ya zəmanət haqqında soruşun.",
  "footer.rights": "Bütün hüquqlar qorunur.",
};

const en: Dict = {
  "nav.home": "Home",
  "nav.catalog": "Catalog",
  "nav.contact": "Contact",
  "nav.shopNow": "Shop now",
  "nav.openCart": "Open cart",
  "nav.toggleMenu": "Toggle menu",
  "nav.language": "Language",

  "hero.badge": "Instant digital delivery",
  "hero.title": "Premium subscriptions online",
  "hero.subtitle":
    "Best-price streaming, music, gaming, AI and VPN subscriptions — delivered in minutes with warranty and 24/7 support.",
  "hero.cta": "Shop now",
  "hero.scroll": "Scroll down",

  "products.heading": "Popular subscriptions",
  "products.eyebrow": "Popular",
  "products.add": "Add to cart",
  "products.added": "{title} added to cart",
  "products.viewCatalog": "View full catalog",

  "why.eyebrow": "WHY 2G SHOP",
  "why.title": "Digital goods,",
  "why.titleAccent": "zero waiting",
  "why.subtitle":
    "Premium subscriptions and keys, delivered instantly with warranty and real support.",
  "why.instant": "Instant delivery",
  "why.warranty": "Warranty",
  "why.support": "24/7 support",

  "catalog.back": "Back to home",
  "catalog.title": "Full",
  "catalog.titleAccent": "catalog",
  "catalog.subtitle":
    "Best-price subscriptions and digital keys, delivered in minutes with warranty and 24/7 support.",

  "cart.title": "Cart",
  "cart.empty": "Your cart is empty",
  "cart.total": "Total",
  "cart.buy": "Checkout",
  "cart.close": "Close",
  "cart.remove": "Remove {title}",
  "cart.decrease": "Decrease",
  "cart.increase": "Increase",
  "cart.choose": "Choose where to message us — the order text is filled in automatically.",
  "cart.back": "Back",
  "cart.notConfigured": "{channel} is not configured",
  "cart.copied": "Order text copied — paste it into the DM",
  "cart.igHint":
    "Instagram can't prefill text. Copy the message and paste it into the DM.",
  "cart.igCopy": "Copy message",
  "cart.igOpen": "Open Instagram",
  "cart.sent": "Cart sent and cleared",
  "cart.failed": "Could not place the order",
  "cart.copyLink": "Copy link",
  "cart.linkCopied": "Link copied",
  "cart.vaultTitle": "Your vault",
  "cart.subtotal": "Subtotal",
  "cart.fee": "Service fee",
  "cart.secure": "Secure connection active",
  "cart.checkout": "Initialize checkout",

  "shared.title": "Customer cart",
  "shared.created": "Created",
  "shared.notFound": "Cart not found",
  "shared.loadError": "Could not load the cart",
  "shared.home": "Go home",

  "contact.eyebrow": "Support center",
  "contact.title": "How can we",
  "contact.titleAccent": "help?",
  "contact.subtitle":
    "Choose the fastest way to reach us. Send a message for non-urgent requests or start a live chat when an operator is online.",
  "contact.messageTitle": "Send a message",
  "contact.messageDesc": "Describe your question and we'll reply by email as soon as possible.",
  "contact.name": "Your name",
  "contact.email": "Email address",
  "contact.message": "Which subscription are you interested in?",
  "contact.send": "Send message",
  "contact.sent": "Message sent — we'll get back to you soon.",
  "contact.chatTitle": "Live chat",
  "contact.chatDesc": "Talk with our AI assistant or request a human operator in real time.",
  "contact.online": "Operator online",
  "contact.offline": "Operator offline",
  "contact.onlineHint": "Average response time under 2 minutes",
  "contact.offlineHint": "Live chat is closed. Leave a message and we'll reply soon.",
  "contact.start": "Start live chat",
  "contact.unavailable": "Live chat unavailable",
  "contact.chatError": "Could not start chat. Please try again.",
  "contact.aiAssistant": "AI assistant",
  "contact.askPlaceholder": "Ask about your order...",
  "contact.operatorRequested": "Operator requested — a human will join this chat soon.",

  "chat.callOperator": "Call operator",
  "chat.empty": "Start chatting",
  "chat.emptyDesc": "Ask about orders, subscriptions, delivery or warranty.",
  "footer.rights": "All rights reserved.",
};

const dictionaries: Record<Lang, Dict> = { ru, az, en };

function detectLang(): Lang {
  if (typeof window === "undefined") return "ru";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored && (LANGS as readonly string[]).includes(stored)) return stored as Lang;
  const raw = navigator.language || navigator.languages?.[0] || "en";
  const code = raw.toLowerCase().split("-")[0] ?? "en";
  if (code === "az" || code === "tr") return "az";
  if (["ru", "be", "uk", "kk", "ky", "uz"].includes(code)) return "ru";
  return "en";
}

type I18nValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({
  children,
  initialLang,
}: {
  children: ReactNode;
  initialLang?: Lang | null;
}) {
  // Server renders the default language; the visitor's choice is applied on mount.
  const [lang, setLangState] = useState<Lang>(initialLang ?? "ru");
  const getCookieLang = useServerFn(getLangCookie);
  const setCookieLang = useServerFn(setLangCookie);

  useEffect(() => {
    // Prefer the cookie set by the server, fall back to localStorage / browser detection.
    getCookieLang()
      .then((cookieLang) => {
        const next = cookieLang ?? detectLang();
        setLangState(next);
      })
      .catch(() => {
        setLangState(detectLang());
      });
  }, [getCookieLang]);

  useEffect(() => {
    if (typeof document !== "undefined") document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback(
    (l: Lang) => {
      setLangState(l);
      try {
        window.localStorage.setItem(STORAGE_KEY, l);
      } catch {
        /* storage unavailable */
      }
      setCookieLang({ data: l }).catch(() => {
        /* ignore network errors */
      });
    },
    [setCookieLang],
  );

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      const template = dictionaries[lang][key] ?? dictionaries.en[key] ?? key;
      if (!vars) return template;
      return template.replace(/\{(\w+)\}/g, (_, k: string) =>
        vars[k] !== undefined ? String(vars[k]) : `{${k}}`,
      );
    },
    [lang],
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
