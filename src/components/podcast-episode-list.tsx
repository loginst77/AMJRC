"use client";

import Link from "next/link";
import { ArrowRight, ChevronRight, Mic, Play, SquareArrowOutUpRight } from "lucide-react";

import { cn } from "@/lib/cn";
import { formatDate } from "@/lib/media-data";
import { cardHoverCn } from "@/lib/variants";

export interface PodcastEpisode {
  id: string;
  title: string;
  description?: string;
  author?: string;
  date: string;
  href?: string;
  tags?: PodcastTag[];
  alliance?: {
    name: string;
    href?: string;
  };
  featured?: boolean;
}

export interface PodcastTag {
  id: string;
  slug: string;
  name: string;
}

interface PodcastEpisodeListProps {
  episodes: PodcastEpisode[];
}

export function PodcastEpisodeList({ episodes }: PodcastEpisodeListProps) {
  return (
    <div className="space-y-4">
      {episodes.map((episode) => (
        <div key={episode.id} className={cn("group flex items-stretch overflow-hidden rounded-2xl bg-white", cardHoverCn)}>
          <Link href={episode.href || "#"} className="group flex min-w-0 flex-1 items-center gap-4 p-4 sm:px-6 sm:py-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-sm font-bold text-zinc-600 dark:bg-blue-900/30 dark:text-zinc-400">
              <Mic className="h-6 w-6" strokeWidth={1.5} />
            </div>

            <div className="min-w-0 flex-1 text-left">
              <div className="flex h-full flex-col items-start justify-center space-y-1 min-h-[80px]">
                <h3 className="truncate text-lg font-semibold text-zinc-950 transition-colors duration-200 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                  {episode.title}
                </h3>
                {episode.description ? <p className="line-clamp-2 text-base text-zinc-500 dark:text-zinc-400">{episode.description}</p> : null}

                <div className="">
                  {!!episode.tags?.length ? (
                    <div className="mt-1 flex flex-wrap items-center justify-start gap-2">
                      {episode.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-100 dark:bg-blue-900/40 dark:text-blue-200 dark:ring-blue-800/70"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="hidden shrink-0 text-right text-sm text-zinc-500 sm:flex sm:flex-col sm:items-end sm:gap-0.5">
              {episode.author ? <div className="text-base font-medium">{episode.author}</div> : null}
              <div className="text-base">{formatDate(episode.date)}</div>
            </div>
          </Link>

          <Link
            href={episode.href || "#"}
            className="group/play hidden sm:flex items-center border-l border-zinc-200 sm:px-10 md:px-14 text-gray-800 transition-colors duration-200 hover:bg-blue-100 dark:border-zinc-700 dark:hover:bg-blue-950/30"
          >
            <SquareArrowOutUpRight className="h-5 w-5 transition-transform group-hover/play:scale-110" strokeWidth={1.7} />
          </Link>
        </div>
      ))}
    </div>
  );
}
