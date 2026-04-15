import Link from "next/link";
import { Download, Newspaper } from "lucide-react";
import { type MediaItem, type MediaTag, formatDate } from "@/lib/media-data";
import { cn } from "@/lib/cn";
import { cardHoverCn } from "@/lib/variants";

interface NewspaperCardProps {
  issue: MediaItem & {
    community?: {
      id: string;
      name: string;
      href: string;
    };
  };
  className?: string;
}

export function NewspaperCard({ issue, className = "" }: NewspaperCardProps) {
  return (
    <div className={cn("group flex h-full flex-col overflow-hidden bg-white !cursor-default", cardHoverCn, className)}>
      <div className="flex items-center justify-between gap-2 border-b border-zinc-200 bg-gradient-to-r from-blue-200/90 via-blue-200/70 to-blue-100/80 p-6">
        {issue.community ? (
          <Link href={issue.community.href} className="rounded-full text-base font-medium text-zinc-700 transition-colors duration-200 hover:text-blue-600">
            {issue.community.name}
          </Link>
        ) : (
          <span />
        )}

        {issue.date && (
          <span className="text-base text-zinc-400">
            {formatDate(issue.date instanceof Date || typeof issue.date === "string" ? issue.date : String(issue.date))}
          </span>
        )}
      </div>
      <div className="flex flex-col p-6">
        <div className="flex flex-col gap-2">
          {/* Title */}
          <h3 className="mb-2 text-xl font-semibold leading-snug text-zinc-950 transition-colors duration-200 group-hover:text-blue-600">
            {issue.title}
          </h3>
          {issue.author ? <p className="text-base font-medium text-zinc-700">{issue.author}</p> : null}

          {/* Description */}
          <p className="mt-2 line-clamp-2 flex-1 text-base leading-relaxed text-zinc-500">{issue.description}</p>
        </div>
      </div>

      <div className="min-h-12 px-6 pb-4">
        {issue.tags?.length ?
          <div className="flex flex-wrap gap-2">
            {issue.tags.map((tag: MediaTag) => (
              <span
                key={tag.id}
                className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-100 transition-colors duration-200">
                {tag.name}
              </span>
            ))}
          </div>
        : <div />}
      </div>

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between border-t border-zinc-200">
        <a
          href={issue.href}
          download
          className="inline-flex w-full items-center justify-center whitespace-nowrap p-6 !text-base font-medium text-zinc-700 underline-offset-4 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring hover:bg-blue-100 disabled:pointer-events-none disabled:opacity-50">
          Скачать PDF
          <Download className="ml-1.5 h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}
