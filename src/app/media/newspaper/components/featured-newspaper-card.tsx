import { Download, FileDown, Newspaper, PinIcon } from "lucide-react";

import { authorColor } from "@/components/media-components/article-card";
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
  tags?: { name: string }[];
};

interface FeaturedNewspaperCardProps {
  issue: FeaturedNewspaperIssue;
}

export function FeaturedNewspaperCard({ issue }: FeaturedNewspaperCardProps) {
  return (
    <section className="bg-white">
      <Container className="py-16 sm:py-20">
        <p className="mb-6 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-zinc-400">
          <PinIcon className="h-5 w-5" /> Закрепленные выпуски
        </p>
        <div
          className={cn(
            "group relative block overflow-hidden rounded-3xl border border-zinc-200 bg-gradient-to-br from-blue-50 via-white to-sky-50 shadow-none !cursor-default",
            cardHoverCn,
          )}>
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-200/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-sky-200/40 blur-3xl" />

          <div className="relative">
            <div className="p-8">
              <h2 className="py-4 flex items-center gap-2 text-3xl font-bold leading-snug tracking-tight text-zinc-900 group-hover:text-blue-600 sm:text-3xl">
                {issue.title}
              </h2>

              <p className="mb-2 max-w-2xl text-lg leading-relaxed text-zinc-600">{issue.description}</p>
            </div>
            {issue.tags?.length ?
              <div className="mb-8 px-8 flex flex-wrap items-center gap-2">
                {issue.tags.map((tag, index) => (
                  <div
                    key={`${tag.name}-${index}`}
                    className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-200 transition-colors duration-200">
                    {tag.name}
                  </div>
                ))}
              </div>
            : <div className="mb-8" />}
            <div className="flex items-stretch justify-between border-t border-zinc-200">
              {issue.author ?
                <div className="w-full px-8">
                  <div className="flex w-full items-center justify-between gap-4 py-6">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold",
                          authorColor(issue.author).bg,
                          authorColor(issue.author).text,
                        )}>
                        {issue.author.charAt(0)}
                      </div>
                      <div>
                        <p className="text-base font™-semibold text-zinc-800">{issue.author}</p>
                        <p className="text-sm text-zinc-500">Автор</p>
                      </div>
                    </div>

                    <span className="text-base text-zinc-400">{formatDate(issue.date)}</span>
                  </div>
                </div>
              : <div className="px-8 py-6 text-base text-zinc-400">{formatDate(issue.date)}</div>}
              <a
                href={issue.pdfUrl || "#"}
                download
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap border-l border-zinc-200 bg-white px-16 py-8 text-base font-medium hover:bg-blue-50 hover:text-blue-600">
                Скачать PDF
                <Download className="h-4.5 w-4.5" strokeWidth={1.6} />
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
