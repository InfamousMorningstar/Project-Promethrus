"use client";

import { useCalgaryTemp, useCalgaryTime } from "../live-data";

export function CalgaryNow() {
  const time = useCalgaryTime();
  const tempC = useCalgaryTemp();

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
