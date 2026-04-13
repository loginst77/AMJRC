import { FC } from "react";
import { asLink, Content, isFilled, type KeyTextField, type LinkField } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/SectionHeader";

/**
 * Props for `InfoCard`.
 */
export type InfoCardProps = SliceComponentProps<Content.InfoCardSlice>;

type CardItem = {
  icon?: KeyTextField;
  title?: KeyTextField;
  text?: KeyTextField;
  buttonLink?: LinkField;
  buttonVariant?: "secondary" | "ghost";
  buttonTarget?: "_blank" | "_self";
};

/**
 * Component for "InfoCard" Slices.
 */
const InfoCard: FC<InfoCardProps> = ({ slice }) => {
  const cards = (slice.items as unknown as CardItem[]) || [];

  const lookupIcon = (raw?: string | null): LucideIcon | undefined => {
    if (!raw) return undefined;
    const key = raw.trim();
    if (!key) return undefined;
    const pascal = key
      .split(/[\s_-]+/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join("");
    const IconComp = (Icons as unknown as Record<string, LucideIcon | undefined>)[pascal];
    return IconComp;
  };

  const normalized = cards
    .map((item) => {
      const title = isFilled.keyText(item.title) ? item.title : null;
      const text = isFilled.keyText(item.text) ? item.text : null;
      const href = item.buttonLink && isFilled.link(item.buttonLink) ? asLink(item.buttonLink) : null;
      const buttonLabel =
        item.buttonLink && isFilled.link(item.buttonLink) && "text" in item.buttonLink && item.buttonLink.text ?
          (item.buttonLink.text as string)
        : null;
      const iconRaw = isFilled.keyText(item.icon) ? item.icon : null;
      const IconComp = lookupIcon(iconRaw);
      return {
        iconText: iconRaw,
        IconComp,
        title,
        text,
        buttonLabel,
        href,
        buttonVariant: item.buttonVariant === "ghost" ? "ghost" : "secondary",
        buttonTarget: item.buttonTarget === "_blank" ? "_blank" : undefined,
      };
    })
    .filter((card) => card.title && card.text);

  const capped = normalized.slice(0, 3);

  if (!capped.length) {
    return null;
  }

  const columnsClass =
    capped.length === 1 ? "grid-cols-1 max-w-xl"
    : capped.length === 2 ? "grid-cols-1 md:grid-cols-2 max-w-5xl"
    : "grid-cols-1 md:grid-cols-3";

  return (
    <section data-slice-type={slice.slice_type} data-slice-variation={slice.variation} className="bg-zinc-50 py-16 md:py-28 dark:bg-zinc-950">
      <Container>
        <div
          className={`grid overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-[var(--shadow-secondary)] dark:border-zinc-800 dark:bg-zinc-900 ${columnsClass} mx-auto`}
          style={{ boxShadow: "var(--shadow-secondary)" }}>
          {capped.map((card, idx) => (
            <div
              key={`${card.title}-${idx}`}
              className="flex flex-col border-b border-zinc-200 bg-white last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex-1 px-5 py-8 sm:px-8 sm:py-12">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-xl text-blue-900">
                  {card.IconComp ?
                    <card.IconComp className="h-7 w-7" />
                  : card.iconText || "✦"}
                </div>
                <div className="mt-6">
                  <SectionHeader
                    title={card.title}
                    description={card.text}
                    tone="light"
                    align="left"
                    size="sm"
                    className="gap-2"
                    descriptionClassName="!text-base leading-6 text-zinc-700"
                  />
                </div>
              </div>

              {card.buttonLabel && card.href && (
                <Link
                  href={card.href}
                  target={card.buttonTarget}
                  className="group mt-auto flex w-full items-center justify-start gap-2 border-t border-zinc-200 px-5 py-10 text-sm font-medium uppercase tracking-wide text-zinc-600 transition-colors hover:bg-blue-100 hover:text-zinc-900 sm:px-8 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white">
                  {card.buttonLabel}
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-2" />
                </Link>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default InfoCard;
