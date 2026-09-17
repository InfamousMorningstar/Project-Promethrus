"use client";

/*
  AHMXD loading screen.

  - The logo is the progress bar: the wings draw their outline and the violet core fills from the
    bottom, driven by real readiness signals rather than a timer.
  - The telemetry stream lists the files this page actually requested (Resource Timing API), with
    their real size, cache status and duration, and ends with the measured time to ready.
  - Exit: the wings slide away, the core stretches into a full-height seam of light, and the screen
    splits open along it. Intro animations elsewhere wait for that moment (see loader-state).
*/
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { markLoaderDone } from "./loader-state";
import { MARK_PATHS } from "./logo-mark";

type Line = { id: number; name: string; size: string; time: string; final?: boolean };

const MIN_VISIBLE_MS = 1500; // long enough for the choreography to read, even on a warm cache
const MAX_VISIBLE_MS = 6500; // never hold the site hostage to a slow asset
const CORE_TOP = 5;
const CORE_BOTTOM = 95;

const WEIGHTS = { fonts: 0.25, image: 0.3, webgl: 0.2, load: 0.25 } as const;
type Task = keyof typeof WEIGHTS;

function describe(entry: PerformanceResourceTiming, id: number): Line | null {
  let url: URL;
  try {
    url = new URL(entry.name);
  } catch {
    return null;
  }
  if (url.pathname.startsWith("/_next/webpack-hmr") || url.pathname.includes("__nextjs")) return null;

  let name = decodeURIComponent(url.pathname.split("/").filter(Boolean).pop() ?? url.hostname);
  // Optimised images: show the source file and requested width, not the optimiser endpoint.
  if (url.pathname === "/_next/image") {
    const src = url.searchParams.get("url") ?? "";
    name = `${decodeURIComponent(src).split("/").pop()} @${url.searchParams.get("w")}w`;
  }
  if (url.pathname.startsWith("/api/")) name = url.pathname;
  // Build chunks have hashed names; label them by type so the stream stays readable.
  const chunk = /^\/_next\/static\/(chunks|css)\//.test(url.pathname);
  if (chunk) {
    const ext = name.split(".").pop();
    const stem = name.replace(/\.[^.]+$/, "").replace(/[^a-z0-9]/gi, "").slice(-8);
    name = `${ext === "css" ? "styles" : "bundle"} ${stem}.${ext}`;
  }
  if (name.length > 30) name = `${name.slice(0, 18)}...${name.slice(-9)}`;

  // transferSize is 0 for memory/disk cache hits and smaller than the body for 304 revalidations.
  const cached =
    (entry.transferSize === 0 && entry.decodedBodySize > 0) ||
    (entry.encodedBodySize > 0 && entry.transferSize < entry.encodedBodySize);
  const bytes = entry.transferSize || entry.encodedBodySize;
  const size = cached ? "cache" : bytes >= 1024 * 1024 ? `${(bytes / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return { id, name, size, time: `${Math.round(entry.duration)} ms` };
}

export function SiteLoader() {
  const [gone, setGone] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);

  const root = useRef<HTMLDivElement>(null);
  const leftDoor = useRef<HTMLDivElement>(null);
  const rightDoor = useRef<HTMLDivElement>(null);
  const seam = useRef<HTMLDivElement>(null);
  const wingLeft = useRef<SVGPathElement>(null);
  const wingRight = useRef<SVGPathElement>(null);
  const coreFill = useRef<SVGRectElement>(null);
  const coreGroup = useRef<SVGGElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const elapsed = useRef<HTMLSpanElement>(null);
  const chrome = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mountedAt = performance.now();
    html.style.overflow = "hidden";

    let disposed = false;
    let exiting = false;
    let target = 0;
    let shown = 0;
    let readyAt: number | null = null;
    let raf = 0;
    let nextId = 0;
    let requests = 0;
    let bytes = 0;
    const queue: Line[] = [];
    const done = new Set<Task>();

    const unlock = () => {
      html.style.overflow = "";
      ScrollTrigger.refresh();
    };

    const finishTask = (task: Task) => {
      if (disposed || done.has(task)) return;
      done.add(task);
      target = [...done].reduce((sum, t) => sum + WEIGHTS[t], 0);
      if (done.size === Object.keys(WEIGHTS).length && readyAt === null) {
        readyAt = performance.now();
        const total = bytes >= 1048576 ? `${(bytes / 1048576).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
        queue.push({ id: nextId++, name: `${requests} requests`, size: total, time: `ready ${(readyAt / 1000).toFixed(2)} s`, final: true });
      }
    };

    // --- Real readiness signals -------------------------------------------------------------
    const family = getComputedStyle(html).getPropertyValue("--font-geist-black").trim();
    (family ? document.fonts.load(`900 100px ${family}`) : Promise.resolve())
      .then(() => document.fonts.ready)
      .catch(() => {})
      .finally(() => finishTask("fonts"));

    const heroImage = () => document.querySelector<HTMLImageElement>("#hero-screen img");
    const waitFor = <T,>(find: () => T | null, timeout: number) =>
      new Promise<T | null>((resolve) => {
        const began = performance.now();
        const poll = () => {
          const found = find();
          if (found || performance.now() - began > timeout || disposed) resolve(found);
          else requestAnimationFrame(poll);
        };
        poll();
      });

    waitFor(heroImage, 3000)
      .then((img) => (img ? img.decode().catch(() => {}) : undefined))
      .finally(() => finishTask("image"));
    waitFor(() => document.querySelector("#top canvas"), 2500).finally(() => finishTask("webgl"));

    if (document.readyState === "complete") finishTask("load");
    else window.addEventListener("load", () => finishTask("load"), { once: true });

    // --- Telemetry stream ------------------------------------------------------------------------
    let observer: PerformanceObserver | null = null;
    try {
      observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as PerformanceResourceTiming[]) {
          const line = describe(entry, nextId);
          if (!line) continue;
          nextId++;
          requests++;
          bytes += entry.transferSize || entry.encodedBodySize || 0;
          queue.push(line);
        }
      });
      observer.observe({ type: "resource", buffered: true });
    } catch {
      // Resource Timing unavailable: the loader still works, just without the stream.
    }
    // Drip-feed the queue so a burst of cached files still reads as a stream.
    const drip = window.setInterval(() => {
      const next = queue.shift();
      if (next) setLines((current) => [...current, next].slice(-4));
    }, 70);

    // --- Render loop: eases shown progress toward real progress -----------------------------------
    const render = (p: number) => {
      const draw = String(1 - p);
      wingLeft.current?.setAttribute("stroke-dashoffset", draw);
      wingRight.current?.setAttribute("stroke-dashoffset", draw);
      const height = (CORE_BOTTOM - CORE_TOP) * p;
      coreFill.current?.setAttribute("y", String(CORE_BOTTOM - height));
      coreFill.current?.setAttribute("height", String(height));
      if (counter.current) counter.current.textContent = String(Math.round(p * 100)).padStart(3, "0");
    };

    const exit = (skipped: boolean) => {
      if (exiting) return;
      exiting = true;
      if (skipped) {
        target = 1;
        shown = 1;
        render(1);
      }

      if (reduce) {
        gsap.to(root.current, {
          opacity: 0,
          duration: 0.35,
          onStart: () => {
            unlock();
            markLoaderDone();
          },
          onComplete: () => setGone(true),
        });
        return;
      }

      const coreRect = coreGroup.current?.getBoundingClientRect();
      const seamStart = coreRect ? coreRect.height / window.innerHeight : 0.08;

      const tl = gsap.timeline({ onComplete: () => setGone(true) });
      tl.to([wingLeft.current, wingRight.current], { attr: { "fill-opacity": 0.92 }, duration: 0.22, ease: "power2.out" }, 0)
        .to(chrome.current, { opacity: 0, y: 6, duration: 0.35, ease: "power2.in" }, 0.1)
        .to(wingLeft.current, { x: -34, opacity: 0, duration: 0.55, ease: "power3.in" }, 0.28)
        .to(wingRight.current, { x: 34, opacity: 0, duration: 0.55, ease: "power3.in" }, 0.28)
        .set(seam.current, { opacity: 1, scaleY: seamStart }, 0.72)
        .to(coreGroup.current, { opacity: 0, duration: 0.12 }, 0.72)
        .to(seam.current, { scaleY: 1, duration: 0.6, ease: "expo.out" }, 0.72)
        .add(() => {
          unlock();
          markLoaderDone();
        }, 1.1)
        .to(leftDoor.current, { xPercent: -101, duration: 1.05, ease: "expo.inOut" }, 1.1)
        .to(rightDoor.current, { xPercent: 101, duration: 1.05, ease: "expo.inOut" }, 1.1)
        .to(seam.current, { opacity: 0, scaleX: 6, duration: 0.7, ease: "power2.out" }, 1.2);
    };

    const tick = () => {
      if (disposed) return;
      shown += (target - shown) * 0.09;
      if (target - shown < 0.002) shown = target;
      render(shown);
      const now = performance.now();
      if (elapsed.current) elapsed.current.textContent = `${(now / 1000).toFixed(2)} s`;
      if (!exiting) {
        const visibleFor = now - mountedAt;
        if ((readyAt !== null && shown >= 1 && visibleFor > MIN_VISIBLE_MS) || visibleFor > MAX_VISIBLE_MS) exit(false);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // --- Skip ----------------------------------------------------------------------------------------
    const skip = () => exit(true);
    window.addEventListener("keydown", skip);
    root.current?.addEventListener("pointerdown", skip);
    const rootEl = root.current;

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.clearInterval(drip);
      observer?.disconnect();
      window.removeEventListener("keydown", skip);
      rootEl?.removeEventListener("pointerdown", skip);
      html.style.overflow = "";
    };
  }, []);

  if (gone) return null;

  return (
    <div
      id="site-loader"
      ref={root}
      role="status"
      aria-label="Loading AHMXD Technologies"
      className="fixed inset-0 z-[70] cursor-default select-none"
    >
      <div ref={leftDoor} className="absolute inset-y-0 left-0 w-[calc(50%+1px)] bg-bg" />
      <div ref={rightDoor} className="absolute inset-y-0 right-0 w-[calc(50%+1px)] bg-bg" />
      <div
        ref={seam}
        aria-hidden
        className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 bg-accent opacity-0 shadow-[0_0_24px_4px_rgb(139_92_246/0.65)]"
      />

      {/* The mark: wings draw with progress, the core fills from the bottom. */}
      <div aria-hidden className="absolute inset-0 grid place-items-center">
        <div className="relative animate-[loader-in_0.6s_cubic-bezier(0.16,1,0.3,1)_both]">
          <svg viewBox="0 0 100 100" className="size-[88px] overflow-visible">
            <defs>
              <clipPath id="loader-core-clip">
                <rect ref={coreFill} x="0" y={CORE_BOTTOM} width="100" height="0" />
              </clipPath>
            </defs>
            <path
              ref={wingLeft}
              d={MARK_PATHS.left}
              pathLength={1}
              strokeDasharray="1"
              strokeDashoffset="1"
              strokeWidth="1.2"
              strokeLinejoin="round"
              className="fill-ink stroke-ink"
              fillOpacity="0"
            />
            <path
              ref={wingRight}
              d={MARK_PATHS.right}
              pathLength={1}
              strokeDasharray="1"
              strokeDashoffset="1"
              strokeWidth="1.2"
              strokeLinejoin="round"
              className="fill-ink stroke-ink"
              fillOpacity="0"
            />
            <g ref={coreGroup}>
              <path d={MARK_PATHS.core} fill="none" strokeWidth="0.8" className="stroke-line-strong" />
              <path
                d={MARK_PATHS.core}
                clipPath="url(#loader-core-clip)"
                className="fill-accent-fill drop-shadow-[0_0_6px_rgb(139_92_246/0.8)]"
              />
            </g>
          </svg>
        </div>
      </div>

      <div ref={chrome} aria-hidden className="absolute inset-0 font-mono text-[11px] tracking-[0.04em]">
        <div className="absolute left-1/2 top-[calc(50%+68px)] -translate-x-1/2 text-center">
          <span ref={counter} className="tabular-nums text-ink">
            000
          </span>
          <span className="text-soft"> / 100</span>
        </div>

        <ul className="absolute bottom-6 left-4 grid w-[calc(100%-8.5rem)] max-w-[420px] gap-1 sm:bottom-8 sm:left-8">
          {lines.map((line) => (
            <li
              key={line.id}
              className={`grid grid-cols-[1fr_auto] gap-3 overflow-hidden sm:grid-cols-[1fr_auto_auto] sm:gap-4 animate-[loader-line_0.35s_cubic-bezier(0.16,1,0.3,1)_both] ${
                line.final ? "text-accent" : "text-soft"
              }`}
            >
              <span className="truncate">
                <span className="text-accent">{line.final ? "✓ " : "↓ "}</span>
                {line.name}
              </span>
              <span className="hidden tabular-nums sm:inline">{line.size}</span>
              <span className="text-right tabular-nums sm:w-[74px]">{line.time}</span>
            </li>
          ))}
        </ul>

        <div className="absolute bottom-6 right-4 text-right text-soft sm:bottom-8 sm:right-8">
          <span ref={elapsed} className="tabular-nums text-ink">
            0.00 s
          </span>
          <span className="mt-1 block">Calgary, AB</span>
        </div>

        <div className="absolute right-4 top-6 text-soft opacity-0 animate-[loader-in_0.6s_ease_1.2s_forwards] sm:right-8 sm:top-8">
          Press any key to skip
        </div>
      </div>
    </div>
  );
}
