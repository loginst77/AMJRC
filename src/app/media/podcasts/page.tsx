import type { Metadata } from "next";
import { asDate, asText, type Content } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";

import { FeaturedEpisode } from "./components/featured-episode";
import { TagFilterBar } from "@/components/tags/tag-filter-bar";
import { PodcastEpisodeList, type PodcastEpisode, type PodcastTag } from "@/components/media-components/podcast-episode-list";
import { Container } from "@/components/ui/container";
import { MediaPageHero } from "@/components/media-components/media-page-hero";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import { SectionHeader } from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Подкасты",
  description: "Аудиобеседы, интервью и размышления о вере.",
};

export default async function PodcastsPage({ searchParams }: { searchParams?: Promise<{ tag?: string | string[] }> }) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const rawTagParam = resolvedSearchParams?.tag;
  const selectedTag =
    Array.isArray(rawTagParam) && rawTagParam.length > 0 ? decodeURIComponent(rawTagParam[0]!)
    : typeof rawTagParam === "string" ? decodeURIComponent(rawTagParam)
    : undefined;
  const selectedTagKey = selectedTag?.toLowerCase();

  const client = createClient();

  const [landing, podcasts] = await Promise.all([
    client.getSingle("podcastlandingpage").catch(() => null),
    client.getAllByType<Content.PodcastDocument>("podcast", {
      orderings: [
        { field: "my.podcast.date", direction: "desc" },
        { field: "document.first_publication_date", direction: "desc" },
      ],
      fetchLinks: ["tag.name"],
    }),
  ]);

  const episodes: PodcastEpisode[] = podcasts.map((episode) => {
    const title = asText((episode.data as { title?: any }).title) || (episode.data as any).meta_title || "Без названия";
    const description = (episode.data as { description?: string }).description || (episode.data as any).meta_description || "";
    const href =
      (
        (episode.data as { external_link?: { url?: string; link_type?: string } }).external_link?.url ||
        (episode.data as any).external_link?.link_type === "Web"
      ) ?
        (episode.data as any).external_link?.url
      : undefined;
    const date = asDate((episode.data as { date?: any }).date ?? episode.first_publication_date) || null;
    const author = (episode.data as { author?: string }).author || undefined;
    const featured = Boolean((episode.data as { featured?: boolean }).featured);
    const tagsGroup = (episode.data as { tags?: { tag?: unknown }[] }).tags ?? [];
    const tags: PodcastTag[] = tagsGroup
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
      .filter(Boolean) as PodcastTag[];

    return {
      id: `${episode.id}`,
      title,
      description,
      author,
      date: date ? date.toISOString() : "",
      href: href || undefined,
      tags,
      alliance: undefined,
      featured,
    };
  });

  const featuredEpisodes = episodes.filter((ep) => ep.featured);
  const fallbackFeatured = featuredEpisodes.length ? featuredEpisodes : episodes.slice(0, 1);
  const regularEpisodes = episodes.filter((ep) => !fallbackFeatured.some((featuredEp) => featuredEp.id === ep.id));

  const tagStats = new Map<string, { tag: PodcastTag; count: number }>();
  regularEpisodes.forEach((episode) => {
    episode.tags?.forEach((tag) => {
      const current = tagStats.get(tag.slug);
      if (current) {
        current.count += 1;
      } else {
        tagStats.set(tag.slug, { tag, count: 1 });
      }
    });
  });

  const tagFilters = Array.from(tagStats.values()).sort((a, b) => a.tag.name.localeCompare(b.tag.name, "ru"));

  const matchedTag = selectedTagKey ? tagFilters.find((item) => item.tag.slug.toLowerCase() === selectedTagKey)?.tag : undefined;
  const activeTagKey = matchedTag?.slug.toLowerCase();
  const activeTagLabel = matchedTag?.name;
  const matchesTag = (episode: PodcastEpisode) => !activeTagKey || episode.tags?.some((tag) => tag.slug.toLowerCase() === activeTagKey);
  const rest = regularEpisodes.filter((episode) => matchesTag(episode));
  const totalVisible = rest.length;

  return (
    <div className="flex flex-col">
      <MediaPageHero title="Подкасты" />
      {landing && (
        <section className="w-full">
          <SliceZone slices={landing.data.slices} components={components} />
        </section>
      )}

      {fallbackFeatured.length ?
        <FeaturedEpisode episodes={fallbackFeatured} />
      : null}

      <section className="bg-zinc-50 py-12">
        <Container className="space-y-4">
          <SectionHeader title="Все выпуски" size="sm" as="div" className="text-center" descriptionClassName="text-center" />

          <TagFilterBar
            allCount={regularEpisodes.length}
            anchorId="podcast-list"
            tags={tagFilters.map(({ tag, count }) => ({
              slug: tag.slug,
              name: tag.name,
              count,
              href: `/media/podcasts?tag=${encodeURIComponent(tag.slug)}`,
              active: activeTagKey === tag.slug.toLowerCase(),
            }))}
          />

          <div id="podcast-list" className="scroll-mt-24">
            {totalVisible === 0 ?
              <div className="rounded-xl border border-dashed border-zinc-200 bg-white px-6 py-10 text-center text-zinc-600">
                <p className="font-semibold text-zinc-800">Нет выпусков для выбранного тега</p>
                <p className="text-sm text-zinc-500">Добавьте тег к выпуску в Prismic, чтобы он появился в этом фильтре.</p>
              </div>
            : rest.length === 0 ?
              <div className="rounded-xl border border-zinc-200 bg-white px-6 py-6 text-sm text-zinc-600 shadow-sm">
                Пока нет незакреплённых выпусков для выбранного тега.
              </div>
            : <PodcastEpisodeList episodes={rest} />}
          </div>
        </Container>
      </section>
    </div>
  );
}
