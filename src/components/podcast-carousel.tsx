"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play, Mic } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button";
import { PodcastEpisodeList, type PodcastEpisode } from "@/components/media-components/podcast-episode-list";

interface PodcastCarouselProps {
  episodes: PodcastEpisode[];
  className?: string;
  allHref?: string;
  allLabel?: string;
}

export function PodcastCarouselClient({ episodes, className, allHref, allLabel }: PodcastCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    // Use a small 24px threshold (matching the p-6 padding) to prevent
    // fractional pixel/padding snap points from keeping the button active.
    setCanScrollLeft(el.scrollLeft > 24);
    setCanScrollRight(Math.ceil(el.scrollLeft + el.clientWidth) < el.scrollWidth - 24);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Check initial state, plus a small delay to handle browser scroll restoration
    updateScrollState();
    const timer = setTimeout(updateScrollState, 100);

    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      clearTimeout(timer);
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState, episodes.length]);

  const scrollByAmount = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    // Since each chunk is 'w-full', scroll by exactly one full page width
    const amount = el.clientWidth;
    el.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
  };

  const chunkedEpisodes = [];
  for (let i = 0; i < episodes.length; i += 3) {
    chunkedEpisodes.push(episodes.slice(i, i + 3));
  }

  if (!episodes.length) return null;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Scrollable row */}
      <div
        ref={scrollRef}
        className="flex items-stretch overflow-x-auto scroll-smooth snap-x snap-mandatory py-6 rounded-4xl [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {chunkedEpisodes.map((chunk, chunkIdx) => (
          <div key={`chunk-${chunkIdx}`} className="flex-none w-full md:px-6 snap-start">
            <PodcastEpisodeList episodes={chunk} />
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <div className="flex gap-3">
        <Button
          onClick={() => scrollByAmount("left")}
          disabled={!canScrollLeft}
          variant="outline"
          size="md"
          className={cn(
            "flex h-12 flex-1 items-center justify-center group rounded-full border border-zinc-200 transition-colors disabled:opacity-100 disabled:border-zinc-200",
            canScrollLeft ?
              "text-zinc-900 hover:bg-zinc-100"
            : "!bg-white !text-zinc-300 cursor-default",
          )}
          aria-label="Назад">
          <ChevronLeft
            strokeWidth={1.2}
            className={cn("transition-transform duration-200", canScrollLeft && "group-hover:-translate-x-0.5")}
          />
          Назад
        </Button>
        <Button
          onClick={() => scrollByAmount("right")}
          disabled={!canScrollRight}
          variant="outline"
          size="md"
          className={cn(
            "flex h-12 flex-1 items-center justify-center group rounded-full border border-zinc-200 transition-colors disabled:opacity-100 disabled:border-zinc-200",
            canScrollRight ?
              "text-zinc-900 hover:bg-zinc-100"
            : "!bg-white !text-zinc-300 cursor-default",
          )}
          aria-label="Вперёд">
          Вперед
          <ChevronRight strokeWidth={1.2} className="group-hover:translate-x-1 transition-transform duration-200" />
        </Button>
      </div>

      {allHref && (
        <ButtonLink href={allHref} variant="primary" size="md" className="w-full sm:hidden">
          {allLabel || "Все подкасты →"}
        </ButtonLink>
      )}
    </div>
  );
}
