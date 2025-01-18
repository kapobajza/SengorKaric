import cookie from "cookie";

import type { ThemeAppearance } from "@/web/theme/types";

const THEME_COOKIE_NAME = "theme";

export function createThemeCookie(value: ThemeAppearance) {
  return cookie.serialize(THEME_COOKIE_NAME, value, {
    maxAge: 60 * 60 * 24 * 30 * 365, // 1 year
    secure: false,
    path: "/",
    httpOnly: false,
  });
}

export function getThemeCookie(request: Request) {
  const cookieHeader = request.headers.get("Cookie");
  return cookieHeader
    ? (cookie.parse(cookieHeader)[THEME_COOKIE_NAME] as ThemeAppearance)
    : undefined;
}
