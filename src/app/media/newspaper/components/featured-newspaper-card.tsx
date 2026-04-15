"use client";

import Link from "next/link";
import { Download, FileDown, Newspaper, PinIcon } from "lucide-react";

import { Container } from "@/components/ui/container";
import { useVisibleTagCount } from "@/hooks/use-visible-tag-count";
import { cn } from "@/lib/cn";
import { formatDate } from "@/lib/media-data";
import { cardHoverCn } from "@/lib/variants";

export type FeaturedNewspaperIssue = {
  id: string;
  title: string;
  description?: string;
  pdfUrl?: string;
  author?: string;
  date?: Date | null;
  tags?: { name: string }[];
  community?: {
    id: string;
    name: string;
    href: string;
  };
};

interface FeaturedNewspaperCardProps {
  issues: FeaturedNewspaperIssue[];
}

function FeaturedNewspaperItem({ issue }: { issue: FeaturedNewspaperIssue }) {
  const { measureTagsRef, visibleTagCount } = useVisibleTagCount(issue.tags);
  const visibleTags = issue.tags?.slice(0, visibleTagCount) ?? [];
  const overflowTags = issue.tags?.slice(visibleTagCount) ?? [];

  return (
    <div
      className={cn(
        "group relative block overflow-hidden rounded-3xl border border-zinc-200 bg-gradient-to-br from-blue-50 via-white to-sky-50 shadow-none !cursor-default",
        cardHoverCn,
      )}
    >
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-sky-200/40 blur-3xl" />

      <div className="relative">
        <div className="p-6 sm:p-8">
          <h2 className="py-3 text-2xl font-bold leading-snug tracking-tight text-zinc-900 group-hover:text-blue-600 sm:py-4 sm:text-3xl">
            {issue.title}
          </h2>
          {issue.author ? <p className="mb-3 text-base font-semibold text-zinc-800 sm:text-lg">{issue.author}</p> : null}

          <p className="mb-2 max-w-2xl text-base leading-relaxed text-zinc-600 sm:text-lg">{issue.description}</p>
        </div>
        {issue.tags?.length ? (
          <div className="relative mb-6 px-6 sm:mb-8 sm:px-8">
            <div
              ref={measureTagsRef}
              aria-hidden="true"
              className="pointer-events-none invisible absolute inset-0 flex flex-wrap gap-1.5 sm:gap-2"
            >
              {issue.tags.map((tag, index) => (
                <span
                  key={`${tag.name}-${index}`}
                  className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700 ring-1 ring-inset ring-blue-100 sm:px-4 sm:py-2 sm:text-base md:px-3 md:py-1.5 md:text-xs"
                >
                  {tag.name}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {visibleTags.map((tag, index) => (
                <span
                  key={`${tag.name}-visible-${index}`}
                  className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700 ring-1 ring-inset ring-blue-100 transition-colors duration-200 sm:px-4 sm:py-2 sm:text-base md:px-3 md:py-1.5 md:text-xs"
                >
                  {tag.name}
                </span>
              ))}
            </div>
            {overflowTags.length > 0 ? (
              <div className="mt-2 flex items-center -space-x-10 overflow-hidden sm:-space-x-18">
                {overflowTags.slice(0, 5).map((tag, index) => (
                  <span
                    key={`${tag.name}-overflow-${index}`}
                    className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700 ring-1 ring-inset ring-blue-100 shadow-sm transition-transform duration-200 hover:z-10 sm:px-4 sm:py-2 sm:text-base md:px-3 md:py-1.5 md:text-xs"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        ) : (
          <div className="mb-6 sm:mb-8" />
        )}
        <div className="flex flex-col border-t border-zinc-200 sm:flex-row sm:items-stretch sm:justify-between">
          <div className="w-full">
            {issue.community ? (
              <Link
                href={issue.community.href}
                className="relative flex h-full flex-col items-start gap-2 px-6 py-4 text-zinc-950 transition-colors duration-200 hover:bg-blue-100 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-6"
              >
                <span className="min-w-0 text-sm font-medium leading-snug sm:text-base">{issue.community.name}</span>
                <span className="text-sm text-zinc-400 sm:text-base">{formatDate(issue.date)}</span>
              </Link>
            ) : (
              <div className="relative flex justify-end px-6 py-4 sm:px-8 sm:py-6">
                <span className="text-right text-sm text-zinc-400 sm:text-base">{formatDate(issue.date)}</span>
              </div>
            )}
          </div>
          <a
            href={issue.pdfUrl || "#"}
            download
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap border-t border-zinc-200 bg-white px-6 py-6 text-base font-medium hover:bg-blue-50 hover:text-blue-600 sm:border-l sm:border-t-0 sm:px-16 sm:py-8"
          >
            Скачать PDF
            <Download className="h-4.5 w-4.5" strokeWidth={1.6} />
          </a>
        </div>
      </div>
    </div>
  );
}

export function FeaturedNewspaperCard({ issues }: FeaturedNewspaperCardProps) {
  if (!issues.length) return null;

  return (
    <section className="bg-white">
      <Container className="py-16 sm:py-20">
        <p className="mb-6 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-zinc-400">
          <PinIcon className="h-5 w-5" /> Закрепленные выпуски
        </p>
        <div className="flex flex-col gap-6">
          {issues.map((issue) => (
            <FeaturedNewspaperItem key={issue.id} issue={issue} />
          ))}
        </div>
      </Container>
    </section>
  );
}
