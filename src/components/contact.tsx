"use client";

import {
  ArrowRightIcon,
  CheckIcon,
  CopyIcon,
  EnvelopeSimpleIcon,
  GithubLogoIcon,
  LinkedinLogoIcon,
} from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/components/use-reduced-motion";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { needs, payments, site, timelines } from "@/lib/site";
import { onPlanAnnounced } from "./plan-intent";
import { DecryptedText } from "./reactbits/decrypted-text";
import { Reveal } from "./reveal";
import { SectionTitle } from "./section-title";

type Errors = Partial<Record<"needs" | "name" | "email" | "details", string>>;

const inputClass =
  "w-full rounded-xl border border-line-strong bg-bg px-4 py-3 text-ink placeholder:text-soft transition-colors hover:border-soft focus:border-accent focus:outline-none focus-visible:outline-2 focus-visible:outline-accent aria-[invalid=true]:border-[#f87171]";

function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied((c) => (c === key ? null : c)), 2000);
    } catch {
      setCopied(null);
    }
  };
  return { copied, copy };
}

function Chip({
  type,
  name,
  value,
  checked,
  onChange,
}: {
  type: "checkbox" | "radio";
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label
      className={`relative inline-flex cursor-pointer select-none items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent ${
        checked
          ? "border-accent bg-accent-soft text-accent"
          : "border-line-strong text-muted hover:border-soft hover:text-ink"
      }`}
    >
      <input type={type} name={name} value={value} checked={checked} onChange={onChange} className="sr-only" />
      {checked && <CheckIcon size={13} weight="bold" aria-hidden />}
      {value}
    </label>
  );
}

