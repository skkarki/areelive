import { useEffect, useRef, useState } from "react";
import { Moon, Sun, SunMoon } from "lucide-react";
import { THEME_STORAGE_KEY } from "@/lib/theme";

export function ThemeToggle() {
  const [dark, setDark] = useState<boolean | null>(null);
  const preference = useRef<string | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = (isDark: boolean) => {
      document.documentElement.classList.toggle("dark", isDark);
      setDark(isDark);
    };
    const readPreference = () => {
      try {
        preference.current = localStorage.getItem(THEME_STORAGE_KEY);
      } catch {
        /* Storage may be disabled. */
      }
      apply(preference.current === "dark" || (preference.current !== "light" && media.matches));
    };
    const onSystemChange = () => {
      if (preference.current !== "light" && preference.current !== "dark") apply(media.matches);
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === THEME_STORAGE_KEY || event.key === null) readPreference();
    };
    readPreference();
    media.addEventListener("change", onSystemChange);
    window.addEventListener("storage", onStorage);
    return () => {
      media.removeEventListener("change", onSystemChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const label = dark === null ? "Switch color theme" : `Switch to ${dark ? "light" : "dark"} theme`;
  const Icon = dark === null ? SunMoon : dark ? Sun : Moon;

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() => {
        const next = !document.documentElement.classList.contains("dark");
        preference.current = next ? "dark" : "light";
        try {
          localStorage.setItem(THEME_STORAGE_KEY, preference.current);
        } catch {
          /* Apply even without storage. */
        }
        document.documentElement.classList.toggle("dark", next);
        setDark(next);
      }}
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <Icon aria-hidden="true" className="h-4 w-4" />
    </button>
  );
}
