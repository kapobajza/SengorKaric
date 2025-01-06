import { createContext, useContext, useState } from "react";

import { ThemeAppearance } from "@/web/theme/types";
import type { AppTheme } from "@/web/theme/types";
import { isBrowser } from "@/web/lib/utils";

type AdminThemeContext = {
  theme: AppTheme;
  setThemeAppearance: (theme: ThemeAppearance) => void;
};

const AdminThemeContext = createContext<AdminThemeContext | undefined>(
  undefined,
);

const getInitialThemeAppearance = (): ThemeAppearance => {
  if (!isBrowser()) {
    return "light";
  }

  const localStorageTheme = localStorage.getItem("theme");

  if (localStorageTheme) {
    return localStorageTheme === ThemeAppearance.Dark
      ? ThemeAppearance.Dark
      : ThemeAppearance.Light;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export function AdminThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [themeAppearance, setThemeAppearance] = useState(
    getInitialThemeAppearance(),
  );

  const updateTWTheme = (theme: ThemeAppearance) => {
    if (theme === ThemeAppearance.Dark) {
      document.documentElement.classList.add(ThemeAppearance.Dark);
      document.documentElement.classList.remove(ThemeAppearance.Light);
    } else {
      document.documentElement.classList.add(ThemeAppearance.Light);
      document.documentElement.classList.remove(ThemeAppearance.Dark);
    }
  };

  const updateTheme = (theme: ThemeAppearance) => {
    localStorage.setItem("theme", theme);
    updateTWTheme(theme);
    setThemeAppearance(theme);
  };

  const value: AdminThemeContext = {
    theme: {
      appearance: themeAppearance,
    },
    setThemeAppearance: updateTheme,
  };

  return <AdminThemeContext value={value}>{children}</AdminThemeContext>;
}

export function useAdminTheme() {
  const context = useContext(AdminThemeContext);

  if (!context) {
    throw new Error("hook must be used within AdminThemeProvider.");
  }

  return context;
}

export function useAdminThemeValue() {
  const { theme } = useAdminTheme();
  return theme;
}

export function useSetAdminThemeAppearance() {
  const { setThemeAppearance } = useAdminTheme();
  return setThemeAppearance;
}
