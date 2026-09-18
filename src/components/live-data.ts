"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import type { StatusPayload } from "@/app/api/status/route";
import type { WeatherPayload } from "@/app/api/weather/route";

/*
  Live readings shared by the hero's status bar and the footer, so each endpoint is requested
  once per page view however many components show it. Server snapshots are null, so server HTML
  and hydration agree and the values fill in after.
*/

// --- Calgary clock: one ticking timer for the whole page ---------------------------------------
const clockFormat = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Edmonton",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

let now: string | null = null;
let clockTimer: ReturnType<typeof setInterval> | null = null;
const clockListeners = new Set<() => void>();

function subscribeClock(listener: () => void) {
  clockListeners.add(listener);
  if (!clockTimer) {
    const tick = () => {
      now = clockFormat.format(new Date());
      clockListeners.forEach((l) => l());
    };
    tick();
    clockTimer = setInterval(tick, 1000);
  }
  return () => {
    clockListeners.delete(listener);
    if (clockListeners.size === 0 && clockTimer) {
      clearInterval(clockTimer);
      clockTimer = null;
    }
  };
}

/** Calgary local time as HH:MM:SS, or null until the first tick on the client. */
export function useCalgaryTime() {
  return useSyncExternalStore(
    subscribeClock,
    () => now,
    () => null,
  );
}

// --- Calgary temperature: refreshed every ten minutes while anything shows it ------------------
const WEATHER_REFRESH_MS = 10 * 60 * 1000;
let tempC: number | null = null;
let weatherTimer: ReturnType<typeof setInterval> | null = null;
const weatherListeners = new Set<() => void>();

function loadWeather() {
  fetch("/api/weather")
    .then((r) => (r.ok ? r.json() : Promise.reject()))
    .then((data: WeatherPayload) => {
      tempC = data.tempC;
      weatherListeners.forEach((l) => l());
    })
    .catch(() => {
      // Keep the last known reading.
    });
}

function subscribeWeather(listener: () => void) {
  weatherListeners.add(listener);
  if (!weatherTimer) {
    loadWeather();
    weatherTimer = setInterval(loadWeather, WEATHER_REFRESH_MS);
  }
  return () => {
    weatherListeners.delete(listener);
    if (weatherListeners.size === 0 && weatherTimer) {
      clearInterval(weatherTimer);
      weatherTimer = null;
    }
  };
}

/** Current Calgary temperature in °C, or null while loading or unavailable. */
export function useCalgaryTemp() {
  return useSyncExternalStore(
    subscribeWeather,
    () => tempC,
    () => null,
  );
}

// --- Client site status: fetched once per page view ------------------------------------------
export type StatusState = { kind: "loading" } | { kind: "error" } | { kind: "ready"; data: StatusPayload };

let statusRequest: Promise<StatusPayload> | null = null;

function loadStatus() {
  statusRequest ??= fetch("/api/status")
    .then((r) => (r.ok ? (r.json() as Promise<StatusPayload>) : Promise.reject(new Error(`status ${r.status}`))))
    .catch((err) => {
      statusRequest = null; // allow a retry on the next mount
      throw err;
    });
  return statusRequest;
}

/** Live status of the client sites. Pass `enabled = false` to defer the request (e.g. until in view). */
export function useSiteStatus(enabled = true): StatusState {
  const [state, setState] = useState<StatusState>({ kind: "loading" });

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    loadStatus()
      .then((data) => !cancelled && setState({ kind: "ready", data }))
      .catch(() => !cancelled && setState({ kind: "error" }));
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return state;
}
