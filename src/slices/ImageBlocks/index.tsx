import { FC } from "react";
import { asLink, Content, isFilled, type ImageField, type LinkField, type KeyTextField } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { SliceComponentProps } from "@prismicio/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { cn } from "@/lib/cn";

/**
 * Props for `ImageBlocks`.
 */
export type ImageBlocksProps = SliceComponentProps<Content.ImageBlocksSlice>;

type BlockItem = {
  image?: ImageField;
  title?: KeyTextField;
  description?: KeyTextField;
  button?: LinkField;
  image_position?: KeyTextField;
};

/**
 * Component for "ImageBlocks" Slices.
 * Renders alternating (zigzag) image-left / image-right rows.
 */
const ImageBlocks: FC<ImageBlocksProps> = ({ slice }) => {
  const items = (slice.items as unknown as BlockItem[]).filter((item) => item.title || isFilled.image(item.image));

  if (!items.length) return null;

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="bg-zinc-50 py-16 md:py-24">
      <Container>
        <div className="flex flex-col gap-10 sm:gap-12 md:gap-16">
          {items.map((item, idx) => {
            const imageRight = item.image_position === "right";
            const href = item.button && isFilled.link(item.button) ? asLink(item.button) : null;
            const label = item.button && "text" in item.button ? (item.button.text as string) : null;
            const hasImage = isFilled.image(item.image);

            return (
              <div
                key={`${item.title}-${idx}`}
                className={cn(
                  "group flex flex-col items-stretch overflow-hidden rounded-3xl border border-zinc-200 bg-white md:flex-row",
                  imageRight && "md:flex-row-reverse",
                )}>
                {/* Image column — ~55% */}
                <div className="relative aspect-[4/3] sm:aspect-video w-full shrink-0 overflow-hidden bg-zinc-100 md:aspect-auto md:h-auto md:min-h-[400px] md:w-[55%]">
                  {hasImage ?
                    <PrismicNextImage
                      field={item.image}
                      fill
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  : <div className="flex h-full min-h-[280px] w-full items-center justify-center md:min-h-[400px]">
                      <div className="h-16 w-16 rounded-2xl bg-zinc-200" />
                    </div>
                  }
                </div>

                {/* Text column */}
                <div className="flex w-full flex-col justify-center gap-5 sm:gap-6 p-6 sm:p-8 md:w-[45%] md:px-10 md:py-14 lg:p-14">
                  {item.title && (
                    <h2 className="text-3xl font-semibold leading-tight tracking-tight text-zinc-950 sm:text-4xl">
                      {item.title}
                    </h2>
                  )}
                  {item.description && <p className="text-base sm:text-lg leading-relaxed text-zinc-600">{item.description}</p>}
                  {href && label && (
                    <Link
                      href={href}
                      className="group/btn inline-flex w-fit items-center gap-2 rounded-full border border-zinc-900 px-6 py-3 text-sm font-medium tracking-wide text-zinc-900 transition-all duration-200 hover:bg-zinc-900 hover:text-white">
                      {label}
                      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default ImageBlocks;
