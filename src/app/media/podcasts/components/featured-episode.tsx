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
    <section className="bg-white dark:bg-zinc-950">
      <Container className="py-14 sm:py-20">
        <p className="mb-6 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          <PinIcon className="h-5 w-5" /> Закрепленные выпуски
        </p>
        <div className="flex flex-col gap-6">
          {episodes.map((episode) => (
            <div
              key={episode.id}
              className={cn("overflow-hidden rounded-3xl border border-zinc-200 bg-gradient-to-br from-purple-50 to-white", cardHoverCn)}
            >
              <div className="group flex h-full flex-col sm:flex-row sm:items-stretch">
                {/* Content: artwork + info */}
                <div className="flex flex-col flex-1 gap-6 p-6 sm:flex-row sm:items-center">
                  {/* Podcast artwork */}
                  <div className="flex h-34 w-34 shrink-0 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-900/30">
                    <Mic size={48} strokeWidth={1.2} />
                  </div>
                  {/* Info */}
                  <div className="flex-1 space-y-3">
                    <h3 className="text-2xl font-semibold text-zinc-950 dark:text-white group-hover:text-blue-600">{episode.title}</h3>
                    <p className="text-zinc-600 dark:text-zinc-400">{episode.description}</p>
                    <div className="flex items-center gap-4 text-sm text-zinc-500">
                      {episode.author && <span className="font-medium">{episode.author}</span>}
                      <span>{formatDate(episode.date)}</span>
                    </div>
                    <div className="">
                      {!!episode.tags?.length && (
                        <div className="flex flex-wrap items-center gap-2">
                          {episode.tags.map((tag) => (
                            <span
                              key={tag.id}
                              className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-100 dark:bg-blue-900/40 dark:text-blue-200 dark:ring-blue-800/70"
                            >
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center border-l border-zinc-200 duration-200">
                  <Link
                    href={episode.href || "#"}
                    className="flex h-full w-full shrink-0 items-center justify-center sm:px-10 md:px-14 py-4 text-gray-800 hover:bg-blue-100 group/link"
                  >
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
