import type { ActionFunction } from "react-router";

import { getHints } from "@/web/lib/utils";
import { ThemeAppearance } from "@/web/theme/types";
import { createThemeCookie } from "@/web/lib/cookie.server";

export const action: ActionFunction = async ({ request }) => {
  const hints = getHints(request);
  let value = (await request.formData()).get("theme");

  if (!value) {
    value =
      hints.theme === ThemeAppearance.Dark
        ? ThemeAppearance.Light
        : ThemeAppearance.Dark;
  }

  return Response.json(
    { theme: value },
    {
      headers: {
        "Set-Cookie": createThemeCookie(value as ThemeAppearance),
      },
    },
  );
};
