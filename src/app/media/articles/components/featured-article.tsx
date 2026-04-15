import Link from "next/link";
import { Clock, PinIcon } from "lucide-react";

import { formatDate, readingTime, type MediaItem } from "@/components/media-components/article-card";
import { cn } from "@/lib/cn";
import { truncateWords } from "@/lib/text";
import { cardHoverCn } from "@/lib/variants";

type FeaturedArticleProps = {
  article: MediaItem;
  className?: string;
  /** Only the first stacked featured item should show the pinned label. Default true. */
  showPinnedLabel?: boolean;
  /** How many featured articles are shown; drives singular vs plural pinned heading. Default 1. */
  featuredCount?: number;
};

export function FeaturedArticle({ article, className, showPinnedLabel = true, featuredCount = 1 }: FeaturedArticleProps) {
  const useCompactStackSpacing = featuredCount > 2 && !showPinnedLabel;

  return (
    <section className={cn("bg-white", className)}>
      <div className={cn("mx-auto w-full max-w-6xl px-6", useCompactStackSpacing ? "pt-3 sm:pt-4" : "pt-16 sm:pt-20")}>
        {showPinnedLabel ? (
          <p className="mb-6 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-zinc-400">
            <PinIcon className="h-5 w-5" />
            Закрепленные статьи
          </p>
        ) : null}
        <div
          className={cn(
            "group relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-sky-50 shadow-none transition-all duration-300 hover:-translate-y-1",
            cardHoverCn,
          )}
        >
          <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-blue-200/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-sky-200/40 blur-3xl" />

          <Link
            href={`/media/${article.href || `articles/${article.id}`}`}
            aria-label={`Открыть статью: ${article.title}`}
            className="relative block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            <div className="p-8 sm:p-10">
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center justify-center gap-2 text-sm text-zinc-500">
                  <Clock className="h-4 w-4 mb-0.5" />
                  {readingTime(article.description)}
                </span>
              </div>

              <h2 className="mb-4 text-3xl font-bold leading-snug tracking-tight text-zinc-900 group-hover:text-blue-600 sm:text-3xl">
                {article.title}
              </h2>
              {article.author ? <p className="mb-3 text-base font-semibold text-zinc-800 sm:text-lg">{article.author}</p> : null}
              <p className="mb-2 max-w-2xl text-lg leading-relaxed text-zinc-600">{truncateWords(article.description, 48)}</p>
              <div className="flex flex-wrap items-center gap-2">
                {article.tags?.map((tag) => (
                  <div
                    key={tag.id}
                    className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-100 transition-colors duration-200 sm:px-4 sm:py-2 sm:text-base md:px-3 md:py-1.5 md:text-xs"
                  >
                    {tag.name}
                  </div>
                ))}
              </div>
            </div>
          </Link>

          {article.community ? (
            <Link
              href={article.community.href}
              className="relative mt-auto flex flex-col items-start gap-2 border-t border-zinc-200 px-8 py-6 text-zinc-950 transition-colors duration-200 hover:bg-blue-100 sm:flex-row sm:items-center sm:justify-between sm:px-10"
            >
              <span className="min-w-0 text-sm font-medium leading-snug sm:text-base">{article.community.name}</span>
              {article.date ? <span className="text-sm text-zinc-400 sm:text-base">{formatDate(article.date)}</span> : null}
            </Link>
          ) : (
            <div className="relative flex justify-end border-t border-zinc-200 px-8 py-6 sm:px-10">
              {article.date ? <span className="text-right text-sm text-zinc-400 sm:text-base">{formatDate(article.date)}</span> : null}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
