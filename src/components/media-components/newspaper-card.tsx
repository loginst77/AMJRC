import { Download, Newspaper } from "lucide-react";
import { type MediaItem } from "@/lib/media-data";
import { cn } from "@/lib/cn";
import { cardHoverCn } from "@/lib/variants";

interface NewspaperCardProps {
  issue: MediaItem & { tags?: string[] };
  className?: string;
}

export function NewspaperCard({ issue, className = "" }: NewspaperCardProps) {
  return (
    <div className={cn("group flex h-full flex-col overflow-hidden bg-white !cursor-default", cardHoverCn, className)}>
      {/* Date */}
      <div className="flex items-center justify-between gap-2 border-b border-zinc-200 bg-gradient-to-r from-blue-200/90 via-blue-200/70 to-blue-100/80 p-6 dark:border-zinc-800">
        {issue.author && (
          <div className="flex items-center gap-2 rounded-full text-sm font-semibold text-zinc-700">
            <Newspaper className="h-6 w-6" strokeWidth={1.5} />
            {issue.author}
          </div>
        )}

        <span className="text-sm text-zinc-600">{typeof issue.date === "number" ? issue.date : ""}</span>
      </div>
      <div className="flex flex-col p-6">
        <div className="flex flex-col gap-2">
          {/* Title */}
          <h3 className="mb-2 text-xl font-bold leading-snug text-zinc-900 transition-colors duration-200 group-hover:text-blue-500 dark:text-white">
            {issue.title}
          </h3>

          {/* Description */}
          <p className="line-clamp-5 flex-1 text-base leading-relaxed text-zinc-500 dark:text-zinc-400">{issue.description}</p>
        </div>
      </div>

      <div className="min-h-12 px-6 py-4 dark:border-zinc-800">
        {issue.tags?.length ? (
          <div className="flex flex-wrap gap-2">
            {issue.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-100 dark:bg-blue-900/40 dark:text-blue-200 dark:ring-blue-800/70"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : (
          <div />
        )}
      </div>

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800">
        <a
          href={issue.href}
          download
          className="inline-flex w-full items-center justify-center whitespace-nowrap p-6 !text-base font-medium text-zinc-700 underline-offset-4 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring hover:bg-blue-100 disabled:pointer-events-none disabled:opacity-50"
        >
          Скачать PDF
          <Download className="ml-1.5 h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}
