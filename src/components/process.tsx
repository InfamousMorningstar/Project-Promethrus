"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { steps } from "@/lib/site";
import { StrokeText } from "./reactbits/stroke-text";
import { SectionTitle } from "./section-title";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Process() {
  const root = useRef<HTMLElement>(null);
  const list = useRef<HTMLOListElement>(null);
  const fill = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // The rail fills as you read, and each stage lights up once you reach it,
      // so the page walks through the project in the order it actually happens.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const items = gsap.utils.toArray<HTMLElement>(".process-step");
        items.forEach((el) => (el.dataset.done = "false"));

        gsap.fromTo(
          fill.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: list.current, start: "top 62%", end: "bottom 62%", scrub: 0.6 },
          },
        );

        items.forEach((el) => {
          ScrollTrigger.create({
            trigger: el,
            start: "top 62%",
            onEnter: () => (el.dataset.done = "true"),
            onLeaveBack: () => (el.dataset.done = "false"),
          });
        });

        return () => items.forEach((el) => (el.dataset.done = "true"));
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="process"
      aria-labelledby="process-title"
      className="mx-auto max-w-[1400px] scroll-mt-20 px-4 py-24 sm:px-6 md:py-32 lg:px-10"
    >
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <SectionTitle id="process-title" lines={["How it", "works"]} />
            <p className="mt-6 max-w-[30ch] text-lg leading-relaxed text-muted">Six steps. No surprises.</p>
          </div>
        </div>

        <ol ref={list} className="relative lg:col-span-7">
          <div className="absolute bottom-3 left-[11px] top-3 w-px bg-line" aria-hidden />
          <div
            ref={fill}
            className="absolute bottom-3 left-[11px] top-3 w-px origin-top bg-gradient-to-b from-accent-fill via-accent to-accent-fill"
            aria-hidden
          />
          {steps.map((step) => (
            <li key={step.title} data-done="true" className="process-step group relative pb-14 pl-14 last:pb-0">
              {/* Ring and dot share one SVG coordinate space, so the dot is centred exactly at any zoom
                  level. Its centre (11.5) matches the 1px rail at left-[11px]. */}
              <svg aria-hidden viewBox="0 0 23 23" className="absolute left-0 top-1.5 size-[23px] overflow-visible">
                <circle
                  cx="11.5"
                  cy="11.5"
                  r="11"
                  strokeWidth="1"
                  className="fill-bg stroke-line-strong transition-[stroke] duration-500 group-data-[done=true]:stroke-accent"
                />
                <circle
                  cx="11.5"
                  cy="11.5"
                  r="4.5"
                  className="origin-center scale-0 fill-accent-fill transition-transform duration-500 ease-out-expo [transform-box:fill-box] group-data-[done=true]:scale-100"
                />
              </svg>
              <StrokeText
                as="h3"
                text={step.title}
                trigger="scroll"
                replayOnHover
                drawDuration={1}
                stagger={0.03}
                strokeWidth={1.8}
                className="text-[clamp(1.75rem,3.2vw,2.5rem)]"
              />
              <p className="mt-2 max-w-[50ch] text-lg leading-relaxed text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
