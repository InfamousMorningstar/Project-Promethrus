import type { ComponentProps } from "react";

type Variant = "primary" | "ghost";

const base =
  "group inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-full px-5 text-sm font-semibold tracking-[-0.01em] transition-[background-color,border-color,color,transform] duration-300 ease-out-expo active:scale-[0.98]";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent-fill text-accent-contrast shadow-[inset_0_1px_0_rgb(255_255_255/0.22)] hover:bg-[#6d28d9]",
  ghost: "border border-line-strong text-ink hover:border-accent hover:text-accent",
};

export function ButtonLink({
  variant = "primary",
  className,
  ...props
}: ComponentProps<"a"> & { variant?: Variant }) {
  return <a className={`${base} ${variants[variant]} ${className ?? ""}`} {...props} />;
}
