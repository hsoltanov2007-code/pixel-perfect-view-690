# Avtomatik SEO səhifələri — hər məhsul üçün

Yalnız ChatGPT Plus üçün deyil: kataloqa əlavə etdiyiniz **hər məhsul** üçün öz ünvanı olan ayrıca səhifə avtomatik yaranacaq (Spotify, Netflix, YouTube Premium, VPN və s.).

## Nə olacaq

- Hər məhsul öz linkini alır: `2gshop.com/p/chatgpt-plus`, `/p/spotify-premium`, `/p/netflix` ...
- Link məhsulun adından avtomatik düzəlir (slug). Adminkada heç nə əlavə yazmaq lazım deyil.
- Səhifə 3 dildə işləyir və artıq adminkada yazdığınız RU/AZ/EN təsvir və üstünlükləri göstərir.
- Səhifədə: şəkil, qiymət (AZN), üstünlüklər, "Səbətə at" düymələri, Telegram/Instagram ilə birbaşa alış.
- Hər səhifənin öz title/description/canonical/og teqləri məhsulun adı və qiyməti ilə.
- Hər səhifəyə Product + Offer JSON-LD (Google-un qiyməti nəticələrdə göstərməsi üçün).
- Sitemap avtomatik olaraq bütün aktiv məhsul səhifələrini əlavə edir — yeni məhsul əlavə edən kimi Google onu tapır.
- Kataloq və ana səhifədəki kartlar bu səhifələrə link verir (daxili keçidlər indeksləşməyə kömək edir).

Yeni məhsul əlavə edəndə heç bir kod dəyişikliyi lazım deyil — səhifə, meta teqlər və sitemap yazısı özü yaranır.

## Texniki hissə

1. `src/lib/slug.ts` — başlıqdan slug düzəldən köməkçi (kiril/AZ hərfləri translit, unikallıq üçün lazım olsa `id` prefiksi).
2. `src/lib/shop.functions.ts` — yeni server funksiyası `getProductBySlug` (aktiv məhsullar arasından slug üzrə tapır, imza URL-i də qaytarır) və sitemap üçün `getProductSlugs`.
3. `src/routes/p.$slug.tsx` — yeni marşrut:
   - `loader` ilə məhsulu yükləyir, tapılmasa `notFound()`.
   - `head()`: title `{Ad} — 2G SHOP`, description = localizasiya olunmuş təsvirin ilk cümləsi + qiymət, canonical/og:url `https://2gshop.com/p/{slug}`, og:type `product`, məhsul şəkli varsa og:image.
   - JSON-LD: `Product` + `Offer` (price, priceCurrency AZN, availability), üstəgəl `BreadcrumbList`.
   - UI: mövcud kataloq kart dizaynı ("Cosmos" stili), `LocalizedDescription`, `localizePerks`, `useCart` ilə səbətə əlavə, `src/lib/social.ts` ilə Telegram/Instagram düymələri.
4. `src/routes/sitemap[.]xml.ts` — statik siyahıya `getProductSlugs` nəticəsindən `/p/{slug}` yazıları əlavə olunur (`changefreq: weekly`, `priority: 0.8`).
5. `src/routes/catalog.tsx` və `src/components/Products.tsx` — kartların başlığı/şəkli `/p/{slug}` səhifəsinə link olur; "Səbətə at" düyməsi əvvəlki kimi işləyir (link kliki ilə toqquşmasın).

Verilənlər bazasına dəyişiklik lazım deyil — slug adından hesablanır.
