export const UP_THEME_KEY = "up-theme";

export function isDarkTheme() {
  return document.documentElement.classList.contains("dark");
}

export function applyTheme(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
  try {
    localStorage.setItem(UP_THEME_KEY, dark ? "dark" : "light");
  } catch {
    /* private mode */
  }
}

export function toggleTheme() {
  const next = !isDarkTheme();
  applyTheme(next);
  return next;
}
