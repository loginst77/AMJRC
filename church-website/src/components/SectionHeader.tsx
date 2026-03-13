import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/cn";

type Tone = "light" | "dark";
type Align = "left" | "center";
type Size = "lg" | "sm";

type SectionHeaderProps = {
  title: ReactNode;
  description?: ReactNode;
  tone?: Tone;
  align?: Align;
  size?: Size;
  className?: string;
  as?: ElementType;
  descriptionClassName?: string;
};

export function SectionHeader({
  title,
  description,
  tone = "light",
  align = "left",
  size = "lg",
  className,
  as: TitleTag = "h2",
  descriptionClassName,
}: SectionHeaderProps) {
  const titleClass =
    tone === "dark"
      ? size === "sm"
        ? "text-2xl font-semibold text-white"
        : "text-4xl font-semibold tracking-tight text-white sm:text-5xl"
      : size === "sm"
        ? "text-2xl font-semibold text-zinc-950"
        : "text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl";

  const descriptionClass =
    tone === "dark"
      ? size === "sm"
        ? "text-base text-zinc-300"
        : "text-lg text-zinc-200"
      : size === "sm"
        ? "text-base text-zinc-600"
        : "text-lg text-zinc-700";

  const alignClass =
    align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <div className={cn("flex flex-col gap-4", alignClass, className)}>
      <TitleTag className={titleClass}>{title}</TitleTag>
      {description ? (
        <div className={cn(descriptionClass, descriptionClassName)}>{description}</div>
      ) : null}
    </div>
  );
}
