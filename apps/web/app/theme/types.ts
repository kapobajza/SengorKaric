export const ThemeAppearance = {
  Dark: "dark",
  Light: "light",
} as const;

export type ThemeAppearance =
  (typeof ThemeAppearance)[keyof typeof ThemeAppearance];

export type AppTheme = {
  appearance: ThemeAppearance;
};
