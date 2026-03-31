"use client";

import { FC } from "react";
import { Content, asLink, isFilled, type ImageField, type KeyTextField, type LinkField, type RichTextField } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

import { LandingPageHero as LandingPageHeroComponent } from "@/components/LandingPageHero";

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

const LandingPageHeroSlice: FC<LandingPageHeroProps> = ({ slice }) => {
  const primary = slice.primary as unknown as LandingPageHeroPrimary;

  const breadcrumbHomeHref =
    primary.breadcrumbHomeLink && isFilled.link(primary.breadcrumbHomeLink) ? asLink(primary.breadcrumbHomeLink) : "/";
  const buttonHref = primary.buttonLink && isFilled.link(primary.buttonLink) ? asLink(primary.buttonLink) : null;
  const secondaryButtonHref =
    primary.secondaryButtonLink && isFilled.link(primary.secondaryButtonLink) ? asLink(primary.secondaryButtonLink) : null;

  return (
    <LandingPageHeroComponent
      sliceType={slice.slice_type}
      sliceVariation={slice.variation}
      title={primary.title}
      description={primary.description}
      backgroundImage={primary.backgroundImage}
      breadcrumbHomeLabel={primary.breadcrumbHomeLabel}
      breadcrumbHomeLink={breadcrumbHomeHref}
      breadcrumbCurrent={primary.breadcrumbCurrent}
      button1Label={primary.buttonLabel}
      button1Link={buttonHref}
      button2Label={primary.secondaryButtonLabel}
      button2Link={secondaryButtonHref}
    />
  );
};

export default LandingPageHeroSlice;
