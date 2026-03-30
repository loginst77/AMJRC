import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, PinIcon } from "lucide-react";
import { Container } from "@/components/ui/container";
import { type MediaItem } from "@/lib/media-data";
import { cn } from "@/lib/cn";
import { cardHoverCn } from "@/lib/variants";

interface FeaturedBookProps {
  book: MediaItem;
}

export function FeaturedBook({ book }: FeaturedBookProps) {
  return (
    <section className="bg-white dark:bg-zinc-950">
      <Container className="py-16 sm:py-20">
        <p className="mb-6 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          <PinIcon className="h-5 w-5" /> Закрепленные книги
        </p>
        <Link href={book.href || "#"} className={cn("group relative block", cardHoverCn)}>
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-200/40 blur-3xl transition-opacity group-hover:opacity-75 dark:bg-blue-800/10" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-blue-200/40 blur-3xl transition-opacity group-hover:opacity-75 dark:bg-blue-800/10" />

          <div className="relative flex flex-col items-center gap-6 p-8 sm:p-10 md:flex-row md:items-start lg:gap-8">
            <div className="flex justify-center md:w-[28%] md:justify-start">
              <div className="relative flex h-64 w-44 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-blue-200 to-blue-100 shadow-xl shadow-blue-900/10 ring-1 ring-blue-300/50 transition-transform duration-300 group-hover:scale-[1.03] group-hover:rotate-0 dark:from-blue-900/50 dark:to-blue-950/40 dark:ring-blue-700/50 sm:h-82 sm:w-56">
                {book.imageSrc ? (
                  <Image
                    src={book.imageSrc}
                    alt={book.title}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 14rem, (min-width: 640px) 14rem, 12rem"
                  />
                ) : (
                  <BookOpen className="h-16 w-16 text-blue-500/80 drop-shadow-sm dark:text-blue-300/80" strokeWidth={1} />
                )}
              </div>
            </div>

            <div className="flex flex-col md:w-[72%] md:self-stretch">
              <div className="mb-5 flex items-start justify-between gap-4">
                <h2 className="min-w-0 flex-1 text-3xl font-bold leading-tight tracking-tight text-zinc-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400 sm:text-3xl">
                  {book.title}
                </h2>
                {typeof book.date === "number" ? (
                  <span className="shrink-0 rounded-full border border-zinc-200 bg-zinc-100 px-4 py-2 text-xs font-semibold tabular-nums text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                    {book.date}
                  </span>
                ) : null}
              </div>
              <p className="mb-8 max-w-2xl text-lg leading-relaxed text-zinc-600">{book.description}</p>
              <div className="mb-8 flex flex-wrap items-center gap-2">
                {book.tags?.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-200 transition-colors duration-200 dark:bg-blue-900/40 dark:text-blue-200 dark:ring-blue-800/70"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>

              <div className="mt-auto flex flex-col justify-between gap-6 pt-2 sm:flex-row sm:items-center">
                {book.author ? (
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-700 ring-1 ring-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:ring-blue-800">
                        {book.author.charAt(0)}
                      </div>
                      <div>
                        <p className="text-base font-bold text-zinc-900 dark:text-zinc-100">{book.author}</p>
                        <p className="text-sm font-medium text-zinc-500">Автор</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div />
                )}

                <div className="inline-flex items-center justify-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-6 py-3 text-sm font-semibold text-blue-600 transition-all duration-200 group-hover:gap-3 dark:border-blue-900/50 dark:bg-blue-900/20 dark:text-blue-400">
                  Подробнее о книге
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        </Link>
      </Container>
    </section>
  );
}
