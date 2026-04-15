"use client";

import Link from "next/link";
import { Mic, PinIcon, SquareArrowOutUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { useVisibleTagCount } from "@/hooks/use-visible-tag-count";
import { formatDate } from "@/lib/media-data";
import type { PodcastEpisode } from "@/components/media-components/podcast-episode-list";
import { cn } from "@/lib/cn";
import { cardHoverCn } from "@/lib/variants";

interface FeaturedEpisodeProps {
  episodes?: PodcastEpisode[];
}

export function FeaturedEpisode({ episodes = [] }: FeaturedEpisodeProps) {
  if (!episodes.length) return null;

  return (
    <section className="bg-white">
      <Container className="py-12 sm:py-16 md:py-20">
        <p className="mb-6 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-zinc-400">
          <PinIcon className="h-5 w-5" /> Закрепленные выпуски
        </p>
        <div className="flex flex-col gap-6">
          {episodes.map((episode) => (
            <div
              key={episode.id}
              className={cn("overflow-hidden rounded-3xl border border-zinc-200 bg-gradient-to-br from-purple-50 to-white", cardHoverCn)}
            >
              <FeaturedEpisodeItem episode={episode} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function FeaturedEpisodeItem({ episode }: { episode: PodcastEpisode }) {
  const { measureTagsRef, visibleTagCount } = useVisibleTagCount(episode.tags);
  const visibleTags = episode.tags?.slice(0, visibleTagCount) ?? [];
  const overflowTags = episode.tags?.slice(visibleTagCount) ?? [];

  return (
    <div className="group flex h-full flex-col md:flex-row md:items-stretch">
                {/* Content: artwork + info */}
      <div className="flex flex-1 flex-col">
        {/* Info */}
        <div className="flex w-full flex-col">
          <div className="flex-1 space-y-2 p-6 sm:p-8">
            <div className="flex items-start gap-4 sm:gap-6">
              {/* Podcast artwork */}
              <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-sky-300 via-blue-400 to-blue-500 sm:h-24 sm:w-24">
                {/* Decorative rings */}
                <span className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20" />
                <span className="absolute h-16 w-16 rounded-full bg-white/10 shadow-inner shadow-white/20" />
                <Mic size={36} strokeWidth={1.4} className="relative z-10 text-white drop-shadow" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-2xl font-bold leading-snug tracking-tight text-zinc-900 group-hover:text-blue-600 sm:text-3xl">
                  {episode.title}
                </h3>
                {episode.author ? <p className="text-base font-semibold text-zinc-800 sm:text-lg">{episode.author}</p> : null}
                <p className="max-w-2xl text-base leading-relaxed text-zinc-600 sm:text-lg">{episode.description}</p>
              </div>
            </div>
            {episode.tags && episode.tags.length > 0 ? (
              <div className="relative my-3 sm:my-4">
                <div
                  ref={measureTagsRef}
                  aria-hidden="true"
                  className="pointer-events-none invisible absolute inset-0 flex flex-wrap gap-1.5 sm:gap-2"
                >
                  {episode.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700 ring-1 ring-inset ring-blue-100 sm:px-4 sm:py-2 sm:text-base md:px-3 md:py-1.5 md:text-xs"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {visibleTags.map((tag) => (
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
                    {overflowTags.slice(0, 5).map((tag) => (
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
            ) : null}
          </div>
          {episode.community ? (
            <Link
              href={episode.community.href}
              className="flex items-center justify-between gap-4 border-t border-zinc-200 px-6 py-6 transition-colors duration-200 hover:bg-blue-100 sm:px-8"
            >
              <span className="min-w-0 text-base font-medium text-zinc-700 transition-colors duration-200 hover:text-blue-600">
                {episode.community.name}
              </span>
              <span className="text-base text-zinc-400">{formatDate(episode.date)}</span>
            </Link>
          ) : (
            <div className="flex items-center justify-end gap-4 border-t border-zinc-200 px-6 py-4 sm:px-8 sm:py-6">
              <span className="text-base text-zinc-400">{formatDate(episode.date)}</span>
            </div>
          )}
        </div>
      </div>
      <div className="hidden items-center border-t border-zinc-200 duration-200 md:flex md:border-l md:border-t-0">
        <Link
          href={episode.href || "#"}
          className="group/link flex h-full w-full shrink-0 items-center justify-center px-6 py-4 text-gray-800 hover:bg-blue-100 sm:px-8 md:px-14"
        >
          <SquareArrowOutUpRight className="h-6 w-6 transition-transform group-hover/link:scale-110" strokeWidth={1.7} />
        </Link>
      </div>
    </div>
  );
}
