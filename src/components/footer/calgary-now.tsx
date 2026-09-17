"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import type { WeatherPayload } from "@/app/api/weather/route";

const formatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Edmonton",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

// One shared ticking clock. The snapshot is cached between ticks so React sees a stable value,
// and the server snapshot is null so server HTML and hydration agree (the time fills in after).
let now: string | null = null;
let timer: ReturnType<typeof setInterval> | null = null;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!timer) {
    const tick = () => {
      now = formatter.format(new Date());
      listeners.forEach((l) => l());
    };
    tick();
    timer = setInterval(tick, 1000);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer) {
      clearInterval(timer);
      timer = null;
    }
  };
}

const REFRESH_MS = 10 * 60 * 1000;

export function CalgaryNow() {
  const time = useSyncExternalStore(
    subscribe,
    () => now,
    () => null,
  );
  const [tempC, setTempC] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = () =>
      fetch("/api/weather")
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((data: WeatherPayload) => {
          if (!cancelled) setTempC(data.tempC);
        })
        .catch(() => {
          // Keep the last known reading; the clock still runs without it.
        });
    load();
    const interval = setInterval(load, REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="mt-3 text-sm">
      <p className="text-soft">Calgary, Canada, Earth</p>
      <p className="mt-1 flex items-center gap-2 font-mono tabular-nums text-muted">
        <span className="relative flex size-1.5" aria-hidden>
          <span className="absolute inset-0 animate-ping rounded-full bg-live opacity-60 motion-reduce:hidden" />
          <span className="relative size-1.5 rounded-full bg-live" />
        </span>
        <span className="sr-only">Local time in Calgary:</span>
        <time aria-live="off">{time ?? "--:--:--"}</time>
        <span aria-hidden className="text-soft">
          ·
        </span>
        <span className="sr-only">Current temperature:</span>
        <span>{tempC === null ? "--°C" : `${tempC}°C`}</span>
      </p>
    </div>
  );
}
