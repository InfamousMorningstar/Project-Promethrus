"use client";

// Adapted from Aceternity UI "Text Hover Effect" (ui.aceternity.com/components/text-hover-effect):
// brand violet instead of the rainbow, motion values instead of React state for the cursor light,
// and the outline draws itself when the footer is uncovered. Outline only, so it uses the static
// Geist Black cut: stroking the variable font exposes its overlapping glyph contours.
import { motion, useInView, useMotionTemplate, useMotionValue, useSpring } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";

export function WordmarkReveal({ text = "AHMXD" }: { text?: string }) {
  const id = useId().replace(/:/g, "");
  const svgRef = useRef<SVGSVGElement>(null);
  const inView = useInView(svgRef, { once: true, amount: 0.15 });
  const [canHover, setCanHover] = useState(true);
  const [hovered, setHovered] = useState(false);

  const x = useMotionValue(50);
  const y = useMotionValue(40);
  const sx = useSpring(x, { stiffness: 160, damping: 24, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 160, damping: 24, mass: 0.6 });
  const cx = useMotionTemplate`${sx}%`;
  const cy = useMotionTemplate`${sy}%`;

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setCanHover(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Baseline sits at the bottom of a box trimmed to cap height, so the letters fill the frame edge to edge.
  const textProps = {
    x: "50%",
    y: 196,
    textAnchor: "middle" as const,
    textLength: 980,
    lengthAdjust: "spacingAndGlyphs" as const,
    fill: "none",
    strokeLinejoin: "round" as const,
    style: {
      fontFamily: "var(--font-geist-black), var(--font-geist), sans-serif",
      fontWeight: 900,
      fontSize: 250,
      letterSpacing: "-0.04em",
    },
  };

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 1000 200"
      overflow="visible"
      className="block w-full select-none"
      role="img"
      aria-label="AHMXD"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set(((e.clientX - r.left) / r.width) * 100);
        y.set(((e.clientY - r.top) / r.height) * 100);
      }}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <defs>
        {/* The outline is brightest at the top and dissolves into the bottom edge of the screen. */}
        <linearGradient id={`${id}-base`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--text)" stopOpacity="0.4" />
          <stop offset="90%" stopColor="var(--text)" stopOpacity="0.06" />
        </linearGradient>
        <linearGradient id={`${id}-violet`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#6d28d9" />
        </linearGradient>
        <motion.radialGradient id={`${id}-light`} gradientUnits="userSpaceOnUse" r="22%" cx={cx} cy={cy}>
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>
        <mask id={`${id}-mask`}>
          <rect width="100%" height="100%" fill={canHover ? `url(#${id}-light)` : "white"} />
        </mask>
      </defs>

      {/* Base outline, drawn once when the footer comes into view. */}
      <motion.text
        {...textProps}
        stroke={`url(#${id}-base)`}
        strokeWidth={1.2}
        initial={{ strokeDasharray: 1800, strokeDashoffset: 1800 }}
        animate={inView ? { strokeDashoffset: 0 } : undefined}
        transition={{ duration: 2.6, ease: [0.65, 0, 0.35, 1] }}
      >
        {text}
      </motion.text>

      {/* Violet outline, visible only where the cursor light falls (always faintly on touch screens). */}
      <motion.g
        mask={`url(#${id}-mask)`}
        initial={false}
        animate={{ opacity: canHover ? (hovered ? 1 : 0) : inView ? 0.4 : 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <text {...textProps} stroke={`url(#${id}-violet)`} strokeWidth={2}>
          {text}
        </text>
      </motion.g>
    </svg>
  );
}
