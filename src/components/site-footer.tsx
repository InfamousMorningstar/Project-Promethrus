"use client";

import { ArrowRightIcon, ArrowUpIcon } from "@phosphor-icons/react";
import { motion, useScroll, useTransform } from "motion/react";
import { useReducedMotion } from "@/components/use-reduced-motion";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { legalLinks, navItems, site } from "@/lib/site";
import { ButtonLink } from "./button-link";
import { CalgaryNow } from "./footer/calgary-now";
import { StatusBoard } from "./footer/status-board";
import { WordmarkReveal } from "./footer/wordmark-reveal";
import { Wordmark } from "./logo-mark";
import { Magnetic } from "./magnetic";

const elsewhere = [
  { label: "Portfolio", href: site.links.portfolio },
  { label: "LinkedIn", href: site.links.linkedin },
  { label: "GitHub", href: site.links.github },
];

/*
  Curtain footer: on screens tall enough to hold it, the footer is pinned to the viewport and
  the page slides up off it (the clip-path keeps it hidden until its slot scrolls into view).
  Smaller screens get the same footer in normal flow.
*/
// Must match the `curtain` custom variant in globals.css.
const CURTAIN_QUERY = "(min-width: 1024px) and (min-height: 860px)";

function useCurtain() {
  const [curtain, setCurtain] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(CURTAIN_QUERY);
    const sync = () => setCurtain(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return curtain;
}

export function SiteFooter() {
  const shell = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const curtain = useCurtain();
  // Reveal motion only happens on curtain screens; elsewhere the footer scrolls in as normal content.
  const animated = curtain && !reduce;
  const { scrollYProgress } = useScroll({ target: shell, offset: ["start end", "end end"] });
  const lift = useTransform(scrollYProgress, (p) => (animated ? `${14 * (1 - p)}%` : "0%"));
  // Function form on purpose: Motion hands range-mapped opacity to the native ScrollTimeline,
  // which does not track this pinned footer, so the fade would freeze at its start value.
  const shade = useTransform(scrollYProgress, (p) => (animated ? Math.max(0, 0.55 * (1 - p / 0.85)) : 0));
  const seamShadow = useTransform(shade, (s) => s / 0.55);
  const year = new Date().getFullYear();

  return (
    <footer
      ref={shell}
      className="relative curtain:h-[820px]"
      style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
    >
      <div className="relative isolate flex flex-col overflow-hidden bg-bg-raised curtain:fixed curtain:inset-x-0 curtain:bottom-0 curtain:h-[820px]">
        {/* Light that pools behind the wordmark, plus a soft top fade so the reveal has depth but no seam. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[70%] bg-[radial-gradient(60%_70%_at_50%_100%,rgb(124_58_237/0.22),transparent_70%)]"
        />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-bg to-transparent" />
        {/* Darkens the footer while it is still under the page, lifting as it is uncovered. */}
        <motion.div aria-hidden style={{ opacity: shade }} className="pointer-events-none absolute inset-0 z-10 bg-bg" />

        <motion.div style={{ y: lift }} className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col px-4 pt-20 sm:px-6 lg:px-10 curtain:pt-16">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <h2 className="display text-[clamp(2.75rem,6vw,5.25rem)]">
                <span className="block">Need it built?</span>
                <span className="block text-accent">Need it fixed?</span>
              </h2>
              <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-muted">
                Both start the same way: a short conversation about what the business needs. Every reply comes from
                Salman.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                <Magnetic>
                  <ButtonLink href="#contact" className="h-12 px-6 text-[15px]">
                    Start a project
                    <ArrowRightIcon
                      size={16}
                      weight="bold"
                      className="transition-transform duration-300 group-hover:translate-x-0.5"
                    />
                  </ButtonLink>
                </Magnetic>
                <a
                  href={`mailto:${site.email}`}
                  className="border-b border-line-strong pb-0.5 font-medium text-muted transition-colors hover:border-accent hover:text-ink"
                >
                  {site.email}
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <StatusBoard />
            </div>
          </div>

          {/* Stacked above the wordmark, whose hover area reaches up under these links. */}
          <div className="relative z-10 mt-14 grid gap-8 border-t border-line pt-8 sm:grid-cols-2 lg:grid-cols-12 lg:items-start curtain:mt-12">
            <div className="lg:col-span-4">
              <Wordmark />
              <CalgaryNow />
            </div>
            <nav aria-label="Footer" className="lg:col-span-5">
              <ul className="flex flex-wrap gap-x-6 gap-y-2">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <a href={`#${item.id}`} className="text-muted transition-colors hover:text-ink">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
              <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                {elsewhere.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} target="_blank" rel="noreferrer" className="text-soft transition-colors hover:text-ink">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
              <ul aria-label="Legal" className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                {legalLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-soft underline-offset-4 transition-colors hover:text-ink hover:underline">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="flex items-start justify-between gap-4 sm:col-span-2 lg:col-span-3 lg:flex-col lg:items-end">
              <p className="text-sm text-soft">&copy; {year} AHMXD Technologies</p>
              <a
                href="#top"
                className="group inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-muted transition-colors hover:border-accent hover:text-ink"
              >
                Back to top
                <ArrowUpIcon size={14} weight="bold" className="transition-transform duration-300 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>

          {/* The wordmark bleeds off the bottom edge of the screen. */}
          <div className="relative -mx-2 mt-auto translate-y-[16%] pt-12 sm:-mx-4 curtain:pt-0">
            <WordmarkReveal />
          </div>
        </motion.div>
      </div>

      {/* Soft shadow the lifting page casts on the footer. It rides the seam and fades out with the shade. */}
      <motion.div
        aria-hidden
        style={{ opacity: seamShadow }}
        className="pointer-events-none absolute inset-x-0 top-0 z-20 hidden h-16 bg-gradient-to-b from-black/15 to-transparent curtain:block dark:from-black/50"
      />
    </footer>
  );
}
