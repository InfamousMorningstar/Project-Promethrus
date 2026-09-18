"use client";

import { ArrowRightIcon, CheckIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { billingNotes, buyoutNote, cad, extras, ownership, plans, scopeNotes, steps, terms, type Billing, type Plan } from "@/lib/site";
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
  { value: "monthly", label: "Pay monthly", note: "Low upfront" },
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
  const upfront = billing === "upfront";
  const amount = upfront ? plan.upfront : plan.monthly;
  // What is paid before design starts, shown on the card itself rather than only in the fine print.
  const depositLabel = upfront ? `${terms.depositPercent}% down payment` : `${terms.monthlyDepositMonths} months upfront`;
  const depositAmount = upfront
    ? Math.round((plan.upfront * terms.depositPercent) / 100)
    : plan.monthly * terms.monthlyDepositMonths;
  const from = plan.from ? "From " : "";
  const toStart = upfront
    ? `${from}${cad(depositAmount)} to start, the rest at launch.`
    : `${from}${cad(depositAmount)} to start, then ${cad(plan.monthly)} a month.`;

  return (
    <div className="mt-8">
      {plan.from && <span className="block text-sm font-medium text-soft">Starting from</span>}
      {/* The number never shrinks; if the row is tight, the payment labels wrap below it. */}
      <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
        {/* The number rolls to its new value when the payment option changes. */}
        <span className="relative inline-flex shrink-0 overflow-hidden py-1 text-[2.9rem] leading-none font-extrabold tracking-[-0.05em] tabular-nums sm:text-[3.25rem] xl:text-[3.6rem]">
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
        <span className="flex flex-col whitespace-nowrap text-sm font-medium leading-snug">
          <span className="text-soft">{upfront ? "one time" : "a month"}</span>
          <span className="font-semibold text-accent">{depositLabel}</span>
        </span>
      </div>
      <p className="mt-3 text-[15px] leading-relaxed text-muted">
        <span className="font-semibold text-ink">{toStart}</span>{" "}
        {upfront
          ? `Plus hosting from ${cad(terms.hosting)} a month.`
          : `Hosting and edits included, ${terms.minimumMonths}-month minimum.`}
      </p>
    </div>
  );
}

