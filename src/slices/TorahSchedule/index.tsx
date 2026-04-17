"use client";

import { FC, useEffect, useState } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookOpen, X } from "lucide-react";

/**
 * Props for `TorahSchedule`.
 */
export type TorahScheduleProps = SliceComponentProps<Content.TorahScheduleSlice>;

const ROWS_PER_PAGE = 10;

const HEADERS = ["Дата", "Название", "Перевод", "Тора", "Хафтара", "Брит Хадаша"] as const;

/**
 * Component for "TorahSchedule" Slices.
 */
const TorahSchedule: FC<TorahScheduleProps> = ({ slice }) => {
  const [isMobileTableOpen, setIsMobileTableOpen] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const tablePageParam = searchParams.get("torahSchedulePage");
  const currentPage = Math.max(Number.parseInt(tablePageParam || "1", 10) || 1, 1);

  const rawRows = (slice as any).items ?? [];
  const rows = rawRows.filter(
    (row: Record<string, string | null | undefined>) => row.date || row.name || row.translation || row.torah || row.haftarah || row.brit_hadasha,
  );

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
  const tableSummary =
    rows.length > 0 ? `${rows.length} ${rows.length === 1 ? "запись" : rows.length < 5 ? "записи" : "записей"}` : "Расписание чтений";

  useEffect(() => {
    if (!isMobileTableOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileTableOpen]);

  const renderTableMarkup = ({ fullscreen = false }: { fullscreen?: boolean } = {}) => (
    <div
      className={
        fullscreen ? "h-full w-full overflow-auto bg-white" : "overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-secondary"
      }
    >
      <Table className={`border-separate border-spacing-0 text-sm sm:text-base ${fullscreen ? "min-w-max" : "min-w-full"}`}>
        <TableHeader>
          <TableRow className="bg-zinc-50 hover:bg-white">
            {HEADERS.map((header, index) => (
              <TableHead
                key={header}
                scope="col"
                className={`border-b border-zinc-200 px-4 py-3 text-center text-sm font-semibold tracking-tight text-zinc-900 sm:px-5 sm:text-base ${
                  index < HEADERS.length - 1 ? "border-r border-zinc-200" : ""
                }`}
              >
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {pagedRows.length > 0 ? (
            pagedRows.map((row: Record<string, string | null | undefined>, index: number) => (
              <TableRow
                key={`${row.date ?? "date"}-${row.name ?? "name"}-${startIndex + index}`}
                className="border-zinc-200 bg-white hover:bg-zinc-50/80"
              >
                <TableCell className="max-w-34 md:max-w-none border-b last:border-b-0 border-r border-zinc-200 px-4 py-4 text-center font-medium text-zinc-900 whitespace-normal break-words sm:px-5">
                  {row.date || "-"}
                </TableCell>
                <TableCell className="border-b last:border-b-0 border-r border-zinc-200 px-4 py-4 text-center text-zinc-700 whitespace-normal break-words sm:px-5">
                  {row.name || "-"}
                </TableCell>
                <TableCell className="border-b last:border-b-0 border-r border-zinc-200 px-4 py-4 text-center text-zinc-700 whitespace-normal break-words sm:px-5">
                  {row.translation || "-"}
                </TableCell>
                <TableCell className="border-b border-r border-zinc-200 px-4 py-4 text-center text-zinc-700 whitespace-normal break-words sm:px-5">
                  {row.torah || "-"}
                </TableCell>
                <TableCell className="border-b border-r border-zinc-200 px-4 py-4 text-center text-zinc-700 whitespace-normal break-words sm:px-5">
                  {row.haftarah || "-"}
                </TableCell>
                <TableCell className="border-b max-w-64 md:max-w-none border-zinc-200 px-4 py-4 text-center text-zinc-700 whitespace-normal break-words sm:px-5">
                  {row.brit_hadasha || "-"}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow className="border-zinc-200 bg-white">
              <TableCell colSpan={HEADERS.length} className="px-5 py-10 text-center text-zinc-500">
                Добавьте строки в слайс TorahSchedule в Prismic.
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
