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
  const name = isFilled.keyText(slice.primary.name) ? slice.primary.name : null;
  const title = isFilled.keyText(slice.primary.title) ? slice.primary.title : null;
  const buttonLink = slice.primary.buttonLink;
  const buttonHref = asLink(buttonLink);
  const buttonLabel = isFilled.link(buttonLink) && buttonLink.text ? buttonLink.text : null;
  const paragraphs = slice.items.map((item) => item.paragraph).filter(isFilled.keyText);

  return (
    <section data-slice-type={slice.slice_type} data-slice-variation={slice.variation} className="border-t border-zinc-200 bg-zinc-50">
      <Container className="py-16 sm:py-20 md:py-28">
        <div className="mx-auto max-w-4xl">
          <div>
            <div className="relative">
              <div className="relative space-y-4 text-base leading-relaxed text-zinc-700 sm:space-y-5 sm:text-[17px]">
                {paragraphs.map((paragraph, index) => (
                  <p key={`${index}-${paragraph}`}>{paragraph}</p>
                ))}
              </div>

              {(name || title) && (
                <div className="mt-6 flex flex-col gap-4 sm:mt-8 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    {name && <p className="text-sm font-semibold text-zinc-700">{name}</p>}
                    {title && <p className="text-sm text-zinc-500">{title}</p>}
                  </div>

                  {buttonLabel && buttonHref && (
                    <ButtonLink href={buttonHref} variant="primary" size="md" className="w-full shrink-0 sm:w-auto">
                      {buttonLabel}
                    </ButtonLink>
                  )}
                </div>
              )}

              {buttonLabel && buttonHref && !(name || title) && (
                <div className="mt-6">
                  <ButtonLink href={buttonHref} variant="primary" size="md" className="w-full sm:w-auto">
                    {buttonLabel}
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
