export const brand = {
  purple: "#9b2fff",
  green: "#06d25e",
};

export const accent = {
  blue: "#2e73f6",
  cyan: "#10c6df",
  amber: "#f59e0b",
  orange: "#ff6a00",
  green: "#06d25e",
  red: "#ef4444",
  purple: "#9b2fff",
  pink: "#f2389d",
  teal: "#14b8a6",
  indigo: "#6366f1",
};

export const status = {
  success: "#00c853",
  info: "#2979ff",
  warning: "#ffab00",
  danger: "#ff4d4d",
};

export const dark = {
  bgPrimary: "#0d1117",
  bgCard: "#161f30",
  bgInput: "#0d121f",
  textMain: "#e2e8f0",
  textMuted: "#8892a4",
  border: "#243048",
};

export const light = {
  bgPrimary: "#f6f6f7",
  bgCard: "#ffffff",
  bgInput: "#f0f2f5",
  textMain: "#12284a",
  textMuted: "#6c757d",
  border: "#dddddf",
};

export type ThemeColors = typeof dark;

export function getTheme(scheme: string | null | undefined): ThemeColors {
  return scheme === "light" ? light : dark;
}
