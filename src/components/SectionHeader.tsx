import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/cn";

type Align = "left" | "center";
type Size = "lg" | "sm";

type SectionHeaderProps = {
  title: ReactNode;
  description?: ReactNode;
  align?: Align;
  size?: Size;
  className?: string;
  as?: ElementType;
  titleClassName?: string;
  descriptionClassName?: string;
};

export function SectionHeader({
  title,
  description,
  align = "left",
  size = "lg",
  className,
  as: TitleTag = "h2",
  titleClassName,
  descriptionClassName,
}: SectionHeaderProps) {
  const titleClass = size === "sm" ? "text-2xl font-semibold text-zinc-950" : "text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl";

  const descriptionClass = size === "sm" ? "text-base text-zinc-600" : "text-lg text-zinc-700";

  const alignClass = align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <div className={cn("flex flex-col gap-2", alignClass, className)}>
      <TitleTag className={cn(titleClass, titleClassName)}>{title}</TitleTag>
      {description ? <div className={cn(descriptionClass, descriptionClassName)}>{description}</div> : null}
    </div>
  );
}
