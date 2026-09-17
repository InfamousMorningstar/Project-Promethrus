import {
  BellRingingIcon,
  BookOpenTextIcon,
  ChatCircleTextIcon,
  ClockCounterClockwiseIcon,
  CodeIcon,
  KeyIcon,
  LifebuoyIcon,
  LockKeyIcon,
  PasswordIcon,
} from "@phosphor-icons/react/ssr";
import Link from "next/link";
import type { ReactNode } from "react";
import { continuity } from "@/lib/site";
import { Reveal } from "./reveal";
import { SectionTitle } from "./section-title";

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

const linkClass =
  "font-semibold text-ink underline decoration-accent/50 underline-offset-4 transition-colors hover:text-accent";

// How client sites and data are protected, and what happens if the one engineer is unavailable.
export function NeverStuck() {
  return (
    <section id="security" aria-labelledby="stuck-title" className="mx-auto max-w-[1400px] scroll-mt-20 px-4 pb-24 sm:px-6 md:pb-32 lg:px-10">
      <div className="rule mb-24 md:mb-32" />
      <SectionTitle id="stuck-title" lines={["Secure and", "never stuck"]} />
      <Reveal delay={0.08}>
        <p className="mt-6 max-w-[52ch] text-xl leading-relaxed text-muted">
          One engineer, no single point of failure. Here&apos;s how your site and data are protected, even if I&apos;m
          ever unavailable.
        </p>
      </Reveal>

      <ul className="mt-16 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {continuity.map((item, i) => (
          <li key={item.title}>
            <Reveal delay={0.05 + (i % 3) * 0.08} className="h-full border-t border-line pt-8">
              <span className="grid size-11 place-items-center rounded-xl border border-line bg-surface text-accent shadow-panel">
                {icons[item.icon]}
              </span>
              <h3 className="mt-6 text-xl font-bold tracking-[-0.02em]">{item.title}</h3>
              <p className="mt-2 max-w-[40ch] leading-relaxed text-muted">{item.body}</p>
            </Reveal>
          </li>
        ))}
      </ul>

      <Reveal>
        <p className="mt-14 max-w-[70ch] leading-relaxed text-muted">
          The details are in the{" "}
          <Link href="/privacy#security" className={linkClass}>
            Privacy Policy
          </Link>{" "}
          and the{" "}
          <Link href="/terms" className={linkClass}>
            Terms of Service
          </Link>
          .
        </p>
      </Reveal>
    </section>
  );
}
