"use client";

import { FC } from "react";
import {
  Content,
  asLink,
  isFilled,
  type ImageField,
  type KeyTextField,
  type LinkField,
  type RichTextField,
} from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { SliceComponentProps } from "@prismicio/react";
import Link from "next/link";

import { PrismicRichText } from "@/components/PrismicRichText";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export type LandingPageHeroProps = SliceComponentProps<Content.LandingPageHeroSlice>;

type LandingPageHeroPrimary = {
  title?: KeyTextField;
  description?: RichTextField;
  backgroundImage?: ImageField;
  breadcrumbHomeLabel?: KeyTextField;
  breadcrumbHomeLink?: LinkField;
  breadcrumbCurrent?: KeyTextField;
  buttonLabel?: KeyTextField;
  buttonLink?: LinkField;
  secondaryButtonLabel?: KeyTextField;
  secondaryButtonLink?: LinkField;
};

const DEFAULT_DESCRIPTION: RichTextField = [
  {
    type: "paragraph",
    text: "Альянс Мессианских Еврейских Русскоязычных Общин объединяет верующих по всему миру — людей, разделяющих веру в Иешуа Мессию и любовь к Его народу.",
    spans: [],
  },
  {
    type: "paragraph",
    text: "Мы служим, поддерживая общины, развивая лидеров и укрепляя единство Церкви.",
    spans: [],
  },
];

const LandingPageHero: FC<LandingPageHeroProps> = ({ slice }) => {
  const primary = slice.primary as unknown as LandingPageHeroPrimary;

  const title = isFilled.keyText(primary.title) ? primary.title : "О нас";
  const description = isFilled.richText(primary.description) ? primary.description : DEFAULT_DESCRIPTION;
  const backgroundImage = isFilled.image(primary.backgroundImage) ? primary.backgroundImage : null;
  const breadcrumbHomeLabel = isFilled.keyText(primary.breadcrumbHomeLabel) ? primary.breadcrumbHomeLabel : "Главная";
  const breadcrumbHomeHref =
    primary.breadcrumbHomeLink && isFilled.link(primary.breadcrumbHomeLink)
      ? asLink(primary.breadcrumbHomeLink)
      : "/";
  const breadcrumbCurrent = isFilled.keyText(primary.breadcrumbCurrent) ? primary.breadcrumbCurrent : title;
  const buttonHref = primary.buttonLink && isFilled.link(primary.buttonLink) ? asLink(primary.buttonLink) : null;
  const secondaryButtonHref =
    primary.secondaryButtonLink && isFilled.link(primary.secondaryButtonLink)
      ? asLink(primary.secondaryButtonLink)
      : null;
  const hasButton = !!buttonHref && isFilled.keyText(primary.buttonLabel);
  const hasSecondaryButton = !!secondaryButtonHref && isFilled.keyText(primary.secondaryButtonLabel);

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="relative min-h-[380px] overflow-hidden py-14 sm:py-22 md:py-24"
    >
      {backgroundImage ? (
        <PrismicNextImage field={backgroundImage} fill className="absolute inset-0 h-full w-full object-cover" priority />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-800 via-indigo-900 to-zinc-900" />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-transparent" />

      <Container className="relative z-10">
        <div className="max-w-2xl space-y-5">
          <nav className="text-sm text-zinc-300">
            {breadcrumbHomeHref ? (
              <Link href={breadcrumbHomeHref} className="transition-colors hover:text-white">
                {breadcrumbHomeLabel}
              </Link>
            ) : (
              <span className="text-white">{breadcrumbHomeLabel}</span>
            )}
            <span className="mx-2 text-zinc-400">/</span>
            <span className="text-white">{breadcrumbCurrent}</span>
          </nav>

          <div className="border-l-4 border-white/80 pl-4">
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">{title}</h1>
          </div>

            <div className="max-w-3xl text-zinc-200 backdrop-blur-sm p-4 rounded-3xl bg-white/15">
          <PrismicRichText
            field={description}
            components={{
              paragraph: ({ children }) => <p className="text-lg leading-8 text-zinc-100">{children}</p>,
            }}
          />
          </div>

          {(hasButton || hasSecondaryButton) && (
            <div className="flex flex-wrap gap-3">
              {hasButton && buttonHref && (
                <ButtonLink href={buttonHref} size="lg" variant="primary">
                  {primary.buttonLabel}
                </ButtonLink>
              )}
              {hasSecondaryButton && secondaryButtonHref && (
                <ButtonLink href={secondaryButtonHref} size="lg" variant="filled">
                  {primary.secondaryButtonLabel}
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
