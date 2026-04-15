import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { asDate, asLink, asText } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";

import { LandingPageHero } from "@/components/LandingPageHero";
import { PrismicRichText } from "@/components/PrismicRichText";
import { type MediaItem as ArticleMediaItem } from "@/components/media-components/article-card";
import { CommunityMediaSection, type CommunityNewspaperItem } from "@/components/media-components/community-media-section";
import { type PodcastEpisode } from "@/components/media-components/podcast-episode-list";
import { type VideoCardItem } from "@/components/media-components/video-card";
import { Container } from "@/components/ui/container";
import { type MediaItem as BaseMediaItem, type MediaTag } from "@/lib/media-data";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import { SectionHeader } from "@/components/SectionHeader";

type Params = { uid: string };

function getTextValue(field: unknown) {
  if (typeof field === "string") return field.trim();
  if (Array.isArray(field)) return (asText(field as Parameters<typeof asText>[0]) ?? "").trim();
  return "";
}

function toValidDate(value?: string | Date | null) {
  if (!value) return null;

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function isLinkedToCommunity(relationship: unknown, communityId: string, communityUid: string) {
  if (!relationship || typeof relationship !== "object") return false;

  const relation = relationship as Record<string, unknown>;
  if (relation.link_type !== "Document") return false;

  return (typeof relation.id === "string" && relation.id === communityId) || (typeof relation.uid === "string" && relation.uid === communityUid);
}

function youtubeThumbnail(url?: string | null) {
  if (!url) return null;

  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

      const parts = parsed.pathname.split("/");
      const embedIndex = parts.indexOf("embed");
      if (embedIndex >= 0 && parts[embedIndex + 1]) return `https://img.youtube.com/vi/${parts[embedIndex + 1]}/hqdefault.jpg`;

      const shortsIndex = parts.indexOf("shorts");
      if (shortsIndex >= 0 && parts[shortsIndex + 1]) return `https://img.youtube.com/vi/${parts[shortsIndex + 1]}/hqdefault.jpg`;
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

function toYouTubeEmbed(url?: string | null) {
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

      const parts = parsed.pathname.split("/");
      const embedIndex = parts.indexOf("embed");
      if (embedIndex >= 0 && parts[embedIndex + 1]) return `https://www.youtube.com/embed/${parts[embedIndex + 1]}`;
    }
  } catch {
    return null;
  }

  return null;
}

function extractTags(group: { tag?: unknown }[] | undefined): MediaTag[] {
  return (group ?? [])
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
}

export async function generateStaticParams() {
  const client = createClient();
  const communities = await client.getAllByType("community" as any).catch(() => []);
  return communities.map((doc: any) => ({ uid: doc.uid! }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { uid } = await params;
  const client = createClient();
  const community = await client.getByUID("community" as any, uid).catch(() => null);
  if (!community) return { title: "Община не найдена" };
  const doc = community as any;

  const title = asText(doc.data?.title) || "Община";
  const description = doc.data?.description || doc.data?.meta_description || "";
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: doc.data?.meta_image?.url ? [doc.data.meta_image.url] : undefined,
    },
  };
}

