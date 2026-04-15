import Link from "next/link";
import { Mic, PinIcon, SquareArrowOutUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
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
      <Container className="py-16 sm:py-20">
        <p className="mb-6 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-zinc-400">
          <PinIcon className="h-5 w-5" /> Закрепленные выпуски
        </p>
        <div className="flex flex-col gap-6">
          {episodes.map((episode) => (
            <div
              key={episode.id}
              className={cn("overflow-hidden rounded-3xl border border-zinc-200 bg-gradient-to-br from-purple-50 to-white", cardHoverCn)}>
              <div className="group flex h-full flex-col sm:flex-row sm:items-stretch">
                {/* Content: artwork + info */}
                <div className="flex flex-col flex-1 gap-0 sm:flex-row sm:items-center">
                  {/* Info */}
                  <div className="flex flex-col w-full">
                    <div className="flex-1 space-y-2 p-8">
                      <div className="flex items-start gap-6">
                        {/* Podcast artwork */}
                        <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-sky-300 via-blue-400 to-blue-500">
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
                          <p className="max-w-2xl text-lg leading-relaxed text-zinc-600">{episode.description}</p>
                        </div>
                      </div>
                      <div className="mt-4">
                        {!!episode.tags?.length && (
                          <div className="flex flex-wrap items-center gap-2">
                            {episode.tags.map((tag) => (
                              <span
                                key={tag.id}
                                className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-100 transition-colors duration-200">
                                {tag.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between px-8 py-6 gap-4 border-t border-zinc-200">
                      {episode.community ?
                        <Link href={episode.community.href} className="min-w-0 text-base font-medium text-zinc-700 transition-colors duration-200 hover:text-blue-600">
                          {episode.community.name}
                        </Link>
                      : <span />}
                      <span className="text-base text-zinc-400">{formatDate(episode.date)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center border-l border-zinc-200 duration-200">
                  <Link
                    href={episode.href || "#"}
                    className="flex h-full w-full shrink-0 items-center justify-center sm:px-10 md:px-14 py-4 text-gray-800 hover:bg-blue-100 group/link">
                    <SquareArrowOutUpRight className="h-6 w-6 transition-transform group-hover/link:scale-110" strokeWidth={1.7} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
