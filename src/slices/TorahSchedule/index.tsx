"use client";

import { FC, useEffect, useMemo, useState } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import type { TorahDocument } from "../../../prismicio-types";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookOpen, X } from "lucide-react";

type TorahScheduleContext = {
  readings?: TorahDocument[];
  today?: string;
};

export type TorahScheduleProps = SliceComponentProps<Content.TorahScheduleSlice, TorahScheduleContext>;

const ROWS_PER_PAGE = 10;

const HEADERS = ["Дата", "Тора"] as const;

const formatDate = (dateStr: string | null | undefined) => {
  if (!dateStr) return "";
  // Parse "YYYY-MM-DD" as a local calendar date — `new Date("YYYY-MM-DD")` is UTC midnight,
  // which displays as the previous day for any negative-UTC timezone.
  const [y, m, d] = dateStr.split("-").map(Number);
  if (!y || !m || !d) return dateStr;
  try {
    return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long" }).format(new Date(y, m - 1, d));
  } catch {
    return dateStr;
  }
};

const formatDateRange = (start: string | null | undefined, end: string | null | undefined) => {
  const startStr = formatDate(start);
  const endStr = formatDate(end);
  if (startStr && endStr) return `${startStr} — ${endStr}`;
  return startStr || endStr || "-";
};

type ScheduleRow = {
  key: string;
  startDate: string;
  endDate: string;
  passage: string;
  isCurrent: boolean;
  isSelected: boolean;
  href: string;
};

