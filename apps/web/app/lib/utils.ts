import { clsx } from "clsx";
import type { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { getHintUtils } from "@epic-web/client-hints";
import { clientHint as colorSchemeHint } from "@epic-web/client-hints/color-scheme";

import { ThemeAppearance } from "@/web/theme/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isBrowser() {
  return typeof window !== "undefined";
}

export const hintsUtils = getHintUtils({
  theme: colorSchemeHint,
});

export const { getHints } = hintsUtils;

export function getBrowserCookieThemeRaw() {
  const cookieTheme = document.cookie
    .split("; ")
    .find((row) => row.startsWith("theme="))
    ?.split("=")[1];

  return cookieTheme;
}

export function getBrowserCookieTheme() {
  const cookieTheme = getBrowserCookieThemeRaw();

  return cookieTheme === ThemeAppearance.Light
    ? ThemeAppearance.Dark
    : ThemeAppearance.Light;
}
