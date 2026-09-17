"use client";

import { useSyncExternalStore } from "react";

// Shared "the loading screen has opened" flag, so intro animations wait for the reveal
// instead of playing unseen underneath the loader.
let done = false;
const listeners = new Set<() => void>();

export function markLoaderDone() {
  if (done) return;
  done = true;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useLoaderDone() {
  return useSyncExternalStore(
    subscribe,
    () => done,
    () => false,
  );
}
