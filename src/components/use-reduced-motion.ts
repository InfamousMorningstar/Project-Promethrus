"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

// Hydration-safe version of Motion's useReducedMotion: the server and the hydration pass both see
// `false`, then React re-renders with the real preference. Branching render output on the raw
// media query made server HTML and client props disagree for reduced-motion visitors.
export function useReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
