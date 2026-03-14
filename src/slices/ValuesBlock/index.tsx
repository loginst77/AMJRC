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
      description:
        "We anchor every gathering, decision, and prayer in the truth of God's Word.",
    },
    {
      title: "Hospitality First",
      description:
        "Every person is welcomed as family and invited to belong before they believe.",
    },
    {
      title: "Serving Our City",
      description:
        "We partner with local schools, shelters, and nonprofits to meet practical needs.",
    },
  ];

  const valuesFromCMS = slice.items
    .map(({ title, description }) => ({
      title: isFilled.keyText(title) ? title : undefined,
      description: isFilled.keyText(description) ? description : undefined,
    }))
    .filter(
      (value): value is { title: string; description: string } =>
        Boolean(value.title && value.description),
    )
    .map(({ title, description }) => ({ title, description }))
    .slice(0, 4);

  const valuesToRender =
    valuesFromCMS.length >= 2 ? valuesFromCMS : fallbackValues;

  const gridColsClass =
    valuesToRender.length === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : valuesToRender.length === 3
        ? "grid-cols-1 sm:grid-cols-3"
        : "grid-cols-1 sm:grid-cols-2 md:grid-cols-4";

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
    >
      <Bounded as="div" yPadding="sm">
        <div className={`mx-auto grid gap-8 sm:gap-10 md:gap-12 ${gridColsClass}`}>
          {valuesToRender.map(({ title, description }) => (
            <div
              key={title}
              className="space-y-2 border-t border-zinc-200 px-3 py-10 text-center first:border-t-0 sm:border-t-0 sm:border-r sm:last:border-r-0 sm:px-4 sm:py-12 sm:text-left md:px-6 dark:border-zinc-800"
            >
              <div className="text-lg font-semibold text-zinc-950 dark:text-white">
                {title}
              </div>
              <p className="text-zinc-700 dark:text-zinc-300">{description}</p>
            </div>
          ))}
        </div>
      </Bounded>
    </section>
  );
};

export default ValuesBlock;
