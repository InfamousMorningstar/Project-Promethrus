"use client";

import { ArrowRightIcon, ArrowUpRightIcon } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/components/use-reduced-motion";
import Image from "next/image";
import { useState } from "react";
import { heroLine, projects } from "@/lib/site";
import { ContainerScroll } from "./ui/container-scroll-animation";
import { ButtonLink } from "./button-link";
import { Magnetic } from "./magnetic";
import { DecryptedText } from "./reactbits/decrypted-text";
import GhostFibers from "./reactbits/ghost-fibers";
import { StrokeText } from "./reactbits/stroke-text";
import { useLoaderDone } from "./loader-state";
import { useTheme } from "./use-theme";

const ease = [0.16, 1, 0.3, 1] as const;
const ROTATE_MS = 6500;

function HeroCopy() {
  // Everything waits for the loading screen to open, so the intro plays in view.
  const loaded = useLoaderDone();
  // Same props on server and client; MotionProvider drops the movement for reduced-motion users.
  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 16, filter: "blur(6px)" },
    animate: loaded ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined,
    transition: { duration: 1, delay, ease },
  });

  return (
    <div className="flex flex-col items-center px-2">
      <motion.p
        {...rise(0.05)}
        className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-3.5 py-1.5 font-mono text-[11px] tracking-[0.08em] text-muted uppercase backdrop-blur"
      >
        <span className="size-1.5 rounded-full bg-live" aria-hidden />
        <DecryptedText text="Web design, apps & IT systems" animateOn="view" start={loaded} />
      </motion.p>

      {/* Each line draws its outline, then fills: the signature reveal used across the site. */}
      <h1 className="mt-8 flex flex-col items-center text-[clamp(2.4rem,6.2vw,5.75rem)] leading-none">
        <StrokeText text="Websites and IT for" trigger="mount" start={loaded} delay={0.25} drawDuration={1.1} stagger={0.03} replayOnHover />{" "}
        <StrokeText
          text="Calgary businesses."
          trigger="mount"
          start={loaded}
          delay={0.6}
          drawDuration={1.1}
          stagger={0.03}
          replayOnHover
          className="-mt-[0.16em]"
          fillClassName="fill-accent"
          strokeClassName="stroke-ink/70"
        />
      </h1>

      <motion.p {...rise(1.1)} className="mt-6 max-w-[34rem] text-lg leading-relaxed text-muted md:text-xl">
        {heroLine}
      </motion.p>

      <motion.div {...rise(1.25)} className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <Magnetic>
          <ButtonLink href="#contact" className="h-12 px-6 text-[15px]">
            Start a project
            <ArrowRightIcon size={16} weight="bold" className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </ButtonLink>
        </Magnetic>
        <ButtonLink href="#work" variant="ghost" className="h-12 px-6 text-[15px]">
          See the work
        </ButtonLink>
      </motion.div>
    </div>
  );
}

export function Hero() {
  const reduce = useReducedMotion();
  const { theme } = useTheme();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const current = projects[active];
  const next = () => setActive((i) => (i + 1) % projects.length);

  return (
    <section id="top" className="relative isolate overflow-hidden">
      {/* React Bits Ghost Fibers, tuned to the brand violet. The mask fades every edge into the page. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[115dvh] [mask-image:radial-gradient(ellipse_75%_70%_at_50%_38%,black_35%,transparent_78%)]"
      >
        {theme === "dark" ? (
          <GhostFibers lineColor="#221548" glowColor="#5b3ad6" blueBoost={1.05} brightness={1.5} grain={0.04} dpr={0.75} fps={40} />
        ) : (
          <GhostFibers lightMode lineColor="#5b21b6" glowColor="#8b5cf6" grain={0.02} dpr={0.75} fps={40} />
        )}
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[55%] -z-10 mx-auto h-[640px] max-w-5xl rounded-full bg-accent-fill/15 blur-[140px]"
      />

      <ContainerScroll
        titleComponent={<HeroCopy />}
        footer={
          <div
            className="flex flex-col items-center justify-between gap-4 md:flex-row"
            onPointerEnter={() => setPaused(true)}
            onPointerLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            <div role="tablist" aria-label="Recent projects" className="flex flex-wrap justify-center gap-1 rounded-full border border-line bg-surface/70 p-1 backdrop-blur">
              {projects.map((p, i) => {
                const selected = i === active;
                return (
                  <button
                    key={p.name}
                    type="button"
                    role="tab"
                    id={`hero-tab-${i}`}
                    aria-selected={selected}
                    aria-controls="hero-screen"
                    onClick={() => setActive(i)}
                    className={`relative overflow-hidden rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                      selected ? "text-ink" : "text-muted hover:text-ink"
                    }`}
                  >
                    {selected && (
                      <motion.span
                        layoutId="hero-tab"
                        className="absolute inset-0 rounded-full border border-line-strong bg-surface-strong"
                        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 34 }}
                      />
                    )}
                    <span className="relative">{p.name}</span>
                    {selected && (
                      <span
                        key={active}
                        aria-hidden
                        onAnimationEnd={next}
                        style={{ animationDuration: `${ROTATE_MS}ms`, animationPlayState: paused ? "paused" : "running" }}
                        className="absolute inset-x-4 bottom-1 h-px origin-left animate-[hero-progress_linear_forwards] bg-accent motion-reduce:hidden"
                      />
                    )}
                  </button>
                );
              })}
            </div>
            <a
              href={current.href}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink"
            >
              <span className="size-1.5 rounded-full bg-live" aria-hidden />
              <span>
                {current.relation === "Client work" ? "Live at" : "Lab project at"}{" "}
                <span className="font-medium text-ink">{current.domain}</span>
              </span>
              <ArrowUpRightIcon size={14} weight="bold" className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
        }
      >
        <div id="hero-screen" role="tabpanel" aria-labelledby={`hero-tab-${active}`} className="absolute inset-0">
          {/* All screens stay mounted and cross-fade, so the next site is already decoded when it appears. */}
          {projects.map((p, i) => (
            <motion.div
              key={p.name}
              className="absolute inset-0"
              aria-hidden={i !== active}
              initial={false}
              animate={{ opacity: i === active ? 1 : 0, scale: i === active || reduce ? 1 : 1.015 }}
              transition={{ duration: 0.9, ease }}
            >
              <Image
                src={p.image}
                alt={i === active ? `${p.name} homepage, built by AHMXD` : ""}
                fill
                preload={i === 0}
                loading="eager"
                sizes="(min-width: 1024px) 1000px, 94vw"
                className="object-cover object-top"
              />
            </motion.div>
          ))}
        </div>
      </ContainerScroll>

      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg" />
    </section>
  );
}
