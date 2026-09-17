"use client";

import { useEffect, useState } from "react";

export const SECTIONS = [
  { id: "top", label: "Home" },
  { id: "services", label: "Services" },
  { id: "work", label: "Work" },
  { id: "process", label: "Process" },
  { id: "studio", label: "Studio" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];

// The section crossing the upper-middle band of the viewport is the current one.
export function useActiveSection(): SectionId {
  const [active, setActive] = useState<SectionId>("top");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id as SectionId);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return active;
}
