import type { needs, payments } from "@/lib/site";

// A pricing button tells the contact form which plan was picked, so the form arrives with
// the matching answers already selected.
const EVENT = "ahmxd:plan";

export type PlanIntent = {
  need: (typeof needs)[number];
  payment: (typeof payments)[number];
};

export function announcePlan(intent: PlanIntent) {
  window.dispatchEvent(new CustomEvent<PlanIntent>(EVENT, { detail: intent }));
}

export function onPlanAnnounced(listener: (intent: PlanIntent) => void) {
  const handler = (e: Event) => listener((e as CustomEvent<PlanIntent>).detail);
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}
