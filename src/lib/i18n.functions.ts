import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import { LANGS, type Lang } from "./i18n";

const COOKIE_NAME = "2g_lang";
const MAX_AGE = 60 * 60 * 24 * 365; // 1 year

function isLang(value: string): value is Lang {
  return (LANGS as readonly string[]).includes(value);
}

export const getLangCookie = createServerFn({ method: "GET" }).handler(async () => {
  const raw = getCookie(COOKIE_NAME);
  return raw && isLang(raw) ? raw : null;
});

export const setLangCookie = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    if (typeof data !== "string" || !isLang(data)) {
      throw new Error("Invalid language");
    }
    return data;
  })
  .handler(async ({ data }) => {
    setCookie(COOKIE_NAME, data, {
      path: "/",
      maxAge: MAX_AGE,
      sameSite: "lax",
      secure: process.env["NODE_ENV"] === "production",
    });
    return { success: true };
  });
