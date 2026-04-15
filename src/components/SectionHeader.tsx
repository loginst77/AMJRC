import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/cn";

type Align = "left" | "center";
type Size = "lg" | "sm";
type Tone = "light" | "dark";

type SectionHeaderProps = {
  title: ReactNode;
  afterTitle?: ReactNode;
  description?: ReactNode;
  align?: Align;
  size?: Size;
  tone?: Tone;
  className?: string;
  as?: ElementType;
  titleClassName?: string;
  descriptionClassName?: string;
};

export function SectionHeader({
  title,
  afterTitle,
  description,
  align = "left",
  size = "lg",
  tone = "light",
  className,
  as: TitleTag = "h2",
  titleClassName,
  descriptionClassName,
}: SectionHeaderProps) {
  const titleColor = tone === "dark" ? "text-white" : "text-zinc-950";
  const descriptionColor =
    tone === "dark" ? "text-zinc-300"
    : size === "sm" ? "text-zinc-600"
    : "text-zinc-700";

  const titleClass =
    size === "sm" ? `text-2xl font-semibold ${titleColor}` : `text-4xl font-semibold tracking-tight ${titleColor} sm:text-4xl`;

  const descriptionClass = size === "sm" ? `text-base ${descriptionColor}` : `text-lg ${descriptionColor}`;

  const alignClass = align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <div className={cn("flex flex-col gap-2", alignClass, className)}>
      <TitleTag className={cn(titleClass, titleClassName)}>{title}</TitleTag>
      {afterTitle}
      {description ?
        <div className={cn(descriptionClass, descriptionClassName)}>{description}</div>
      : null}
    </div>
  );
}
