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
    <section className="bg-white">
      <Container className="py-16 sm:py-20">
        <p className="mb-6 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-zinc-400">
          <PinIcon className="h-5 w-5" /> Закрепленные книги
        </p>
        <Link href={book.href || "#"} className={cn("group relative block", cardHoverCn)}>
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-200/40 blur-3xl transition-opacity group-hover:opacity-75" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-blue-200/40 blur-3xl transition-opacity group-hover:opacity-75" />

          <div className="relative flex flex-col items-center gap-6 p-8 sm:p-10 md:flex-row md:items-start lg:gap-8">
            <div className="flex justify-center md:w-[28%] md:justify-start">
              <div className="relative flex h-64 w-44 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-blue-200 to-blue-100 shadow-xl shadow-blue-900/10 ring-1 ring-blue-300/50 transition-transform duration-300 group-hover:scale-[1.03] group-hover:rotate-0 sm:h-82 sm:w-56">
                {book.imageSrc ?
                  <Image
                    src={book.imageSrc}
                    alt={book.title}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 14rem, (min-width: 640px) 14rem, 12rem"
                  />
                : <BookOpen className="h-16 w-16 text-blue-500/80 drop-shadow-sm" strokeWidth={1} />}
              </div>
            </div>

            <div className="flex flex-col md:w-[72%] md:self-stretch">
              <div className="flex items-start flex-col space-y-2 py-6">
                <h2 className="min-w-0 flex-1 text-3xl font-bold leading-tight tracking-tight text-zinc-900 transition-colors group-hover:text-blue-600 sm:text-3xl">
                  {book.title}
                </h2>

                <p className="max-w-2xl text-lg leading-relaxed text-zinc-600">{book.description}</p>
                {typeof book.date === "number" ?
                  <span className="shrink-0 text-base font-semibold tabular-nums text-zinc-600">Дата выпуска: {book.date}</span>
                : null}
              </div>

              <div className="mb-8 flex flex-wrap items-center gap-2">
                {book.tags?.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-200 transition-colors duration-200">
                    {tag.name}
                  </span>
                ))}
              </div>

              <div className="mt-auto flex flex-col justify-between gap-6 pt-2 sm:flex-row sm:items-center">
                {book.author ?
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-700 ring-1 ring-blue-200">
                        {book.author.charAt(0)}
                      </div>
                      <div>
                        <p className="text-base font-bold text-zinc-900">{book.author}</p>
                        <p className="text-sm font-medium text-zinc-500">Автор</p>
                      </div>
                    </div>
                  </div>
                : <div />}
              </div>
            </div>
          </div>
        </Link>
      </Container>
    </section>
  );
}
