import { FC } from "react";
import { Content, asText } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

import { SectionHeader } from "@/components/SectionHeader";
import { EventCardsSection, type EventCardSectionItem } from "@/components/event-cards-section";
import { ButtonLink } from "@/components/ui/button";
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

  const communitiesWithEvents = communities
    .map((community) => {
      const communityName = asText(community.data.title) || "Община";
      const events: EventCardSectionItem[] = community.data.slices.flatMap((communitySlice, sliceIndex) => {
        if (communitySlice.slice_type !== "event_cards") return [];

        return communitySlice.items.map((event, eventIndex) => ({
          id: `${community.id}-${sliceIndex}-${eventIndex}`,
          image: event.image,
          date: event.date,
          time: event.time,
          location: event.location,
          title: event.title,
          summary: event.summary,
          buttonLink: event.buttonLink,
          communityName,
        }));
      });

      return {
        id: community.id,
        href: `/communities/${community.uid}`,
        name: communityName,
        events,
      };
    })
    .filter((community) => community.events.length > 0);

  if (!communitiesWithEvents.length) return null;

  return (
    <section data-slice-type={slice.slice_type} data-slice-variation={slice.variation} className="bg-white">
      <Container className="py-14 sm:py-20">
        <div className="mx-auto w-full max-w-6xl space-y-12">
          {communitiesWithEvents.map((community) => (
            <div key={community.id} className="space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <SectionHeader title={community.name} as="div" className="text-left" descriptionClassName="text-left" />
                <ButtonLink href={community.href} size="md" className="hidden sm:inline-flex">
                  Перейти к общине
                </ButtonLink>
              </div>
              <EventCardsSection events={community.events} showCommunityNameInCard={false} />
              <ButtonLink href={community.href} size="md" className="w-full sm:hidden">
                Перейти к общине
              </ButtonLink>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default EventList;
