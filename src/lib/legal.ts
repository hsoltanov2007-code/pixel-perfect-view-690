import type { Lang } from "@/lib/i18n";

export type LegalDoc = {
  title: string;
  intro: string;
  updated: string;
  sections: { heading: string; body: string[] }[];
};

export type LegalSlug = "privacy" | "terms" | "refund";

const LAST_UPDATED = "2026-08-09";

const updatedLabel: Record<Lang, string> = {
  ru: "Обновлено",
  az: "Yeniləndi",
  en: "Last updated",
};

export const legalLabels: Record<Lang, Record<LegalSlug, string>> = {
  ru: { privacy: "Политика конфиденциальности", terms: "Условия использования", refund: "Оплата и возврат" },
  az: { privacy: "Məxfilik siyasəti", terms: "İstifadə şərtləri", refund: "Ödəniş və qaytarma" },
  en: { privacy: "Privacy Policy", terms: "Terms of Service", refund: "Payment & Refunds" },
};

export function legalUpdated(lang: Lang) {
  return `${updatedLabel[lang]}: ${LAST_UPDATED}`;
}

const docs: Record<Lang, Record<LegalSlug, LegalDoc>> = {
  ru: {
    privacy: {
      title: "Политика конфиденциальности",
      updated: legalUpdated("ru"),
      intro:
        "2G SHOP уважает вашу приватность. Ниже описано, какие данные мы собираем и как их используем.",
      sections: [
        {
          heading: "Какие данные мы собираем",
          body: [
            "Контактные данные, которые вы указываете сами: имя, e-mail, ник в мессенджере.",
            "Состав заказа и содержимое корзины, необходимые для оформления покупки.",
            "Сообщения, отправленные через форму связи или чат поддержки.",
            "Технические данные: выбранный язык (cookie) и базовая статистика посещений.",
          ],
        },
        {
          heading: "Зачем мы их используем",
          body: [
            "Чтобы обработать заказ и выдать приобретённый цифровой товар.",
            "Чтобы отвечать на вопросы поддержки и решать спорные ситуации.",
            "Чтобы сохранять ваши настройки сайта, например выбранный язык.",
          ],
        },
        {
          heading: "Передача третьим лицам",
          body: [
            "Мы не продаём ваши данные. Они могут обрабатываться сервисами, через которые вы с нами связываетесь (WhatsApp, Telegram, Instagram), и поставщиками хостинга и инфраструктуры сайта.",
          ],
        },
        {
          heading: "Хранение и ваши права",
          body: [
            "Мы храним данные заказов столько, сколько нужно для поддержки и гарантии.",
            "Вы можете запросить удаление или исправление ваших данных, написав нам через страницу «Контакты».",
          ],
        },
        {
          heading: "Cookie",
          body: [
            "Мы используем только технические cookie — например, для запоминания выбранного языка. Их можно удалить в настройках браузера.",
          ],
        },
      ],
    },
    terms: {
      title: "Условия использования",
      updated: legalUpdated("ru"),
      intro:
        "Пользуясь сайтом 2G SHOP и оформляя заказ, вы соглашаетесь с условиями ниже.",
      sections: [
        {
          heading: "О сервисе",
          body: [
            "2G SHOP продаёт цифровые товары: подписки, ключи и аккаунты сервисов.",
            "Заказ оформляется через корзину и подтверждается в мессенджере: WhatsApp, Telegram или Instagram.",
          ],
        },
        {
          heading: "Заказ и выдача",
          body: [
            "Товар выдаётся после подтверждения оплаты в переписке с нами.",
            "Сроки выдачи зависят от товара и указываются при оформлении заказа.",
          ],
        },
        {
          heading: "Обязанности покупателя",
          body: [
            "Указывать корректные контактные данные.",
            "Не перепродавать и не передавать полученные доступы третьим лицам, если это запрещено правилами сервиса-поставщика.",
            "Соблюдать правила использования сервиса, подписку на который вы приобрели.",
          ],
        },
        {
          heading: "Ограничение ответственности",
          body: [
            "Мы не отвечаем за блокировки и изменения условий со стороны сторонних сервисов, а также за нарушения их правил покупателем.",
            "Цены и наличие товаров могут изменяться без предварительного уведомления.",
          ],
        },
        {
          heading: "Изменения",
          body: ["Мы можем обновлять эти условия. Актуальная версия всегда доступна на этой странице."],
        },
      ],
    },
    refund: {
      title: "Оплата и возврат",
      updated: legalUpdated("ru"),
      intro:
        "Здесь описано, как проходит оплата цифровых товаров и в каких случаях возможен возврат.",
      sections: [
        {
          heading: "Оплата",
          body: [
            "Способ оплаты согласовывается в переписке после оформления заказа.",
            "Заказ считается оплаченным после подтверждения поступления средств.",
          ],
        },
        {
          heading: "Гарантия",
          body: [
            "На каждый товар действует гарантия, срок которой указывается при покупке.",
            "Если доступ перестал работать в течение гарантийного срока не по вашей вине — мы заменим товар.",
          ],
        },
        {
          heading: "Возврат",
          body: [
            "Возврат средств возможен, если товар не был выдан или оказался неработоспособным и замена невозможна.",
            "Возврат не производится, если доступ был использован и работает корректно, либо доступ утрачен из-за нарушения правил сервиса.",
          ],
        },
        {
          heading: "Как оформить",
          body: [
            "Напишите нам через страницу «Контакты» и укажите номер заказа или ссылку на корзину. Мы ответим в течение 24 часов.",
          ],
        },
      ],
    },
  },
  az: {
    privacy: {
      title: "Məxfilik siyasəti",
      updated: legalUpdated("az"),
      intro:
        "2G SHOP məxfiliyinizə hörmət edir. Aşağıda hansı məlumatları topladığımız və necə istifadə etdiyimiz göstərilib.",
      sections: [
        {
          heading: "Hansı məlumatları toplayırıq",
          body: [
            "Özünüzün göndərdiyiniz əlaqə məlumatları: ad, e-poçt, messencer istifadəçi adı.",
            "Sifarişin tərkibi və səbətdəki məhsullar.",
            "Əlaqə forması və ya dəstək çatı vasitəsilə göndərilən mesajlar.",
            "Texniki məlumatlar: seçilmiş dil (cookie) və sadə ziyarət statistikası.",
          ],
        },
        {
          heading: "Niyə istifadə edirik",
          body: [
            "Sifarişi emal etmək və rəqəmsal məhsulu çatdırmaq üçün.",
            "Dəstək suallarına cavab vermək və mübahisələri həll etmək üçün.",
            "Sayt tənzimləmələrinizi, məsələn dili yadda saxlamaq üçün.",
          ],
        },
        {
          heading: "Üçüncü tərəflər",
          body: [
            "Məlumatlarınızı satmırıq. Onlar bizimlə əlaqə saxladığınız xidmətlər (WhatsApp, Telegram, Instagram) və hostinq təchizatçıları tərəfindən emal oluna bilər.",
          ],
        },
        {
          heading: "Saxlanma və hüquqlarınız",
          body: [
            "Sifariş məlumatlarını dəstək və zəmanət üçün lazım olan müddətdə saxlayırıq.",
            "«Əlaqə» səhifəsi vasitəsilə yazaraq məlumatlarınızın silinməsini və ya düzəlişini tələb edə bilərsiniz.",
          ],
        },
        {
          heading: "Cookie",
          body: [
            "Yalnız texniki cookie-lərdən istifadə edirik — məsələn, seçilmiş dili yadda saxlamaq üçün. Onları brauzer tənzimləmələrindən silmək olar.",
          ],
        },
      ],
    },
    terms: {
      title: "İstifadə şərtləri",
      updated: legalUpdated("az"),
      intro: "2G SHOP saytından istifadə edərək və sifariş verərək aşağıdakı şərtləri qəbul edirsiniz.",
      sections: [
        {
          heading: "Xidmət haqqında",
          body: [
            "2G SHOP rəqəmsal məhsullar satır: abunəliklər, açarlar və hesablar.",
            "Sifariş səbət vasitəsilə verilir və messencerdə (WhatsApp, Telegram, Instagram) təsdiqlənir.",
          ],
        },
        {
          heading: "Sifariş və çatdırılma",
          body: [
            "Məhsul ödəniş təsdiqləndikdən sonra təhvil verilir.",
            "Çatdırılma müddəti məhsuldan asılıdır və sifariş zamanı bildirilir.",
          ],
        },
        {
          heading: "Alıcının öhdəlikləri",
          body: [
            "Düzgün əlaqə məlumatları təqdim etmək.",
            "Təchizatçı xidmətin qaydaları qadağan edirsə, əldə edilmiş girişi başqasına ötürməmək.",
            "Aldığınız xidmətin istifadə qaydalarına riayət etmək.",
          ],
        },
        {
          heading: "Məsuliyyətin məhdudlaşdırılması",
          body: [
            "Üçüncü tərəf xidmətlərin bloklamalarına və şərt dəyişikliklərinə görə məsuliyyət daşımırıq.",
            "Qiymətlər və mövcudluq xəbərdarlıq olmadan dəyişə bilər.",
          ],
        },
        { heading: "Dəyişikliklər", body: ["Şərtlər yenilənə bilər. Aktual versiya həmişə bu səhifədədir."] },
      ],
    },
    refund: {
      title: "Ödəniş və qaytarma",
      updated: legalUpdated("az"),
      intro: "Rəqəmsal məhsulların ödənişi və hansı hallarda geri qaytarmanın mümkün olduğu barədə.",
      sections: [
        {
          heading: "Ödəniş",
          body: [
            "Ödəniş üsulu sifarişdən sonra yazışmada razılaşdırılır.",
            "Sifariş vəsaitin daxil olması təsdiqləndikdən sonra ödənilmiş sayılır.",
          ],
        },
        {
          heading: "Zəmanət",
          body: [
            "Hər məhsul üçün zəmanət var, müddəti alış zamanı bildirilir.",
            "Zəmanət müddətində giriş sizin təqsiriniz olmadan işləməzsə, məhsulu dəyişirik.",
          ],
        },
        {
          heading: "Qaytarma",
          body: [
            "Məhsul təhvil verilməyibsə və ya işləmirsə və dəyişmək mümkün deyilsə, vəsait qaytarılır.",
            "Giriş istifadə olunubsa və düzgün işləyirsə, yaxud qaydaların pozulması səbəbindən itirilibsə, qaytarma edilmir.",
          ],
        },
        {
          heading: "Necə müraciət etmək",
          body: [
            "«Əlaqə» səhifəsindən bizə yazın və sifariş nömrəsini və ya səbət linkini göndərin. 24 saat ərzində cavab veririk.",
          ],
        },
      ],
    },
  },
  en: {
    privacy: {
      title: "Privacy Policy",
      updated: legalUpdated("en"),
      intro:
        "2G SHOP respects your privacy. This page explains what data we collect and how we use it.",
      sections: [
        {
          heading: "Data we collect",
          body: [
            "Contact details you provide: name, email, messenger handle.",
            "Order contents and your cart, needed to complete the purchase.",
            "Messages you send through the contact form or support chat.",
            "Technical data: your chosen language (cookie) and basic visit statistics.",
          ],
        },
        {
          heading: "How we use it",
          body: [
            "To process your order and deliver the digital product.",
            "To answer support questions and resolve disputes.",
            "To remember your site preferences, such as language.",
          ],
        },
        {
          heading: "Third parties",
          body: [
            "We do not sell your data. It may be processed by the services you contact us through (WhatsApp, Telegram, Instagram) and by our hosting and infrastructure providers.",
          ],
        },
        {
          heading: "Retention and your rights",
          body: [
            "We keep order data as long as needed for support and warranty.",
            "You can request deletion or correction of your data by writing to us via the Contact page.",
          ],
        },
        {
          heading: "Cookies",
          body: [
            "We only use technical cookies, for example to remember your language. You can clear them in your browser settings.",
          ],
        },
      ],
    },
    terms: {
      title: "Terms of Service",
      updated: legalUpdated("en"),
      intro: "By using 2G SHOP and placing an order you agree to the terms below.",
      sections: [
        {
          heading: "About the service",
          body: [
            "2G SHOP sells digital goods: subscriptions, keys and accounts.",
            "Orders are placed through the cart and confirmed in a messenger: WhatsApp, Telegram or Instagram.",
          ],
        },
        {
          heading: "Ordering and delivery",
          body: [
            "The product is delivered after payment is confirmed in our chat.",
            "Delivery time depends on the product and is stated when ordering.",
          ],
        },
        {
          heading: "Buyer responsibilities",
          body: [
            "Provide accurate contact details.",
            "Do not resell or share the access you receive when the provider's rules forbid it.",
            "Follow the usage rules of the service you subscribed to.",
          ],
        },
        {
          heading: "Limitation of liability",
          body: [
            "We are not responsible for bans or term changes made by third-party services, or for rule violations by the buyer.",
            "Prices and availability may change without notice.",
          ],
        },
        { heading: "Changes", body: ["We may update these terms. The current version is always on this page."] },
      ],
    },
    refund: {
      title: "Payment & Refunds",
      updated: legalUpdated("en"),
      intro: "How payment for digital goods works and when a refund is possible.",
      sections: [
        {
          heading: "Payment",
          body: [
            "The payment method is agreed in chat after you place the order.",
            "An order is considered paid once we confirm the funds have arrived.",
          ],
        },
        {
          heading: "Warranty",
          body: [
            "Every product comes with a warranty; its length is stated at purchase.",
            "If the access stops working within the warranty period through no fault of yours, we replace it.",
          ],
        },
        {
          heading: "Refunds",
          body: [
            "A refund is possible if the product was never delivered, or it does not work and no replacement is available.",
            "No refund is given if the access was used and works correctly, or was lost due to breaking the provider's rules.",
          ],
        },
        {
          heading: "How to request",
          body: [
            "Write to us via the Contact page with your order number or cart link. We reply within 24 hours.",
          ],
        },
      ],
    },
  },
};

export function getLegalDoc(lang: Lang, slug: LegalSlug): LegalDoc {
  return docs[lang][slug];
}
