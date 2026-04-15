"use client";

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
      <p className={`mb-4 text-sm text-zinc-500 ${isPrev ? "" : "sm:text-right"}`}>{dateRange}</p>

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
