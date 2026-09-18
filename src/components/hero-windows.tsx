"use client";

import { ArrowUpRightIcon, PauseIcon, PlayIcon } from "@phosphor-icons/react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { projects } from "@/lib/site";
import { useLoaderDone } from "./loader-state";
import { useSiteStatus } from "./live-data";
import { useReducedMotion } from "./use-reduced-motion";

const ROTATE_MS = 6500;
const clients = projects.filter((p) => p.relation === "Client work");

// Where each window sits for its depth in the stack (0 = front). Windows behind step up and to
// the right, so their title bars (domain + live latency) stay readable above the front one.
const DEPTH = [
  { x: "0%", y: "0%", scale: 1, opacity: 1 },
  { x: "9%", y: "-16%", scale: 0.94, opacity: 0.8 },
  { x: "18%", y: "-32%", scale: 0.88, opacity: 0.55 },
] as const;

function Latency({ domain }: { domain: string }) {
  const state = useSiteStatus();
  if (state.kind === "loading") return <span className="text-soft">checking</span>;
  const site = state.kind === "ready" ? state.data.sites.find((s) => s.domain === domain) : undefined;
  if (!site) return <span className="text-soft">no reading</span>;
  return site.ok ? <span className="text-ink">{site.ms} ms</span> : <span className="text-[#dc2626] dark:text-[#f87171]">down</span>;
}

function StatusDot({ domain }: { domain: string }) {
  const state = useSiteStatus();
  const site = state.kind === "ready" ? state.data.sites.find((s) => s.domain === domain) : undefined;
  const tone = !site ? "bg-soft" : site.ok ? "bg-live" : "bg-[#dc2626] dark:bg-[#f87171]";
  return <span aria-hidden className={`size-1.5 shrink-0 rounded-full ${tone}`} />;
}

/*
  The hero's proof: the real client sites, stacked like open windows. The front one rotates every
  few seconds (paused on hover or focus), any window can be brought forward, and each title bar
  shows that site's live response time measured by this site's server.
*/
export function HeroWindows({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  const loaded = useLoaderDone();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  // Visitors can stop the rotation outright (WCAG 2.2.2), separate from the hover pause.
  const [stopped, setStopped] = useState(false);
  const n = clients.length;
  const next = () => setActive((i) => (i + 1) % n);

  // A few degrees of tilt toward the cursor gives the stack depth without turning it into a toy.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-5, 5]), { stiffness: 120, damping: 20 });
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [4, -4]), { stiffness: 120, damping: 20 });

  const current = clients[active];

  return (
    <div className={className}>
      <div
        className="[perspective:1400px]"
        onPointerMove={(e) => {
          if (reduce || e.pointerType !== "mouse") return;
          const r = e.currentTarget.getBoundingClientRect();
          px.set((e.clientX - r.left) / r.width - 0.5);
          py.set((e.clientY - r.top) / r.height - 0.5);
        }}
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => {
          setPaused(false);
          px.set(0);
          py.set(0);
        }}
      >
        <motion.div
          id="hero-screen"
          style={{ rotateX, rotateY }}
          initial={{ opacity: 0, x: 60 }}
          animate={loaded ? { opacity: 1, x: 0 } : undefined}
          transition={{ duration: 1.1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          // Margins leave room for the windows stepping out behind the front one.
          className="relative mr-[7%] mt-[14%] aspect-[16/10] [transform-style:preserve-3d]"
        >
          {clients.map((p, i) => {
            const depth = (i - active + n) % n;
            const pose = DEPTH[Math.min(depth, DEPTH.length - 1)];
            const front = depth === 0;
            return (
              <motion.div
                key={p.name}
                aria-hidden={!front}
                initial={false}
                animate={{ x: pose.x, y: pose.y, scale: pose.scale, opacity: pose.opacity }}
                transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 170, damping: 26 }}
                style={{ zIndex: n - depth, transformOrigin: "0% 100%" }}
                onClick={() => !front && setActive(i)}
                className={`absolute inset-0 overflow-hidden rounded-xl border border-line-strong bg-surface shadow-[0_40px_90px_-30px_rgb(0_0_0/0.7)] ${
                  front ? "" : "cursor-pointer"
                }`}
              >
                <div className="flex h-8 items-center gap-2.5 border-b border-line bg-surface-strong px-3 font-mono text-[11px]">
                  <StatusDot domain={p.domain} />
                  <span className="truncate text-muted">{p.domain}</span>
                  <span className="ml-auto tabular-nums">
                    <Latency domain={p.domain} />
                  </span>
                </div>
                <div className="relative h-[calc(100%-2rem)]">
                  <Image
                    src={p.image}
                    alt={front ? `${p.name} homepage, built by AHMXD` : ""}
                    fill
                    preload={i === 0}
                    loading="eager"
                    sizes="(min-width: 1024px) 40vw, 90vw"
                    className="object-cover object-top"
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={loaded ? { opacity: 1 } : undefined}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="mt-6"
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <div className="flex flex-wrap items-center gap-1">
          <div role="tablist" aria-label="Client sites" className="flex flex-wrap gap-1">
            {clients.map((p, i) => {
              const selected = i === active;
              return (
                <button
                  key={p.name}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="hero-screen"
                  onClick={() => setActive(i)}
                  className={`relative inline-flex min-h-11 items-center rounded-full px-3 text-[15px] font-medium transition-colors duration-300 ${
                    selected ? "text-ink" : "text-muted hover:text-ink"
                  }`}
                >
                  {p.name}
                  {selected && (
                    <span
                      key={active}
                      aria-hidden
                      onAnimationEnd={next}
                      // Held until the loading screen opens, so the first site gets its full turn.
                      style={{ animationDuration: `${ROTATE_MS}ms`, animationPlayState: paused || stopped || !loaded ? "paused" : "running" }}
                      className="absolute inset-x-3 bottom-1.5 h-px origin-left animate-[hero-progress_linear_forwards] bg-accent motion-reduce:hidden"
                    />
                  )}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => setStopped((v) => !v)}
            aria-pressed={stopped}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-[15px] font-medium text-muted transition-colors hover:text-ink motion-reduce:hidden"
          >
            {stopped ? <PlayIcon size={14} weight="fill" aria-hidden /> : <PauseIcon size={14} weight="fill" aria-hidden />}
            {stopped ? "Play" : "Pause"}
          </button>
        </div>
        {/* The chosen site in one sentence, with a plain link to visit it. */}
        <p className="mt-2 text-[16px] leading-relaxed text-muted">
          <span aria-live="polite">
            <span className="font-semibold text-ink">{current.name}:</span> {current.summary}
          </span>{" "}
          <a
            href={current.href}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-1 font-medium text-ink underline decoration-accent/50 underline-offset-4 transition-colors hover:text-accent"
          >
            Visit {current.domain}
            <ArrowUpRightIcon size={14} weight="bold" aria-hidden className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </p>
      </motion.div>
    </div>
  );
}
