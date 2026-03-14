"use client";

import { FC } from "react";
import { asLink, Content, isFilled, type ImageField, type KeyTextField, type LinkField } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { SliceComponentProps } from "@prismicio/react";

import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type BannerProps = SliceComponentProps<Content.BannerSlice>;

type BannerFields = {
  title?: KeyTextField;
  description?: KeyTextField;
  actionLabel?: KeyTextField;
  actionLink?: LinkField;
  image?: ImageField;
};

const Banner: FC<BannerProps> = ({ slice }) => {
  const primary = slice.primary as unknown as BannerFields;

  const title = primary.title || "Присоединяйтесь к нашему сообществу";
  const description =
    primary.description ||
    "Встречаемся каждое воскресенье и на неделе, чтобы вместе поклоняться, учиться и служить городу.";

  const actionLabel = primary.actionLabel || "Узнать больше";
  const actionHref =
    primary.actionLink && isFilled.link(primary.actionLink) ? asLink(primary.actionLink) : undefined;

  const hasBackgroundImage = isFilled.image(primary.image);

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={cn("relative overflow-hidden", !hasBackgroundImage && "bg-zinc-100 text-zinc-950")}
    >
      {hasBackgroundImage && (
        <>
          <PrismicNextImage field={primary.image!} fill priority className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/60" />
        </>
      )}

      <Container className="relative z-10 py-16 sm:py-20 flex flex-col items-center text-center">
        <h2
          className={cn(
            "max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl",
            hasBackgroundImage ? "text-white" : undefined,
          )}
        >
          {title}
        </h2>

        {description && (
          <p
            className={cn(
              "mt-4 max-w-xl text-lg leading-relaxed",
              hasBackgroundImage ? "text-zinc-200" : "text-zinc-600",
            )}
          >
            {description}
          </p>
        )}

        {actionHref && (
          <ButtonLink
            href={actionHref}
            variant={hasBackgroundImage ? "filled" : "primary"}
            size="lg"
            className="mt-8"
          >
            {actionLabel}
          </ButtonLink>
        )}
      </Container>
    </section>
  );
};

export default Banner;