function PlanCard({ plan, billing, shownOnPhone }: { plan: Plan; billing: Billing; shownOnPhone: boolean }) {
  return (
    <SpotlightCard
      id={`plan-${plan.id}`}
      className={`${shownOnPhone ? "flex" : "hidden lg:flex"} flex-col p-7 md:p-9 ${plan.recommended ? "lg:-my-4 lg:py-12" : ""}`}
    >
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
      <p className="mt-3 max-w-[34ch] text-lg leading-relaxed text-muted">{plan.summary}</p>

      <Price plan={plan} billing={billing} />

      {/* The list grows to fill the card, so every button lines up along the bottom. */}
      <ul className="mt-8 grid flex-1 content-start gap-3 border-t border-line pt-8">
        {plan.features.map((f) => (
          <li key={f} className="flex gap-3 text-[17px] leading-snug">
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

// The whole process on one line, so nobody has to scroll through a timeline to learn it.
function Stepper() {
  return (
    <div>
      <h3 className="text-lg font-semibold">How it works</h3>
      <ol className="mt-4 grid grid-cols-3 gap-x-3 gap-y-4 sm:grid-cols-6">
        {steps.map((step, i) => (
          <li key={step.title} className="flex flex-col gap-2 border-t-2 border-line-strong pt-3 first:border-accent-fill">
            <span className="font-mono text-[13px] text-soft">{String(i + 1).padStart(2, "0")}</span>
            <span className="text-[17px] font-semibold leading-tight">{step.title}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

type DetailTab = "terms" | "scope" | "ownership" | "extras";
const detailTabs: { id: DetailTab; label: string }[] = [
  { id: "terms", label: "Payment terms" },
  { id: "scope", label: "Scope and changes" },
  { id: "ownership", label: "Who owns what" },
  { id: "extras", label: "Other services" },
];

// The fine print lives in three tabs, so only one block is ever on screen.
function Details({ billing }: { billing: Billing }) {
  const [tab, setTab] = useState<DetailTab>("terms");
  const baseId = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const reduce = useReducedMotion();
  const details = billingNotes[billing];

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const last = detailTabs.length - 1;
    const keys: Record<string, number> = {
      ArrowRight: i === last ? 0 : i + 1,
      ArrowLeft: i === 0 ? last : i - 1,
      Home: 0,
      End: last,
    };
    const to = keys[e.key];
    if (to === undefined) return;
    e.preventDefault();
    setTab(detailTabs[to].id);
    refs.current[to]?.focus();
  };

  return (
    <div>
      <div role="tablist" aria-label="Pricing details" className="flex flex-wrap gap-2">
        {detailTabs.map((t, i) => {
          const selected = t.id === tab;
          return (
            <button
              key={t.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${t.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setTab(t.id)}
              onKeyDown={(e) => onKey(e, i)}
              className={`inline-flex min-h-12 items-center rounded-full border px-5 text-[16px] font-semibold transition-colors ${
                selected ? "border-accent bg-accent-soft text-accent" : "border-line-strong text-muted hover:border-soft hover:text-ink"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={tab === "terms" ? `terms-${billing}` : tab}
          id={`${baseId}-panel`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${tab}`}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease }}
          className="mt-6"
        >
          {tab === "terms" && (
            <>
              <p className="text-lg font-semibold">{details.title}</p>
              <ul className="mt-4 grid gap-x-10 gap-y-3 md:grid-cols-2">
                {details.notes.map((note) => (
                  <li key={note} className="flex gap-3 text-[17px] leading-relaxed text-muted">
                    <CheckIcon size={16} weight="bold" className="mt-1.5 shrink-0 text-accent" aria-hidden />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {tab === "scope" && (
            <>
              <p className="text-lg text-muted">What your price covers, so there are no surprises later.</p>
              <ul className="mt-4 grid gap-x-10 gap-y-3 md:grid-cols-2">
                {scopeNotes.map((note) => (
                  <li key={note} className="flex gap-3 text-[17px] leading-relaxed text-muted">
                    <CheckIcon size={16} weight="bold" className="mt-1.5 shrink-0 text-accent" aria-hidden />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {tab === "ownership" && (
            <>
              <p className="text-lg text-muted">The same on every plan, upfront or monthly.</p>
              <dl className="mt-5 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
                {ownership.map((o) => {
                  const yours = o.owner === "You";
                  return (
                    <div key={o.item} className={`border-t-2 pt-4 ${yours ? "border-accent-fill" : "border-line-strong"}`}>
                      <dt className="flex items-center justify-between gap-3">
                        <span className="text-[17px] font-semibold">{o.item}</span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[13px] font-semibold ${
                            yours ? "bg-accent-soft text-accent" : "border border-line-strong text-muted"
                          }`}
                        >
                          {yours ? "Yours" : "AHMXD"}
                        </span>
                      </dt>
                      <dd className="mt-2 leading-relaxed text-muted">{o.note}</dd>
                    </div>
                  );
                })}
              </dl>
              <p className="mt-6 max-w-[70ch] text-[17px] leading-relaxed text-muted">
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
            </>
          )}

          {tab === "extras" && (
            <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-5">
              {extras.map((x) => (
                <div key={x.name} className="border-t-2 border-line-strong pt-4">
                  <dt className="text-[17px] font-semibold">{x.name}</dt>
                  <dd className="mt-2">
                    <span className="flex flex-wrap items-baseline gap-x-1.5">
                      {x.from && <span className="text-soft">From</span>}
                      <span className="text-2xl font-extrabold tracking-[-0.03em] tabular-nums">{cad(x.amount)}</span>
                      {x.unit && <span className="text-soft">{x.unit}</span>}
                    </span>
                    <span className="mt-1 block leading-relaxed text-muted">{x.body}</span>
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function Pricing() {
  const [billing, setBilling] = useState<Billing>("upfront");
  // Phones show one plan at a time (picked with big buttons, no swiping); wide screens show all three.
  const [picked, setPicked] = useState<Plan["id"]>(plans.find((p) => p.recommended)?.id ?? plans[0].id);

  return (
    <section id="pricing" aria-labelledby="pricing-title" className="band scroll-mt-24">
      <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 md:py-24 lg:px-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <SectionTitle id="pricing-title" lines={["Clear", "pricing"]} sizeClassName="text-[clamp(2.25rem,4.6vw,4rem)]" />
            <p className="mt-5 max-w-[48ch] text-lg leading-relaxed text-muted">
              Competitive, honest prices: a fixed quote for a clearly agreed scope, well below the $5,000 or more that top-rated Calgary agencies start at.
            </p>
          </div>
          <Reveal delay={0.1} className="shrink-0">
            <BillingSwitch value={billing} onChange={setBilling} />
          </Reveal>
        </div>

        <div className="mt-12">
          <Stepper />
        </div>

        <div role="group" aria-label="Choose a plan to view" className="mt-10 grid grid-cols-3 gap-2 lg:hidden">
          {plans.map((p) => (
            <button
              key={p.id}
              type="button"
              aria-pressed={picked === p.id}
              aria-controls={`plan-${p.id}`}
              onClick={() => setPicked(p.id)}
              className={`min-h-12 rounded-full border px-2 text-[16px] font-semibold transition-colors ${
                picked === p.id ? "border-accent bg-accent-soft text-accent" : "border-line-strong text-muted"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        {/* Extra top margin on large screens leaves room for the raised recommended card. */}
        <div className="mt-4 grid items-stretch gap-4 lg:mt-16 lg:grid-cols-3 lg:gap-5">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} billing={billing} shownOnPhone={plan.id === picked} />
          ))}
        </div>

        <div className="mt-12 border-t border-line pt-10 lg:mt-16">
          <Details billing={billing} />
        </div>
      </div>
    </section>
  );
}
