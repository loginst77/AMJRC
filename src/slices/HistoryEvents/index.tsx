import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { Container } from "@/components/ui/container";
import { LightRays } from "@/components/ui/light-rays";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import { cardHoverCn } from "@/lib/variants";

/**
 * Props for `HistoryEvents`.
 */
export type HistoryEventsProps = SliceComponentProps<Content.HistoryEventsSlice>;

/**
 * Component for "HistoryEvents" Slices.
 */
const HistoryEvents: FC<HistoryEventsProps> = ({ slice }) => {
  // Cast slice to any to avoid TS errors if types haven't been regenerated via Slice Machine yet
  const prismicData: any = slice;

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="relative overflow-hidden border-t border-zinc-200 bg-zinc-50">
      {/* Light Rays Background */}
      <LightRays />

      <Container className="relative z-10 py-16 sm:py-20 md:py-28">
        {/* Header */}
        <div className="space-y-3 text-center">
          {prismicData.primary?.badge_text && <Badge size="lg">{prismicData.primary.badge_text}</Badge>}
          {prismicData.primary?.heading && (
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
              {prismicData.primary.heading}
            </h2>
          )}
          {prismicData.primary?.description && (
            <p className="mx-auto max-w-xl text-lg text-zinc-600">{prismicData.primary.description}</p>
          )}
        </div>

        {/* Timeline */}
        {prismicData.items && prismicData.items.length > 0 && (
          <div className="relative mx-auto mt-12 max-w-5xl sm:mt-14 md:mt-16">
            {/* Vertical line (aligned to the left) */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-zinc-200 md:left-7 lg:left-8" />

            <div className="space-y-10 sm:space-y-12 md:space-y-16">
              {prismicData.items.map((m: any, index: number) => {
                return (
                  <div key={index} className="relative pl-16 md:pl-20 lg:pl-24">
                    {/* Dot on the left line */}
                    <div className="absolute left-6 top-6 z-10 flex -translate-x-[calc(50%-0.5px)] items-center justify-center md:left-7 lg:left-8">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-700 ring-[5px] ring-white/50">
                        <span className="h-2 w-2 rounded-full bg-white" />
                      </span>
                    </div>

                    {/* Card (all aligned to the right side of the line) */}
                    <div className="w-full md:w-[85%] lg:w-[75%]">
                      <div
                        className={cn(
                          "group flex flex-col overflow-hidden rounded-3xl border border-zinc-200/80 bg-white/80 shadow-secondary backdrop-blur-sm transition-shadow",
                        )}>
                        <div className="flex items-center justify-between border-zinc-200 px-5 pt-5 sm:px-6 sm:pt-6">
                          <span className="rounded-full bg-blue-100 px-4 py-1.5 text-3xl font-bold tracking-wider text-zinc-950 sm:px-6 sm:py-2 sm:text-4xl">
                            {m.year}
                          </span>{" "}
                        </div>
                        <div className="flex-1 p-5 sm:p-6">
                          <h3 className="mb-2 text-lg font-bold leading-snug text-zinc-950 sm:text-xl">{m.heading}</h3>
                          <p className="flex-1 text-base leading-relaxed text-zinc-600">{m.text}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
};

export default HistoryEvents;
