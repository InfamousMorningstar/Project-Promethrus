"use client";

import {
  BellRingingIcon,
  BookOpenTextIcon,
  CaretDownIcon,
  ChatCircleTextIcon,
  ClockCounterClockwiseIcon,
  CodeIcon,
  KeyIcon,
  LifebuoyIcon,
  LockKeyIcon,
  PasswordIcon,
} from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useId, useState, type ReactNode } from "react";
import { continuity, site } from "@/lib/site";
import { Reveal } from "./reveal";

const ICON = { size: 22, weight: "duotone" } as const;
const icons = {
  twoFactor: <PasswordIcon {...ICON} />,
  encrypted: <LockKeyIcon {...ICON} />,
  backups: <ClockCounterClockwiseIcon {...ICON} />,
  breach: <BellRingingIcon {...ICON} />,
  key: <KeyIcon {...ICON} />,
  guide: <BookOpenTextIcon {...ICON} />,
  code: <CodeIcon {...ICON} />,
  reply: <ChatCircleTextIcon {...ICON} />,
  lifebuoy: <LifebuoyIcon {...ICON} />,
} satisfies Record<(typeof continuity)[number]["icon"], ReactNode>;

const FEATURED = 3;
const credentials = [
  "SAIT Software Development diploma",
  "Mount Royal University BCIS (in progress)",
  "AWS Certified Cloud Practitioner",
  "Based in Calgary",
];
const linkClass = "font-semibold text-ink underline decoration-accent/50 underline-offset-4 transition-colors hover:text-accent";

/*
  One section for "who is behind this and can I trust them": the founder, then the promises that
  protect a client. The three strongest are always visible; the other six open with one button,
  so the section stays short without hiding anything behind hover.
*/
export function About() {
  const [showAll, setShowAll] = useState(false);
  const moreId = useId();
  const featured = continuity.slice(0, FEATURED);
  const more = continuity.slice(FEATURED);

  return (
    <section id="about" aria-labelledby="about-title" className="mx-auto max-w-[1400px] scroll-mt-24 px-4 py-20 sm:px-6 md:py-24 lg:px-10">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-4">
          <figure className="relative mx-auto max-w-sm overflow-hidden rounded-2xl border border-line bg-surface lg:mx-0">
            <Image
              src={site.photo}
              alt="Salman Ahmad, founder of AHMXD Technologies"
              width={1280}
              height={1600}
              sizes="(min-width: 1024px) 28vw, 90vw"
              className="aspect-[4/5] w-full object-cover object-[50%_20%]"
            />
          </figure>
        </Reveal>

        <div className="lg:col-span-8">
          <Reveal>
            <h2 id="about-title" className="text-[clamp(2rem,4vw,3rem)] font-extrabold leading-tight tracking-[-0.035em]">
              Who you&apos;ll work with
            </h2>
            <p className="mt-4 max-w-[56ch] text-xl leading-relaxed text-muted">
              I&apos;m Salman Ahmad. I design, build and look after every project myself, so you always talk to the
              person who did the work.
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {credentials.map((c) => (
                <li key={c} className="rounded-full border border-line px-3.5 py-1.5 text-[15px] text-muted">
                  {c}
                </li>
              ))}
            </ul>
          </Reveal>

          <div id="security" className="mt-12 scroll-mt-24">
            <h3 className="text-xl font-bold tracking-[-0.02em]">Promises that protect you</h3>
            <ul className="mt-5 grid gap-4 md:grid-cols-3">
              {featured.map((item) => (
                <li key={item.title} className="rounded-2xl border border-line bg-surface p-6 shadow-panel">
                  <span className="text-accent">{icons[item.icon]}</span>
                  <p className="mt-3 text-lg font-bold leading-snug tracking-[-0.015em]">{item.title}</p>
                  <p className="mt-2 leading-relaxed text-muted">{item.body}</p>
                </li>
              ))}
            </ul>

            <AnimatePresence initial={false}>
              {showAll && (
                <motion.ul
                  id={moreId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="grid gap-x-8 overflow-hidden md:grid-cols-2"
                >
                  {more.map((item) => (
                    <li key={item.title} className="flex gap-4 border-t border-line py-5 first:mt-6 md:[&:nth-child(2)]:mt-6">
                      <span className="mt-0.5 shrink-0 text-accent">{icons[item.icon]}</span>
                      <span>
                        <span className="block text-lg font-bold leading-snug">{item.title}</span>
                        <span className="mt-1 block leading-relaxed text-muted">{item.body}</span>
                      </span>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <button
                type="button"
                aria-expanded={showAll}
                aria-controls={moreId}
                onClick={() => setShowAll((v) => !v)}
                className="inline-flex min-h-12 items-center gap-2 rounded-full border border-line-strong px-5 text-[15px] font-semibold transition-colors hover:border-accent hover:text-accent"
              >
                {showAll ? "Show fewer promises" : `Show all ${continuity.length} promises`}
                <CaretDownIcon
                  size={16}
                  weight="bold"
                  aria-hidden
                  className={`transition-transform duration-300 ${showAll ? "rotate-180" : ""}`}
                />
              </button>
              <p className="text-muted">
                Details in the{" "}
                <Link href="/privacy#security" className={linkClass}>
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link href="/terms" className={linkClass}>
                  Terms
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
