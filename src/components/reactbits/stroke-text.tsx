"use client";

/*
  Adapted from React Bits "Stroke Text" (reactbits.dev/text-animations/stroke-text).
  Changes for this site:
  - Sizes with the surrounding CSS font-size (1em = 100 SVG units), so headings stay fluid.
  - Real text for screen readers and search engines; the SVG is decorative.
  - Colours come from theme tokens via classes, so light and dark mode both work.
  - Uses the static Geist Black cut: stroking a variable font exposes overlapping glyph contours.
  - `replayOnHover` redraws on hover after the first reveal, and the hover target can be an
    ancestor marked with [data-stroke-hover] (for example a whole card).
*/
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type ElementType } from "react";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

type Trigger = "mount" | "scroll" | "hover";

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  strokeClassName?: string;
  fillClassName?: string;
  trigger?: Trigger;
  replayOnHover?: boolean;
  delay?: number;
  drawDuration?: number;
  stagger?: number;
  strokeWidth?: number;
  /** Letter spacing in em. */
  tracking?: number;
  /** For trigger="mount": hold the draw until this turns true (e.g. after the loading screen). */
  start?: boolean;
};

const UNITS = 100; // SVG units per em
const OPEN = 100000; // wipe width that uncovers any line length

type Box = { x: number; y: number; width: number; height: number };

