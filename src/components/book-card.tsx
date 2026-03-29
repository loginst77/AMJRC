import Link from "next/link";
import { BookOpen } from "lucide-react";
import { type MediaItem } from "@/lib/media-data";
import { cn } from "@/lib/cn";
import { cardHoverCn } from "@/lib/variants";

export function BookCard({ book }: { book: MediaItem }) {
  return (
    <Link href={book.href || "#"} className={cn("group flex min-w-[120px] flex-col bg-white dark:bg-zinc-900", cardHoverCn)}>
      <div className="flex h-72 w-full shrink-0 items-center justify-center bg-gradient-to-br from-blue-100 to-blue-50 shadow-inner transition-transform duration-300 group-hover:scale-[1.02] ring-1 ring-blue-200/50 dark:from-blue-900/40 dark:to-blue-950/30 dark:ring-blue-900/60">
        <BookOpen className="h-16 w-16 text-blue-500/80 drop-shadow-sm dark:text-blue-300/80" strokeWidth={1} />
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div className="p-6">
          <h3 className="line-clamp-2 text-xl font-bold leading-snug text-zinc-900 transition-colors group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-blue-300">
            {book.title}
          </h3>
          <p className="mt-2 line-clamp-3 text-base leading-relaxed text-zinc-500 dark:text-zinc-400">{book.description}</p>
        </div>
        <div className="flex items-center justify-between border-t border-zinc-200 p-6 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
          {book.author && <span className="font-medium text-zinc-600 dark:text-zinc-300">{book.author}</span>}
          <span>{book.date ? new Date(book.date).getFullYear() : ""}</span>
        </div>
      </div>
    </Link>
  );
}
