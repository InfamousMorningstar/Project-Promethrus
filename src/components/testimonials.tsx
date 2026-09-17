import { QuotesIcon } from "@phosphor-icons/react/ssr";
import { testimonials } from "@/lib/site";
import { Reveal } from "./reveal";
import { SectionTitle } from "./section-title";

// Renders nothing until real client quotes are added in site.ts.
export function Testimonials() {
  if (testimonials.length === 0) return null;

  const columns = testimonials.length === 1 ? "" : testimonials.length === 2 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3";

  return (
    <section aria-labelledby="testimonials-title" className="mx-auto max-w-[1400px] px-4 py-24 sm:px-6 md:py-32 lg:px-10">
      <SectionTitle id="testimonials-title" lines={["In their", "words"]} />
      <div className={`mt-14 grid gap-4 lg:gap-5 ${columns}`}>
        {testimonials.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.08} className="h-full">
            <figure className="flex h-full flex-col rounded-2xl border border-line bg-surface p-7 shadow-panel md:p-9">
              <QuotesIcon size={28} weight="fill" className="text-accent" aria-hidden />
              <blockquote className="mt-5 max-w-[52ch] text-lg leading-relaxed text-ink">{t.quote}</blockquote>
              <figcaption className="mt-auto pt-8">
                <span className="block font-semibold">{t.name}</span>
                <span className="text-sm text-soft">
                  {t.role}, {t.business}
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
