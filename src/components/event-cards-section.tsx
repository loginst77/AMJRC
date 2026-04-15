"use client";

import { useState } from "react";
import { isFilled, type ImageField, type KeyTextField, type LinkField } from "@prismicio/client";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { Dialog } from "radix-ui";
import { ArrowRight, Calendar, Clock, MapPin, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { cardHoverCn } from "@/lib/variants";

export type EventCardSectionItem = {
  id: string;
  image?: ImageField | null;
  label?: KeyTextField | string | null;
  date?: KeyTextField | string | null;
  time?: KeyTextField | string | null;
  location?: KeyTextField | string | null;
  title?: KeyTextField | string | null;
  summary?: KeyTextField | string | null;
  buttonLink?: LinkField;
  communityName?: string | null;
};

type EventCardsSectionProps = {
  events: EventCardSectionItem[];
  badgeText?: string | null;
  heading?: string | null;
  description?: string | null;
  showHeader?: boolean;
  showAllButton?: boolean;
};

type EventViewModel = {
  raw: EventCardSectionItem;
  title: string;
  label: string | null;
  date: string | null;
  time: string | null;
  location: string | null;
  summary: string | null;
  communityName: string | null;
  hasButton: boolean;
  hasImage: boolean;
};

function getTextValue(field?: KeyTextField | string | null) {
  if (typeof field !== "string") return null;

  const value = field.trim();
  return value ? value : null;
}

export function EventCardsSection({
  events,
  badgeText,
  heading,
  description,
  showHeader = false,
  showAllButton = false,
}: EventCardsSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [allOpen, setAllOpen] = useState(false);

  const normalizedEvents: EventViewModel[] = events.map((event) => ({
    raw: event,
    title: getTextValue(event.title) ?? "Событие",
    label: getTextValue(event.label),
    date: getTextValue(event.date),
    time: getTextValue(event.time),
    location: getTextValue(event.location),
    summary: getTextValue(event.summary),
    communityName: getTextValue(event.communityName),
    hasButton: !!event.buttonLink && isFilled.link(event.buttonLink),
    hasImage: !!event.image && isFilled.image(event.image),
  }));

  if (!normalizedEvents.length) return null;

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
        className={cn("group relative flex min-h-[30rem] w-full flex-col justify-between bg-zinc-800 text-left", cardHoverCn, className)}
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
          {event.communityName && <div>{event.communityName}</div>}
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
    <>
      {showHeader && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            {badgeText && (
              <Badge variant="outline" size="lg">
                {badgeText}
              </Badge>
            )}
            {heading && <h2 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white sm:text-4xl">{heading}</h2>}
            {description && <p className="max-w-xl text-zinc-600 dark:text-zinc-400">{description}</p>}
          </div>

          {showAllButton && (
            <Button type="button" size="md" onClick={() => setAllOpen(true)} className="hidden sm:inline-flex">
              Все события →
            </Button>
          )}
        </div>
      )}

      <div className={showHeader ? "space-y-6" : undefined}>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {normalizedEvents.map((event, index) => (
            <div key={event.raw.id} className="min-w-0">
              {renderEventCard(event, index)}
            </div>
          ))}
        </div>

        {showAllButton && (
          <div className="sm:hidden">
            <Button type="button" size="md" onClick={() => setAllOpen(true)} className="w-full">
              Все события →
            </Button>
          </div>
        )}
      </div>

      {showAllButton && (
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
                  {heading && (
                    <Dialog.Title className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-3xl">
                      {heading}
                    </Dialog.Title>
                  )}
                  {description && (
                    <Dialog.Description className="max-w-2xl text-base text-zinc-600 dark:text-zinc-400">{description}</Dialog.Description>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 sm:p-8">
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {normalizedEvents.map((event, index) => (
                    <div key={event.raw.id} className="min-w-0">
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

      {normalizedEvents.map((event, index) => (
        <Dialog.Root key={event.raw.id} open={openIndex === index} onOpenChange={(open) => !open && setOpenIndex(null)}>
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
                  {event.communityName && (
                    <div className="text-sm font-semibold uppercase tracking-[0.15em] text-zinc-500 dark:text-zinc-400">
                      {event.communityName}
                    </div>
                  )}
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
                    <Dialog.Description className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
                      {event.summary}
                    </Dialog.Description>
                  )}

                  {event.hasButton && (
                    <PrismicNextLink field={event.raw.buttonLink} className={buttonVariants({ variant: "primary", className: "h-auto py-3" })}>
                      {(event.raw.buttonLink as { text?: string } | undefined)?.text || "Подробнее"}
                      <ArrowRight className="h-4 w-4" />
                    </PrismicNextLink>
                  )}
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      ))}
    </>
  );
}
