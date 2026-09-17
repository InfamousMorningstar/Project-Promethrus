"use client";

import { useSyncExternalStore } from "react";

export type Theme = "dark" | "light";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

const read = (): Theme => (document.documentElement.dataset.theme === "light" ? "light" : "dark");

export function useTheme() {
  const theme = useSyncExternalStore<Theme>(subscribe, read, () => "dark");

  const setTheme = (next: Theme) => {
    const apply = () => {
      document.documentElement.dataset.theme = next;
    };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (document.startViewTransition && !reduce) document.startViewTransition(apply);
    else apply();
    try {
      localStorage.setItem("ahmxd-theme", next);
    } catch {
      // Private mode or blocked storage: the choice still applies for this visit.
    }
  };

  return { theme, setTheme };
}
