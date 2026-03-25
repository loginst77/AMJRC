import type { Metadata } from "next";
import Link from "next/link";
import { asDate, asText, type Content } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";

import { FeaturedEpisode } from "./featured-episode";
import { PodcastEpisodeList, type PodcastEpisode } from "@/components/podcast-episode-list";
import { Container } from "@/components/ui/container";
import { createClient } from "@/prismicio";
import { components } from "@/slices";

export const metadata: Metadata = {
  title: "Подкасты",
  description: "Аудиобеседы, интервью и размышления о вере.",
};

export default async function PodcastsPage() {
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
      (episode.data as { external_link?: { url?: string; link_type?: string } }).external_link?.url ||
      (episode.data as any).external_link?.link_type === "Web"
        ? (episode.data as any).external_link?.url
        : undefined;
    const date = asDate((episode.data as { date?: any }).date ?? episode.first_publication_date) || null;
    const author = (episode.data as { author?: string }).author || undefined;
    const featured = Boolean((episode.data as { featured?: boolean }).featured);

    return {
      id: `${episode.id}`,
      title,
      description,
      author,
      date: date ? date.toISOString() : "",
      href: href || undefined,
      alliance: undefined,
      featured,
    };
  });

  const featured = episodes.find((ep) => ep.featured) ?? episodes[0];
  const rest = episodes.filter((ep) => ep !== featured);

  const landingTitle =
    landing && (asText((landing.data as { title?: any }).title) || (landing.data as any).meta_title)
      ? asText((landing.data as { title?: any }).title) || (landing.data as any).meta_title
      : "Подкасты";
  const landingDescription =
    (landing?.data as { description?: string })?.description ||
    (landing?.data as any)?.meta_description ||
    "Аудиобеседы, интервью и размышления о вере и духовной жизни.";

  return (
    <div className="flex flex-col">
      {landing ? (
        <section className="w-full">
          <SliceZone slices={landing.data.slices} components={components} />
        </section>
      ) : (
        <section className="relative min-h-[360px] overflow-hidden py-14 sm:py-24">
          <img src="/church1.jpg" alt="Подкасты" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
          <Container className="relative z-10">
            <div className="max-w-2xl space-y-4">
              <nav className="text-sm text-zinc-300">
                <Link href="/" className="transition-colors hover:text-white">
                  Главная
                </Link>
                <span className="mx-2">/</span>
                <Link href="/media" className="transition-colors hover:text-white">
                  Медия
                </Link>
                <span className="mx-2">/</span>
                <span className="text-white">Подкасты</span>
              </nav>
              <div className="border-l-4 border-white pl-4">
                <h1 className="text-5xl font-semibold tracking-tight text-white">{landingTitle}</h1>
              </div>
              <p className="text-lg leading-8 text-zinc-200">{landingDescription}</p>
            </div>
          </Container>
        </section>
      )}

      {featured ? <FeaturedEpisode episode={featured} /> : null}

      <section className="bg-zinc-50 dark:bg-black">
        <Container className="py-14 sm:py-20">
          <h2 className="mb-8 text-sm font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Все выпуски</h2>
          <PodcastEpisodeList episodes={rest} />
        </Container>
      </section>
    </div>
  );
}