export default async function CommunityPage({ params }: { params: Promise<Params> }) {
  const { uid } = await params;
  const client = createClient();
  const community = await client.getByUID("community" as any, uid).catch(() => null);
  if (!community) notFound();

  const doc = community as any;
  const title = asText(doc.data?.title) || "Община";
  const communityId = typeof doc.id === "string" ? doc.id : "";
  const communityUid = typeof doc.uid === "string" ? doc.uid : uid;

  const [articleDocs, bookDocs, podcastDocs, videoDocs, newspaperDocs] = await Promise.all([
    client
      .getAllByType("article" as any, {
        orderings: [
          { field: "my.article.date", direction: "desc" },
          { field: "document.first_publication_date", direction: "desc" },
        ],
        fetchLinks: ["tag.name"],
      })
      .catch(() => []),
    client
      .getAllByType("book" as any, {
        orderings: [
          { field: "my.book.date_of_release", direction: "desc" },
          { field: "document.first_publication_date", direction: "desc" },
        ],
        fetchLinks: ["tag.name"],
      })
      .catch(() => []),
    client
      .getAllByType("podcast" as any, {
        orderings: [
          { field: "my.podcast.date", direction: "desc" },
          { field: "document.first_publication_date", direction: "desc" },
        ],
        fetchLinks: ["tag.name"],
      })
      .catch(() => []),
    client
      .getAllByType("video" as any, {
        orderings: [
          { field: "my.video.date", direction: "desc" },
          { field: "document.first_publication_date", direction: "desc" },
        ],
        fetchLinks: ["tag.name"],
      })
      .catch(() => []),
    client
      .getAllByType("newspaper" as any, {
        orderings: [{ field: "document.first_publication_date", direction: "desc" }],
        fetchLinks: ["tag.name"],
      })
      .catch(() => []),
  ]);

  const articleItems: ArticleMediaItem[] = articleDocs
    .filter((article: any) => isLinkedToCommunity(article.data?.community, communityId, communityUid))
    .map((article: any) => {
      const contentText = getTextValue(article.data?.content);
      const description = [getTextValue(article.data?.description), getTextValue(article.data?.meta_description), contentText]
        .map((value) => value.trim())
        .filter((value) => value && value.toLowerCase() !== "short description")[0];
      const date = asDate(article.data?.date) ?? toValidDate(article.first_publication_date);
      const tags = extractTags(article.data?.tags);

      return {
        id: article.id,
        title: getTextValue(article.data?.title) || getTextValue(article.data?.meta_title) || "Без названия",
        description: description || "",
        href: article.uid ? `articles/${article.uid}` : undefined,
        author: getTextValue(article.data?.author) || undefined,
        date: date?.toISOString(),
        tags,
        community: {
          id: communityId,
          name: title,
          href: `/communities/${communityUid}`,
        },
      };
    });

  const bookItems: BaseMediaItem[] = bookDocs
    .filter((book: any) => isLinkedToCommunity(book.data?.community, communityId, communityUid))
    .map((book: any) => {
      const releaseYear = typeof book.data?.date_of_release === "number" ? book.data.date_of_release : null;
      const buyLink = typeof book.data?.buy_link?.url === "string" ? book.data.buy_link.url : undefined;
      const tags = extractTags(book.data?.tags);

      return {
        id: book.id,
        title: getTextValue(book.data?.title) || "Без названия",
        description: getTextValue(book.data?.description) || undefined,
        href: buyLink || (typeof book.url === "string" ? book.url : undefined),
        imageSrc: book.data?.image?.url ?? undefined,
        author: getTextValue(book.data?.author) || undefined,
        date: releaseYear,
        tags,
      };
    });

  const podcastItems: PodcastEpisode[] = podcastDocs
    .filter((podcast: any) => isLinkedToCommunity(podcast.data?.community, communityId, communityUid))
    .map((podcast: any) => {
      const date = asDate(podcast.data?.date) ?? toValidDate(podcast.first_publication_date);
      const externalLink = typeof podcast.data?.external_link?.url === "string" ? podcast.data.external_link.url : undefined;
      const tags = extractTags(podcast.data?.tags);

      return {
        id: podcast.id,
        title: getTextValue(podcast.data?.title) || getTextValue(podcast.data?.meta_title) || "Без названия",
        description: getTextValue(podcast.data?.description) || getTextValue(podcast.data?.meta_description) || undefined,
        href: externalLink || (typeof podcast.url === "string" ? podcast.url : undefined),
        author: getTextValue(podcast.data?.author) || undefined,
        date: date?.toISOString() || "",
        tags,
      };
    });

  const videoItems: VideoCardItem[] = videoDocs
    .filter((video: any) => isLinkedToCommunity(video.data?.community, communityId, communityUid))
    .map((video: any) => {
      const date = asDate(video.data?.date) ?? toValidDate(video.first_publication_date);
      const videoUrl =
        typeof video.data?.youtube_url?.url === "string"
          ? video.data.youtube_url.url
          : typeof video.data?.youtube_url?.embed_url === "string"
            ? video.data.youtube_url.embed_url
            : typeof video.url === "string"
              ? video.url
              : undefined;
      const embedUrl = toYouTubeEmbed(videoUrl);
      const tags = extractTags(video.data?.tags);

      return {
        id: video.id,
        title: getTextValue(video.data?.title) || "Видео",
        description: getTextValue(video.data?.description) || getTextValue(video.data?.meta_description) || undefined,
        href: videoUrl || undefined,
        embedUrl: embedUrl || undefined,
        imageSrc: video.data?.thumbnail?.url ?? youtubeThumbnail(videoUrl),
        author: getTextValue(video.data?.author) || undefined,
        date: date?.toISOString() || undefined,
        tags,
      };
    });

  const newspaperItems: CommunityNewspaperItem[] = newspaperDocs
    .filter((issue: any) => isLinkedToCommunity(issue.data?.community, communityId, communityUid))
    .map((issue: any) => {
      const date = toValidDate(issue.first_publication_date);
      const tags = extractTags(issue.data?.tags);

      return {
        id: issue.id,
        title: getTextValue(issue.data?.title) || "Выпуск газеты",
        description: getTextValue(issue.data?.description) || undefined,
        href: typeof issue.data?.pdf?.url === "string" ? issue.data.pdf.url : undefined,
        author: getTextValue(issue.data?.author) || undefined,
        date: date?.toISOString() || undefined,
        tags,
      };
    });

  return (
    <div className="flex flex-col min-h-screenbg-white">
      <LandingPageHero
        title={doc.data?.title}
        description={doc.data?.description}
        backgroundImage={doc.data?.image}
        button1Link={asLink(doc.data?.button_1_link)}
        button1Label={doc.data?.button_1_link?.text}
        button1Variant={doc.data?.button_1_link?.variant}
        button2Link={asLink(doc.data?.button_2_link)}
        button2Label={doc.data?.button_2_link?.text}
        button2Variant={doc.data?.button_2_link?.variant}
        breadcrumbHomeLabel="Главная"
        breadcrumbHomeLink="/"
        breadcrumbMiddleLabel="Общины"
        breadcrumbMiddleLink="/communities"
        breadcrumbCurrent={title}
        community={{
          leader: doc.data?.location,
          serviceTime: doc.data?.service_time,
          address: doc.data?.address,
        }}
      />

      <section className="bg-white !bg-red-200">
        <Container>
          <div className="mx-auto max-w-3xl space-y-8">
            <article className="prose prose-zinc prose-lg max-w-none prose-headings:mt-8 prose-headings:mb-4 prose-p:my-4 prose-p:leading-8 prose-strong:font-semibold">
              <PrismicRichText field={doc.data?.content} />
            </article>
          </div>
        </Container>
      </section>

      <SliceZone slices={doc.data.slices} components={components} />

      <SectionHeader
        title="Медиа этой общины"
        description="Материалы, связанные с этой общиной, сгруппированные по типу."
        as="div"
        className="mx-auto w-full py-10 border-y lg:px-40 px-6"
      />
      <CommunityMediaSection articles={articleItems} books={bookItems} podcasts={podcastItems} videos={videoItems} newspapers={newspaperItems} />
    </div>
  );
}
