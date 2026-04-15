import { FC } from "react";
import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

import { Bounded } from "@/components/Bounded";

/**
 * Props for `ValuesBlock`.
 */
export type ValuesBlockProps = SliceComponentProps<Content.ValuesBlockSlice>;

/**
 * Component for "ValuesBlock" Slices.
 */
const ValuesBlock: FC<ValuesBlockProps> = ({ slice }) => {
  const fallbackValues = [
    {
      title: "Rooted in Scripture",
      description: "We anchor every gathering, decision, and prayer in the truth of God's Word.",
    },
    {
      title: "Hospitality First",
      description: "Every person is welcomed as family and invited to belong before they believe.",
    },
    {
      title: "Serving Our City",
      description: "We partner with local schools, shelters, and nonprofits to meet practical needs.",
    },
  ];

  const valuesFromCMS = slice.items
    .map(({ title, description }) => ({
      title: isFilled.keyText(title) ? title : undefined,
      description: isFilled.keyText(description) ? description : undefined,
    }))
    .filter((value): value is { title: string; description: string } => Boolean(value.title && value.description))
    .map(({ title, description }) => ({ title, description }))
    .slice(0, 4);

  const valuesToRender = valuesFromCMS.length >= 2 ? valuesFromCMS : fallbackValues;

  const isSecondary = slice.primary.background === "Secondary (grey)";

  const gridColsClass =
    valuesToRender.length === 2 ? "grid-cols-1 sm:grid-cols-2"
    : valuesToRender.length === 3 ? "grid-cols-1 md:grid-cols-3"
    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";

  const cardClass =
    valuesToRender.length <= 3 ?
      "space-y-2 border-t border-zinc-200 px-3 py-6 text-center first:border-t-0 sm:border-t-0 sm:px-5 sm:py-8 sm:text-left md:border-r md:px-6 md:py-10 md:last:border-r-0"
    : "space-y-2 border-t border-zinc-200 px-3 py-6 text-center first:border-t-0 sm:border-t-0 sm:border-r sm:px-5 sm:py-8 sm:text-left sm:even:border-r-0 md:px-6 md:py-10 lg:border-r lg:last:border-r-0";

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={`border-t border-zinc-200 ${isSecondary ? "bg-zinc-50" : "bg-white"}`}>
      <Bounded as="div" yPadding="sm">
        <div className={`mx-auto grid gap-6 sm:gap-x-0 sm:gap-y-6 ${gridColsClass}`}>
          {valuesToRender.map(({ title, description }) => (
            <div key={title} className={cardClass}>
              <div className="text-base font-semibold text-zinc-950 sm:text-lg">{title}</div>
              <p className="text-sm text-zinc-600 sm:text-base">{description}</p>
            </div>
          ))}
        </div>
      </Bounded>
    </section>
  );
};

export default ValuesBlock;
