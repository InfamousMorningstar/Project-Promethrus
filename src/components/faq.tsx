"use client";

import { PlusIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/components/use-reduced-motion";
import { useId, useState } from "react";
import { faqs } from "@/lib/site";
import { Reveal } from "./reveal";

type Item = (typeof faqs)[number];

function Question({ item, isOpen, onToggle, id }: { item: Item; isOpen: boolean; onToggle: () => void; id: string }) {
  const reduce = useReducedMotion();
  return (
    <div className="border-b border-line last:border-b-0">
      <h3>
        <button
          id={`${id}-button`}
          type="button"
          aria-expanded={isOpen}
          aria-controls={`${id}-panel`}
          onClick={onToggle}
          className="flex min-h-16 w-full items-center justify-between gap-6 px-6 py-5 text-left text-lg font-semibold tracking-[-0.015em] transition-colors hover:text-accent md:px-7"
        >
          {item.q}
          <motion.span
            aria-hidden
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 22 }}
            className={`grid size-9 shrink-0 place-items-center rounded-full border transition-colors ${
              isOpen ? "border-accent text-accent" : "border-line-strong text-muted"
            }`}
          >
            <PlusIcon size={15} weight="bold" />
          </motion.span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`${id}-panel`}
            role="region"
            aria-labelledby={`${id}-button`}
            initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduce ? { opacity: 1 } : { height: "auto", opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="max-w-[60ch] px-6 pb-6 text-lg leading-relaxed text-muted md:px-7">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();
  // Two columns on wide screens halve the section's height; each column is its own card.
  const half = Math.ceil(faqs.length / 2);
  const columns = [faqs.slice(0, half), faqs.slice(half)];

  return (
    <section id="faq" aria-labelledby="faq-title" className="band scroll-mt-24">
      <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 md:py-24 lg:px-10">
        <Reveal>
          <h2 id="faq-title" className="text-[clamp(2rem,4vw,3rem)] font-extrabold leading-tight tracking-[-0.035em]">
            Questions
          </h2>
        </Reveal>

        <div className="mt-10 grid items-start gap-4 lg:grid-cols-2 lg:gap-5">
          {columns.map((column, c) => (
            <div key={c} className="rounded-2xl border border-line bg-surface shadow-panel">
              {column.map((item, j) => {
                const i = c * half + j;
                return (
                  <Question
                    key={item.q}
                    item={item}
                    id={`${baseId}-${i}`}
                    isOpen={open === i}
                    onToggle={() => setOpen(open === i ? null : i)}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
