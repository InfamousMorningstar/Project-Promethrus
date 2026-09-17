"use client";

import { ButtonLink } from "../button-link";
import { Wordmark } from "../logo-mark";
import { CommandIsland } from "./command-island";
import { ThemeToggle } from "./theme-toggle";

// The brand bar sits at the top of the page and scrolls away with it; the command island is what
// stays with you (top on desktop, bottom within thumb reach on phones).
export function SiteHeader() {
  return (
    <>
      <header className="absolute inset-x-0 top-0 z-30">
        <div className="mx-auto flex h-[76px] max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
          <a href="#top" aria-label="AHMXD Technologies, back to top" className="rounded-lg">
            <Wordmark />
          </a>
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
