// The AHMXD mark, taken from portfolio.ahmxd.net/favicon.svg so both sites share one identity.
export const MARK_PATHS = {
  core: "M50 5 L54 20 L52 85 L50 95 L48 85 L46 20 Z",
  left: "M42 30 L12 85 L38 75 L42 60 Z",
  right: "M58 30 L88 85 L62 75 L58 60 Z",
} as const;

export function LogoMark({ className, title = "AHMXD" }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" role="img" aria-label={title} className={className}>
      <path d={MARK_PATHS.core} className="fill-accent-fill" />
      <path d={MARK_PATHS.left} className="fill-ink" fillOpacity={0.9} />
      <path d={MARK_PATHS.right} className="fill-ink" fillOpacity={0.9} />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className ?? ""}`}>
      <LogoMark className="size-8 shrink-0" />
      <span className="flex flex-col leading-none">
        <span className="text-[15px] font-extrabold tracking-[-0.02em]">AHMXD Technologies</span>
        <span className="mt-1.5 text-[11.5px] italic tracking-[0.005em] text-soft">Web Development &amp; IT Solutions</span>
      </span>
    </span>
  );
}