const TorahSchedule: FC<TorahScheduleProps> = ({ slice, context }) => {
  const [isMobileTableOpen, setIsMobileTableOpen] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const tablePageParam = searchParams.get("torahSchedulePage");
  const currentPage = Math.max(Number.parseInt(tablePageParam || "1", 10) || 1, 1);

  const readings = context?.readings ?? [];
  const today = context?.today ?? new Date().toISOString().slice(0, 10);

  const rows: ScheduleRow[] = useMemo(() => {
    const sorted = [...readings].sort((a, b) => {
      const startA = (a.data?.startDate as string | null) || "";
      const startB = (b.data?.startDate as string | null) || "";
      return startA.localeCompare(startB);
    });

    // Real "current" reading = the one that contains today. Used for the "сейчас" badge.
    const currentIndex = sorted.findIndex((doc) => {
      const start = (doc.data?.startDate as string | null) || "";
      const end = (doc.data?.enddate as string | null) || "";
      return !!start && !!end && today >= start && today <= end;
    });
    // Base for offset math mirrors page.tsx: fall back to the latest reading when today is out of range.
    const baseIndex = currentIndex !== -1 ? currentIndex : Math.max(0, sorted.length - 1);

    const offsetParam = Number.parseInt(searchParams.get("offset") || "0", 10) || 0;
    const selectedIndex = sorted.length > 0 ? Math.max(0, Math.min(sorted.length - 1, baseIndex + offsetParam)) : -1;

    const versionParam = (searchParams.get("version") || "NRP").toUpperCase();

    return sorted.map((doc, idx) => {
      const offset = idx - baseIndex;
      const params = new URLSearchParams();
      params.set("version", versionParam);
      params.set("offset", String(offset));
      return {
        key: doc.id,
        startDate: (doc.data?.startDate as string | null) || "",
        endDate: (doc.data?.enddate as string | null) || "",
        passage: (doc.data?.bible_passage as string | null) || "",
        isCurrent: idx === currentIndex,
        isSelected: idx === selectedIndex,
        href: `/torah?${params.toString()}#reader`,
      };
    });
  }, [readings, today, searchParams]);

  const totalPages = Math.max(1, Math.ceil(rows.length / ROWS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * ROWS_PER_PAGE;
  const pagedRows = rows.slice(startIndex, startIndex + ROWS_PER_PAGE);

  const buildPageHref = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("torahSchedulePage", String(page));
    return `${pathname}?${params.toString()}#torah-schedule`;
  };

  const sectionTitle = ((slice as any).primary?.section_title as string | null) ?? "";

  useEffect(() => {
    if (!isMobileTableOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileTableOpen]);

  const cellPadding = "px-4 py-4 sm:px-5";
  const cellBase = `border-b border-zinc-200 text-center whitespace-normal break-words`;
  const linkBase = `block ${cellPadding} transition-colors`;

  const rowBg = (row: ScheduleRow) => {
    if (row.isSelected) return "bg-blue-100/70 hover:bg-blue-100";
    if (row.isCurrent) return "bg-blue-50/50 hover:bg-blue-50";
    return "bg-white hover:bg-zinc-50/80";
  };

  const renderTableMarkup = ({ fullscreen = false }: { fullscreen?: boolean } = {}) => (
    <div
      className={
        fullscreen ? "h-full w-full overflow-auto bg-white" : "overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-secondary"
      }
    >
      <Table className={`border-separate border-spacing-0 text-sm sm:text-base ${fullscreen ? "min-w-max" : "min-w-full"}`}>
        <TableHeader>
          <TableRow className="bg-zinc-50 hover:bg-white">
            {HEADERS.map((header) => (
              <TableHead
                key={header}
                scope="col"
                className={`border-b border-zinc-200 px-4 py-3 text-center text-sm font-semibold tracking-tight text-zinc-900 sm:px-5 sm:text-base`}
              >
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {pagedRows.length > 0 ? (
            pagedRows.map((row) => (
              <TableRow
                key={row.key}
                aria-current={row.isSelected ? "page" : undefined}
                className={`${rowBg(row)} transition-colors`}
              >
                <TableCell className={`${cellBase} max-w-34 md:max-w-none p-0 ${row.isSelected ? "font-semibold text-zinc-900" : "font-medium text-zinc-900"}`}>
                  <Link href={row.href} className={`${linkBase} text-zinc-900`} aria-label={`Перейти к чтению: ${row.passage}`}>
                    <span className="inline-flex items-center justify-center gap-2 flex-wrap">
                      <span>{formatDateRange(row.startDate, row.endDate)}</span>
                      {row.isCurrent ? (
                        <span className="inline-flex items-center rounded-full bg-blue-500 px-2 py-0.5 text-xs font-semibold text-white">
                          сейчас
                        </span>
                      ) : null}
                    </span>
                  </Link>
                </TableCell>
                <TableCell className={`${cellBase} max-w-64 md:max-w-none p-0 ${row.isSelected ? "font-semibold text-zinc-900" : "text-zinc-700"}`}>
                  <Link href={row.href} className={`${linkBase} ${row.isSelected ? "text-zinc-900" : "text-zinc-700"}`} aria-label={`Перейти к чтению: ${row.passage}`}>
                    {row.passage || "-"}
                  </Link>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow className="border-zinc-200 bg-white">
              <TableCell colSpan={HEADERS.length} className="px-5 py-10 text-center text-zinc-500">
                Чтения ещё не добавлены в Prismic.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <section
      id="torah-schedule"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="border-t border-zinc-200 bg-white py-14 sm:py-20"
    >
      <Container>
        <div className="mx-auto max-w-7xl">
          {sectionTitle ? <h2 className="mb-6 text-2xl font-bold text-zinc-950 sm:text-3xl">{sectionTitle}</h2> : null}

          <div className="sm:hidden">
            <button
              type="button"
              onClick={() => setIsMobileTableOpen(true)}
              className="group flex w-full items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-5 text-left transition-colors hover:border-blue-200 hover:bg-blue-50"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-900">
                <BookOpen className="h-6 w-6 text-white" strokeWidth={1.5} />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-base font-semibold text-zinc-950">Открыть таблицу</span>
                <span className="block text-sm text-zinc-500">Просмотреть расписание в полноэкранном режиме</span>
              </div>
            </button>
          </div>

          <div className="hidden sm:mx-auto sm:block sm:max-w-3xl lg:max-w-none">{renderTableMarkup()}</div>

          {isMobileTableOpen ? (
            <div className="fixed inset-0 z-[90] flex flex-col bg-white sm:hidden">
              <div className="sticky top-0 z-10 border-b border-zinc-200 bg-white">
                <div className="flex items-center justify-between px-4 py-3">
                  <h3 className="truncate pr-2 text-base font-semibold text-zinc-950">{sectionTitle || "Таблица расписания"}</h3>
                  <button
                    type="button"
                    onClick={() => setIsMobileTableOpen(false)}
                    className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 px-4 text-sm font-medium text-zinc-900 hover:bg-zinc-100"
                  >
                    Закрыть
                    <X className="ml-1 h-4 w-4" strokeWidth={1.5} />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-hidden bg-white">{renderTableMarkup({ fullscreen: true })}</div>
            </div>
          ) : null}

          {totalPages > 1 ? (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              {Array.from({ length: totalPages }, (_, index) => {
                const page = index + 1;
                const isActive = page === safeCurrentPage;

                return (
                  <Link
                    key={page}
                    href={buildPageHref(page)}
                    aria-current={isActive ? "page" : undefined}
                    className={`inline-flex h-10 min-w-15 items-center justify-center rounded-xl border px-3 text-sm font-semibold transition-colors ${
                      isActive
                        ? "border-blue-400 bg-blue-400 text-white"
                        : "border-zinc-200 bg-white text-zinc-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                    }`}
                  >
                    {page}
                  </Link>
                );
              })}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
};

export default TorahSchedule;
