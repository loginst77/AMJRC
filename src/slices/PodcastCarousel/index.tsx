import { FC } from "react";
import { Content, asDate, asText, type RichTextField, type LinkField } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { createClient } from "@/prismicio";
import { PodcastCarouselClient } from "@/components/podcast-carousel";
import { type PodcastEpisode } from "@/components/media-components/podcast-episode-list";

/**
 * Props for `PodcastCarousel`.
 */
export type PodcastCarouselProps = SliceComponentProps<Content.PodcastCarouselSlice>;

/**
 * Component for "PodcastCarousel" Slices.
 */
const PodcastCarousel: FC<PodcastCarouselProps> = async ({ slice }) => {
  const client = createClient();
  const response = await client
    .getByType<Content.PodcastDocument>("podcast", {
      orderings: [
        { field: "my.podcast.date", direction: "desc" },
        { field: "document.first_publication_date", direction: "desc" },
      ],
      fetchLinks: ["tag.name", "community.title"],
      pageSize: 6,
    })
    .catch(() => null);

  const podcasts = response?.results ?? [];

  const items: PodcastEpisode[] = podcasts.map((podcast) => {
    const rawTitle = (podcast.data as { title?: RichTextField | string | null }).title;
    const title = Array.isArray(rawTitle) ? asText(rawTitle as RichTextField) : rawTitle || "Подкаст";

    const description = (podcast.data as any).description as string | undefined;

    const externalLink = (podcast.data as any).external_link as LinkField | undefined;
    const href = externalLink && "url" in externalLink ? externalLink.url : undefined;

    const dateRaw =
      asDate((podcast.data as any).date) ?? (podcast.first_publication_date ? new Date(podcast.first_publication_date) : null);
    const date = dateRaw ? dateRaw.toISOString() : new Date().toISOString();

    const author = (podcast.data as any).author as string | undefined;
    const rawCommunity = (podcast.data as { community?: unknown }).community;
    let community: PodcastEpisode["community"] | undefined = undefined;
    if (rawCommunity && typeof rawCommunity === "object") {
      const rel = rawCommunity as Record<string, unknown>;
      const id = typeof rel.id === "string" ? rel.id : null;
      const uid = typeof rel.uid === "string" ? rel.uid : null;
      if (rel.link_type === "Document" && id && uid) {
        const linkedTitle = (rel.data as { title?: RichTextField | string | null } | undefined)?.title;
        const name =
          Array.isArray(linkedTitle) ? asText(linkedTitle as RichTextField)
          : typeof linkedTitle === "string" ? linkedTitle
          : uid;
        community = {
          id,
          name: name || uid,
          href: `/communities/${uid}`,
        };
      }
    }

    const tagsGroup = (podcast.data as { tags?: { tag?: unknown }[] }).tags ?? [];
    const tags = tagsGroup
      .map((item) => {
        const rel = item?.tag as Record<string, unknown> | null | undefined;
        if (!rel || typeof rel !== "object") return null;
        if (rel.link_type !== "Document" || !rel.id) return null;
        const id = String(rel.id);
        const slug = String(rel.uid || id);
        const linkedName = (rel.data as { name?: string } | undefined)?.name;
        const name = linkedName || slug;
        return { id, slug, name };
      })
      .filter(Boolean) as { id: string; slug: string; name: string }[];

    return {
      id: podcast.id,
      title,
      description: description || undefined,
      href: href || "#",
      date,
      author: author || undefined,
      community,
      tags,
    };
  });

  if (!items.length) return null;

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={slice.primary?.background ? "bg-white" : "bg-zinc-50"}>
      <Container className="py-14 sm:py-20">
        {/* Section header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-950">{slice.primary?.title || "Подкасты"}</h2>
            {slice.primary?.description && <p className="max-w-xl text-zinc-600">{slice.primary.description}</p>}
          </div>
          <ButtonLink href="/media/podcasts" variant="primary" size="md" className="hidden sm:inline-flex">
            Все подкасты →
          </ButtonLink>
        </div>

        <div className="mt-8">
          <PodcastCarouselClient episodes={items} allHref="/media/podcasts" allLabel="Все подкасты →" />
        </div>
      </Container>
    </section>
  );
};

export default PodcastCarousel;
