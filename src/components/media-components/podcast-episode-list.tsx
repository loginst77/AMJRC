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
  community?: {
    id: string;
    name: string;
    href: string;
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
        <div
          key={episode.id}
          className={cn("group flex flex-col overflow-hidden rounded-2xl bg-white md:flex-row md:items-stretch", cardHoverCn)}
        >
          <Link href={episode.href || "#"} className="group flex min-w-0 flex-1 items-start gap-4 p-4 sm:px-6 sm:py-6 md:items-center">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-sm font-bold text-zinc-600 sm:h-18 sm:w-18 md:h-24 md:w-24">
              <Mic size={30} strokeWidth={1.5} />
            </div>

            <div className="min-w-0 flex-1 text-left">
              <div className="flex h-full min-h-[80px] flex-col items-start justify-center space-y-1">
                <h3 className="line-clamp-2 text-xl font-semibold leading-snug text-zinc-950 transition-colors duration-200 group-hover:text-blue-600">
                  {episode.title}
                </h3>
                {episode.author ? <p className="text-base font-medium text-zinc-700">{episode.author}</p> : null}
                {episode.description ? <p className="mt-2 text-base leading-relaxed text-zinc-500 line-clamp-2">{episode.description}</p> : null}

                <div>
                  {!!episode.tags?.length ? (
                    <div className="mt-2 flex flex-wrap items-center justify-start gap-1.5 sm:gap-2">
                      {episode.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700 ring-1 ring-inset ring-blue-100 transition-colors duration-200 sm:px-3 sm:py-1.5 sm:text-xs"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </Link>

          {episode.community ? (
            <div>
              {/* Mobile */}
              <Link
                href={episode.community.href}
                className="flex flex-row items-start gap-2 border-t border-zinc-200 p-6 text-zinc-950 transition-colors duration-200 hover:bg-blue-100 justify-between sm:hidden"
              >
                <span className="min-w-0 text-sm font-medium leading-snug">
                  <span className="truncate">{episode.community.name}</span>
                </span>
                <span className="text-sm text-zinc-400">{formatDate(episode.date)}</span>
              </Link>
            </div>
          ) : (
            <div className="border-t border-zinc-200 px-4 py-6 text-right sm:hidden">
              <div className="text-sm text-zinc-400">{formatDate(episode.date)}</div>
            </div>
          )}

          {episode.community ? (
            <Link
              href={episode.community.href}
              className="hidden shrink-0 text-right group-hover:text-blue-600 md:flex md:flex-col md:items-end md:justify-center md:gap-0.5 md:px-6"
            >
              <div className="text-base font-medium text-zinc-700 transition-colors duration-200 group-hover:text-blue-600">
                {episode.community.name}
              </div>
              <div className="text-base text-zinc-400">{formatDate(episode.date)}</div>
            </Link>
          ) : (
            <div className="hidden shrink-0 text-right md:flex md:flex-col md:items-end md:justify-center md:gap-0.5 md:px-6">
              <div className="text-base text-zinc-400">{formatDate(episode.date)}</div>
            </div>
          )}

          <Link
            href={episode.href || "#"}
            className="group/play hidden lg:flex items-center border-l border-zinc-200 sm:px-10 md:px-14 text-gray-800 transition-colors duration-200 hover:bg-blue-100"
          >
            <SquareArrowOutUpRight className="h-5 w-5 transition-transform group-hover/play:scale-110" strokeWidth={1.7} />
          </Link>
        </div>
      ))}
    </div>
  );
}
