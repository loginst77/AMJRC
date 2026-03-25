import Link from "next/link";
import { Play } from "lucide-react";
import { Container } from "@/components/ui/container";
import { formatDate, type MediaItem } from "@/lib/media-data";
import { cn } from "@/lib/cn";
import { cardHoverCn } from "@/lib/variants";

interface FeaturedEpisodeProps {
  episode: MediaItem;
}

export function FeaturedEpisode({ episode }: FeaturedEpisodeProps) {
  return (
    <section className="bg-white dark:bg-zinc-950">
      <Container className="py-14 sm:py-20">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-6">Последний выпуск</h2>
        {/* Podcast */}
        <div className={cn("rounded-3xl overflow-hidden border border-zinc-200 bg-gradient-to-br from-purple-50 to-white", cardHoverCn)}>
          <div className="flex flex-col sm:flex-row sm:items-stretch group">
            {/* Content: artwork + info */}
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center flex-1 p-6">
              {/* Podcast artwork */}
              <div className="flex h-34 w-34 shrink-0 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-900/30">
                <svg className="h-15 w-15 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
                  />
                </svg>
              </div>
              {/* Info */}
              <div className="flex-1 space-y-3">
                <span className="inline-flex items-center rounded-full bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-600 dark:text-purple-400">
                  Новый выпуск
                </span>
                <h3 className="text-2xl font-semibold text-zinc-950 dark:text-white group-hover:text-blue-600">{episode.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400">{episode.description}</p>
                <div className="flex items-center gap-4 text-sm text-zinc-500">
                  {episode.author && <span className="font-medium">{episode.author}</span>}
                  <span>{formatDate(episode.date)}</span>
                </div>
              </div>
            </div>
            {/* Play button — no padding so border touches card edges */}
            <div className="flex items-center border-l border-zinc-200 duration-200">
              <Link
                href={episode.href || "#"}
                className="flex h-full group/link w-full shrink-0 py-4 px-18 hover:bg-blue-100 items-center justify-center text-gray-800"
              >
                <Play className="h-8 w-8 transition-transform group-hover/link:scale-110" fill="currentColor" />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
