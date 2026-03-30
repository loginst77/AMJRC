import type { Metadata } from "next";
import { SliceZone } from "@prismicio/react";
import { asDate, asText, type Content, type RichTextField } from "@prismicio/client";

import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/SectionHeader";
import { FeaturedVideo } from "@/app/media/videos/components/featured-video";
import { TagFilterBar } from "@/components/tags/tag-filter-bar";
import { VideoCard, type VideoCardItem } from "@/components/media-components/video-card";
import { type MediaTag } from "@/lib/media-data";
import { createClient } from "@/prismicio";
import { components } from "@/slices";

function toYouTubeEmbed(url?: string): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.slice(1);
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
      const paths = parsed.pathname.split("/");
      const embedIdx = paths.indexOf("embed");
      if (embedIdx >= 0 && paths[embedIdx + 1]) return `https://www.youtube.com/embed/${paths[embedIdx + 1]}`;
    }
    return null;
  } catch {
    return null;
  }
}

function youtubeThumbnail(url?: string): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
      const parts = parsed.pathname.split("/");
      const embedIdx = parts.indexOf("embed");
      if (embedIdx >= 0 && parts[embedIdx + 1]) return `https://img.youtube.com/vi/${parts[embedIdx + 1]}/hqdefault.jpg`;
    }
    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.slice(1);
      if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
    }
  } catch {
    return null;
  }
  return null;
}

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const page = await client.getSingle("videolandingpage").catch(() => null);

  const titleField = page?.data ? (page.data as any).meta_title : null;
  const descField = page?.data ? (page.data as any).meta_description : null;

  const title = typeof titleField === "string" ? titleField || "Видео" : page ? asText(titleField) || "Видео" : "Видео";
  const description =
    typeof descField === "string"
      ? descField || ""
      : page
        ? asText(descField) || "Видеоматериалы, записи служений и обучающие ролики."
        : "Видеоматериалы, записи служений и обучающие ролики.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: page?.data?.meta_image?.url ? [page.data.meta_image.url] : undefined,
    },
  };
}

export default async function VideosPage({ searchParams }: { searchParams?: Promise<{ tag?: string | string[] }> }) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const rawTagParam = resolvedSearchParams?.tag;
  const selectedTag =
    Array.isArray(rawTagParam) && rawTagParam.length > 0
      ? decodeURIComponent(rawTagParam[0]!)
      : typeof rawTagParam === "string"
        ? decodeURIComponent(rawTagParam)
        : undefined;
  const selectedTagKey = selectedTag?.toLowerCase();

  const client = createClient();
  const landing = await client.getSingle("videolandingpage").catch(() => null);
  const videos = await client.getAllByType<Content.VideoDocument>("video", {
    orderings: [
      { field: "my.video.date", direction: "desc" },
      { field: "document.first_publication_date", direction: "desc" },
    ],
    fetchLinks: ["tag.name"],
  });

  const items: VideoCardItem[] = videos.map((video) => {
    const rawTitle = (video.data as { title?: RichTextField | string | null }).title;
    const title = Array.isArray(rawTitle) ? asText(rawTitle as RichTextField) : rawTitle || "Видео";

    const rawDescription = (video.data as { description?: RichTextField | string | null }).description;
    const description = Array.isArray(rawDescription) ? asText(rawDescription as RichTextField) : rawDescription || "";

    const url = (video.data as any).youtube_url?.embed_url || (video.data as any).youtube_url?.url;
    const embedUrl = toYouTubeEmbed(url);
    const thumbnail = (video.data as any).thumbnail?.url as string | undefined;
    const dateRaw = asDate((video.data as any).date) ?? (video.first_publication_date ? new Date(video.first_publication_date) : null);
    const date = dateRaw ? dateRaw.toISOString() : null;
    const imageSrc = thumbnail || youtubeThumbnail(embedUrl || url) || undefined;
    const featured = Boolean((video.data as { featured?: boolean }).featured);
    const author = (video.data as { author?: string | null }).author?.trim() || undefined;

    const tagsGroup = (video.data as { tags?: { tag?: unknown }[] }).tags ?? [];
    const tags: MediaTag[] = tagsGroup
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
      .filter(Boolean) as MediaTag[];

    return {
      id: video.id,
      title: title || "Видео",
      description,
      href: url || embedUrl || "#",
      embedUrl: embedUrl || undefined,
      imageSrc,
      date: date ?? undefined,
      featured,
      author,
      tags,
    };
  });

  const featuredVideos = items.filter((video) => video.featured);
  const regularVideos = items.filter((video) => !video.featured);

  const tagStats = new Map<string, { tag: MediaTag; count: number }>();
  regularVideos.forEach((video) => {
    video.tags?.forEach((tag) => {
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

  const matchesTag = (item: VideoCardItem) => !activeTagKey || item.tags?.some((tag) => tag.slug.toLowerCase() === activeTagKey);
  const visibleVideos = activeTagKey ? regularVideos.filter((v) => matchesTag(v)) : regularVideos;

  return (
    <div className="bg-white dark:bg-zinc-950">
      {landing && (
        <section className="w-full">
          <SliceZone slices={landing.data.slices} components={components} />
        </section>
      )}

      {featuredVideos.length ? <FeaturedVideo videos={featuredVideos} /> : null}

      <section className="bg-zinc-50 py-12 dark:bg-black">
        <Container className="space-y-4">
          <SectionHeader title="Все видео" size="sm" as="div" className="text-center" descriptionClassName="text-center" />

          {items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-200 bg-white px-6 py-10 text-center text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
              <p className="font-semibold text-zinc-800 dark:text-zinc-100">Скоро здесь появятся видео.</p>
            </div>
          ) : null}

          {items.length > 0 && regularVideos.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-200 bg-white px-6 py-10 text-center text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
              <p className="font-semibold text-zinc-800 dark:text-zinc-100">Пока только закреплённые видео.</p>
            </div>
          ) : null}

          {regularVideos.length > 0 ? (
            <div className="space-y-4">
              <TagFilterBar
                allCount={regularVideos.length}
                anchorId="video-list"
                allHref="/media/videos"
                tags={tagFilters.map(({ tag, count }) => ({
                  slug: tag.slug,
                  name: tag.name,
                  count,
                  href: `/media/videos?tag=${encodeURIComponent(tag.slug)}`,
                  active: activeTagKey === tag.slug.toLowerCase(),
                }))}
              />

              <div id="video-list" className="scroll-mt-24">
                {visibleVideos.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-zinc-200 bg-white px-6 py-10 text-center text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
                    <p className="font-semibold text-zinc-800 dark:text-zinc-100">Нет видео для выбранного тега</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Назначьте видео тег в Prismic или выберите другой фильтр.</p>
                  </div>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
                    {visibleVideos.map((video) => (
                      <VideoCard key={video.id} video={video} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </Container>
      </section>
    </div>
  );
}
