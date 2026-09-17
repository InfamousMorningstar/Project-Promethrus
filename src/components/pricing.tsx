"use client";

import { ArrowRightIcon, CheckIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useId, useState } from "react";
import { billingNotes, buyoutNote, cad, extras, ownership, plans, terms, type Billing, type Plan } from "@/lib/site";
import { ButtonLink } from "./button-link";
import { announcePlan } from "./plan-intent";
import { Reveal } from "./reveal";
import { SectionTitle } from "./section-title";
import { SpotlightCard } from "./spotlight-card";
import { useReducedMotion } from "./use-reduced-motion";

const ease = [0.16, 1, 0.3, 1] as const;

const inlineLink = "font-semibold text-ink underline decoration-accent/50 underline-offset-4 transition-colors hover:text-accent";

const options: { value: Billing; label: string; note?: string }[] = [
  { value: "upfront", label: "Pay upfront" },
  { value: "monthly", label: "Pay monthly", note: "$0 to start" },
];

// Native radios, so arrow keys move between the two options like any radio group.
function BillingSwitch({ value, onChange }: { value: Billing; onChange: (b: Billing) => void }) {
  const reduce = useReducedMotion();
  const name = useId();

  return (
    <div role="radiogroup" aria-label="How you pay" className="inline-flex rounded-full border border-line bg-surface p-1 shadow-panel">
      {options.map((o) => {
        const checked = o.value === value;
        return (
          <label
            key={o.value}
            className={`relative inline-flex cursor-pointer select-none items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-300 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent ${
              checked ? "text-ink" : "text-muted hover:text-ink"
            }`}
          >
            <input type="radio" name={name} value={o.value} checked={checked} onChange={() => onChange(o.value)} className="sr-only" />
            {checked && (
              <motion.span
                layoutId="billing-pill"
                aria-hidden
                className="absolute inset-0 rounded-full border border-line-strong bg-surface-strong"
                transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 34 }}
              />
            )}
            <span className="relative">{o.label}</span>
            {o.note && (
              <span className="relative rounded-full bg-accent-soft px-2 py-0.5 text-xs font-semibold text-accent">{o.note}</span>
            )}
          </label>
        );
      })}
    </div>
  );
}

function Price({ plan, billing }: { plan: Plan; billing: Billing }) {
  const reduce = useReducedMotion();
  const amount = billing === "upfront" ? plan.upfront : plan.monthly;

  return (
    <div className="mt-8">
      <div className="flex items-baseline gap-2">
        {plan.from && <span className="text-sm font-medium text-soft">From</span>}
        {/* The number rolls to its new value when the payment option changes. */}
        <span className="relative inline-flex overflow-hidden py-1 text-[3.25rem] leading-none font-extrabold tracking-[-0.05em] tabular-nums md:text-6xl">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={billing}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: "70%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: "-70%" }}
              transition={{ duration: 0.5, ease }}
            >
              {cad(amount)}
            </motion.span>
          </AnimatePresence>
        </span>
        <span className="text-sm font-medium text-soft">{billing === "upfront" ? "one time" : "a month"}</span>
      </div>
      <p className="mt-2 text-sm text-muted">
        {billing === "upfront"
          ? `Plus hosting from ${cad(terms.hosting)} a month`
          : `Hosting and edits included, ${terms.minimumMonths}-month minimum`}
      </p>
    </div>
  );
}

