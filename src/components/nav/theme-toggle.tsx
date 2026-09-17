"use client";

import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "../use-theme";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const next = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} theme`}
      className={`relative grid size-10 place-items-center overflow-hidden rounded-full border border-line text-muted transition-colors duration-300 hover:border-line-strong hover:text-ink ${className}`}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={theme}
          initial={{ y: -14, opacity: 0, rotate: -60 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: 14, opacity: 0, rotate: 60 }}
          transition={{ type: "spring", stiffness: 420, damping: 28 }}
          className="grid place-items-center"
        >
          {theme === "dark" ? <SunIcon size={17} weight="bold" /> : <MoonIcon size={17} weight="bold" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
