import Link from "next/link";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { cn } from "@/lib/cn";
import { cardHoverCn } from "@/lib/variants";

interface ReadingPreviewCardProps {
  direction: "prev" | "next";
  title: string;
  dateRange: string;
  href: string;
}

export function ReadingPreviewCard({ direction, title, dateRange, href }: ReadingPreviewCardProps) {
  const isPrev = direction === "prev";

  return (
    <Link href={href} className={cn("group relative rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 text-left w-full block transition-colors", cardHoverCn)}>
      {/* Label */}
      <div className={`flex items-center gap-2 mb-4 ${isPrev ? "" : "justify-end"}`}>
        {isPrev && <ChevronLeft className="h-4 w-4 text-zinc-400 transition-transform group-hover:-translate-x-1" />}
        <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          {isPrev ? "Предыдущее чтение" : "Следующее чтение"}
        </span>
        {!isPrev && <ChevronRight className="h-4 w-4 text-zinc-400 transition-transform group-hover:translate-x-1" />}
      </div>

      {/* Title */}
      <div className={`flex items-center gap-2 mb-1 ${isPrev ? "" : "justify-end"}`}>
        <h3 className="text-xl font-bold text-zinc-950 dark:text-white group-hover:text-blue-600 transition-colors">{title}</h3>
      </div>
      <p className={`text-sm text-zinc-500 dark:text-zinc-400 mb-4 ${isPrev ? "" : "text-right"}`}>
        {dateRange}
      </p>

      {/* Read more hint */}
      <div className={`mt-4 flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${isPrev ? "" : "justify-end"}`}>
        <BookOpen className="h-4 w-4" />
        Нажмите, чтобы прочитать
      </div>
    </Link>
  );
}
