import Link from "next/link";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import type { TorahPortion, TorahChapter } from "@/lib/torah-data";
import { cn } from "@/lib/cn";
import { cardHoverCn } from "@/lib/variants";

interface ReadingPreviewCardProps {
  direction: "prev" | "next";
  portion: TorahPortion;
  chapter: TorahChapter;
  currentOffset: number;
}

export function ReadingPreviewCard({ direction, portion, chapter, currentOffset }: ReadingPreviewCardProps) {
  const isPrev = direction === "prev";
  const targetOffset = Math.max(-1, Math.min(1, isPrev ? currentOffset - 1 : currentOffset + 1));
  const href = `/read-torah?offset=${targetOffset}#reader`;

  return (
    <Link href={href} className={cn("group relative rounded-3xl bg-white p-8 text-left w-full block", cardHoverCn)}>
      {/* Label */}
      <div className={`flex items-center gap-2 mb-4 ${isPrev ? "" : "justify-end"}`}>
        {isPrev && <ChevronLeft className="h-4 w-4 text-zinc-400" />}
        <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          {isPrev ? "Предыдущая глава" : "Следующая глава"}
        </span>
        {!isPrev && <ChevronRight className="h-4 w-4 text-zinc-400" />}
      </div>

      {/* Title */}
      <div className="flex items-center gap-2 mb-1">
        <h3 className="text-xl font-bold text-zinc-950 group-hover:text-blue-600">{portion.name}</h3>
        <span className="text-lg text-zinc-300 dark:text-zinc-600" dir="rtl">
          {portion.hebrewName}
        </span>
      </div>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
        {portion.book} &middot; Глава {chapter.chapter}
      </p>

      {/* Truncated verses with gradient fade */}
      <div className="relative max-h-[160px] overflow-hidden">
        <div className="space-y-0">
          {chapter.verses.map((v) => (
            <p key={v.verse} className="text-[14px] leading-[1.9] text-zinc-600 dark:text-zinc-400">
              <span className="mr-1 inline-flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold tabular-nums text-zinc-400 dark:text-zinc-500 align-text-top">
                {v.verse}
              </span>
              {v.text}{" "}
            </p>
          ))}
        </div>
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-white/90 to-transparent dark:from-zinc-950 dark:via-zinc-950/90" />
      </div>

      {/* Read more hint */}
      <div className="mt-4 flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <BookOpen className="h-4 w-4" />
        Нажмите, чтобы прочитать полностью
      </div>
    </Link>
  );
}
