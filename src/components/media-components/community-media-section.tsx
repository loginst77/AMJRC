"use client";

import { useState } from "react";

import { ArticleCard, type MediaItem as ArticleMediaItem } from "@/components/media-components/article-card";
import { BookCard } from "@/components/media-components/book-card";
import { NewspaperCard } from "@/components/media-components/newspaper-card";
import { PodcastEpisodeList, type PodcastEpisode } from "@/components/media-components/podcast-episode-list";
import { VideoCard, type VideoCardItem } from "@/components/media-components/video-card";
import { SectionHeader } from "@/components/SectionHeader";
import { Button, ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { type MediaItem as BaseMediaItem } from "@/lib/media-data";

export type CommunityNewspaperItem = BaseMediaItem & {
  community?: {
    id: string;
    name: string;
    href: string;
  };
};

type CommunityMediaSectionProps = {
  articles: ArticleMediaItem[];
  books: BaseMediaItem[];
  podcasts: PodcastEpisode[];
  videos: VideoCardItem[];
  newspapers: CommunityNewspaperItem[];
};

function ViewAllButton({ expanded, onClick, className }: { expanded: boolean; onClick: () => void; className?: string }) {
  return (
    <Button type="button" size="md" variant="secondary" onClick={onClick} className={className}>
      {expanded ? "Свернуть" : "Показать все"}
    </Button>
  );
}

function SectionButtons({
  href,
  allLabel,
  expanded,
  onToggle,
  showToggle,
}: {
  href: string;
  allLabel: string;
  expanded: boolean;
  onToggle: () => void;
  showToggle: boolean;
}) {
  return (
    <>
      <div className="hidden sm:flex sm:flex-wrap sm:items-center sm:justify-end sm:gap-3">
        {showToggle ? <ViewAllButton expanded={expanded} onClick={onToggle} /> : null}
        <ButtonLink href={href} size="md">
          {allLabel} →
        </ButtonLink>
      </div>

      <div className="flex flex-col gap-3 sm:hidden">
        {showToggle ? <ViewAllButton expanded={expanded} onClick={onToggle} className="w-full" /> : null}
        <ButtonLink href={href} size="md" className="w-full">
          {allLabel} →
        </ButtonLink>
      </div>
    </>
  );
}

export function CommunityMediaSection({ articles, books, podcasts, videos, newspapers }: CommunityMediaSectionProps) {
  const hasMedia = articles.length || books.length || podcasts.length || videos.length || newspapers.length;

  const [articlesExpanded, setArticlesExpanded] = useState(false);
  const [booksExpanded, setBooksExpanded] = useState(false);
  const [podcastsExpanded, setPodcastsExpanded] = useState(false);
  const [videosExpanded, setVideosExpanded] = useState(false);
  const [newspapersExpanded, setNewspapersExpanded] = useState(false);

  if (!hasMedia) return null;

  const visibleArticles = articlesExpanded ? articles : articles.slice(0, 3);
  const visibleBooks = booksExpanded ? books : books.slice(0, 3);
  const visiblePodcasts = podcastsExpanded ? podcasts : podcasts.slice(0, 3);
  const visibleVideos = videosExpanded ? videos : videos.slice(0, 2);
  const visibleNewspapers = newspapersExpanded ? newspapers : newspapers.slice(0, 3);

  return (
    <section className="bg-zinc-50 py-12 sm:py-16">
      <Container className="space-y-10">
        {articles.length ? (
          <section className="space-y-6">
            <SectionHeader title="Статьи" description="Статьи и заметки, связанные с этой общиной." size="sm" as="div" />

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visibleArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            <SectionButtons
              href="/media/articles"
              allLabel="Все статьи"
              expanded={articlesExpanded}
              onToggle={() => setArticlesExpanded((value) => !value)}
              showToggle={articles.length > 3}
            />
          </section>
        ) : null}

        {videos.length ? (
          <section className="space-y-6">
            <SectionHeader title="Видео" description="Видео и записи, прикреплённые к этой общине." size="sm" as="div" />

            <div className="grid gap-6 sm:grid-cols-2">
              {visibleVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>

            <SectionButtons
              href="/media/videos"
              allLabel="Все видео"
              expanded={videosExpanded}
              onToggle={() => setVideosExpanded((value) => !value)}
              showToggle={videos.length > 2}
            />
          </section>
        ) : null}

        {podcasts.length ? (
          <section className="space-y-6">
            <SectionHeader title="Подкасты" description="Аудиовыпуски, связанные с этой общиной." size="sm" as="div" />

            <PodcastEpisodeList episodes={visiblePodcasts} />

            <SectionButtons
              href="/media/podcasts"
              allLabel="Все подкасты"
              expanded={podcastsExpanded}
              onToggle={() => setPodcastsExpanded((value) => !value)}
              showToggle={podcasts.length > 3}
            />
          </section>
        ) : null}

        {newspapers.length ? (
          <section className="space-y-6">
            <SectionHeader title="Газета" description="Выпуски газеты, связанные с этой общиной." size="sm" as="div" />

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visibleNewspapers.map((issue) => (
                <NewspaperCard key={issue.id} issue={issue} />
              ))}
            </div>

            <SectionButtons
              href="/media/newspaper"
              allLabel="Все выпуски"
              expanded={newspapersExpanded}
              onToggle={() => setNewspapersExpanded((value) => !value)}
              showToggle={newspapers.length > 3}
            />
          </section>
        ) : null}

        {books.length ? (
          <section className="space-y-6">
            <SectionHeader title="Книги" description="Книги, рекомендованные или связанные с этой общиной." size="sm" as="div" />

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visibleBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>

            <SectionButtons
              href="/media/books"
              allLabel="Все книги"
              expanded={booksExpanded}
              onToggle={() => setBooksExpanded((value) => !value)}
              showToggle={books.length > 3}
            />
          </section>
        ) : null}
      </Container>
    </section>
  );
}
