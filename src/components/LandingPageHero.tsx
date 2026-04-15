import { FC, ReactNode } from "react";
import { asLink, isFilled, type ImageField, type RichTextField, type TitleField } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { PrismicText } from "@prismicio/react";
import Link from "next/link";

import { PrismicRichText } from "@/components/PrismicRichText";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export type LandingPageHeroProps = {
  title?: ReactNode | TitleField | string | null;
  description?: RichTextField | string | null;
  backgroundImage?: ImageField | null;

  breadcrumbHomeLabel?: string | null;
  breadcrumbHomeLink?: string | null;
  breadcrumbMiddleLabel?: string | null;
  breadcrumbMiddleLink?: string | null;
  breadcrumbCurrent?: string | null;

  button1Label?: string | null;
  button1Link?: string | null;
  button1Variant?: string | null;

  button2Label?: string | null;
  button2Link?: string | null;
  button2Variant?: string | null;

  sliceType?: string;
  sliceVariation?: string;

  community?: {
    leader?: string | null;
    serviceTime?: string | null;
    address?: string | null;
  } | null;
};

export const LandingPageHero: FC<LandingPageHeroProps> = ({
  title,
  description,
  backgroundImage,
  breadcrumbHomeLabel = "Главная",
  breadcrumbHomeLink = "/",
  breadcrumbMiddleLabel,
  breadcrumbMiddleLink,
  breadcrumbCurrent,
  button1Label,
  button1Link,
  button1Variant,
  button2Label,
  button2Link,
  button2Variant,
  sliceType,
  sliceVariation,
  community,
}) => {
  const displayTitle =
    typeof title === "string" ? title
    : Array.isArray(title) ? <PrismicText field={title} />
    : title || "Старница";

  const displayBreadcrumbCurrent = breadcrumbCurrent || (typeof displayTitle === "string" ? displayTitle : "Старница");

  const displayDescription = description;

  const hasButton1 = !!button1Link && !!button1Label;
  const hasButton2 = !!button2Link && !!button2Label;

  const resolveVariant = (variant?: string | null, fallback?: any) => {
    if (!variant) return fallback;
    const v = variant.toLowerCase();
    // Use "filled" (glassmorphism) for secondary buttons on this dark background hero
    return v === "secondary" ? "filled" : v;
  };

  return (
    <section
      data-slice-type={sliceType}
      data-slice-variation={sliceVariation}
      className="relative min-h-[380px] overflow-hidden py-14 sm:py-22 md:py-24">
      {backgroundImage && isFilled.image(backgroundImage) ?
        <PrismicNextImage field={backgroundImage} fill className="absolute inset-0 h-full w-full object-cover" priority />
      : <div className="absolute inset-0 bg-gradient-to-br from-blue-800 via-indigo-900 to-zinc-900" />}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-transparent" />

      <Container className="relative z-10">
        <div className="max-w-2xl space-y-5">
          <nav className="text-sm text-zinc-300">
            {breadcrumbHomeLink ?
              <Link href={breadcrumbHomeLink} className="transition-colors hover:text-white">
                {breadcrumbHomeLabel}
              </Link>
            : <span className="text-white">{breadcrumbHomeLabel}</span>}
            {breadcrumbMiddleLabel && (<>
              <span className="mx-2 text-zinc-400">/</span>
              {breadcrumbMiddleLink ?
                <Link href={breadcrumbMiddleLink} className="transition-colors hover:text-white">
                  {breadcrumbMiddleLabel}
                </Link>
              : <span className="text-white">{breadcrumbMiddleLabel}</span>}
            </>)}
            <span className="mx-2 text-zinc-400">/</span>
            <span className="text-white">{displayBreadcrumbCurrent}</span>
          </nav>

          <div className="border-l-4 border-white/80 pl-4">
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">{displayTitle}</h1>
          </div>

          {(
            isFilled.richText(displayDescription as RichTextField) ||
            (typeof displayDescription === "string" && displayDescription.trim().length > 0)
          ) ?
            <div className="max-w-3xl text-zinc-200 backdrop-blur-sm p-4 rounded-3xl bg-white/15">
              {typeof displayDescription === "string" ?
                <p className="text-base leading-relaxed sm:text-lg text-zinc-100">{displayDescription}</p>
              : <PrismicRichText
                  field={displayDescription as RichTextField}
                  components={{
                    paragraph: ({ children }) => <p className="text-base leading-relaxed sm:text-lg text-zinc-100">{children}</p>,
                  }}
                />
              }
            </div>
          : null}

          {community && (
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-zinc-300 bg-white/15 backdrop-blur-sm p-4 rounded-2xl w-fit">
              {community.leader && (
                <span>
                  <span className="font-medium text-white">Лидер:</span> {community.leader}
                </span>
              )}
              {community.serviceTime && (
                <span>
                  <span className="font-medium text-white">Служение:</span> {community.serviceTime}
                </span>
              )}
              {community.address && (
                <span>
                  <span className="font-medium text-white">Адрес:</span> {community.address}
                </span>
              )}
            </div>
          )}

          {(hasButton1 || hasButton2) && (
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
              {hasButton1 && button1Link && (
                <ButtonLink href={button1Link} size="lg" variant={resolveVariant(button1Variant, "primary") as any} className="w-full sm:w-auto">
                  {button1Label}
                </ButtonLink>
              )}
              {hasButton2 && button2Link && (
                <ButtonLink href={button2Link} size="lg" variant={resolveVariant(button2Variant, "filled") as any} className="w-full sm:w-auto">
                  {button2Label}
                </ButtonLink>
              )}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
};

export default LandingPageHero;
