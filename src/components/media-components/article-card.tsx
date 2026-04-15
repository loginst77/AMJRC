import Link from "next/link";
import { Clock } from "lucide-react";
import { cn } from "@/lib/cn";
import { cardHoverCn } from "@/lib/variants";
import { truncateWords } from "@/lib/text";

export type ArticleTag = {
  id: string;
  slug: string;
  name: string;
};

export type MediaItem = {
  id: string;
  title: string;
  description: string;
  author?: string;
  date?: string | Date | null;
  href?: string;
  featured?: boolean;
  tags?: ArticleTag[];
  community?: {
    id: string;
    name: string;
    href: string;
  };
};

type ArticleCardProps = {
  article: MediaItem;
  className?: string;
};

export function formatDate(value?: string | Date | null) {
  if (!value) return "";
  const d = typeof value === "string" ? new Date(value) : value;
  return d.toLocaleDateString("ru-RU");
}

export function getArticleHref(id: string) {
  return `articles/${id}`;
}

/** Rough reading-time estimate (~180 words/min, based on description length). */
export function readingTime(text: string): string {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const mins = Math.max(1, Math.ceil(words / 180));
  return `${mins} мин`;
}

/** Deterministic accent colour per author initial */
export const ACCENT_COLORS = [
  { bg: "bg-violet-100", text: "text-violet-600" },
  { bg: "bg-sky-100", text: "text-sky-600" },
  { bg: "bg-emerald-100", text: "text-emerald-600" },
  { bg: "bg-rose-100", text: "text-rose-600" },
  { bg: "bg-amber-100", text: "text-amber-600" },
];

export function authorColor(name?: string) {
  if (!name) return ACCENT_COLORS[0];
  return ACCENT_COLORS[name.charCodeAt(0) % ACCENT_COLORS.length];
}

export function ArticleCard({ article, className = "" }: ArticleCardProps) {
  return (
    <div
      className={cn(
        "group flex h-full flex-col overflow-hidden bg-white",
        cardHoverCn,
        className,
      )}>
      <Link
        href={`/media/${article.href || getArticleHref(article.id)}`}
        aria-label={`Открыть статью: ${article.title}`}
        className="block flex-1 p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50"
      >
        {/* Tags + reading time */}
        <div className="flex flex-wrap items-center gap-2 mb-4 justify-between">
          <span className="inline-flex items-center gap-1 text-sm text-zinc-400">
            <Clock className="h-4 w-4 mb-0.5" />
            {readingTime(article.description)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold leading-snug text-zinc-900 group-hover:text-blue-600 transition-colors duration-200 mb-2">
          {article.title}
        </h3>
        {article.author ? <p className="mb-3 text-sm font-semibold text-zinc-800 sm:text-base">{article.author}</p> : null}

        {/* Description */}
        <p className="text-base leading-relaxed text-zinc-500 line-clamp-3 flex-1">{truncateWords(article.description)}</p>
        <div className="flex flex-wrap items-center gap-2 mt-4">
          {article.tags?.map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-100 transition-colors duration-200">
              {tag.name}
            </span>
          ))}
        </div>
      </Link>

      {/* Footer */}
      {article.community ? (
        <Link
          href={article.community.href}
          className="mt-auto flex flex-col items-start gap-2 border-t border-zinc-200 p-6 text-zinc-950 transition-colors duration-200 hover:bg-blue-100 sm:flex-row sm:items-center sm:justify-between"
        >
          <span className="min-w-0 text-sm font-medium leading-snug sm:text-base">{article.community.name}</span>
          {article.date ? <span className="text-sm text-zinc-400 sm:text-base">{formatDate(article.date)}</span> : null}
        </Link>
      ) : (
        <div className="mt-auto flex justify-end border-t border-zinc-200 p-6">
          {article.date ? <span className="text-right text-sm text-zinc-400 sm:text-base">{formatDate(article.date)}</span> : null}
        </div>
      )}
    </div>
  );
}
