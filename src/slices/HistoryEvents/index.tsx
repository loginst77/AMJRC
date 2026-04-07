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
      className="relative overflow-hidden border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      {/* Light Rays Background */}
      <LightRays />

      <Container className="relative z-10 py-20 lg:py-28">
        {/* Header */}
        <div className="mx-auto max-w-3xl space-y-3 text-center flex flex-col items-center">
          {prismicData.primary?.badge_text && <Badge size="lg">{prismicData.primary.badge_text}</Badge>}

          {prismicData.primary?.heading && (
            <h2 className="text-4xl font-semibold tracking-tight text-zinc-900">{prismicData.primary.heading}</h2>
          )}

          {prismicData.primary?.description && (
            <p className="mx-auto max-w-xl text-lg text-zinc-600">{prismicData.primary.description}</p>
          )}
        </div>

        {/* Timeline */}
        {prismicData.items && prismicData.items.length > 0 && (
          <div className="relative mx-auto mt-16 max-w-5xl">
            {/* Vertical line (aligned to the left) */}
            <div className="absolute left-6 lg:left-8 top-0 bottom-0 w-px bg-zinc-200 dark:bg-zinc-800" />

            <div className="space-y-12 sm:space-y-16">
              {prismicData.items.map((m: any, index: number) => {
                return (
                  <div key={index} className="relative pl-16 lg:pl-24">
                    {/* Dot on the left line */}
                    <div className="absolute left-6 lg:left-8 top-6 z-10 flex items-center justify-center -translate-x-[calc(50%-0.5px)] sm:-translate-x-[calc(50%-0.5px)]">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-950 ring-[5px] ring-zinc-50 dark:bg-white dark:ring-zinc-950">
                        <span className="h-2 w-2 rounded-full bg-white dark:bg-zinc-950" />
                      </span>
                    </div>

                    {/* Card (all aligned to the right side of the line) */}
                    <div className="w-full sm:w-[85%] lg:w-[75%]">
                      <div
                        className={cn(
                          "group flex flex-col bg-white overflow-hidden rounded-3xl border border-zinc-200/80 bg-white/80 shadow-secondary backdrop-blur-sm transition-shadow dark:border-zinc-800 dark:bg-zinc-900/80",
                        )}>
                        <div className="pt-6 px-6 border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                          <span className="text-4xl font-bold tracking-wider text-zink-600 dark:text-blue-500 px-6 py-2 bg-blue-200/80 rounded-full">
                            {m.year}
                          </span>{" "}
                        </div>
                        <div className="p-6 flex-1">
                          <h3 className="text-xl font-bold leading-snug text-zinc-900 mb-2">{m.heading}</h3>
                          <p className="text-base leading-relaxed text-zinc-500 flex-1">{m.text}</p>
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
