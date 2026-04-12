"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { BookCard } from "@/components/media-components/book-card";
import { type MediaItem } from "@/lib/media-data";

interface BookCarouselProps {
  books: MediaItem[];
  className?: string;
}

export function BookCarouselClient({ books, className }: BookCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 24);
    setCanScrollRight(Math.ceil(el.scrollLeft + el.clientWidth) < el.scrollWidth - 24);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollState();
    const timer = setTimeout(updateScrollState, 100);

    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      clearTimeout(timer);
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState, books.length]);

  const scrollByAmount = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
  };

  if (!books.length) return null;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Scrollable row */}
      <div
        ref={scrollRef}
        className="flex items-stretch gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory p-6 scroll-p-6 rounded-4xl [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden after:content-[''] after:w-px after:shrink-0">
        {books.map((book) => (
          <div key={book.id} className="flex h-auto flex-none w-[280px] sm:w-[350px] lg:w-[420px] snap-start">
            <BookCard book={book} />
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
            "flex h-12 flex-1 items-center justify-center group rounded-full border border-zinc-200 transition-colors disabled:opacity-100 disabled:border-zinc-200 dark:disabled:border-zinc-800",
            canScrollLeft ?
              "text-zinc-900 hover:bg-zinc-100 dark:text-white dark:hover:bg-zinc-900"
            : "!bg-white !text-zinc-300 dark:bg-zinc-900 dark:text-zinc-700 cursor-default",
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
            "flex h-12 flex-1 items-center justify-center group rounded-full border border-zinc-200 transition-colors disabled:opacity-100 disabled:border-zinc-200 dark:disabled:border-zinc-800",
            canScrollRight ?
              "text-zinc-900 hover:bg-zinc-100 dark:text-white dark:hover:bg-zinc-900"
            : "!bg-white !text-zinc-300 dark:bg-zinc-900 dark:text-zinc-700 cursor-default",
          )}
          aria-label="Вперёд">
          Вперед
          <ChevronRight strokeWidth={1.2} className="group-hover:translate-x-1 transition-transform duration-200" />
        </Button>
      </div>
    </div>
  );
}
