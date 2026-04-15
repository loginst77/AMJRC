"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button, ButtonLink } from "@/components/ui/button";
import { BookCard } from "@/components/media-components/book-card";
import { type MediaItem } from "@/lib/media-data";

interface BookCarouselProps {
  books: MediaItem[];
  className?: string;
  allHref?: string;
  allLabel?: string;
}

export function BookCarouselClient({ books, className, allHref, allLabel }: BookCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const getCards = useCallback((el: HTMLDivElement) => {
    return Array.from(el.children).filter((child): child is HTMLDivElement => child instanceof HTMLDivElement);
  }, []);

  const getClosestCardIndex = useCallback(
    (el: HTMLDivElement) => {
      const cards = getCards(el);
      if (!cards.length) return 0;

      const isSmall = window.innerWidth < 640;
      const currentPosition =
        isSmall ? el.scrollLeft + el.clientWidth / 2 : el.scrollLeft;

      return cards.reduce((closestIndex, card, index) => {
        const cardPosition =
          isSmall ? card.offsetLeft + card.offsetWidth / 2 : card.offsetLeft;
        const closestCard = cards[closestIndex];
        const closestPosition =
          isSmall
            ? closestCard.offsetLeft + closestCard.offsetWidth / 2
            : closestCard.offsetLeft;

        return Math.abs(cardPosition - currentPosition) < Math.abs(closestPosition - currentPosition)
          ? index
          : closestIndex;
      }, 0);
    },
    [getCards],
  );

  const getScrollLeftForCard = useCallback((el: HTMLDivElement, card: HTMLDivElement) => {
    const isSmall = window.innerWidth < 640;
    const maxScrollLeft = Math.max(0, el.scrollWidth - el.clientWidth);
    const centeredLeft = card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2;
    const alignedLeft = isSmall ? centeredLeft : card.offsetLeft;

    return Math.min(Math.max(0, alignedLeft), maxScrollLeft);
  }, []);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    activeIndexRef.current = getClosestCardIndex(el);
    setCanScrollLeft(el.scrollLeft > 24);
    setCanScrollRight(Math.ceil(el.scrollLeft + el.clientWidth) < el.scrollWidth - 24);
  }, [getClosestCardIndex]);

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

    const cards = getCards(el);
    if (!cards.length) return;

    const offset = direction === "left" ? -1 : 1;
    const nextIndex = Math.min(Math.max(activeIndexRef.current + offset, 0), cards.length - 1);
    const nextCard = cards[nextIndex];

    activeIndexRef.current = nextIndex;
    el.scrollTo({ left: getScrollLeftForCard(el, nextCard), behavior: "smooth" });
  };

  if (!books.length) return null;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Scrollable row */}
      <div
        ref={scrollRef}
        className="flex items-stretch gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory py-6 px-1 sm:p-6 scroll-p-1 sm:scroll-p-6 rounded-4xl [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden after:content-[''] after:w-px after:shrink-0">
        {books.map((book) => (
          <div key={book.id} className="flex h-auto flex-none w-[calc(100%-8px)] sm:w-[350px] lg:w-[420px] snap-center sm:snap-start">
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
          {allLabel || "Все книги →"}
        </ButtonLink>
      )}
    </div>
  );
}
