"use client";

/*
  Adapted from React Bits "Scroll Reveal" (reactbits.dev/text-animations/scroll-reveal).
  Changes: animations are scoped with gsap.context, so unmounting only removes this component's
  ScrollTriggers (the original killed every trigger on the page, including the pinned Work pan);
  highlighted words can use the accent colour; reduced motion shows the finished text.
*/
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useMemo, useRef } from "react";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

type Props = {
  text: string;
  /** Words (exact match, punctuation included) rendered in the accent colour. */
  highlight?: string[];
  className?: string;
  baseOpacity?: number;
  blurStrength?: number;
};

export function ScrollReveal({ text, highlight = [], className = "", baseOpacity = 0.12, blurStrength = 6 }: Props) {
  const ref = useRef<HTMLParagraphElement>(null);

  const words = useMemo(
    () =>
      text.split(/(\s+)/).map((word, i) =>
        /^\s+$/.test(word) ? (
          word
        ) : (
          <span key={i} className={`sr-word inline-block ${highlight.includes(word) ? "text-accent" : ""}`}>
            {word}
          </span>
        ),
      ),
    [text, highlight],
  );

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const targets = el.querySelectorAll<HTMLElement>(".sr-word");
      gsap.fromTo(
        el,
        { rotate: 2.5, transformOrigin: "0% 50%" },
        { rotate: 0, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "center 55%", scrub: true } },
      );
      gsap.fromTo(
        targets,
        { opacity: baseOpacity, filter: `blur(${blurStrength}px)` },
        {
          opacity: 1,
          filter: "blur(0px)",
          ease: "none",
          stagger: 0.05,
          scrollTrigger: { trigger: el, start: "top 85%", end: "center 50%", scrub: true },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [baseOpacity, blurStrength]);

  return (
    <p ref={ref} className={className}>
      {words}
    </p>
  );
}
