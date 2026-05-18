"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { cn } from "@/lib/cn";
import { cardHoverCn } from "@/lib/variants";

interface ReadingPreviewCardProps {
  direction: "prev" | "next";
  title: string;
  /** Bible passage / verse range (e.g. Prismic bible_passage); shown when distinct from title. */
  passageReference?: string | null;
  dateRange: string;
  href: string;
}

export function ReadingPreviewCard({ direction, title, passageReference, dateRange, href }: ReadingPreviewCardProps) {
  const isPrev = direction === "prev";
  const passage = typeof passageReference === "string" ? passageReference.trim() : "";
  const showPassage = passage.length > 0 && passage !== title.trim();

  return (
    <Link
      href={href}
      scroll={false}
      onClick={() => {
        setTimeout(() => {
          document.getElementById("reader")?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }}
      className={cn(
        "group relative block w-full rounded-3xl border border-zinc-200 bg-white p-4 text-left transition-colors sm:p-8",
        cardHoverCn,
      )}
    >
      {/* Label */}
      <div className={`mb-3 flex items-center gap-2 sm:mb-4 ${isPrev ? "" : "justify-end"}`}>
        {isPrev && <ChevronLeft className="h-4 w-4 text-zinc-400 transition-transform group-hover:-translate-x-1" />}
        <span className="text-xs hidden sm:block font-semibold uppercase sm:tracking-widest text-zinc-400">
          {isPrev ? "Предыдущее чтение" : "Следующее чтение"}
        </span>
        {!isPrev && <ChevronRight className="h-4 w-4 text-zinc-400 transition-transform group-hover:translate-x-1" />}
      </div>

      {/* Title */}
      <div className={`mb-1 flex items-center gap-2 ${isPrev ? "" : "sm:justify-end"}`}>
        <h3 className="text-lg font-bold leading-snug text-zinc-950 transition-colors group-hover:text-blue-600 sm:text-xl">{title}</h3>
      </div>
      {/* Passage + dates: stacked until md, single row on md+ */}
      <div
        className={cn(
          "mb-4 flex flex-col text-sm mt-3 md:mt-0 lg:text-base text-zinc-500  gap-2 md:flex-row md:flex-wrap md:items-baseline md:gap-x-2 md:gap-y-1",
          isPrev ? "md:justify-start" : "items-end text-right md:items-baseline md:justify-end",
        )}
      >
        {showPassage ? <p className="shrink-0 max-md:w-full ">{passage}</p> : null}
        <p className="max-md:w-full md:border-l-2 border-zinc-400/70 md:pl-2">{dateRange}</p>
      </div>

      {/* Read more hint */}
      <div
        className={`mt-4 flex hidden sm:flex items-center gap-2 text-sm font-medium text-blue-600 opacity-100 transition-opacity duration-300 sm:opacity-0 sm:group-hover:opacity-100 ${
          isPrev ? "" : "sm:justify-end"
        }`}
      >
        <BookOpen className="h-4 w-4" />
        Нажмите, чтобы прочитать
      </div>
    </Link>
  );
}