export function StrokeText({
  text,
  as: Tag = "span",
  className = "",
  strokeClassName = "stroke-accent",
  fillClassName = "fill-ink",
  trigger = "scroll",
  replayOnHover = false,
  delay = 0,
  drawDuration = 1.4,
  stagger = 0.04,
  strokeWidth = 1.4,
  tracking = -0.035,
  start = true,
}: Props) {
  const rootRef = useRef<HTMLElement | null>(null);
  const measureRef = useRef<SVGTextElement | null>(null);
  const wipeRef = useRef<SVGRectElement | null>(null);
  const [box, setBox] = useState<Box | null>(null);
  const hasBox = box !== null;
  const boxRef = useRef<Box | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const clipId = `stroke-wipe-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const chars = useMemo(() => Array.from(text), [text]);
  const dash = UNITS * 7;
  const fontStyle = {
    fontFamily: "var(--font-geist-black), var(--font-geist), sans-serif",
    fontWeight: 900,
    fontSize: `${UNITS}px`,
    letterSpacing: `${tracking * UNITS}px`,
  };

  useLayoutEffect(() => {
    let cancelled = false;
    const measure = () => {
      const node = measureRef.current;
      if (cancelled || !node) return;
      try {
        const b = node.getBBox();
        if (!b.width) return;
        const pad = Math.max(strokeWidth, 4);
        const next = { x: b.x - pad, y: b.y - pad, width: b.width + pad * 2, height: b.height + pad * 2 };
        boxRef.current = next;
        setBox(next);
      } catch {
        // getBBox throws if the SVG is not rendered yet; the fonts.ready pass retries.
      }
    };
    // The heading font may not be requested until something uses it, so fonts.ready can resolve
    // before it arrives. Measure straight away if it is loaded; otherwise give it a short grace
    // period so the draw starts on time, then re-measure when it lands. A later re-measure only
    // resizes the SVG; it does not restart the animation.
    const node = measureRef.current;
    let grace: ReturnType<typeof setTimeout> | undefined;
    if (node && document.fonts) {
      const font = `900 ${UNITS}px ${getComputedStyle(node).fontFamily}`;
      if (document.fonts.check(font)) measure();
      else {
        grace = setTimeout(measure, 600);
        document.fonts
          .load(font)
          .then(() => document.fonts.ready)
          .then(() => {
            clearTimeout(grace);
            measure();
          })
          .catch(measure);
      }
    } else {
      measure();
    }
    return () => {
      cancelled = true;
      clearTimeout(grace);
    };
  }, [text, tracking, strokeWidth]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !hasBox) return;

    // Hidden until the start state is applied, so the finished text never flashes before drawing.
    const show = () => {
      if (svgRef.current) svgRef.current.style.opacity = "1";
    };
    const strokes = Array.from(root.querySelectorAll<SVGTSpanElement>("[data-stroke-char]"));
    const wipe = wipeRef.current;
    const targets = [...strokes, wipe].filter(Boolean) as Element[];

    const setStart = () => {
      gsap.killTweensOf(targets);
      gsap.set(strokes, { strokeDasharray: dash, strokeDashoffset: dash });
      if (wipe) gsap.set(wipe, { attr: { width: 0 } });
    };
    const setEnd = () => {
      gsap.killTweensOf(targets);
      gsap.set(strokes, { strokeDasharray: dash, strokeDashoffset: 0 });
      if (wipe) gsap.set(wipe, { attr: { width: OPEN } });
    };
    const build = (startDelay: number) => {
      setStart();
      const tl = gsap.timeline({ paused: true, delay: startDelay });
      tl.to(strokes, { strokeDashoffset: 0, duration: drawDuration, ease: "power2.out", stagger }, 0);
      if (wipe) {
        // Wipe across the measured line, then open fully so a later re-measure can never clip the fill.
        tl.to(
          wipe,
          {
            attr: { width: () => boxRef.current?.width ?? OPEN },
            duration: Math.max(0.5, drawDuration * 0.45),
            ease: "power2.inOut",
            onComplete: () => gsap.set(wipe, { attr: { width: OPEN } }),
          },
          drawDuration * 0.7,
        );
      }
      return tl;
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setEnd();
      show();
      return () => gsap.killTweensOf(targets);
    }

    let timeline: gsap.core.Timeline | null = null;
    let st: ScrollTrigger | null = null;
    let revealed = trigger !== "scroll";

    if (trigger === "hover") {
      setEnd();
    } else {
      timeline = build(delay);
      if (trigger === "scroll") {
        st = ScrollTrigger.create({
          trigger: root,
          start: "top 85%",
          once: true,
          onEnter: () => {
            revealed = true;
            timeline?.play(0);
          },
        });
      } else if (start) {
        timeline.play(0);
      }
    }
    show();

    const hoverEl = (root.closest("[data-stroke-hover]") as HTMLElement | null) ?? root;
    const replay = () => {
      if (!revealed || (timeline && timeline.isActive())) return;
      timeline?.kill();
      timeline = build(0);
      timeline.play(0);
    };
    const hoverEnabled = trigger === "hover" || replayOnHover;
    if (hoverEnabled) hoverEl.addEventListener("pointerenter", replay);

    return () => {
      if (hoverEnabled) hoverEl.removeEventListener("pointerenter", replay);
      st?.kill();
      timeline?.kill();
      gsap.killTweensOf(targets);
    };
  }, [hasBox, dash, delay, drawDuration, stagger, trigger, replayOnHover, start]);

  const viewBox = box ? `${box.x} ${box.y} ${box.width} ${box.height}` : `0 ${-UNITS} ${chars.length * 60} ${UNITS * 1.3}`;
  const widthEm = (box ? box.width : chars.length * 60) / UNITS;

  return (
    <Tag ref={rootRef} className={`relative block ${className}`}>
      <span className="sr-only">{text}</span>
      <svg
        ref={svgRef}
        aria-hidden
        viewBox={viewBox}
        className="block h-auto max-w-full overflow-visible"
        style={{ width: `${widthEm}em`, opacity: 0 }}
      >
        {box && (
          <defs>
            <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
              <rect ref={wipeRef} x={box.x} y={box.y} width={0} height={box.height} />
            </clipPath>
          </defs>
        )}
        <text
          ref={measureRef}
          x="0"
          y="0"
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          strokeLinecap="round"
          className={strokeClassName}
          style={fontStyle}
        >
          {chars.map((c, i) => (
            <tspan data-stroke-char key={i}>
              {c}
            </tspan>
          ))}
        </text>
        <text
          x="0"
          y="0"
          className={fillClassName}
          style={fontStyle}
          clipPath={box ? `url(#${clipId})` : undefined}
        >
          {/* Same per-letter split as the outline: a single run would be shaped differently and drift. */}
          {chars.map((c, i) => (
            <tspan key={i}>{c}</tspan>
          ))}
        </text>
      </svg>
    </Tag>
  );
}
