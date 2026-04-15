import { FC } from "react";
import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

import { EventCardsSection, type EventCardSectionItem } from "@/components/event-cards-section";
import { Container } from "@/components/ui/container";
export type EventCardsProps = SliceComponentProps<Content.EventCardsSlice>;

const EventCards: FC<EventCardsProps> = ({ slice }) => {
  const heading = isFilled.keyText(slice.primary.heading) ? slice.primary.heading : "Наши события";
  const description = isFilled.keyText(slice.primary.description) ? slice.primary.description : null;
  const events: EventCardSectionItem[] = slice.items.map((event, index) => ({
    id: `${slice.id}-${index}`,
    image: event.image,
    date: event.date,
    time: event.time,
    location: event.location,
    title: event.title,
    summary: event.summary,
    buttonLink: event.buttonLink,
  }));

  if (!events.length) return null;

  return (
    <section data-slice-type={slice.slice_type} data-slice-variation={slice.variation} className="bg-white">
      <Container className="py-14 sm:py-20">
        <div className="mx-auto w-full max-w-6xl space-y-6">
          <EventCardsSection events={events} heading={heading} description={description} showHeader showAllButton />
        </div>
      </Container>
    </section>
  );
};

export default EventCards;
