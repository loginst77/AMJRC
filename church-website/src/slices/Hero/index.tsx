import { FC } from "react";
import {
  asLink,
  type Content,
  isFilled,
  type RichTextField,
  type EmbedField,
  type TitleField,
} from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import type { SliceComponentProps, JSXMapSerializer } from "@prismicio/react";

import { PrismicRichText } from "@/components/PrismicRichText";
import { ButtonLink } from "@/components/ui/button";

const titleComponents: JSXMapSerializer = {
  heading1: ({ children }) => (
    <h1 className="max-w-2xl text-balance text-start text-4xl font-semibold leading-tight tracking-wide text-white sm:text-5xl md:text-6xl">
      {children}
    </h1>
  ),
};

const textComponents: JSXMapSerializer = {
  paragraph: ({ children }) => (
    <p className="max-w-xl text-base leading-relaxed text-white/80 uppercase sm:text-base">
      {children}
    </p>
  ),
};

type HeroProps = SliceComponentProps<Content.HeroSlice>;

const Hero: FC<HeroProps> = ({ slice }) => {
  const primary = slice.primary as typeof slice.primary & {
    title: TitleField;
    text: RichTextField;
    videoEmbed?: EmbedField;
  };
  const backgroundImage = primary.backgroundImage;
  const primaryButtonHref = asLink(primary.buttonLink);
  const secondaryButtonHref = asLink(primary.secondaryButtonLink);
  const hasPrimaryButton =
    isFilled.link(primary.buttonLink) &&
    !!primaryButtonHref &&
    isFilled.keyText(primary.buttonText);
  const hasSecondaryButton =
    isFilled.link(primary.secondaryButtonLink) &&
    !!secondaryButtonHref &&
    isFilled.keyText(primary.secondaryButtonText);

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="relative min-h-[75vh] overflow-hidden bg-slate-950 text-white"
    >
      {isFilled.image(backgroundImage) && (
        <PrismicNextImage
          field={backgroundImage}
          alt=""
          fill={true}
          priority={true}
          className="pointer-events-none select-none object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/70 to-transparent" />

      <div className="relative mx-auto flex min-h-[75vh] max-w-6xl flex-col justify-center px-4 py-12 sm:px-6 sm:py-16 md:py-20">
        <div className="grid items-center gap-8 sm:gap-10 lg:grid-cols-[1.05fr_1.2fr]">
          <div className="space-y-5 sm:space-y-6">
            <PrismicRichText field={primary.title} components={titleComponents} />
            <PrismicRichText field={primary.text} components={textComponents} />

            {(hasPrimaryButton || hasSecondaryButton) && (
              <div className="flex flex-wrap gap-3">
                {hasPrimaryButton && (
                  <ButtonLink href={primaryButtonHref} size="lg" variant="primary">
                    {primary.buttonText}
                  </ButtonLink>
                )}
                {hasSecondaryButton && (
                  <ButtonLink href={secondaryButtonHref} size="lg" variant="filled">
                    {primary.secondaryButtonText}
                  </ButtonLink>
                )}
              </div>
            )}
          </div>

          <div className="relative mx-auto w-full max-w-full sm:max-w-4xl lg:max-w-5xl">
            <div className="absolute -inset-3 rounded-3xl bg-white/5 blur-xl" />
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black/50 shadow-2xl ring-1 ring-white/15">
              {isFilled.embed(primary.videoEmbed) ? (
                <iframe
                  src={`${primary.videoEmbed.embed_url?.replace("watch?v=", "embed/") ?? primary.videoEmbed.embed_url}?autoplay=1&mute=1&rel=0`}
                  title={primary.videoEmbed.title ?? "Embedded video"}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                  className="h-full w-full"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div className="flex h-full items-center justify-center px-6 text-center text-sm text-white/40">
                  Video goes here
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
