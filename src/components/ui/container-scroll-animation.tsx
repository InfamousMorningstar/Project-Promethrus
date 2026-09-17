"use client";

// Adapted from Aceternity UI "Container Scroll Animation" (ui.aceternity.com/components/container-scroll-animation):
// brand tokens instead of fixed greys, a footer slot below the screen, a static pose for reduced motion,
// and timing tied to the screen itself so it lands flat exactly when it is centred in the viewport.
import React, { useEffect, useRef } from "react";
import { motion, useMotionValue, useScroll, useTransform, type MotionValue } from "motion/react";
import { useReducedMotion } from "@/components/use-reduced-motion";

export const ContainerScroll = ({
  titleComponent,
  children,
  footer,
}: {
  titleComponent: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  // Scroll position at which the screen's centre lines up with the viewport's centre.
  const straightAt = useMotionValue(1);
  const [isMobile, setIsMobile] = React.useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const card = cardRef.current;
    const container = containerRef.current;
    if (!card || !container) return;

    // The wrapper is never transformed, so its box is the screen's resting layout position.
    const measure = () => {
      const rect = card.getBoundingClientRect();
      const centreInDocument = rect.top + window.scrollY + rect.height / 2;
      straightAt.set(Math.max(centreInDocument - window.innerHeight / 2, 1));
    };

    measure();
    // Re-measure when fonts, images or the viewport change the layout above the screen.
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [straightAt]);

  const progress = useTransform([scrollY, straightAt], ([y, end]: number[]) => Math.min(Math.max(y / end, 0), 1));

  const rotate = useTransform(progress, [0, 1], reduce ? [0, 0] : [20, 0]);
  const scale = useTransform(progress, [0, 1], reduce ? [1, 1] : isMobile ? [0.9, 1] : [1.05, 1]);
  const translate = useTransform(progress, [0, 1], reduce ? [0, 0] : [0, -100]);

  return (
    <div className="relative flex justify-center px-3 pb-24 pt-32 md:px-10 md:pb-40 md:pt-40" ref={containerRef}>
      <div className="relative w-full" style={{ perspective: "1000px" }}>
        <Header translate={translate} titleComponent={titleComponent} />
        <div ref={cardRef} className="mx-auto mt-14 max-w-5xl md:mt-16">
          <Card rotate={rotate} scale={scale}>
            {children}
          </Card>
        </div>
        {footer && <div className="relative mx-auto mt-8 max-w-5xl">{footer}</div>}
      </div>
    </div>
  );
};

export const Header = ({
  translate,
  titleComponent,
}: {
  translate: MotionValue<number>;
  titleComponent: React.ReactNode;
}) => {
  return (
    <motion.div style={{ translateY: translate }} className="mx-auto max-w-5xl text-center">
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
      }}
      className="h-[22rem] w-full rounded-[26px] border border-line-strong bg-surface-strong p-2 shadow-[inset_0_1px_0_rgb(255_255_255/0.06)] sm:h-[32rem] md:h-[40rem] md:p-3"
    >
      <div className="relative h-full w-full overflow-hidden rounded-[18px] border border-line bg-bg">{children}</div>
    </motion.div>
  );
};
