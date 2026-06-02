import { FC } from "react";
import { asLink, type Content, isFilled } from "@prismicio/client";
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
  const buttonHref = asLink(slice.primary.buttonLink);
  const signature = slice.primary.signature || (name ? `С любовью во Мессии, ${name}` : "С любовью во Мессии");
  const paragraphs = slice.items.map((item) => item.paragraph).filter(isFilled.keyText);

  return (
    <section data-slice-type={slice.slice_type} data-slice-variation={slice.variation} className="border-t border-zinc-200 bg-zinc-50">
      <Container className="py-16 sm:py-20 md:py-28">
        <div className="mx-auto max-w-4xl">
          <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400 sm:mb-10 sm:text-sm">{label}</p>

          <div>
            <div className="relative">
              <span
                aria-hidden={true}
                className="pointer-events-none absolute -left-1 -top-7 select-none font-serif text-6xl leading-none text-zinc-200 sm:-left-2 sm:-top-10 sm:text-7xl md:text-8xl"
              >
                &ldquo;
              </span>

              <div className="relative space-y-4 text-base leading-relaxed text-zinc-700 sm:space-y-5 sm:text-[17px]">
                {paragraphs.map((paragraph, index) => (
                  <p key={`${index}-${paragraph}`}>{paragraph}</p>
                ))}
              </div>

              {signature && <p className="mt-6 text-sm font-medium italic text-zinc-400 sm:mt-8">{signature}</p>}

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
