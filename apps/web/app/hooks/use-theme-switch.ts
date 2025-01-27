import { useMutation } from "@tanstack/react-query";
import { useFetcher } from "react-router";
import { useEffect } from "react";

import { ThemeAppearance } from "@/web/theme/types";
import { getBrowserCookieTheme } from "@/web/lib/utils";

function updateDomTheme(theme: string) {
  document.documentElement.classList.remove(
    ThemeAppearance.Light,
    ThemeAppearance.Dark,
  );
  document.documentElement.classList.add(theme);
}

export function useThemeSwitch() {
  const fetcher = useFetcher();

  useEffect(() => {
    const onChange = (event: MediaQueryListEvent) => {
      const cookieTheme = getBrowserCookieTheme();

      if (!cookieTheme) {
        updateDomTheme(
          event.matches ? ThemeAppearance.Dark : ThemeAppearance.Light,
        );
      }
    };

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", onChange);

    return () => {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", onChange);
    };
  }, []);

  return useMutation({
    async mutationFn() {
      let newTheme = getBrowserCookieTheme();

      if (!newTheme) {
        newTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
          ? ThemeAppearance.Dark
          : ThemeAppearance.Light;
      }

      newTheme =
        newTheme === ThemeAppearance.Dark
          ? ThemeAppearance.Light
          : ThemeAppearance.Dark;

      updateDomTheme(newTheme);

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
      const newTheme = getBrowserCookieTheme();

      if (newTheme) {
        updateDomTheme(newTheme);
      }
    },
  });
}
