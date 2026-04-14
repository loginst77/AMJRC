import { FC } from "react";
import { asLink, type Content, isFilled } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { SliceComponentProps } from "@prismicio/react";

import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";

/**
 * Props for `NoteBanner`.
 */
export type NoteBannerProps = SliceComponentProps<Content.NoteBannerSlice>;

/**
 * Component for "NoteBanner" Slices.
 */
const NoteBanner: FC<NoteBannerProps> = ({ slice }) => {
  const label = slice.primary.label || "Слово президента";
  const name = slice.primary.name || "";
  const title = slice.primary.title || "";
  const buttonHref = asLink(slice.primary.buttonLink);
  const signature = slice.primary.signature || (name ? `С любовью во Мессии, ${name}` : "С любовью во Мессии");
  const paragraphs = slice.items.map((item) => item.paragraph).filter(isFilled.keyText);

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
      <Container className="py-16 sm:py-20 md:py-28">
        <div className="mx-auto max-w-5xl">
          <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 sm:mb-10 sm:text-sm">
            {label}
          </p>

          <div className="grid gap-8 sm:grid-cols-[auto_1fr] sm:items-start sm:gap-10 md:gap-12 lg:gap-16">
            <div className="mx-auto flex w-full max-w-xs flex-col items-center gap-4 text-center sm:mx-0 sm:w-48 md:w-52 lg:w-60">
              <div className="relative h-64 w-full shrink-0 overflow-hidden rounded-3xl bg-zinc-200 ring-1 ring-zinc-900/10 dark:bg-zinc-800 dark:ring-white/10 sm:h-64 md:h-72 lg:h-80">
                {isFilled.image(slice.primary.image) && (
                  <PrismicNextImage field={slice.primary.image} fill={true} className="object-cover" />
                )}
              </div>

              <div className="sm:mt-2">
                {name && <p className="font-semibold text-zinc-950 dark:text-white">{name}</p>}
                {title && <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">{title}</p>}
              </div>
            </div>

            <div className="relative">
              <span
                aria-hidden={true}
                className="pointer-events-none absolute -left-1 -top-3 select-none font-serif text-6xl leading-none text-zinc-200 dark:text-zinc-800 sm:-left-2 sm:-top-4 sm:text-7xl md:text-8xl">
                &ldquo;
              </span>

              <div className="relative space-y-4 text-base leading-relaxed text-zinc-700 dark:text-zinc-300 sm:space-y-5 sm:text-[17px]">
                {paragraphs.map((paragraph, index) => (
                  <p key={`${index}-${paragraph}`}>{paragraph}</p>
                ))}
              </div>

              {signature && <p className="mt-6 text-sm font-medium italic text-zinc-400 dark:text-zinc-500 sm:mt-8">{signature}</p>}

              {isFilled.keyText(slice.primary.buttonText) && isFilled.link(slice.primary.buttonLink) && buttonHref && (
                <div className="mt-6">
                  <ButtonLink href={buttonHref} variant="primary" size="md" className="w-full sm:w-auto">
                    {slice.primary.buttonText}
                  </ButtonLink>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default NoteBanner;
