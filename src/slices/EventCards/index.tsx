"use client";

import { FC, useState } from "react";
import { isFilled, type ImageField, type KeyTextField, type LinkField } from "@prismicio/client";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { SliceComponentProps } from "@prismicio/react";
import { Dialog } from "radix-ui";
import { ArrowRight, Calendar, Clock, MapPin, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/cn";
import { cardHoverCn } from "@/lib/variants";

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

type EventViewModel = {
  raw: EventItem;
  title: string;
  label: string | null;
  date: string | null;
  time: string | null;
  location: string | null;
  summary: string | null;
  hasButton: boolean;
  hasImage: boolean;
};

const EventCards: FC<EventCardsProps> = ({ slice }) => {
  const primary = (slice.primary as unknown as EventPrimary) || {};
  const items = (slice.items as unknown as EventItem[]) || [];
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [allOpen, setAllOpen] = useState(false);

  const badgeText = isFilled.keyText(primary.badge_text) ? primary.badge_text : null;
  const heading = isFilled.keyText(primary.heading) ? primary.heading : "Наши события";
  const description = isFilled.keyText(primary.description) ? primary.description : null;
  const events: EventViewModel[] = items.map((event) => ({
    raw: event,
    title: isFilled.keyText(event.title) ? event.title : "Событие",
    label: isFilled.keyText(event.label) ? event.label : null,
    date: isFilled.keyText(event.date) ? event.date : null,
    time: isFilled.keyText(event.time) ? event.time : null,
    location: isFilled.keyText(event.location) ? event.location : null,
    summary: isFilled.keyText(event.summary) ? event.summary : null,
    hasButton: !!event.buttonLink && isFilled.link(event.buttonLink),
    hasImage: isFilled.image(event.image),
  }));

  function renderEventCard(
    event: EventViewModel,
    index: number,
    {
      onClick,
      className,
    }: {
      onClick?: () => void;
      className?: string;
    } = {},
  ) {
    return (
      <button
        type="button"
        onClick={onClick ?? (() => setOpenIndex(index))}
        className={cn(
          "group relative flex min-h-[30rem] w-full !bg-red-200 flex-col justify-between bg-zinc-800 text-left",
          cardHoverCn,
          className,
        )}
        aria-label={`Открыть событие ${event.title}`}
      >
        {event.hasImage && (
          <PrismicNextImage
            field={event.raw.image!}
            fill
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/70 via-black/20 to-black/40" />

        <div className="relative z-10 flex flex-col gap-1 p-6 text-xs font-semibold uppercase tracking-[0.15em] text-white/70 group-hover:text-white">
          {event.label && <div>{event.label}</div>}
          {event.date && <div>{event.date}</div>}
        </div>

        <div className="relative z-10 p-6">
          <div className="text-lg font-bold leading-snug text-white">{event.title}</div>
          <div className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/60 transition-colors group-hover:text-white">
            Подробнее
          </div>
        </div>
      </button>
    );
  }

  return (
    <section data-slice-type={slice.slice_type} data-slice-variation={slice.variation} className="bg-white dark:bg-zinc-950">
      <Container className="py-14 sm:py-20">
        <div className="mx-auto w-full max-w-6xl space-y-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <h2 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white sm:text-4xl">{heading}</h2>
              {description && <p className="max-w-xl text-zinc-600 dark:text-zinc-400">{description}</p>}
            </div>

            <Button type="button" size="md" onClick={() => setAllOpen(true)} className="hidden sm:inline-flex">
              Все события →
            </Button>
          </div>

          {events.length > 0 && (
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {events.map((event, index) => (
                  <div key={index} className="min-w-0">
                    {renderEventCard(event, index)}
                  </div>
                ))}
              </div>

              <div className="sm:hidden">
                <Button type="button" size="md" onClick={() => setAllOpen(true)} className="w-full">
                  Все события →
                </Button>
              </div>
            </div>
          )}
        </div>
      </Container>

      {events.length > 0 && (
        <Dialog.Root open={allOpen} onOpenChange={setAllOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
            <Dialog.Content className="fixed inset-x-4 top-[50%] z-50 mx-auto flex h-[85vh] max-w-6xl -translate-y-1/2 flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
                >
                  <X className="h-4 w-4" />
                </button>
              </Dialog.Close>

              <div className="border-b border-zinc-200 p-6 pr-16 dark:border-zinc-800 sm:p-8 sm:pr-20">
                <div className="space-y-3">
                  {badgeText && (
                    <Badge variant="outline" size="lg">
                      {badgeText}
                    </Badge>
                  )}
                  <Dialog.Title className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-3xl">{heading}</Dialog.Title>
                  {description && (
                    <Dialog.Description className="max-w-2xl text-base text-zinc-600 dark:text-zinc-400">{description}</Dialog.Description>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 sm:p-8">
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {events.map((event, index) => (
                    <div key={index} className="min-w-0">
                      {renderEventCard(event, index, {
                        onClick: () => {
                          setAllOpen(false);
                          setOpenIndex(index);
                        },
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}

      {events.map((event, i) => (
        <Dialog.Root key={i} open={openIndex === i} onOpenChange={(open) => !open && setOpenIndex(null)}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
            <Dialog.Content className="fixed inset-x-4 top-[50%] z-50 mx-auto flex h-[85vh] max-w-2xl -translate-y-1/2 flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 md:h-[800px]">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
                >
                  <X className="h-4 w-4" />
                </button>
              </Dialog.Close>

              <div className="flex-1 overflow-y-auto">
                {event.hasImage && (
                  <div className="relative h-56 w-full shrink-0 sm:h-72">
                    <PrismicNextImage field={event.raw.image!} fill className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                )}

                <div className="space-y-5 p-8">
                  {event.label && <div className="w-fit rounded-full bg-blue-100 px-4 py-3 text-sm font-semibold">{event.label}</div>}
                  <Dialog.Title className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">{event.title}</Dialog.Title>

                  {(event.date || event.time || event.location) && (
                    <div className="flex flex-wrap gap-4 text-sm text-zinc-500 dark:text-zinc-400">
                      {event.date && (
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          {event.date}
                        </span>
                      )}
                      {event.time && (
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          {event.time}
                        </span>
                      )}
                      {event.location && (
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </span>
                      )}
                    </div>
                  )}

                  {event.summary && (
                    <Dialog.Description className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400">{event.summary}</Dialog.Description>
                  )}

                  {event.hasButton && (
                    <PrismicNextLink field={event.raw.buttonLink} className={buttonVariants({ variant: "primary", className: "h-auto py-3" })}>
                      {(event.raw.buttonLink as any)?.text || "Подробнее"}
                      <ArrowRight className="h-4 w-4" />
                    </PrismicNextLink>
                  )}
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      ))}
    </section>
  );
};

export default EventCards;
