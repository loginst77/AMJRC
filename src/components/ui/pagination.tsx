import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/cn";

export const MEDIA_PAGE_SIZE = 18;

const PAGE_WINDOW = 1;

/** Builds the list of page numbers to render, collapsing gaps with an ellipsis. */
function buildPageItems(current: number, total: number, window = PAGE_WINDOW): (number | "ellipsis")[] {
  const pages = new Set<number>();
  pages.add(1);
  pages.add(total);
  for (let page = current - window; page <= current + window; page += 1) {
    if (page >= 1 && page <= total) pages.add(page);
  }

  const sorted = Array.from(pages).sort((a, b) => a - b);
  const items: (number | "ellipsis")[] = [];
  let previous = 0;
  for (const page of sorted) {
    if (previous && page - previous > 1) items.push("ellipsis");
    items.push(page);
    previous = page;
  }
  return items;
}

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  /** Returns the href for a given page number (should carry over existing filters + list anchor). */
  buildHref: (page: number) => string;
  className?: string;
  /** Tighter controls and no neighbour pages — for narrow containers like the mobile table overlay. */
  compact?: boolean;
};

const arrowBase = "inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors";
const pillBase = "inline-flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-base font-medium transition-colors";

export function Pagination({ currentPage, totalPages, buildHref, className, compact = false }: PaginationProps) {
  if (totalPages <= 1) return null;

  const items = buildPageItems(currentPage, totalPages, compact ? 0 : PAGE_WINDOW);
  const isFirst = currentPage <= 1;
  const isLast = currentPage >= totalPages;

  const arrowCls = cn(arrowBase, compact && "h-9 w-9");
  const pillCls = cn(pillBase, compact && "h-9 min-w-9 px-2 text-sm");
  const ellipsisCls = cn("inline-flex h-10 w-10 items-center justify-center text-zinc-400", compact && "h-9 w-4");
  const iconCls = compact ? "h-4 w-4" : "h-5 w-5";

  return (
    <nav aria-label="Пагинация" className={cn("flex justify-center pt-4", className)}>
      <div className="inline-flex items-center gap-1 rounded-full bg-zinc-100 p-1 text-zinc-500">
        {isFirst ? (
          <span className={cn(arrowCls, "cursor-not-allowed text-zinc-300")} aria-disabled="true">
            <ChevronLeft className={iconCls} strokeWidth={1.8} />
          </span>
        ) : (
          <Link
            href={buildHref(currentPage - 1)}
            aria-label="Предыдущая страница"
            className={cn(arrowCls, "text-zinc-600 hover:bg-white hover:text-zinc-900")}
          >
            <ChevronLeft className={iconCls} strokeWidth={1.8} />
          </Link>
        )}

        {items.map((item, index) =>
          item === "ellipsis" ? (
            <span key={`ellipsis-${index}`} className={ellipsisCls}>
              …
            </span>
          ) : item === currentPage ? (
            <span key={item} aria-current="page" className={cn(pillCls, "bg-white font-semibold text-zinc-900 shadow-sm")}>
              {item}
            </span>
          ) : (
            <Link key={item} href={buildHref(item)} className={cn(pillCls, "text-zinc-600 hover:bg-white hover:text-zinc-900")}>
              {item}
            </Link>
          ),
        )}

        {isLast ? (
          <span className={cn(arrowCls, "cursor-not-allowed text-zinc-300")} aria-disabled="true">
            <ChevronRight className={iconCls} strokeWidth={1.8} />
          </span>
        ) : (
          <Link
            href={buildHref(currentPage + 1)}
            aria-label="Следующая страница"
            className={cn(arrowCls, "text-zinc-600 hover:bg-white hover:text-zinc-900")}
          >
            <ChevronRight className={iconCls} strokeWidth={1.8} />
          </Link>
        )}
      </div>
    </nav>
  );
}