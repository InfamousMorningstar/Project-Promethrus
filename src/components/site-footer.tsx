"use client";

import { ArrowUpIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { legalLinks, navItems, site } from "@/lib/site";
import { CalgaryNow } from "./footer/calgary-now";
import { WordmarkReveal } from "./footer/wordmark-reveal";
import { Wordmark } from "./logo-mark";

const elsewhere = [
  { label: "Portfolio", href: site.links.portfolio },
  { label: "LinkedIn", href: site.links.linkedin },
  { label: "GitHub", href: site.links.github },
];

const linkClass = "text-muted transition-colors hover:text-ink";

// Slim footer: identity, live Calgary time, every link, and the outline wordmark bleeding off the edge.
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative isolate overflow-hidden bg-bg-raised">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[80%] bg-[radial-gradient(60%_70%_at_50%_100%,rgb(124_58_237/0.2),transparent_70%)]"
      />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-24 bg-gradient-to-b from-bg to-transparent" />

      {/* Stacked above the wordmark, whose hover area reaches up under these links. */}
      <div className="relative z-10 mx-auto grid max-w-[1400px] gap-10 px-4 pt-16 sm:grid-cols-2 sm:px-6 lg:grid-cols-12 lg:px-10">
        <div className="lg:col-span-4">
          <Wordmark />
          <CalgaryNow />
          <a href={`mailto:${site.email}`} className="mt-4 inline-block border-b border-line-strong pb-0.5 text-muted transition-colors hover:border-accent hover:text-ink">
            {site.email}
          </a>
        </div>

        <nav aria-label="Footer" className="text-[15px] lg:col-span-6">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className={linkClass}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
            {elsewhere.map((l) => (
              <li key={l.label}>
                <a href={l.href} target="_blank" rel="noreferrer" className={linkClass}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <ul aria-label="Legal" className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
            {legalLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkClass}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-start justify-between gap-4 sm:col-span-2 lg:col-span-2 lg:flex-col lg:items-end">
          <p className="text-[15px] text-muted">&copy; {year} AHMXD Technologies</p>
          <a
            href="#top"
            className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 text-[15px] text-muted transition-colors hover:border-accent hover:text-ink"
          >
            Back to top
            <ArrowUpIcon size={14} weight="bold" className="transition-transform duration-300 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>

      {/* The wordmark bleeds off the bottom edge of the screen. */}
      <div className="relative -mx-2 mt-8 translate-y-[16%] sm:-mx-4">
        <WordmarkReveal />
      </div>
    </footer>
  );
}
