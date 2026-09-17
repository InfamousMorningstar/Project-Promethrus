import { StrokeText } from "./reactbits/stroke-text";

// Section headings draw their outline when scrolled into view, fill, and redraw on hover.
// The last line of a two-line title takes the accent colour.
export function SectionTitle({
  lines,
  id,
  align = "start",
  className = "",
  sizeClassName = "text-[clamp(2.5rem,5.8vw,5rem)]",
}: {
  lines: string[];
  id?: string;
  align?: "start" | "center";
  className?: string;
  sizeClassName?: string;
}) {
  return (
    <h2
      id={id}
      className={`flex flex-col leading-none ${sizeClassName} ${
        align === "center" ? "items-center" : "items-start"
      } ${className}`}
    >
      {lines.map((line, i) => (
        <span key={line} className="contents">
          {i > 0 && " "}
          <StrokeText
            text={line.toUpperCase()}
            trigger="scroll"
            replayOnHover
            delay={i * 0.25}
            className={i > 0 ? "-mt-[0.26em]" : ""}
            fillClassName={lines.length > 1 && i === lines.length - 1 ? "fill-accent" : "fill-ink"}
            strokeClassName={lines.length > 1 && i === lines.length - 1 ? "stroke-ink/60" : "stroke-accent"}
          />
        </span>
      ))}
    </h2>
  );
}
