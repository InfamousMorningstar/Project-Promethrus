import { ArrowUpRightIcon } from "@phosphor-icons/react/ssr";
import Image from "next/image";
import { site } from "@/lib/site";
import { Reveal } from "./reveal";
import { SectionTitle } from "./section-title";

const credentials = [
  ["Education", "SAIT, Software Development diploma"],
  ["Studying", "Mount Royal University, BCIS"],
  ["Certified", "AWS Certified Cloud Practitioner"],
  ["Ships with", "Next.js, TypeScript, Supabase, Python, Docker"],
  ["Based in", "Calgary, Alberta"],
] as const;

export function Studio() {
  return (
    <section
      id="studio"
      aria-labelledby="studio-title"
      className="mx-auto max-w-[1400px] scroll-mt-20 px-4 pb-24 sm:px-6 md:pb-32 lg:px-10"
    >
      <div className="rule mb-24 md:mb-32" />
      <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <figure className="relative overflow-hidden rounded-2xl border border-line bg-surface">
            <Image
              src={site.photo}
              alt="Salman Ahmad, founder of AHMXD Technologies"
              width={1280}
              height={1600}
              sizes="(min-width: 1024px) 36vw, 100vw"
              className="aspect-[4/5] w-full object-cover object-[50%_20%]"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 pt-20 text-zinc-50">
              <span className="block text-xl font-bold tracking-[-0.02em]">Salman Ahmad</span>
              <span className="mt-1 block text-sm text-zinc-300">Founder and engineer</span>
            </figcaption>
          </figure>
        </Reveal>

        <div className="lg:col-span-7 lg:pt-6">
          <SectionTitle id="studio-title" lines={["Meet the", "engineer"]} />
          <Reveal delay={0.08}>
            <p className="mt-8 max-w-[48ch] text-xl leading-relaxed text-muted">
              No account managers. The person who designs your project builds it, launches it and answers when something
              breaks.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <dl className="mt-12 grid gap-x-10 gap-y-6 sm:grid-cols-2">
              {credentials.map(([k, v]) => (
                <div key={k} className="flex flex-col gap-1.5">
                  <dt className="label text-soft">{k}</dt>
                  <dd className="font-medium text-ink">{v}</dd>
                </div>
              ))}
            </dl>
            <a
              href={site.links.portfolio}
              target="_blank"
              rel="noreferrer"
              className="group mt-12 inline-flex items-center gap-2 border-b border-line-strong pb-1 font-semibold transition-colors hover:border-accent hover:text-accent"
            >
              Read the portfolio
              <ArrowUpRightIcon
                size={14}
                weight="bold"
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
