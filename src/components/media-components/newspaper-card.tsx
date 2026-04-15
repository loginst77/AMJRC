"use client";

import Link from "next/link";
import { Download, Newspaper } from "lucide-react";
import { useVisibleTagCount } from "@/hooks/use-visible-tag-count";
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
  const { measureTagsRef, visibleTagCount } = useVisibleTagCount(issue.tags);
  const visibleTags = issue.tags?.slice(0, visibleTagCount) ?? [];
  const overflowTags = issue.tags?.slice(visibleTagCount) ?? [];

  return (
    <div className={cn("group flex h-full flex-col overflow-hidden bg-white !cursor-default", cardHoverCn, className)}>
      {issue.community ? (
        <Link
          href={issue.community.href}
          className="flex items-center group justify-between gap-2 border-b border-zinc-200 bg-gradient-to-r from-blue-200/90 via-blue-200/70 to-blue-100/80 p-6 text-zinc-950 transition-colors duration-200 hover:bg-blue-100"
        >
          <span className="rounded-full text-sm font-medium leading-snug text-zinc-700 transition-colors duration-200 group-hover:text-blue-600 sm:text-base">
            {issue.community.name}
          </span>
          {issue.date && (
            <span className="text-sm text-zinc-400 sm:text-base">
              {formatDate(issue.date instanceof Date || typeof issue.date === "string" ? issue.date : String(issue.date))}
            </span>
          )}
        </Link>
      ) : (
        <div className="flex items-center justify-between gap-2 border-b border-zinc-200 bg-gradient-to-r from-blue-200/90 via-blue-200/70 to-blue-100/80 p-6">
          <span />
          {issue.date && (
            <span className="text-sm text-zinc-400 sm:text-base">
              {formatDate(issue.date instanceof Date || typeof issue.date === "string" ? issue.date : String(issue.date))}
            </span>
          )}
        </div>
      )}
      <div className="flex flex-col p-6">
        <div className="flex flex-col gap-2">
          {/* Title */}
          <h3 className="mb-2 text-lg font-semibold leading-snug text-zinc-950 transition-colors duration-200 group-hover:text-blue-600 sm:text-xl">
            {issue.title}
          </h3>
          {issue.author ? <p className="text-sm font-semibold text-zinc-800 sm:text-base">{issue.author}</p> : null}

          {/* Description */}
          <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-zinc-500 sm:text-base">{issue.description}</p>
        </div>
      </div>

      <div className="min-h-12 px-6 pb-4">
        {issue.tags?.length ? (
          <div className="relative mt-3">
            <div
              ref={measureTagsRef}
              aria-hidden="true"
              className="pointer-events-none invisible absolute inset-0 flex flex-wrap gap-1.5 sm:gap-2"
            >
              {issue.tags.map((tag: MediaTag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700 ring-1 ring-inset ring-blue-100 sm:px-4 sm:py-2 sm:text-base md:px-3 md:py-1.5 md:text-xs"
                >
                  {tag.name}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {visibleTags.map((tag: MediaTag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700 ring-1 ring-inset ring-blue-100 transition-colors duration-200 sm:px-4 sm:py-2 sm:text-base md:px-3 md:py-1.5 md:text-xs"
                >
                  {tag.name}
                </span>
              ))}
            </div>
            {overflowTags.length > 0 ? (
              <div className="mt-2 flex items-center -space-x-10 overflow-hidden sm:-space-x-18">
                {overflowTags.slice(0, 5).map((tag: MediaTag) => (
                  <span
                    key={`${tag.id}-overflow`}
                    className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700 ring-1 ring-inset ring-blue-100 shadow-sm transition-transform duration-200 hover:z-10 sm:px-4 sm:py-2 sm:text-base md:px-3 md:py-1.5 md:text-xs"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        ) : (
          <div />
        )}
      </div>

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between border-t border-zinc-200">
        <a
          href={issue.href}
          download
          className="inline-flex w-full items-center justify-center whitespace-nowrap p-6 !text-sm font-medium text-zinc-700 underline-offset-4 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring hover:bg-blue-100 disabled:pointer-events-none disabled:opacity-50 sm:!text-base"
        >
          Скачать PDF
          <Download className="ml-1.5 h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}