function PlanCard({ plan, billing }: { plan: Plan; billing: Billing }) {
  return (
    <SpotlightCard className={`flex flex-col p-7 md:p-9 ${plan.recommended ? "lg:-my-4 lg:py-12" : ""}`}>
      {plan.recommended && (
        <>
          <div aria-hidden className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-accent/40 ring-inset" />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-48 bg-[radial-gradient(60%_100%_at_50%_0%,rgb(124_58_237/0.16),transparent)]"
          />
        </>
      )}

      <div className="flex items-center justify-between gap-4">
        <h3 className="text-2xl font-bold tracking-[-0.03em]">{plan.name}</h3>
        {plan.recommended && (
          <span className="rounded-full border border-accent/30 bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
            Recommended
          </span>
        )}
      </div>
      <p className="mt-3 max-w-[34ch] leading-relaxed text-muted">{plan.summary}</p>

      <Price plan={plan} billing={billing} />

      {/* The list grows to fill the card, so every button lines up along the bottom. */}
      <ul className="mt-8 grid flex-1 content-start gap-3 border-t border-line pt-8">
        {plan.features.map((f) => (
          <li key={f} className="flex gap-3 leading-snug">
            <CheckIcon size={16} weight="bold" className="mt-0.5 shrink-0 text-accent" aria-hidden />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <ButtonLink
        href="#contact"
        variant={plan.recommended ? "primary" : "ghost"}
        onClick={() =>
          announcePlan({
            need: plan.id === "custom" ? "Web app" : "Website",
            payment: billing === "upfront" ? "Pay upfront" : "Pay monthly",
          })
        }
        className="mt-10 h-12 w-full text-[15px]"
        aria-label={`Start a project: ${plan.name}, paying ${billing}`}
      >
        Start a project
        <ArrowRightIcon size={16} weight="bold" className="transition-transform duration-300 group-hover:translate-x-0.5" />
      </ButtonLink>
    </SpotlightCard>
  );
}

export function Pricing() {
  const [billing, setBilling] = useState<Billing>("upfront");
  const reduce = useReducedMotion();
  const details = billingNotes[billing];

  return (
    <section id="pricing" aria-labelledby="pricing-title" className="band scroll-mt-20">
      <div className="mx-auto max-w-[1400px] px-4 py-24 sm:px-6 md:py-32 lg:px-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <SectionTitle id="pricing-title" lines={["Clear", "pricing"]} />
            <p className="mt-6 max-w-[48ch] text-lg leading-relaxed text-muted">
              Pay for the build once, or start for $0 and pay monthly. Top-rated Calgary agencies start at $5,000 or more.
            </p>
          </div>
          <Reveal delay={0.1} className="shrink-0">
            <BillingSwitch value={billing} onChange={setBilling} />
          </Reveal>
        </div>

        {/* Extra top margin on large screens leaves room for the raised recommended card. */}
        <div className="mt-14 grid items-stretch gap-4 lg:mt-20 lg:grid-cols-3 lg:gap-5">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} billing={billing} />
          ))}
        </div>

        <div className="mt-14 grid gap-8 border-t border-line pt-10 lg:mt-20 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <AnimatePresence mode="wait" initial={false}>
              <motion.h3
                key={billing}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease }}
                className="text-2xl font-bold tracking-[-0.03em]"
              >
                {details.title}
              </motion.h3>
            </AnimatePresence>
            <p className="mt-2 text-muted">Every project starts with a written quote you approve.</p>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.ul
              key={billing}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease }}
              className="grid gap-x-10 gap-y-4 sm:grid-cols-2 lg:col-span-8"
            >
              {details.notes.map((note) => (
                <li key={note} className="flex gap-3 leading-relaxed text-muted">
                  <CheckIcon size={16} weight="bold" className="mt-1 shrink-0 text-accent" aria-hidden />
                  <span>{note}</span>
                </li>
              ))}
            </motion.ul>
          </AnimatePresence>
        </div>

        <Reveal className="mt-16 lg:mt-20">
          <h3 className="text-2xl font-bold tracking-[-0.03em]">Who owns what</h3>
          <p className="mt-2 text-muted">The same on every plan, upfront or monthly.</p>
          <dl className="mt-8 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {ownership.map((o) => {
              const yours = o.owner === "You";
              return (
                <div key={o.item} className={`border-t-2 pt-5 ${yours ? "border-accent-fill" : "border-line-strong"}`}>
                  <dt className="flex items-center justify-between gap-3">
                    <span className="font-semibold">{o.item}</span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        yours ? "bg-accent-soft text-accent" : "border border-line-strong text-muted"
                      }`}
                    >
                      {yours ? "Yours" : "AHMXD"}
                    </span>
                  </dt>
                  <dd className="mt-2 text-sm leading-relaxed text-muted">{o.note}</dd>
                </div>
              );
            })}
          </dl>
          <p className="mt-8 max-w-[70ch] leading-relaxed text-muted">
            {buyoutNote}{" "}
            <a href="#contact" className={inlineLink}>
              Let&apos;s talk about it.
            </a>{" "}
            The full licence terms are in the{" "}
            <Link href="/terms#intellectual-property" className={inlineLink}>
              Terms of Service
            </Link>
            .
          </p>
        </Reveal>

        <Reveal className="mt-16 lg:mt-20">
          <h3 className="text-2xl font-bold tracking-[-0.03em]">Also priced</h3>
          {/* 1px gaps over a line-coloured backing draw the dividers at every breakpoint. */}
          <dl className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-line bg-line shadow-panel sm:grid-cols-2 lg:grid-cols-5">
            {extras.map((x, i) => (
              <div
                key={x.name}
                className={`flex flex-col bg-surface p-6 md:p-7 ${i === extras.length - 1 ? "sm:col-span-2 lg:col-span-1" : ""}`}
              >
                <dt className="font-semibold">{x.name}</dt>
                <dd className="mt-4 flex flex-col gap-3">
                  <span className="flex items-baseline gap-1.5">
                    {x.from && <span className="text-sm text-soft">From</span>}
                    <span className="text-3xl font-extrabold tracking-[-0.04em] tabular-nums">{cad(x.amount)}</span>
                    {x.unit && <span className="text-sm text-soft">{x.unit}</span>}
                  </span>
                  <span className="text-sm leading-relaxed text-muted">{x.body}</span>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
