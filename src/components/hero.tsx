"use client";

import { ArrowRightIcon } from "@phosphor-icons/react";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { heroLine, projects } from "@/lib/site";
import { ButtonLink } from "./button-link";
import { HeroWindows } from "./hero-windows";
import { useCalgaryTemp, useCalgaryTime, useSiteStatus } from "./live-data";
import { useLoaderDone } from "./loader-state";
import { Magnetic } from "./magnetic";
import GhostFibers from "./reactbits/ghost-fibers";
import { StrokeText } from "./reactbits/stroke-text";
import { useTheme } from "./use-theme";

const ease = [0.16, 1, 0.3, 1] as const;
const clientCount = projects.filter((p) => p.relation === "Client work").length;

function HeroCopy({ className = "" }: { className?: string }) {
  // Everything waits for the loading screen to open, so the intro plays in view.
  const loaded = useLoaderDone();
  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 16, filter: "blur(6px)" },
    animate: loaded ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined,
    transition: { duration: 1, delay, ease },
  });
  const line = { trigger: "mount" as const, start: loaded, drawDuration: 1.1, stagger: 0.03, replayOnHover: true };

  return (
    <div className={className}>
      {/* Left-aligned and set large: the headline is the composition, not a caption over a picture. */}
      <h1 className="flex flex-col items-start text-[clamp(2.6rem,6.4vw,6.25rem)] leading-none">
        <StrokeText text="Websites and IT" delay={0.2} {...line} />{" "}
        <StrokeText
          text="for Calgary"
          delay={0.45}
          {...line}
          className="-mt-[0.14em]"
          fillClassName="fill-accent"
          strokeClassName="stroke-ink/70"
        />{" "}
        <StrokeText
          text="businesses."
          delay={0.7}
          {...line}
          className="-mt-[0.14em]"
          fillClassName="fill-accent"
          strokeClassName="stroke-ink/70"
        />
      </h1>

      <motion.p {...rise(1.1)} className="mt-8 max-w-[27rem] text-lg leading-relaxed text-muted md:text-xl">
        {heroLine}
      </motion.p>

      <motion.div {...rise(1.25)} className="mt-9 flex flex-wrap items-center gap-3">
        <Magnetic>
          <ButtonLink href="#contact" className="h-12 px-6 text-[15px]">
            Start a project
            <ArrowRightIcon size={16} weight="bold" className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </ButtonLink>
        </Magnetic>
        <ButtonLink href="#pricing" variant="ghost" className="h-12 px-6 text-[15px]">
          See prices
        </ButtonLink>
      </motion.div>
    </div>
  );
}

function Reading({ label, children }: { label: string; children: ReactNode }) {
  return (
    <span className="flex items-baseline gap-2">
      <span className="sr-only">{label}:</span>
      {children}
    </span>
  );
}

// Live proof along the bottom of the first screen, measured by this site's own server.
function LiveBar() {
  const loaded = useLoaderDone();
  const status = useSiteStatus();
  const time = useCalgaryTime();
  const tempC = useCalgaryTemp();

  const sites = status.kind === "ready" ? status.data.sites : [];
  const up = sites.filter((s) => s.ok);
  const avg = up.length ? Math.round(up.reduce((sum, s) => sum + (s.ms ?? 0), 0) / up.length) : null;
  const allUp = status.kind === "ready" && up.length === sites.length;

  return (
    <motion.div
      aria-label="Live status"
      initial={{ opacity: 0 }}
      animate={loaded ? { opacity: 1 } : undefined}
      transition={{ duration: 0.8, delay: 1.5 }}
      className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line py-5 font-mono text-[14px] text-muted"
    >
      <Reading label="Client sites">
        <span className="relative flex size-1.5 self-center" aria-hidden>
          {allUp && <span className="absolute inset-0 animate-ping rounded-full bg-live opacity-60 motion-reduce:hidden" />}
          <span className={`relative size-1.5 rounded-full ${status.kind === "ready" ? (allUp ? "bg-live" : "bg-[#f87171]") : "bg-soft"}`} />
        </span>
        <span className="text-ink">
          {status.kind === "ready"
            ? `${up.length}/${sites.length} client sites online`
            : status.kind === "error"
              ? "Live status unavailable"
              : `Checking ${clientCount} client sites`}
        </span>
      </Reading>
      {avg !== null && (
        <Reading label="Average response">
          <span className="tabular-nums">{avg} ms average response</span>
        </Reading>
      )}
      <Reading label="Calgary time">
        <span>
          Calgary <time className="tabular-nums text-ink">{time ?? "--:--:--"}</time>
        </span>
      </Reading>
      <Reading label="Temperature">
        <span className="tabular-nums">{tempC === null ? "--°C" : `${tempC}°C`}</span>
      </Reading>
      <span className="text-soft lg:ml-auto">Measured live by this site&apos;s server</span>
    </motion.div>
  );
}

export function Hero() {
  const { theme } = useTheme();

  return (
    <section id="top" className="relative isolate overflow-hidden">
      {/* React Bits Ghost Fibers, weighted to the right so the light sits behind the client sites. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_70%_80%_at_72%_40%,black_30%,transparent_80%)]"
      >
        {theme === "dark" ? (
          <GhostFibers lineColor="#221548" glowColor="#5b3ad6" blueBoost={1.05} brightness={1.5} grain={0.04} dpr={0.75} fps={40} />
        ) : (
          <GhostFibers lightMode lineColor="#5b21b6" glowColor="#8b5cf6" grain={0.02} dpr={0.75} fps={40} />
        )}
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-10%] top-[20%] -z-10 h-[620px] w-[760px] rounded-full bg-accent-fill/15 blur-[140px]"
      />

      <div className="mx-auto flex max-w-[1400px] flex-col px-4 pb-20 sm:px-6 lg:min-h-[100dvh] lg:px-10 lg:pb-0">
        <div className="grid flex-1 items-center gap-16 pt-32 pb-12 lg:grid-cols-12 lg:gap-10 lg:pt-28">
          <HeroCopy className="lg:col-span-6 xl:col-span-6" />
          <HeroWindows className="lg:col-span-6 xl:col-span-6" />
        </div>
        <LiveBar />
      </div>
    </section>
  );
}
