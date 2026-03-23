import type { ReactNode } from "react";
import clsx from "clsx";

type HeadingProps = {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  size?: "2xs" | "sm" | "md" | "lg" | "xl" | "xs";
  color?: "zinc-800" | "white";
  className?: string;
  children?: ReactNode;
};

export function Heading({
  as: Comp = "h1",
  size = "lg",
  color = "zinc-800",
  children,
  className,
}: HeadingProps) {
  return (
    <Comp
      className={clsx(
        "font-bold leading-tight tracking-tight md:leading-tight",
        size === "xl" && "text-5xl md:text-7xl",
        size === "lg" && "text-4xl md:text-5xl",
        size === "md" && "text-3xl md:text-4xl",
        size === "sm" && "text-xl md:text-2xl",
        size === "xs" && "text-lg md:text-xl",
        size === "2xs" && "text-base md:text-lg",
        className,
      )}
    >
      {children}
    </Comp>
  );
}
