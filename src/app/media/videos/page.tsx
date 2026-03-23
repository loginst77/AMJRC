import type { Metadata } from "next";
import { SliceZone } from "@prismicio/react";
import { asDate, asText, type RichTextField } from "@prismicio/client";

import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/SectionHeader";
import { FeaturedVideo } from "@/components/featured-video";
import { VideoCard, type VideoCardItem } from "@/components/video-card";
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

export default async function VideosPage() {
  const client = createClient();
  const landing = await client.getSingle("videolandingpage").catch(() => null);
  const videos = await client.getAllByType("video", {
    orderings: [
      { field: "my.video.date", direction: "desc" },
      { field: "document.first_publication_date", direction: "desc" },
    ],
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

    return {
      id: video.id,
      title: title || "Видео",
      description,
      href: url || embedUrl || "#",
      imageSrc,
      date: date ?? undefined,
      featured,
    };
  });

  const featuredVideos = items.filter((video) => video.featured);
  const regularVideos = items.filter((video) => !video.featured);

  return (
    <div className="bg-white dark:bg-zinc-950">
      {landing && (
        <section className="w-full">
          <SliceZone slices={landing.data.slices} components={components} />
        </section>
      )}

      {featuredVideos.length ? <FeaturedVideo videos={featuredVideos} /> : null}

      <section className="bg-zinc-50 py-12">
        <Container className="space-y-8">
          <SectionHeader
            title="Все видео"
            description="Новые видео появляются здесь сразу после публикации в Prismic."
            size="sm"
            as="div"
            className="text-center"
            descriptionClassName="text-center"
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {regularVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
