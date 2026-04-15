"use client";

import Link from "next/link";
import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import { BookOpen, PinIcon } from "lucide-react";
import { Container } from "@/components/ui/container";
import { type MediaItem } from "@/lib/media-data";
import { cn } from "@/lib/cn";
import { cardHoverCn } from "@/lib/variants";

interface FeaturedBookProps {
  books: MediaItem[];
}

function FeaturedBookItem({ book }: { book: MediaItem }) {
  const [visibleTagCount, setVisibleTagCount] = useState(book.tags?.length ?? 0);
  const measureTagsRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const node = measureTagsRef.current;
    if (!node || !book.tags?.length) {
      setVisibleTagCount(book.tags?.length ?? 0);
      return;
    }

    const measureRows = () => {
      const children = Array.from(node.children) as HTMLElement[];
      const rowTops: number[] = [];
      let nextVisibleTagCount = children.length;

      for (let index = 0; index < children.length; index += 1) {
        const top = children[index]?.offsetTop ?? 0;
        const isNewRow = !rowTops.some((rowTop) => Math.abs(rowTop - top) <= 1);

        if (isNewRow) {
          rowTops.push(top);
        }

        if (rowTops.length > 2) {
          nextVisibleTagCount = index;
          break;
        }
      }

      setVisibleTagCount(nextVisibleTagCount);
    };

    measureRows();

    const resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measureRows) : null;
    resizeObserver?.observe(node);
    Array.from(node.children).forEach((child) => resizeObserver?.observe(child));

    window.addEventListener("resize", measureRows);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", measureRows);
    };
  }, [book.tags]);

  const visibleTags = book.tags?.slice(0, visibleTagCount) ?? [];
  const overflowTags = book.tags?.slice(visibleTagCount) ?? [];

  return (
    <Link href={book.href || "#"} className={cn("group relative block", cardHoverCn)}>
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-200/40 blur-3xl transition-opacity group-hover:opacity-75" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-blue-200/40 blur-3xl transition-opacity group-hover:opacity-75" />

      <div className="relative flex flex-col items-center gap-6 sm:gap-0 md:flex-row md:items-start md:p-6 lg:p-8">
        <div className="flex w-full justify-center md:w-[28%] md:justify-start">
          <div className="relative flex h-[350px] w-full shrink-0 items-center justify-center overflow-hidden bg-gradient-to-br from-blue-100 to-blue-50 shadow-inner ring-1 ring-blue-200/50 transition-transform duration-300 group-hover:scale-[1.03] group-hover:rotate-0 sm:h-100 md:h-80 md:bg-gradient-to-b md:from-blue-200 md:to-blue-100 md:shadow-xl md:shadow-blue-900/10 md:ring-blue-300/50 lg:h-100 md:rounded-3xl">
            {book.imageSrc ? (
              <Image
                src={book.imageSrc}
                alt={book.title}
                fill
                className="scale-[1.05] object-cover transition-transform duration-300 group-hover:scale-[1.08]"
                sizes="(min-width: 1024px) 28vw, (min-width: 768px) 28vw, 100vw"
              />
            ) : (
              <BookOpen className="h-16 w-16 text-blue-500/80 drop-shadow-sm" strokeWidth={1} />
            )}
          </div>
        </div>

        <div className="flex w-full flex-col pt-4 sm:pt-6 md:w-[72%] md:self-stretch">
          <div className="flex flex-col items-start space-y-2 px-4 sm:px-6 md:px-8 lg:px-10">
            <h2 className="min-w-0 flex-1 text-2xl font-bold leading-tight tracking-tight text-zinc-900 transition-colors group-hover:text-blue-600 sm:text-3xl">
              {book.title}
            </h2>

            <p className="max-w-2xl text-base leading-relaxed text-zinc-600 sm:text-lg">{book.description}</p>
            {typeof book.date === "number" ? (
              <span className="text-zinc-600">
                Дата выпуска: <span className="shrink-0 font-semibold text-zinc-600 text-base">{book.date}</span>
              </span>
            ) : null}
            {book.author ? (
              <span className="text-zinc-600">
                Автор: <span className="shrink-0 font-semibold text-zinc-600 text-base">{book.author}</span>
              </span>
            ) : null}
          </div>

          {book.tags && book.tags.length > 0 ? (
            <div className="relative my-6 px-4 sm:my-4 sm:px-6 md:px-8 lg:px-10">
              <div
                ref={measureTagsRef}
                aria-hidden="true"
                className="pointer-events-none invisible absolute inset-0 flex flex-wrap gap-1.5 sm:gap-2"
              >
                {book.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-100 transition-colors duration-200 sm:px-4 sm:py-2 sm:text-base md:px-3 md:py-1.5 md:text-xs"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {visibleTags.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-100 transition-colors duration-200 sm:px-4 sm:py-2 sm:text-base md:px-3 md:py-1.5 md:text-xs"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
              {overflowTags.length > 0 ? (
                <div className="mt-2 flex items-center -space-x-10 overflow-hidden sm:-space-x-18">
                  {overflowTags.slice(0, 5).map((tag) => (
                    <span
                      key={tag.id}
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
      </div>
    </Link>
  );
}

export function FeaturedBook({ books }: FeaturedBookProps) {
  if (!books.length) return null;

  return (
    <section className="bg-white">
      <Container className="py-12 sm:py-16 lg:py-20">
        <p className="mb-6 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-zinc-400">
          <PinIcon className="h-5 w-5" /> Закрепленные книги
        </p>
        <div className="flex flex-col gap-8 sm:gap-12">
          {books.map((book) => (
            <FeaturedBookItem key={book.id} book={book} />
          ))}
        </div>
      </Container>
    </section>
  );
}
