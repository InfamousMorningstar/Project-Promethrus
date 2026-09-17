"use client";

import { ArrowUpRightIcon } from "@phosphor-icons/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import { projects, site } from "@/lib/site";
import { DecryptedText } from "./reactbits/decrypted-text";
import { StrokeText } from "./reactbits/stroke-text";
import { SectionTitle } from "./section-title";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Work() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Horizontal pan only where there is room and motion is welcome.
      // Everywhere else the track stays a native, swipeable scroll-snap row.
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const el = track.current!;
        section.current!.dataset.pan = "on";
        const distance = () => el.scrollWidth - window.innerWidth;

        gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => gsap.set(progress.current, { scaleX: self.progress }),
          },
        });

        gsap.from(".work-card", {
          opacity: 0,
          y: 40,
          duration: 1,
          stagger: 0.1,
          ease: "expo.out",
          scrollTrigger: { trigger: section.current, start: "top 70%" },
        });

        return () => {
          section.current!.dataset.pan = "off";
        };
      });
    },
    { scope: section },
  );

  return (
    <section
      ref={section}
      id="work"
      data-pan="off"
      aria-labelledby="work-title"
      className="group/work band relative overflow-hidden py-20 lg:py-0"
    >
      <div className="no-scrollbar snap-x snap-mandatory scroll-pl-4 overflow-x-auto sm:scroll-pl-6 lg:scroll-pl-10 group-data-[pan=on]/work:snap-none group-data-[pan=on]/work:overflow-visible">
        <div
          ref={track}
          className="flex w-max items-stretch gap-5 px-4 sm:px-6 lg:h-[100dvh] lg:items-center lg:gap-8 lg:px-10"
        >
          <div className="flex w-[85vw] shrink-0 snap-start flex-col justify-center sm:w-[60vw] lg:w-[30vw] lg:max-w-[460px] lg:pr-6">
            <p className="label text-accent">
              <DecryptedText text="Selected work" animateOn="view" />
            </p>
            <SectionTitle id="work-title" lines={["Live", "client work"]} className="mt-5" sizeClassName="text-[clamp(2.5rem,4.2vw,4.25rem)]" />
            <p className="mt-6 max-w-[34ch] text-lg leading-relaxed text-muted">Real businesses. Real traffic. All live today.</p>
          </div>

          {projects.map((p) => (
            <article
              key={p.name}
              data-stroke-hover
              className="work-card flex w-[85vw] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-panel sm:w-[60vw] lg:w-[min(44vw,660px)]"
            >
              <a
                href={p.href}
                target="_blank"
                rel="noreferrer"
                className="group/shot relative block aspect-[16/10] overflow-hidden border-b border-line"
                aria-label={`Visit ${p.name} (opens in a new tab)`}
              >
                <Image
                  src={p.image}
                  alt={`Homepage of ${p.name}`}
                  width={1440}
                  height={900}
                  sizes="(min-width: 1024px) 44vw, 85vw"
                  className="h-full w-full object-cover object-top transition-transform duration-[1.2s] ease-out-expo group-hover/shot:scale-[1.03]"
                />
              </a>
              <div className="flex flex-1 flex-col p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="label text-soft">{p.kind}</span>
                  {p.relation === "Client work" ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-live/30 px-2.5 py-0.5 font-mono text-[11px] text-live">
                      <span className="size-1.5 rounded-full bg-live" aria-hidden />
                      Client, live
                    </span>
                  ) : (
                    <span className="rounded-full border border-line-strong px-2.5 py-0.5 font-mono text-[11px] text-muted">
                      Lab
                    </span>
                  )}
                </div>
                <StrokeText as="h3" text={p.name} trigger="hover" drawDuration={0.9} stagger={0.02} strokeWidth={2} className="mt-4 text-[1.9rem]" />
                <p className="mt-3 max-w-[52ch] leading-relaxed text-muted">{p.summary}</p>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-7">
                  <ul className="flex flex-wrap gap-2" aria-label="Built with">
                    {p.stack.map((s) => (
                      <li key={s} className="rounded-md bg-surface-strong px-2.5 py-1 font-mono text-[11.5px] text-muted">
                        {s}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group/link inline-flex items-center gap-1.5 text-sm font-semibold text-ink transition-colors hover:text-accent"
                  >
                    {p.domain}
                    <ArrowUpRightIcon
                      size={14}
                      weight="bold"
                      className="transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                    />
                  </a>
                </div>
              </div>
            </article>
          ))}

          <div className="work-card flex w-[85vw] shrink-0 snap-start flex-col justify-center rounded-2xl border border-dashed border-line-strong p-8 sm:w-[60vw] lg:w-[26vw] lg:max-w-[400px] lg:self-center">
            <p className="text-2xl font-bold leading-snug tracking-[-0.03em]">Want the engineering detail?</p>
            <p className="mt-4 leading-relaxed text-muted">Case studies and incident write-ups live on the portfolio.</p>
            <a
              href={site.links.portfolio}
              target="_blank"
              rel="noreferrer"
              className="group/link mt-8 inline-flex items-center gap-2 self-start rounded-full border border-line-strong px-5 py-3 text-sm font-semibold transition-colors hover:border-accent hover:text-accent"
            >
              Read the portfolio
              <ArrowUpRightIcon size={14} weight="bold" />
            </a>
          </div>
          <div className="w-px shrink-0 lg:w-[4vw]" aria-hidden />
        </div>
      </div>

      <div className="absolute inset-x-10 bottom-10 hidden h-px bg-line group-data-[pan=on]/work:block" aria-hidden>
        <div ref={progress} className="h-px origin-left scale-x-0 bg-accent" />
      </div>
    </section>
  );
}
