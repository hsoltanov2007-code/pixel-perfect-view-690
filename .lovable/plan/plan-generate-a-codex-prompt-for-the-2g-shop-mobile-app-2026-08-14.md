# Plan: Generate a Codex prompt for the 2G SHOP mobile app

## Goal
Create a ready-to-use English prompt for ChatGPT/Codex that will generate a mobile application for the 2G SHOP brand. The user will paste it into Codex and push the resulting repository themselves.

## Recommended stack
- **React Native + Expo** (best for iOS + cross-platform, fast dev, OTA updates, web parity with the existing site).
- **TypeScript** for type safety.
- **React Navigation** for routing.
- **Zustand** or **React Context** for state.
- **Supabase** as the backend (reuse the existing 2G SHOP database, products, carts, and support chat tables).
- **Expo Router** is optional but recommended if the user wants file-based routing.

## The prompt to paste into Codex

Create a new React Native mobile app with Expo (SDK 52+), TypeScript, and React Navigation.

The app is for "2G SHOP" — a premium digital subscription store in Azerbaijan. It must mirror the existing website (2gshop.com) in branding and functionality.

**Brand & Design**
- Dark, futuristic, premium aesthetic. Deep black background (#0F172A / oklch(0.09 0 0)), white/gray text, subtle neon glows.
- Use the same visual language as the website: cosmos/nebula gradients, glassmorphism cards, rounded pill buttons, glowing borders.
- Match the website typography: Inter for body, Space Grotesk for headings. Use Expo Google Fonts.
- App icon and splash screen: a glowing white "2G" monogram on a dark background. Generate a 1024x1024 icon and a 1242x2436 splash.

**Features**
1. **Home screen**: Hero with a short tagline (Azerbaijani: "Premium rəqəmsal abunəliklər sərfəli qiymətə"), featured product cards (ChatGPT Plus, Netflix, Spotify, YouTube Premium, etc.), and a button to the catalog.
2. **Catalog screen**: Filterable grid of all products. Each product card shows: image, name, price in AZN, short description, and a "Add to cart" button.
3. **Product detail screen**: Full product info, localized description (RU/AZ/EN), perks list, price, and CTA to add to cart.
4. **Cart**: Add/remove items, see total in AZN, unique cart share link. Checkout CTA opens Telegram or Instagram with a pre-filled message containing the cart link (https://2gshop.com/cart/{cartId}). Instagram should fallback to copying the message since Instagram DMs cannot be pre-filled via URL.
5. **Contact screen**: Live chat with the operator (same as website). Use the existing Supabase support chat backend. Also include Telegram and Instagram contact buttons.
6. **Language switcher**: Support RU, AZ, EN. Persist selection in AsyncStorage. Use the same translations as the website where possible.
7. **Admin screen**: Hidden route `/admin` protected by admin password. Allow viewing support messages and managing products (CRUD). Reuse the same admin password as the website.

**Backend**
- Use the existing Supabase project (URL and anon key should be placed in `.env`).
- Fetch products from the `products` table.
- Carts via the `carts` table.
- Support messages via the existing chat tables.
- Social links (Telegram, Instagram) from `site_settings`.

**Technical requirements**
- Expo SDK 52+ with `expo-router` or `react-navigation`.
- TypeScript strictly enabled.
- Use `react-native-reanimated` for smooth animations matching the site.
- Use `expo-image` for optimized images.
- Use `@supabase/supabase-js` for backend calls.
- Support iOS and Android. Build configuration for iOS first.
- Use `.env` with `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
- Add a README with setup, install, and run instructions (`npm install`, `npx expo start`, EAS build setup).
- Include basic error handling, loading states, and empty states.

**Project structure**
```
app/
  (tabs)/
    index.tsx       # Home
    catalog.tsx     # Catalog
    cart.tsx        # Cart
    contact.tsx     # Contact
  admin.tsx         # Hidden admin route
  p/[slug].tsx      # Product detail
components/         # Reusable UI
lib/                # Supabase client, i18n, cart store
assets/             # Logo, splash, icons
```

**Deliverables**
1. Fully functional Expo project.
2. Screens: Home, Catalog, Product Detail, Cart, Contact, Admin.
3. Shared cart logic with Telegram/Instagram checkout.
4. Live support chat integration.
5. README and `.env.example`.
6. App icon and splash screen generated.

Please scaffold the project first, then implement screens one by one, and verify each compiles. Use the same 2G SHOP brand as the website.

---

## Next step
After you review/revise this prompt, paste it into ChatGPT/Codex and push the generated code to your repository. If you want me to refine the prompt (shorter, longer, different stack), say so.
