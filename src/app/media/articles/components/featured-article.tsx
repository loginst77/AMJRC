import Link from "next/link";
import { ArrowRight, Clock, PinIcon } from "lucide-react";

import { authorColor, formatDate, readingTime, type MediaItem } from "@/components/media-components/article-card";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/badge";
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

export function FeaturedArticle({ article, className, showPinnedLabel = true }: FeaturedArticleProps) {
  const color = authorColor(article.author);

  return (
    <section className={cn("bg-white", className)}>
      <div className="mx-auto w-full max-w-6xl px-6 pt-16 sm:pt-20">
        {showPinnedLabel ?
          <p className="mb-6 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-zinc-400">
            <PinIcon className="h-5 w-5" />
            Закрепленные статьи
          </p>
        : null}
        <Link
          href={`/media/${article.href || `articles/${article.id}`}`}
          aria-label={`Открыть статью: ${article.title}`}
          className={cn(
            "group relative block bg-gradient-to-br from-blue-50 via-white to-sky-50 shadow-none transition-all duration-300 hover:-translate-y-1",
            cardHoverCn,
          )}>
          <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-blue-200/40 blur-3xl dark:bg-blue-800/10" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-sky-200/40 blur-3xl dark:bg-sky-800/10" />

          <div className="relative ">
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
              <p className="mb-2 max-w-2xl text-lg leading-relaxed text-zinc-600">{truncateWords(article.description, 48)}</p>
              <div className="flex flex-wrap items-center gap-2">
                {article.tags?.map((tag) => (
                  <div className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-200 transition-colors duration-200 dark:bg-blue-900/40 dark:text-blue-200 dark:ring-blue-800/70">
                    {tag.name}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between px-8 sm:px-8 py-6 border-t border-zinc-200">
              {article.author ?
                <div className="flex items-center gap-3">
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold", color.bg, color.text)}>
                    {article.author.charAt(0)}
                  </div>
                  <div>
                    <p className="text-base font-semibold text-zinc-800">{article.author}</p>
                    <p className="text-sm text-zinc-500">Автор</p>
                  </div>
                </div>
              : <span />}
              <span className="text-base text-zinc-400">{formatDate(article.date)}</span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
