import { FC } from "react";
import { Content, asText } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

import { EventCardsSection, type EventCardSectionItem } from "@/components/event-cards-section";
import { Container } from "@/components/ui/container";
import { createClient } from "@/prismicio";

/**
 * Props for `EventList`.
 */
export type EventListProps = SliceComponentProps<Content.EventListSlice>;

/**
 * Component for "EventList" Slices.
 */
const EventList: FC<EventListProps> = async ({ slice }) => {
  const client = createClient();
  const communities = await client.getAllByType<Content.CommunityDocument>("community").catch(() => []);

  const events: EventCardSectionItem[] = communities.flatMap((community) => {
    const communityName = asText(community.data.title) || "Община";

    return community.data.slices.flatMap((communitySlice, sliceIndex) => {
      if (communitySlice.slice_type !== "event_cards") return [];

      return communitySlice.items.map((event, eventIndex) => ({
        id: `${community.id}-${sliceIndex}-${eventIndex}`,
        image: event.image,
        label: event.label,
        date: event.date,
        time: event.time,
        location: event.location,
        title: event.title,
        summary: event.summary,
        buttonLink: event.buttonLink,
        communityName,
      }));
    });
  });

  if (!events.length) return null;

  return (
    <section data-slice-type={slice.slice_type} data-slice-variation={slice.variation} className="bg-white dark:bg-zinc-950">
      <Container className="py-14 sm:py-20">
        <div className="mx-auto w-full max-w-6xl">
          <EventCardsSection events={events} />
        </div>
      </Container>
    </section>
  );
};

export default EventList;
