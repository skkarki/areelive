export const THEME_STORAGE_KEY = "areelive-theme";

// Run before styles paint so a saved preference never flashes the other theme.
export const THEME_INIT_SCRIPT = `(() => {
  let saved;
  try { saved = localStorage.getItem("areelive-theme"); } catch {}
  const dark = saved === "dark" || (saved !== "light" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
})();`;
