import { useMutation } from "@tanstack/react-query";
import { useFetcher } from "react-router";

import { getBrowserCookieTheme } from "@/web/lib/utils";
import { ThemeAppearance } from "@/web/theme/types";

export function useThemeSwitch() {
  const fetcher = useFetcher();

  return useMutation({
    async mutationFn() {
      const newTheme = getBrowserCookieTheme();

      document.documentElement.classList.remove(
        ThemeAppearance.Light,
        ThemeAppearance.Dark,
      );
      document.documentElement.classList.add(newTheme);

      return fetcher.submit(
        {
          theme: newTheme,
        },
        {
          method: "POST",
          action: "/toggle-theme",
        },
      );
    },
    onError() {
      const oldTheme = getBrowserCookieTheme();

      document.documentElement.classList.remove(
        ThemeAppearance.Light,
        ThemeAppearance.Dark,
      );
      document.documentElement.classList.add(oldTheme);
    },
  });
}
