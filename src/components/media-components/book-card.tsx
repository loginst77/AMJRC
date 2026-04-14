import Link from "next/link";
import Image from "next/image";
import { BookOpen } from "lucide-react";
import { type MediaItem } from "@/lib/media-data";
import { cn } from "@/lib/cn";
import { cardHoverCn } from "@/lib/variants";

export function BookCard({ book }: { book: MediaItem }) {
  return (
    <Link href={book.href || "#"} className={cn("group flex min-w-[120px] flex-col bg-white dark:bg-zinc-900", cardHoverCn)}>
      <div className="relative flex h-[350px] sm:h-100 shrink-0 items-center justify-center overflow-hidden bg-gradient-to-br from-blue-100 to-blue-50 shadow-inner transition-transform duration-300 ring-1 ring-blue-200/50 group-hover:scale-[1.02] dark:from-blue-900/40 dark:to-blue-950/30 dark:ring-blue-900/60">
        {book.imageSrc ?
          <Image
            src={book.imageSrc}
            alt={book.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          />
        : <BookOpen className="h-16 w-16 text-blue-500/80 drop-shadow-sm dark:text-blue-300/80" strokeWidth={1} />}

        <div className="flex items-center z-50 w-full bottom-2 absolute justify-between px-2">
          {book.author && (
            <span className="text-base font-medium rounded-full bg-white/80 backdrop-blur-sm px-4 py-2 text-zinc-800 dark:text-zinc-300">
              {book.author} {typeof book.date === "number" ? `| ${book.date}` : ""}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div className="p-6">
          <h3 className="line-clamp-2 text-xl font-bold leading-snug text-zinc-900 transition-colors group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-blue-300">
            {book.title}
          </h3>
          <p className="mt-2 line-clamp-3 text-base leading-relaxed text-zinc-500">{book.description}</p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {book.tags?.slice(0, 3).map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-100 transition-colors duration-200 dark:bg-blue-900/40 dark:text-blue-200 dark:ring-blue-800/70">
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
