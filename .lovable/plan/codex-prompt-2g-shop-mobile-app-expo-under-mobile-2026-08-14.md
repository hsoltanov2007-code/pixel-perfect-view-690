# Codex prompt: 2G SHOP mobile app (Expo, under `mobile/`)

The mobile app lives in the same repository as the website, in a new `mobile/` folder. Nothing in the existing Lovable site is touched.

## Why a server API is required

Every business table (`products`, `carts`, `chat_threads`, `chat_messages`, `chat_sessions`, `site_settings`) has **service-role-only** policies — there are no `anon` or `authenticated` policies. Only `operator_status` is publicly readable. A mobile app must never ship a service-role key, so the app talks to HTTPS endpoints on `https://2gshop.com` instead of Supabase directly.

Endpoints the website must expose (added later on the web side, listed in the prompt so Codex codes against them):

```text
GET  /api/public/products              -> active products, signed image URLs
GET  /api/public/products/:slug        -> single product
GET  /api/public/contacts              -> telegram / instagram links
POST /api/public/carts                 -> { items:[{id,qty}], channel } -> { id }
GET  /api/public/carts/:id             -> cart snapshot
POST /api/public/chat/threads          -> { threadId, sessionToken }
GET  /api/public/chat/threads/:id      -> messages (requires session token)
POST /api/public/chat/threads/:id      -> send message (requires session token)
GET  /api/public/operator-status       -> { online }
```

Security rules baked into the prompt: prices are always recomputed server-side from product IDs (never trusted from the client), chat access is bound to an opaque session token so one device cannot read another's thread, and no admin surface ships in the mobile binary — admin stays on the website only.

## Data conventions Codex must match

- Prices: `numeric`, currency `AZN`, period string stored on the row (e.g. `/ month`).
- `image_key`: either an absolute URL or `storage:<path>` in the `product-images` bucket — the API returns a signed URL, the app just renders `image_key`.
- `perks`: `text[]`.
- Localized text: `description` and each perk may contain `RU:` / `AZ:` / `EN:` prefixed blocks; the app must parse and show the active language, falling back AZ -> RU -> EN.
- Slugs are derived from the title with RU/AZ transliteration (same algorithm as `src/lib/slug.ts`).
- Cart share link: `https://2gshop.com/cart/{cartId}`.

## The prompt to paste into Codex

Create an Expo (SDK 57) React Native app with TypeScript and Expo Router, in a new `mobile/` directory of this repository. Do not modify any existing files outside `mobile/`.

The app is the mobile client for "2G SHOP", a premium digital subscription store in Azerbaijan (2gshop.com).

**Backend rules (critical)**
- Never embed a Supabase service-role/secret key, and do not call Supabase directly. All data comes from the HTTPS API at `EXPO_PUBLIC_API_BASE_URL` (default `https://2gshop.com`), using the endpoints listed above.
- The cart POST sends only product IDs and quantities; the server computes prices and totals.
- Chat: create a thread once, store the returned opaque session token in `expo-secure-store`, and send it on every chat request. Never send an admin password from the app.
- No admin screen in the mobile app.

**Brand and design**
- Dark, futuristic, premium: near-black background, white/gray text, subtle neon glow, glassmorphism cards, pill buttons.
- Headings Space Grotesk, body Inter, via `@expo-google-fonts`.
- App icon and splash: glowing white "2G" monogram on black. Generate `icon.png` 1024x1024, `adaptive-icon.png` 1024x1024, `splash.png` 1284x2778.

**Screens (Expo Router)**
```
mobile/app/
  (tabs)/index.tsx      Home: hero, featured products, "View catalog"
  (tabs)/catalog.tsx    Catalog: grid, search, add to cart
  (tabs)/cart.tsx       Cart: qty edit, total in AZN, checkout
  (tabs)/contact.tsx    Live chat + Telegram/Instagram buttons
  p/[slug].tsx          Product detail: image, localized description, perks, price, add to cart
  cart/[id].tsx         Shared cart view
mobile/components/  mobile/lib/  mobile/assets/
```

**Behavior**
- Checkout opens Telegram with a pre-filled message containing the cart link. Instagram cannot pre-fill DMs: copy the message to the clipboard, show a toast, then open Instagram. Clear the local cart after a successful cart creation.
- Language switcher RU / AZ / EN, persisted in AsyncStorage, default from device locale, fallback AZ.
- Contact screen shows operator online/offline from the API and polls the thread every few seconds while focused.

**Technical requirements**
- TypeScript `strict: true`. `expo-image`, `react-native-reanimated`, `expo-secure-store`, `@react-native-async-storage/async-storage`, `expo-clipboard`, `expo-linking`.
- A single typed API client in `mobile/lib/api.ts` with timeouts and typed errors; loading, empty and error states on every screen.
- `.env.example` with `EXPO_PUBLIC_API_BASE_URL`. No secrets in the bundle.
- `eas.json` with `development`, `preview`, and `production` profiles; iOS bundle id `com.2gshop.app`.
- README covering install, `npx expo start`, and EAS build steps.
- Add Vitest or Jest unit tests for the localized-text parser, slug helper, and cart totals.

**Completion criteria**
1. `cd mobile && npm install && npx tsc --noEmit` passes with zero errors.
2. `npx expo start` boots and every route renders against the live API without a crash.
3. Catalog shows real products with AZN prices and localized descriptions.
4. Adding items, creating a cart, and opening the Telegram/Instagram checkout works end to end.
5. Chat sends and receives messages tied to the stored session token.
6. No Supabase key of any kind appears in `mobile/`.

Scaffold first, then implement screen by screen, typechecking after each.

## Website-side work this implies

The `/api/public/*` routes above do not exist yet. They are a separate follow-up on the website (TanStack server routes reusing the existing `shop.functions.ts` and `chat.functions.ts` logic, plus chat session tokens). Say the word and I plan that next.
