import { FC } from "react";
import { asLink, isFilled, type Content } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";

import { PrismicRichText } from "@/components/PrismicRichText";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

type HomeHeroProps = {
  data: Content.HomeDocumentData;
};

export const HomeHero: FC<HomeHeroProps> = ({ data }) => {
  const primaryButtonHref = asLink(data.primary_button);
  const secondaryButtonHref = asLink(data.secondary_button);
  const hasPrimaryButton = isFilled.link(data.primary_button) && !!primaryButtonHref;
  const hasSecondaryButton = isFilled.link(data.secondary_button) && !!secondaryButtonHref;

  return (
    <section className="relative min-h-[calc(100vh-88px)] overflow-hidden bg-slate-950 py-12 text-white md:py-16 lg:h-[calc(100vh-88px)] lg:py-0">
      {isFilled.image(data.hero_background_image) && (
        <PrismicNextImage
          field={data.hero_background_image}
          alt=""
          fill={true}
          priority={true}
          className="pointer-events-none select-none object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/70 to-transparent" />

      <Container className="relative grid h-full items-center gap-8 lg:grid-cols-2">
        <div className="space-y-6 md:space-y-8">
          <PrismicRichText
            field={data.hero_title}
            components={{
              heading1: ({ children }) => (
                <h1 className="lg:max-w-2xl w-full text-balance text-start text-4xl font-bold leading-tight tracking-wide text-white sm:text-5xl md:text-5xl lg:text-6xl">
                  {children}
                </h1>
              ),
            }}
          />

          <PrismicRichText
            field={data.hero_text}
            components={{
              paragraph: ({ children }) => (
                <p className="max-w-xl mt-8 !text-base font-semibold uppercase tracking-[0.2em] md:mt-12 lg:mt-20">{children}</p>
              ),
            }}
          />

          {(hasPrimaryButton || hasSecondaryButton) && (
            <div className="flex flex-wrap gap-3">
              {hasPrimaryButton && (
                <ButtonLink href={primaryButtonHref} size="lg" variant="primary">
                  {("text" in data.primary_button && data.primary_button.text) || "Primary Action"}
                </ButtonLink>
              )}
              {hasSecondaryButton && (
                <ButtonLink href={secondaryButtonHref} size="lg" variant="filled">
                  {("text" in data.secondary_button && data.secondary_button.text) || "Secondary Action"}
                </ButtonLink>
              )}
            </div>
          )}
        </div>

        <div className="relative flex w-full items-center justify-center">
          <div className="absolute -inset-3 rounded-3xl bg-white/5 blur-xl" />
          <div className="relative aspect-[9/12] w-full overflow-hidden rounded-2xl bg-black/50 shadow-2xl ring-1 ring-white/15 md:aspect-video lg:aspect-[9/12] lg:max-w-lg">
            {isFilled.embed(data.hero_video_embed) ?
              <iframe
                src={`${data.hero_video_embed.embed_url?.replace("watch?v=", "embed/") ?? data.hero_video_embed.embed_url}?autoplay=1&mute=1&rel=0`}
                title={data.hero_video_embed.title ?? "Embedded video"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
                className="h-full w-full"
                referrerPolicy="no-referrer-when-downgrade"
              />
            : <div className="flex h-full items-center justify-center text-sm text-white/40">Video goes here</div>}
          </div>
        </div>
      </Container>
    </section>
  );
};
