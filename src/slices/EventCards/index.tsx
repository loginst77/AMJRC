"use client";

import { FC, useState } from "react";
import { isFilled, type ImageField, type KeyTextField, type LinkField } from "@prismicio/client";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { SliceComponentProps } from "@prismicio/react";
import { Dialog } from "radix-ui";
import { Calendar, Clock, MapPin, X, ArrowRight } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import { cardHoverCn } from "@/lib/variants";
import { buttonVariants } from "@/components/ui/button";

// Type will be available after Slice Machine sync; using `any` for now
export type EventCardsProps = SliceComponentProps<any>;

type EventItem = {
  image?: ImageField;
  label?: KeyTextField;
  date?: KeyTextField;
  time?: KeyTextField;
  location?: KeyTextField;
  title?: KeyTextField;
  summary?: KeyTextField;
  buttonLink?: LinkField;
};

type EventPrimary = {
  badge_text?: KeyTextField;
  heading?: KeyTextField;
  description?: KeyTextField;
};

const EventCards: FC<EventCardsProps> = ({ slice }) => {
  const primary = (slice.primary as unknown as EventPrimary) || {};
  const items = (slice.items as unknown as EventItem[]) || [];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const badgeText = isFilled.keyText(primary.badge_text) ? primary.badge_text : null;
  const heading = isFilled.keyText(primary.heading) ? primary.heading : "Наши события";
  const description = isFilled.keyText(primary.description) ? primary.description : null;

  return (
    <section data-slice-type={slice.slice_type} data-slice-variation={slice.variation} className="bg-white py-20 md:py-28 dark:bg-zinc-950">
      <Container>
        <div className="mx-auto w-full max-w-6xl space-y-12">
          {/* Header */}
          <div className="flex flex-col items-center space-y-4 text-center">
            {badgeText && (
              <Badge variant="outline" size="lg">
                {badgeText}
              </Badge>
            )}
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white sm:text-4xl">{heading}</h2>
            {description && <p className="mx-auto max-w-xl text-lg text-zinc-600 dark:text-zinc-400">{description}</p>}
          </div>

          {/* Event Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((event, i) => {
              const title = isFilled.keyText(event.title) ? event.title : "Событие";
              const label = isFilled.keyText(event.label) ? event.label : null;
              const date = isFilled.keyText(event.date) ? event.date : null;
              const hasImage = isFilled.image(event.image);

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setOpenIndex(i)}
                  className={cn("group relative flex min-h-[30rem] w-full flex-col justify-between bg-zinc-800 text-left", cardHoverCn)}>
                  {/* Background image */}
                  {hasImage && (
                    <PrismicNextImage
                      field={event.image!}
                      fill
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/70 via-black/20 to-black/40" />

                  {/* Top: label + date */}
                  <div className="relative z-10 flex flex-col gap-1 p-6 text-xs font-semibold uppercase tracking-[0.15em] text-white/70 group-hover:text-white">
                    {label && <div>{label}</div>}
                    {date && <div>{date}</div>}
                  </div>

                  {/* Bottom: title + learn more */}
                  <div className="relative z-10 p-6">
                    <div className="text-lg font-bold leading-snug text-white">{title}</div>
                    <div className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/60 transition-colors group-hover:text-white">
                      Подробнее
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </Container>

      {/* Dialog */}
      {items.map((event, i) => {
        const title = isFilled.keyText(event.title) ? event.title : "Событие";
        const label = isFilled.keyText(event.label) ? event.label : null;
        const date = isFilled.keyText(event.date) ? event.date : null;
        const time = isFilled.keyText(event.time) ? event.time : null;
        const location = isFilled.keyText(event.location) ? event.location : null;
        const summary = isFilled.keyText(event.summary) ? event.summary : null;
        const hasButton = event.buttonLink && isFilled.link(event.buttonLink);
        const hasImage = isFilled.image(event.image);

        return (
          <Dialog.Root key={i} open={openIndex === i} onOpenChange={(open) => !open && setOpenIndex(null)}>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
              <Dialog.Content className="fixed inset-x-4 top-[50%] z-50 mx-auto max-w-2xl -translate-y-1/2 flex h-[85vh] md:h-[800px] flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95">
                {/* Image header */}
                {hasImage && (
                  <div className="relative h-56 w-full shrink-0 sm:h-72">
                    <PrismicNextImage field={event.image!} fill className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                )}

                {/* Close button */}
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60">
                    <X className="h-4 w-4" />
                  </button>
                </Dialog.Close>

                {/* Content */}
                <div className="flex-1 space-y-5 overflow-y-auto p-8">
                  {label && <div className="bg-blue-100 w-fit rounded-full px-4 py-3 text-sm font-semibold">{label}</div>}
                  <Dialog.Title className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">{title}</Dialog.Title>

                  {/* Details row */}
                  {(date || time || location) && (
                    <div className="flex flex-wrap gap-4 text-sm text-zinc-500 dark:text-zinc-400">
                      {date && (
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          {date}
                        </span>
                      )}
                      {time && (
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          {time}
                        </span>
                      )}
                      {location && (
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4" />
                          {location}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Summary */}
                  {summary && (
                    <Dialog.Description className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
                      {summary}
                    </Dialog.Description>
                  )}

                  {/* CTA */}
                  {hasButton && (
                    <PrismicNextLink field={event.buttonLink} className={buttonVariants({ variant: "primary", className: "py-3 h-auto" })}>
                      {(event.buttonLink as any)?.text || "Подробнее"}
                      <ArrowRight className="h-4 w-4" />
                    </PrismicNextLink>
                  )}
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        );
      })}
    </section>
  );
};

export default EventCards;
