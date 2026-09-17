"use client";

/*
  Adapted from React Bits "Decrypted Text" (reactbits.dev/text-animations/decrypted-text).
  Trimmed to the two modes this site uses (hover and in-view) with a sequential left-to-right reveal.
  Changes: screen readers always get the real text (the original announced the scrambled string),
  hover is picked up from the nearest link or button so the whole control triggers it, and
  reduced motion disables the effect.
*/
import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  text: string;
  animateOn?: "hover" | "view";
  className?: string;
  speed?: number;
  characters?: string;
  /** For animateOn="view": wait until this turns true before decoding. */
  start?: boolean;
};

export function DecryptedText({
  text,
  animateOn = "hover",
  className = "",
  speed = 32,
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=",
  start = true,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const [display, setDisplay] = useState(text);
  const [running, setRunning] = useState(false);

  const scramble = useCallback(
    (revealed: number) =>
      Array.from(text)
        .map((ch, i) => (ch === " " || i < revealed ? ch : characters[Math.floor(Math.random() * characters.length)]))
        .join(""),
    [text, characters],
  );

  const run = useCallback(() => {
    if (timer.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let revealed = 0;
    let tick = 0;
    setRunning(true);
    timer.current = setInterval(() => {
      tick++;
      // Two scrambles per revealed character keeps short labels readable while still visibly decoding.
      if (tick % 2 === 0) revealed++;
      if (revealed >= text.length) {
        clearInterval(timer.current!);
        timer.current = null;
        setDisplay(text);
        setRunning(false);
        return;
      }
      setDisplay(scramble(revealed));
    }, speed);
  }, [scramble, speed, text]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (animateOn === "view") {
      if (!start) return;
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            run();
            io.disconnect();
          }
        },
        { threshold: 0.6 },
      );
      io.observe(el);
      return () => io.disconnect();
    }

    const target = (el.closest("a, button, [data-decrypt-hover]") as HTMLElement | null) ?? el;
    target.addEventListener("pointerenter", run);
    return () => target.removeEventListener("pointerenter", run);
  }, [animateOn, run, start]);

  useEffect(
    () => () => {
      if (timer.current) clearInterval(timer.current);
    },
    [],
  );

  return (
    <span ref={ref} className={`relative inline-block ${className}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden className={running ? "text-accent" : undefined}>
        {display}
      </span>
    </span>
  );
}
