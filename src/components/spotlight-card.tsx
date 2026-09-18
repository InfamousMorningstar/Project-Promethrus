"use client";

import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import { useReducedMotion } from "@/components/use-reduced-motion";
import type { ReactNode } from "react";

// Card whose border and surface pick up a soft violet light under the cursor.
export function SpotlightCard({ children, className, id }: { children: ReactNode; className?: string; id?: string }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const glow = useMotionTemplate`radial-gradient(420px circle at ${x}px ${y}px, rgb(139 92 246 / 0.13), transparent 65%)`;
  const edge = useMotionTemplate`radial-gradient(260px circle at ${x}px ${y}px, rgb(167 139 250 / 0.55), transparent 70%)`;

  return (
    <motion.article
      id={id}
      data-stroke-hover
      className={`group/card relative isolate overflow-hidden rounded-2xl border border-line bg-surface shadow-panel ${className ?? ""}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - r.left);
        y.set(e.clientY - r.top);
      }}
      onPointerLeave={() => {
        x.set(-400);
        y.set(-400);
      }}
    >
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 -z-10" style={{ background: glow }} />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl p-px [mask:linear-gradient(#000_0_0)_content-box_exclude,linear-gradient(#000_0_0)]"
        style={{ background: edge }}
      />
      {children}
    </motion.article>
  );
}
