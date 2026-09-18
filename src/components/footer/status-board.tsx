"use client";

import { motion, useInView } from "motion/react";
import { useReducedMotion } from "@/components/use-reduced-motion";
import { useRef } from "react";
import { useSiteStatus } from "../live-data";

function minutesAgo(iso: string) {
  const mins = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  return mins === 0 ? "just now" : mins === 1 ? "1 minute ago" : `${mins} minutes ago`;
}

// One heartbeat per row. Up: a pulse travels along the trace. Down: a flat line.
function Trace({ ok, delay }: { ok: boolean; delay: number }) {
  const reduce = useReducedMotion();
  const d = ok ? "M0 12 H38 L44 4 L50 20 L56 8 L60 12 H120" : "M0 12 H120";
  return (
    <svg viewBox="0 0 120 24" className="h-6 w-full" aria-hidden preserveAspectRatio="none">
      <path d={d} fill="none" className="stroke-line-strong" strokeWidth="1.25" vectorEffect="non-scaling-stroke" />
      {ok && !reduce && (
        <motion.path
          d={d}
          fill="none"
          className="stroke-live"
          strokeWidth="1.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0.18, pathOffset: -0.2 }}
          animate={{ pathOffset: 1.05 }}
          transition={{ duration: 2.6, delay, repeat: Infinity, repeatDelay: 1.2, ease: "linear" }}
        />
      )}
    </svg>
  );
}

export function StatusBoard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "200px" });
  // Shared with the hero's live bar, so this usually reuses the reading already on the page.
  const state = useSiteStatus(inView);

  const sites = state.kind === "ready" ? state.data.sites : [];
  const down = sites.filter((s) => !s.ok).length;

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-2xl border border-line bg-surface/70 p-6 shadow-panel backdrop-blur-md md:p-7"
    >
      <div className="flex items-center justify-between gap-4">
        <p className="label text-soft">Client systems, live</p>
        <p className="flex items-center gap-2 text-sm font-medium" aria-live="polite">
          {state.kind === "ready" && (
            <>
              <span className="relative flex size-2">
                {down === 0 && (
                  <span className="absolute inset-0 animate-ping rounded-full bg-live opacity-60 motion-reduce:hidden" />
                )}
                <span className={`relative size-2 rounded-full ${down === 0 ? "bg-live" : "bg-[#f87171]"}`} />
              </span>
              <span className="text-ink">
                {down === 0 ? "All operational" : `${down} of ${sites.length} unreachable`}
              </span>
            </>
          )}
          {state.kind === "loading" && <span className="text-soft">Checking now</span>}
          {state.kind === "error" && <span className="text-soft">Status unavailable</span>}
        </p>
      </div>

      <ul className="mt-6 grid gap-1">
        {state.kind === "ready"
          ? sites.map((s, i) => (
              <li key={s.domain} className="grid grid-cols-[1fr_64px] items-center gap-4 py-2.5 sm:grid-cols-[1fr_minmax(64px,120px)_64px]">
                <div className="min-w-0">
                  <p className="truncate font-medium text-ink">{s.name}</p>
                  <p className="truncate font-mono text-[11.5px] text-soft">{s.domain}</p>
                </div>
                <div className="hidden sm:block">
                  <Trace ok={s.ok} delay={i * 0.45} />
                </div>
                <p className={`text-right font-mono text-sm tabular-nums ${s.ok ? "text-ink" : "text-[#f87171]"}`}>
                  {s.ok && s.ms !== null ? `${s.ms} ms` : "down"}
                </p>
              </li>
            ))
          : Array.from({ length: 3 }, (_, i) => (
              <li key={i} className="grid grid-cols-[1fr_64px] items-center gap-4 py-2.5 sm:grid-cols-[1fr_minmax(64px,120px)_64px]" aria-hidden>
                <div className="grid gap-1.5">
                  <span className="h-3.5 w-32 animate-pulse rounded bg-surface-strong" />
                  <span className="h-3 w-24 animate-pulse rounded bg-surface-strong" />
                </div>
                <span className="hidden h-px w-full bg-line-strong sm:block" />
                <span className="ml-auto h-3.5 w-12 animate-pulse rounded bg-surface-strong" />
              </li>
            ))}
      </ul>

      <p className="mt-5 border-t border-line pt-4 text-xs leading-relaxed text-soft">
        {state.kind === "ready"
          ? `Response times measured by this site's server, refreshed every 5 minutes. Last checked ${minutesAgo(state.data.checkedAt)}.`
          : state.kind === "error"
            ? "The live check could not run just now. Try again in a few minutes."
            : "Measuring response times for the client sites AHMXD built."}
      </p>
    </div>
  );
}
