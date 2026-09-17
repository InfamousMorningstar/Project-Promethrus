"use client";

import { PlusIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/components/use-reduced-motion";
import { useId, useState } from "react";
import { faqs } from "@/lib/site";
import { SectionTitle } from "./section-title";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const reduce = useReducedMotion();
  const baseId = useId();

  return (
    <section id="faq" aria-labelledby="faq-title" className="band scroll-mt-20">
      <div className="mx-auto max-w-[920px] px-4 py-24 sm:px-6 md:py-32">
        <SectionTitle id="faq-title" lines={["Questions"]} align="center" />

        <div className="mt-14 rounded-2xl border border-line bg-surface shadow-panel">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            const panelId = `${baseId}-panel-${i}`;
            const buttonId = `${baseId}-button-${i}`;
            return (
              <div key={item.q} className={i > 0 ? "border-t border-line" : ""}>
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-6 px-6 py-6 text-left text-lg font-semibold tracking-[-0.015em] transition-colors hover:text-accent md:px-8"
                  >
                    {item.q}
                    <motion.span
                      aria-hidden
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 22 }}
                      className={`grid size-8 shrink-0 place-items-center rounded-full border transition-colors ${
                        isOpen ? "border-accent text-accent" : "border-line-strong text-muted"
                      }`}
                    >
                      <PlusIcon size={14} weight="bold" />
                    </motion.span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      animate={reduce ? { opacity: 1 } : { height: "auto", opacity: 1 }}
                      exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-[62ch] px-6 pb-7 leading-relaxed text-muted md:px-8">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
