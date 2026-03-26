import { Download, Newspaper } from "lucide-react";

import { authorColor } from "@/components/article-card";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/cn";
import { formatDate } from "@/lib/media-data";
import { cardHoverCn } from "@/lib/variants";

export type FeaturedNewspaperIssue = {
  id: string;
  title: string;
  description?: string;
  pdfUrl?: string;
  author?: string;
  date?: Date | null;
};

interface FeaturedNewspaperCardProps {
  issue: FeaturedNewspaperIssue;
}

export function FeaturedNewspaperCard({ issue }: FeaturedNewspaperCardProps) {
  return (
    <section className="bg-white dark:bg-zinc-950">
      <Container className="py-16 sm:py-20">
        <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Последний выпуск</p>
        <div
          className={cn(
            "group relative block overflow-hidden rounded-3xl border border-zinc-200 bg-gradient-to-br from-blue-50 via-white to-sky-50 shadow-none dark:border-zinc-800 dark:from-blue-950/20 dark:via-zinc-950 dark:to-sky-950/10",
            cardHoverCn,
          )}
        >
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-200/40 blur-3xl dark:bg-blue-800/10" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-sky-200/40 blur-3xl dark:bg-sky-800/10" />

          <div className="relative">
            <div className="p-8">
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <Badge variant="outline" size="sm" className="flex items-center gap-1.5 bg-white !shadow-none">
                  Последние новости
                </Badge>
              </div>

              <h2 className="mb-4 flex items-center gap-2 text-3xl font-bold leading-snug tracking-tight text-zinc-900 transition-colors duration-200 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400 sm:text-4xl">
                <Newspaper className="h-8 w-8" strokeWidth={1.5} />
                {issue.title}
              </h2>

              <p className="mb-8 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">{issue.description}</p>
            </div>
            <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800">
              {issue.author ? (
                <div className="w-full px-8">
                  <div className="flex w-full items-center justify-between gap-4 py-6">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold",
                          authorColor(issue.author).bg,
                          authorColor(issue.author).text,
                        )}
                      >
                        {issue.author.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{issue.author}</p>
                        <p className="text-xs text-zinc-500">Автор</p>
                      </div>
                    </div>

                    <span className="text-sm text-zinc-600">{formatDate(issue.date)}</span>
                  </div>
                </div>
              ) : (
                <div className="px-8 py-6 text-sm text-zinc-500">{formatDate(issue.date)}</div>
              )}
              <a
                href={issue.pdfUrl || "#"}
                download
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap border-l border-zinc-200 bg-white px-8 py-8 text-sm font-medium hover:bg-blue-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-blue-900/20"
              >
                Скачать PDF
                <Download className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
