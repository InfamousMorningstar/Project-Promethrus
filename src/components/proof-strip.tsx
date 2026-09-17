"use client";

import { animate, motion, useInView } from "motion/react";
import { useReducedMotion } from "@/components/use-reduced-motion";
import { useEffect, useRef } from "react";
import { proof } from "@/lib/site";

function Ticker({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView) return;
    if (reduce) {
      el.textContent = String(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => (el.textContent = String(Math.round(v))),
    });
    return () => controls.stop();
  }, [inView, reduce, value]);

  // Server HTML carries the real number, so it reads correctly before hydration and without JS.
  return (
    <span ref={ref} className="tabular-nums">
      {value}
    </span>
  );
}

export function ProofStrip() {
  return (
    <section aria-label="At a glance" className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
      <div className="rule" />
      <dl className="grid grid-cols-2 gap-y-10 py-12 md:grid-cols-4 md:py-14">
        {proof.map((item, i) => (
          <motion.div
            key={item.label}
            className={`flex flex-col gap-3 pr-6 ${i > 0 ? "md:border-l md:border-line md:pl-8" : ""}`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <dt className="order-2 max-w-[22ch] text-sm leading-snug text-muted">{item.label}</dt>
            <dd className="order-1 text-5xl font-extrabold tracking-[-0.05em] md:text-6xl">
              {item.prefix}
              <Ticker value={item.value} />
            </dd>
          </motion.div>
        ))}
      </dl>
      <div className="rule" />
    </section>
  );
}
