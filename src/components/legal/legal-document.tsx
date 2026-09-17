import { CheckIcon } from "@phosphor-icons/react/ssr";
import type { ReactNode } from "react";
import { legal } from "@/lib/site";

export type LegalSection = { id: string; title: string; body: ReactNode };

// Shared layout for the Terms of Service and Privacy Policy: a plain-language summary first,
// then numbered sections with stable anchors so other pages can link straight to a clause.
export function LegalDocument({
  title,
  intro,
  summary,
  sections,
}: {
  title: string;
  intro: ReactNode;
  summary: string[];
  sections: LegalSection[];
}) {
  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-24 pt-32 sm:px-6 md:pb-32 md:pt-40 lg:px-10">
      <header className="max-w-[64ch]">
        <h1 className="text-[clamp(2.5rem,5.5vw,4.5rem)] font-extrabold leading-[1.02] tracking-[-0.045em]">{title}</h1>
        <p className="mt-4 text-soft">Last updated {legal.updated}</p>
        <div className="mt-8 text-lg leading-relaxed text-muted">{intro}</div>
      </header>

      <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-16">
        <nav aria-label="On this page" className="hidden lg:col-span-3 lg:block">
          <div className="sticky top-10">
            <p className="font-semibold">On this page</p>
            <ol className="mt-4 grid gap-2.5 text-sm">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-muted transition-colors hover:text-ink">
                    {i + 1}. {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </nav>

        <div className="min-w-0 max-w-[74ch] lg:col-span-9">
          <aside aria-labelledby="summary-title" className="rounded-2xl border border-line bg-surface p-6 shadow-panel md:p-8">
            <h2 id="summary-title" className="text-lg font-bold tracking-[-0.02em]">
              In short
            </h2>
            <ul className="mt-4 grid gap-3">
              {summary.map((line) => (
                <li key={line} className="flex gap-3 leading-relaxed">
                  <CheckIcon size={16} weight="bold" className="mt-1 shrink-0 text-accent" aria-hidden />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-soft">This summary is for convenience. The full text below is what applies.</p>
          </aside>

          {sections.map((s, i) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className="mt-14 scroll-mt-10 border-t border-line pt-10">
              <h2 id={`${s.id}-title`} className="text-2xl font-bold tracking-[-0.03em]">
                {i + 1}. {s.title}
              </h2>
              <div className="legal-prose mt-5">{s.body}</div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
