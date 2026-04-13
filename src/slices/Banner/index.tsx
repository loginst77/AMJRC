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
        <Container className="py-16">
          <div className="grid items-center gap-10">
            <div className="space-y-8">
              <div className="space-y-4 max-w-2xl">
                <h2 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white">{displayTitle}</h2>
                {displayDescription && <p className="max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">{displayDescription}</p>}
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                {primaryHref && (
                  <ButtonLink href={primaryHref} size="lg">
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

      <Container className="relative z-10 py-16 sm:py-20 flex flex-col items-center text-center">
        <h2 className={cn("max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl", hasBackgroundImage ? "text-white" : undefined)}>
          {displayTitle}
        </h2>

        {displayDescription && (
          <p className={cn("mt-4 max-w-xl text-lg leading-relaxed", hasBackgroundImage ? "text-zinc-200" : "text-zinc-600")}>
            {displayDescription}
          </p>
        )}

        {actionHref && (
          <ButtonLink href={actionHref} variant={hasBackgroundImage ? "filled" : "primary"} size="lg" className="mt-8">
            {actionLabel}
          </ButtonLink>
        )}
      </Container>
    </section>
  );
};

export default Banner;
