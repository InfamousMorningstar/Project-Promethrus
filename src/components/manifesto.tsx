import { ScrollReveal } from "./reactbits/scroll-reveal";

// One sentence in place of a paragraph: each word sharpens into focus as it scrolls past.
export function Manifesto() {
  return (
    <section aria-label="What AHMXD stands for" className="mx-auto max-w-[1400px] px-4 pb-8 pt-24 sm:px-6 md:pt-32 lg:px-10">
      <ScrollReveal
        text="Fast websites. Secure systems. One engineer who answers for both."
        highlight={["websites.", "systems."]}
        className="max-w-5xl text-[clamp(2rem,4.6vw,4rem)] font-bold leading-[1.1] tracking-[-0.035em] text-ink"
      />
    </section>
  );
}
