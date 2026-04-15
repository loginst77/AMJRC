import { FC } from "react";
import { Content, asDate, asText, type RichTextField } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { createClient } from "@/prismicio";
import { VideoCarousel as VideoCarouselClient } from "@/components/video-carousel";
import { type VideoCardItem } from "@/components/media-components/video-card";
import { type MediaTag } from "@/lib/media-data";

/**
 * Props for `VideoCarousel`.
 */
export type VideoCarouselProps = SliceComponentProps<Content.VideoCarouselSlice>;

function toYouTubeEmbed(url?: string | null): string | null {
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

function youtubeThumbnail(url?: string | null): string | null {
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

/**
 * Component for "VideoCarousel" Slices.
 */
const VideoCarousel: FC<VideoCarouselProps> = async ({ slice }) => {
  const client = createClient();
  const response = await client
    .getByType<Content.VideoDocument>("video", {
      orderings: [
        { field: "my.video.date", direction: "desc" },
        { field: "document.first_publication_date", direction: "desc" },
      ],
      fetchLinks: ["tag.name"],
      pageSize: 6,
    })
    .catch(() => null);

  const videos = response?.results ?? [];

  const items: VideoCardItem[] = videos.map((video) => {
    const rawTitle = (video.data as { title?: RichTextField | string | null }).title;
    const title = Array.isArray(rawTitle) ? asText(rawTitle as RichTextField) : rawTitle || "Видео";

    const rawDescription = (video.data as { description?: RichTextField | string | null }).description;
    const description = Array.isArray(rawDescription) ? asText(rawDescription as RichTextField) : rawDescription || "";

    const url = (video.data as any).youtube_url?.embed_url || (video.data as any).youtube_url?.url;
    const embedUrl = toYouTubeEmbed(url);
    const thumbnail = (video.data as any).thumbnail?.url as string | undefined;
    const dateRaw = asDate((video.data as any).date) ?? (video.first_publication_date ? new Date(video.first_publication_date) : null);
    const date = dateRaw ? dateRaw.toISOString() : undefined;
    const imageSrc = thumbnail || youtubeThumbnail(embedUrl || url) || undefined;

    const rawAuthor = (video.data as any).author;
    let author: string | undefined = undefined;
    if (rawAuthor) {
      if (typeof rawAuthor === "string") {
        author = rawAuthor.trim() || undefined;
      } else if (typeof rawAuthor === "object" && rawAuthor.link_type === "Document") {
        author = (rawAuthor.data as any)?.name || rawAuthor.uid || rawAuthor.id || undefined;
      }
    }

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
      date,
      author,
      tags,
    };
  });

  if (!items.length) return null;

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={slice.primary.background ? "bg-white" : "bg-zinc-50"}>
      <Container className="py-14 sm:py-20">
        {/* Section header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-950">{slice.primary.title || "Видео"} </h2>
            {slice.primary.description && <p className="max-w-xl text-zinc-600">{slice.primary.description}</p>}
          </div>
          <ButtonLink href="/media/videos" variant="primary" size="md" className="hidden sm:inline-flex">
            Все видео →
          </ButtonLink>
        </div>

        <div className="mt-8">
          <VideoCarouselClient videos={items} allHref="/media/videos" allLabel="Все видео →" />
        </div>
      </Container>
    </section>
  );
};

export default VideoCarousel;