export function Contact() {
  const reduce = useReducedMotion();
  const { copied, copy } = useCopy();
  const [selected, setSelected] = useState<string[]>([]);
  const [timeline, setTimeline] = useState<string>("");
  const [payment, setPayment] = useState<string>("");
  const [form, setForm] = useState({ name: "", business: "", email: "", details: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [brief, setBrief] = useState<string | null>(null);

  // A pricing button carries its plan here, so the matching answers arrive already picked.
  useEffect(
    () =>
      onPlanAnnounced(({ need, payment }) => {
        setSelected((cur) => (cur.includes(need) ? cur : [...cur.filter((n) => n !== "Not sure yet"), need]));
        setPayment(payment);
        setErrors((er) => ({ ...er, needs: undefined }));
        setBrief(null);
      }),
    [],
  );

  const toggleNeed = (n: string) =>
    setSelected((cur) => (cur.includes(n) ? cur.filter((x) => x !== n) : [...cur, n]));

  const validate = (): Errors => {
    const e: Errors = {};
    if (selected.length === 0) e.needs = "Pick at least one, or choose “Not sure yet”.";
    if (!form.name.trim()) e.name = "Add your name so the reply can be addressed to you.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = "Enter an email address the reply can go to.";
    if (form.details.trim().length < 20) e.details = "A couple of sentences is enough. What should it do, and for whom?";
    return e;
  };

  const onSubmit = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) {
      // Move focus to the first field that needs attention, in form order.
      const form = ev.currentTarget;
      const firstKey = (["needs", "name", "email", "details"] as const).find((k) => e[k]);
      const selector = firstKey === "needs" ? "input[name='needs']" : `#contact-${firstKey}`;
      form.querySelector<HTMLElement>(selector)?.focus();
      return;
    }

    const who = form.business.trim() || form.name.trim();
    const header = [
      `Name: ${form.name.trim()}`,
      form.business.trim() && `Business: ${form.business.trim()}`,
      `Reply to: ${form.email.trim()}`,
      `Needs: ${selected.join(", ")}`,
      payment && `Payment: ${payment}`,
      timeline && `Timeline: ${timeline}`,
    ].filter(Boolean);
    const text = `${header.join("\n")}\n\n${form.details.trim()}`;

    const subject = `Project brief: ${selected.join(", ")} for ${who}`;
    setBrief(`${subject}\n\n${text}`);
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
  };

  const field = (key: keyof typeof form) => ({
    id: `contact-${key}`,
    name: key,
    value: form[key],
    onChange: (e: { target: { value: string } }) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
      if (errors[key as keyof Errors]) setErrors((er) => ({ ...er, [key]: undefined }));
    },
    "aria-invalid": errors[key as keyof Errors] ? true : undefined,
    "aria-describedby": `contact-${key}-hint${errors[key as keyof Errors] ? ` contact-${key}-error` : ""}`,
  });

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative isolate scroll-mt-20 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(42%_48%_at_78%_48%,rgb(124_58_237/0.13),transparent_100%)]"
      />
      <div className="mx-auto grid max-w-[1400px] gap-14 px-4 py-24 sm:px-6 md:py-32 lg:grid-cols-12 lg:gap-16 lg:px-10">
        <div className="lg:col-span-7">
          <Reveal>
            <p className="label text-accent">
              <DecryptedText text="Start a project" animateOn="view" />
            </p>
            <SectionTitle id="contact-title" lines={["Let's build", "something"]} className="mt-5" />
            <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-muted">
              Pick what you need. Your email app writes the rest.
            </p>
          </Reveal>

          <AnimatePresence mode="wait" initial={false}>
            {brief ? (
              <motion.div
                key="done"
                role="status"
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="mt-12 rounded-2xl border border-line bg-surface p-7 shadow-panel md:p-9"
              >
                <span className="grid size-11 place-items-center rounded-full bg-accent-soft text-accent">
                  <CheckIcon size={20} weight="bold" />
                </span>
                <h3 className="mt-6 text-2xl font-bold tracking-[-0.03em]">Your brief is ready in your email app</h3>
                <p className="mt-3 max-w-[54ch] leading-relaxed text-muted">
                  Nothing is sent until you press send there. If no email app opened, copy the brief and send it to{" "}
                  <span className="font-medium text-ink">{site.email}</span>.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => copy("brief", brief)}
                    className="inline-flex h-11 items-center gap-2 rounded-full bg-accent-fill px-5 text-sm font-semibold text-accent-contrast transition-colors hover:bg-[#6d28d9] active:scale-[0.98]"
                  >
                    {copied === "brief" ? <CheckIcon size={15} weight="bold" /> : <CopyIcon size={15} weight="bold" />}
                    {copied === "brief" ? "Copied" : "Copy the brief"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setBrief(null)}
                    className="inline-flex h-11 items-center rounded-full border border-line-strong px-5 text-sm font-semibold transition-colors hover:border-accent hover:text-accent"
                  >
                    Edit the brief
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                noValidate
                onSubmit={onSubmit}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="mt-12 grid gap-8"
              >
                <fieldset data-invalid={errors.needs ? true : undefined} aria-describedby="needs-error">
                  <legend className="mb-3 font-semibold">What do you need?</legend>
                  <div className="flex flex-wrap gap-2">
                    {needs.map((n) => (
                      <Chip
                        key={n}
                        type="checkbox"
                        name="needs"
                        value={n}
                        checked={selected.includes(n)}
                        onChange={() => {
                          toggleNeed(n);
                          if (errors.needs) setErrors((er) => ({ ...er, needs: undefined }));
                        }}
                      />
                    ))}
                  </div>
                  {errors.needs && (
                    <p id="needs-error" className="mt-2 text-sm text-[#dc2626] dark:text-[#f87171]">
                      {errors.needs}
                    </p>
                  )}
                </fieldset>

                <fieldset>
                  <legend className="mb-3 font-semibold">
                    How would you like to pay? <span className="font-normal text-soft">(optional)</span>
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {payments.map((p) => (
                      <Chip
                        key={p}
                        type="radio"
                        name="payment"
                        value={p}
                        checked={payment === p}
                        onChange={() => setPayment(p)}
                      />
                    ))}
                  </div>
                </fieldset>

                <fieldset>
                  <legend className="mb-3 font-semibold">
                    Timeline <span className="font-normal text-soft">(optional)</span>
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {timelines.map((t) => (
                      <Chip
                        key={t}
                        type="radio"
                        name="timeline"
                        value={t}
                        checked={timeline === t}
                        onChange={() => setTimeline(t)}
                      />
                    ))}
                  </div>
                </fieldset>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-name" className="font-semibold">
                      Your name
                    </label>
                    <input {...field("name")} autoComplete="name" className={inputClass} />
                    <p id="contact-name-hint" className="sr-only">
                      Required
                    </p>
                    {errors.name && (
                      <p id="contact-name-error" className="text-sm text-[#dc2626] dark:text-[#f87171]">
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-business" className="font-semibold">
                      Business <span className="font-normal text-soft">(optional)</span>
                    </label>
                    <input {...field("business")} autoComplete="organization" className={inputClass} />
                    <p id="contact-business-hint" className="sr-only">
                      Optional
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="contact-email" className="font-semibold">
                    Email
                  </label>
                  <input {...field("email")} type="email" autoComplete="email" inputMode="email" className={inputClass} />
                  <p id="contact-email-hint" className="text-sm text-soft">
                    Where the reply should go.
                  </p>
                  {errors.email && (
                    <p id="contact-email-error" className="text-sm text-[#dc2626] dark:text-[#f87171]">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="contact-details" className="font-semibold">
                    About the project
                  </label>
                  <textarea {...field("details")} rows={5} className={`${inputClass} resize-y`} />
                  <p id="contact-details-hint" className="text-sm text-soft">
                    What it should do, who it is for, and anything you already have (a domain, a logo, an old site).
                  </p>
                  {errors.details && (
                    <p id="contact-details-error" className="text-sm text-[#dc2626] dark:text-[#f87171]">
                      {errors.details}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                  <button
                    type="submit"
                    className="group inline-flex h-12 items-center gap-2 rounded-full bg-accent-fill px-6 text-[15px] font-semibold text-accent-contrast shadow-[inset_0_1px_0_rgb(255_255_255/0.22)] transition-colors hover:bg-[#6d28d9] active:scale-[0.98]"
                  >
                    Email the brief
                    <ArrowRightIcon
                      size={16}
                      weight="bold"
                      className="transition-transform duration-300 group-hover:translate-x-0.5"
                    />
                  </button>
                  <p className="text-sm text-soft">
                    Nothing on this form is stored or sent by the website.{" "}
                    <Link href="/privacy" className="underline underline-offset-4 transition-colors hover:text-ink">
                      Privacy Policy
                    </Link>
                  </p>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <aside className="lg:col-span-5 lg:pt-40" aria-label="Other ways to reach AHMXD">
          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-line bg-surface p-7 shadow-panel md:p-9">
              <h3 className="text-xl font-bold tracking-[-0.02em]">Prefer to write it yourself?</h3>
              <p className="mt-2 leading-relaxed text-muted">Every message is read and answered by Salman directly.</p>

              <div className="mt-7 flex items-center justify-between gap-3 rounded-xl border border-line bg-bg-raised p-2 pl-4">
                <a
                  href={`mailto:${site.email}`}
                  className="flex min-w-0 items-center gap-3 font-medium transition-colors hover:text-accent"
                >
                  <EnvelopeSimpleIcon size={18} weight="bold" className="shrink-0 text-accent" aria-hidden />
                  <span className="truncate">{site.email}</span>
                </a>
                <button
                  type="button"
                  onClick={() => copy("email", site.email)}
                  aria-label={copied === "email" ? "Email address copied" : "Copy email address"}
                  className="grid size-10 shrink-0 place-items-center rounded-lg border border-line text-muted transition-colors hover:border-line-strong hover:text-ink"
                >
                  {copied === "email" ? <CheckIcon size={16} weight="bold" /> : <CopyIcon size={16} weight="bold" />}
                </button>
              </div>

              <ul className="mt-6 grid gap-1">
                <li>
                  <a
                    href={site.links.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-lg py-2.5 text-muted transition-colors hover:text-ink"
                  >
                    <LinkedinLogoIcon size={18} weight="bold" aria-hidden />
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href={site.links.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-lg py-2.5 text-muted transition-colors hover:text-ink"
                  >
                    <GithubLogoIcon size={18} weight="bold" aria-hidden />
                    GitHub
                  </a>
                </li>
              </ul>

              <div className="mt-6 border-t border-line pt-6 text-sm leading-relaxed text-soft">
                Based in Calgary, Alberta, on Mountain Time. Meetings in person around Calgary, or over video anywhere
                else.
              </div>
            </div>
          </Reveal>
        </aside>
      </div>
    </section>
  );
}
