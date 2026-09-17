import { ArrowLeftIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { legalLinks, site } from "@/lib/site";
import { Wordmark } from "../logo-mark";
import { ThemeToggle } from "../nav/theme-toggle";

// The homepage header and footer are built around its sections, so legal pages get a quieter frame.
export function LegalHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="mx-auto flex h-[76px] max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
        <Link href="/" aria-label="AHMXD Technologies, home" className="rounded-lg">
          <Wordmark />
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/"
            className="group inline-flex h-10 items-center gap-2 rounded-full border border-line-strong px-4 text-sm font-semibold transition-colors hover:border-accent hover:text-accent"
          >
            <ArrowLeftIcon size={14} weight="bold" className="transition-transform duration-300 group-hover:-translate-x-0.5" />
            Back to site
          </Link>
        </div>
      </div>
    </header>
  );
}

export function LegalFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line bg-bg-raised">
      <div className="mx-auto grid max-w-[1400px] gap-8 px-4 py-12 sm:px-6 md:grid-cols-12 lg:px-10">
        <div className="md:col-span-5">
          <Wordmark />
          <p className="mt-4 max-w-[40ch] text-sm leading-relaxed text-soft">
            Questions about these documents go to{" "}
            <a href={`mailto:${site.email}`} className="text-muted underline underline-offset-4 transition-colors hover:text-ink">
              {site.email}
            </a>
            .
          </p>
        </div>
        <nav aria-label="Legal" className="md:col-span-7">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li>
              <Link href="/" className="text-muted transition-colors hover:text-ink">
                Home
              </Link>
            </li>
            <li>
              <Link href="/#pricing" className="text-muted transition-colors hover:text-ink">
                Pricing
              </Link>
            </li>
            {legalLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-muted transition-colors hover:text-ink">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-soft">&copy; {year} AHMXD Technologies</p>
        </nav>
      </div>
    </footer>
  );
}
