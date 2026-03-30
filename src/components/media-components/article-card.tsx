import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
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
  { bg: "bg-violet-100 dark:bg-violet-900/30", text: "text-violet-600 dark:text-violet-400" },
  { bg: "bg-sky-100 dark:bg-sky-900/30", text: "text-sky-600 dark:text-sky-400" },
  { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-600 dark:text-emerald-400" },
  { bg: "bg-rose-100 dark:bg-rose-900/30", text: "text-rose-600 dark:text-rose-400" },
  { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-600 dark:text-amber-400" },
];

export function authorColor(name?: string) {
  if (!name) return ACCENT_COLORS[0];
  return ACCENT_COLORS[name.charCodeAt(0) % ACCENT_COLORS.length];
}

export function ArticleCard({ article, className = "" }: ArticleCardProps) {
  return (
    <Link
      href={`/media/${article.href || getArticleHref(article.id)}`}
      aria-label={`Открыть статью: ${article.title}`}
      className={cn(
        "group flex flex-col bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50",
        cardHoverCn,
        className,
      )}
    >
      <div className="p-6 flex-1">
        {/* Tags + reading time */}
        <div className="flex flex-wrap items-center gap-2 mb-4 justify-between">
          <span className="inline-flex items-center gap-1 text-sm text-zinc-400 dark:text-zinc-500">
            <Clock className="h-4 w-4 mb-0.5" />
            {readingTime(article.description)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold leading-snug text-zinc-900 group-hover:text-blue-600 transition-colors duration-200 mb-2">
          {article.title}
        </h3>

        {/* Description */}
        <p className="text-base leading-relaxed text-zinc-500 line-clamp-3 flex-1">{truncateWords(article.description)}</p>
        <div className="flex flex-wrap items-center gap-2 mt-4">
          {article.tags?.map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-100 transition-colors duration-200 dark:bg-blue-900/40 dark:text-blue-200 dark:ring-blue-800/70"
            >
              {tag.name}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          {article.author && <span className="font-medium text-zinc-600">{article.author}</span>}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-zinc-400">{formatDate(article.date)}</span>
        </div>
      </div>
    </Link>
  );
}
