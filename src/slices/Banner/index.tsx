"use client";

import { FC } from "react";
import { asLink, Content, isFilled } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { SliceComponentProps } from "@prismicio/react";

import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type BannerProps = SliceComponentProps<Content.BannerSlice>;

const Banner: FC<BannerProps> = ({ slice }) => {
  if (slice.variation === "noImage") {
    const primary = slice.primary as any;
    const { title, description, primaryButton, secondary_Button } = primary;

    const displayTitle = title || "Пожертвования";
    const displayDescription =
      description || "Ваша щедрость помогает нам заботиться о людях, наставлять семьи и служить нашему городу с любовью Иисуса.";

    const primaryHref = isFilled.link(primaryButton) ? asLink(primaryButton) : undefined;
    const primaryLabel = primaryButton?.text || "Пожертвовать онлайн";

    // secondary_Button might come as a Link field or plain Text field depending on type generation
    const isSecondaryLink = secondary_Button && typeof secondary_Button === "object" && "link_type" in secondary_Button;
    const secondaryHref = isSecondaryLink && isFilled.link(secondary_Button) ? asLink(secondary_Button) : undefined;
    const secondaryLabel = isSecondaryLink ? secondary_Button?.text || "Нужна молитва?" : secondary_Button || "Нужна молитва?";

    const isSecondaryBg = primary.background === "Secondary (grey)";

    return (
      <section
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
        className={isSecondaryBg ? "bg-zinc-50 dark:bg-zinc-900" : "bg-white dark:bg-zinc-950"}>
        <Container className="py-12 sm:py-14 md:py-16">
          <div className="grid items-center gap-8 md:gap-10">
            <div className="space-y-6 sm:space-y-8">
              <div className="max-w-2xl space-y-3 sm:space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl dark:text-white">{displayTitle}</h2>
                {displayDescription && (
                  <p className="max-w-2xl text-base text-zinc-600 sm:text-lg dark:text-zinc-400">{displayDescription}</p>
                )}
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                {primaryHref && (
                  <ButtonLink href={primaryHref} size="lg" variant="secondary">
                    {primaryLabel}
                  </ButtonLink>
                )}
                {secondaryHref ?
                  <ButtonLink href={secondaryHref} variant="ghost" size="lg">
                    {secondaryLabel}
                  </ButtonLink>
                : secondaryLabel && secondary_Button ?
                  <ButtonLink href="#" variant="ghost" size="lg">
                    {secondaryLabel}
                  </ButtonLink>
                : null}
              </div>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  const { title, description, actionLink, image } = slice.primary;

  const displayTitle = title || "Присоединяйтесь к нашему сообществу";
  const displayDescription =
    description || "Встречаемся каждое воскресенье и на неделе, чтобы вместе поклоняться, учиться и служить городу.";

  const actionLabel = actionLink?.text || "Узнать больше";
  const actionHref = isFilled.link(actionLink) ? asLink(actionLink) : undefined;

  const hasBackgroundImage = isFilled.image(image);

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={cn("relative overflow-hidden", !hasBackgroundImage && "bg-zinc-100 text-zinc-950")}>
      {hasBackgroundImage && (
        <>
          <PrismicNextImage field={image} fill priority className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/60" />
        </>
      )}

      <Container className="relative z-10 flex flex-col items-center py-12 text-center sm:py-16 md:py-20">
        <h2
          className={cn(
            "max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl",
            hasBackgroundImage ? "text-white" : undefined,
          )}>
          {displayTitle}
        </h2>

        {displayDescription && (
          <p
            className={cn(
              "mt-3 max-w-xl text-base leading-relaxed sm:mt-4 sm:text-lg",
              hasBackgroundImage ? "text-zinc-200" : "text-zinc-600",
            )}>
            {displayDescription}
          </p>
        )}

        {actionHref && (
          <ButtonLink
            href={actionHref}
            variant={hasBackgroundImage ? "filled" : "primary"}
            size="lg"
            className="mt-6 w-full sm:mt-8 sm:w-auto">
            {actionLabel}
          </ButtonLink>
        )}
      </Container>
    </section>
  );
};

export default Banner;
