import { MessageSquareQuote, Bookmark } from "lucide-react";
import { PrismicRichText } from "@/components/PrismicRichText";

export function CommentariesPanel({ commentaries }: { commentaries: any[] }) {
  return (
    <div className="lg:absolute lg:top-0 lg:bottom-0 lg:right-0 lg:w-[calc(40%-0.75rem)] flex flex-col h-[85vh]">
      <div className="rounded-3xl shadow-secondary border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 overflow-hidden flex flex-col flex-1">
        <div className="flex items-center gap-3 border-b border-zinc-200 px-6 py-6 dark:border-zinc-800 shrink-0 bg-zinc-50">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-blue-600">
            <MessageSquareQuote className="h-5 w-5 text-white" strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-zinc-950 dark:text-white">Комментарии</h3>
            <p className="text-xs text-blue-500 dark:text-zinc-500">К текущему чтению</p>
          </div>
        </div>

        <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50 flex-1 overflow-y-auto scrollbar-thin">
          {commentaries.length > 0 ?
            commentaries.map((c: any, i: number) => (
              <div key={i} className="px-6 bg-white border-b border-zinc-200 dark:border-zinc-800 py-5 transition-colors">
                <div className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 prose prose-sm max-w-none [&>p:first-child]:inline">
                  <Bookmark
                    className="h-5 w-5 mb-2 text-blue-600 dark:text-blue-400 inline-block align-text-top mr-1.5 shrink-0"
                    fill="currentColor"
                    strokeWidth={1.5}
                  />
                  <PrismicRichText field={c.commentary} />
                </div>
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="flex gap-2 items-center justify-center mt-2">
                    — <span className="text-sm font-semibold text-zinc-950 dark:text-white">{c.author}</span>
                  </div>
                </div>
              </div>
            ))
          : <div className="flex flex-col items-center justify-center h-full text-center px-6 text-zinc-400 dark:text-zinc-600 py-10 my-auto">
              <MessageSquareQuote className="h-10 w-10 text-zinc-200 dark:text-zinc-800 mb-4" />
              <p className="text-sm">Комментариев к этому чтению пока нет.</p>
            </div>
          }
        </div>
      </div>
    </div>
  );
}
