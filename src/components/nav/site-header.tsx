"use client";

import { navItems } from "@/lib/site";
import { ButtonLink } from "../button-link";
import { Wordmark } from "../logo-mark";
import { CommandIsland } from "./command-island";
import { ThemeToggle } from "./theme-toggle";

// The brand bar sits at the top of the page with plain text links (clear for every visitor) and
// scrolls away with it. The command island takes over once you scroll: top on desktop, bottom
// within thumb reach on phones, where it is the only menu.
export function SiteHeader() {
  return (
    <>
      <header className="absolute inset-x-0 top-0 z-30">
        <div className="mx-auto flex h-[76px] max-w-[1400px] items-center justify-between gap-6 px-4 sm:px-6 lg:px-10">
          <a href="#top" aria-label="AHMXD Technologies, back to top" className="rounded-lg">
            <Wordmark />
          </a>
          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {navItems
                .filter((item) => item.id !== "contact")
                .map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="inline-flex min-h-11 items-center rounded-full px-4 text-[16px] font-medium text-muted transition-colors hover:bg-surface-strong hover:text-ink"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
            </ul>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <span className="hidden lg:block">
              <ButtonLink href="#contact">Start a project</ButtonLink>
            </span>
          </div>
        </div>
      </header>
      <CommandIsland />
    </>
  );
}
