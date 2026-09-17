"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

// Motion honours prefers-reduced-motion globally (transform and layout animations are skipped),
// so components render identical markup on the server and client instead of branching on it.
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
