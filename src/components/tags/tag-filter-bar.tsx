"use client";

import { useState } from "react";
import Link from "next/link";
import { FilterIcon, X } from "lucide-react";

import { ArticleTagChip, ArticleTagChipGroup } from "@/components/tags/article-tag-chip";

type TagOption = {
  slug: string;
  name: string;
  count: number;
  href: string;
  active: boolean;
};

interface TagFilterBarProps {
  allCount: number;
  tags: TagOption[];
  anchorId?: string;
  allHref?: string;
}

export function TagFilterBar({ allCount, tags, anchorId = "podcast-list", allHref = "/media/podcasts" }: TagFilterBarProps) {
  const [open, setOpen] = useState(false);
  const activeTag = tags.find((tag) => tag.active);
  const hash = anchorId ? `#${anchorId}` : "";
  const latestDesktopTags = tags.slice(-4);
  const desktopTags = (() => {
    if (!activeTag) return latestDesktopTags;

    const isActiveInLatest = latestDesktopTags.some((tag) => tag.slug === activeTag.slug);
    if (isActiveInLatest) return latestDesktopTags;

    // Keep 4 visible desktop tags: inject selected one right after "All".
    return [activeTag, ...latestDesktopTags.slice(0, 3)];
  })();

  return (
    <>
      <ArticleTagChipGroup>
        <div className="flex w-full flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
            <p className="font-semibold text-zinc-700">Категории:</p>

            {/* Mobile / tablet: only active or all + filter button */}
            <div className="inline-flex w-full items-center gap-1 rounded-full bg-zinc-100 p-1 text-zinc-500 lg:hidden">
              {activeTag ? (
                <div className="max-w-[220px] sm:max-w-[320px]">
                  <ArticleTagChip
                    href={`${activeTag.href}${hash}`}
                    label={`${activeTag.name} (${activeTag.count})`}
                    active
                    layoutId="tag-chip-highlight-mobile"
                  />
                </div>
              ) : (
                <div className="max-w-[220px] sm:max-w-[320px]">
                  <ArticleTagChip href={`${allHref}${hash}`} label={`Все (${allCount})`} active layoutId="tag-chip-highlight-mobile" />
                </div>
              )}
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="ml-auto inline-flex items-center gap-2 rounded-full bg-zinc-200 px-4 py-2 text-base text-blue-600 transition-colors hover:bg-zinc-200/70 hover:text-blue-700"
              >
                <FilterIcon className="h-5 w-5" strokeWidth={1.8} />
                Фильтры
              </button>
            </div>

            {/* Desktop: show "All", up to 4 tags and filters button */}
            <div className="hidden w-full max-w-5xl items-center gap-1 rounded-full bg-zinc-100 p-1 text-zinc-500 lg:inline-flex">
              <ArticleTagChip href={`${allHref}${hash}`} label={`Все (${allCount})`} active={!activeTag} layoutId="tag-chip-highlight" />
              {desktopTags.map((tag) => (
                <ArticleTagChip
                  key={tag.slug}
                  href={`${tag.href}${hash}`}
                  label={`${tag.name} (${tag.count})`}
                  active={activeTag?.slug === tag.slug}
                  layoutId="tag-chip-highlight"
                />
              ))}
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="ml-auto inline-flex items-center gap-2 rounded-full bg-zinc-200 px-4 py-2 text-base text-blue-600 transition-colors hover:bg-zinc-200/70 hover:text-blue-700 cursor-pointer"
              >
                <FilterIcon className="h-5 w-5" strokeWidth={1.8} />
                Фильтры
              </button>
            </div>
          </div>
        </div>
      </ArticleTagChipGroup>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="relative w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-zinc-900">Все теги</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex items-center rounded-full bg-zinc-100 cursor-pointer px-6 py-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-200"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Закрыть</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href={`${allHref}${hash}`}
                className="rounded-full bg-zinc-100 px-4 py-2 text-base text-zinc-700 ring-1 ring-inset ring-zinc-200 transition-colors hover:bg-zinc-200"
                onClick={() => setOpen(false)}
              >
                Все ({allCount})
              </Link>
              {tags.map((tag) => (
                <Link
                  key={tag.slug}
                  href={`${tag.href}${hash}`}
                  className="rounded-full bg-zinc-100 px-4 py-2 text-base text-zinc-700 ring-1 ring-inset ring-zinc-200 transition-colors hover:bg-zinc-200"
                  onClick={() => setOpen(false)}
                >
                  {tag.name} ({tag.count})
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
