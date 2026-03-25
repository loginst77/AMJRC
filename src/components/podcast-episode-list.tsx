"use client";

import Link from "next/link";
import { ChevronRight, Mic, Play } from "lucide-react";

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
  alliance?: {
    name: string;
    href?: string;
  };
  featured?: boolean;
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
              <Mic className="h-6 w-6" />
            </div>

            <div className="min-w-0 flex-1 space-y-1">
              <h3 className="truncate text-base font-semibold text-zinc-950 transition-colors duration-200 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                {episode.title}
              </h3>
              {episode.description ? <p className="line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">{episode.description}</p> : null}
              <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                {episode.author ? <span className="font-medium">{episode.author}</span> : null}
                <span>{formatDate(episode.date)}</span>
                {episode.alliance
                  ? episode.alliance.href
                    ? (
                      <Link
                        href={episode.alliance.href}
                        onClick={(e) => e.stopPropagation()}
                        className="group/alliance-link inline-flex shrink-0 items-center gap-0.5 rounded-full bg-blue-100 px-4 py-1.5 text-xs font-semibold text-blue-700 transition-all duration-200 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-300"
                      >
                        {episode.alliance.name}
                        <ChevronRight className="h-3 w-3 transition-transform group-hover/alliance-link:translate-x-0.5" />
                      </Link>
                    )
                    : (
                      <span className="inline-flex shrink-0 items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                        {episode.alliance.name}
                      </span>
                    )
                  : null}
              </div>
            </div>

            <div className="hidden shrink-0 text-right text-sm text-zinc-500 sm:flex sm:flex-col sm:items-end sm:gap-0.5">
              {episode.author ? <div className="font-medium">{episode.author}</div> : null}
              <div>{formatDate(episode.date)}</div>
            </div>
          </Link>

          <Link
            href={episode.href || "#"}
            className="group/play flex items-center border-l border-zinc-200 px-10 text-gray-800 transition-colors duration-200 hover:bg-blue-100 dark:border-zinc-700 dark:hover:bg-blue-950/30"
          >
            <Play className="h-5 w-5 transition-transform group-hover/play:scale-110" fill="currentColor" />
          </Link>
        </div>
      ))}
    </div>
  );
}
