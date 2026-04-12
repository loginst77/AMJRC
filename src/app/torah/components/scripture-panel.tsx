import React from "react";
import { BookOpen } from "lucide-react";
import { TranslationSelector } from "./translation-selector";
import type { TorahPassage, TranslationCode } from "@/lib/torah-data";

export function ScripturePanel({
  passage,
  passageRef,
  currentVersion,
}: {
  passage: TorahPassage;
  passageRef: string;
  currentVersion: TranslationCode;
}) {
  // Group verses into paragraphs based on paragraphStart flag
  const paragraphs: (typeof passage.verses)[] = [];
  passage.verses.forEach((v) => {
    if (v.paragraphStart || paragraphs.length === 0) {
      paragraphs.push([v]);
    } else {
      paragraphs[paragraphs.length - 1].push(v);
    }
  });

  return (
    <div className="lg:w-3/5">
      <div className="rounded-3xl border border-zinc-200 bg-white shadow-secondary h-[85vh] flex flex-col overflow-hidden">
        {/* Chapter heading */}
        <div className="flex items-center bg-zinc-50 dark:bg-zinc-900 justify-between border-b border-zinc-200 px-8 py-5 dark:border-zinc-800 sm:px-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 dark:bg-white">
              <BookOpen className="h-5 w-5 text-white dark:text-zinc-900" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-zinc-950 dark:text-white">{passage.reference}</h3>
              <p className="text-sm text-blue-500 dark:text-zinc-500">{passageRef}</p>
            </div>
          </div>
          <TranslationSelector currentVersion={currentVersion} canon="old_testament" />
        </div>

        {/* Verses */}
        <div className="px-8 py-8 sm:px-10 sm:py-10 flex-1 bg-white overflow-y-auto scrollbar-thin">
          {paragraphs.map((group, pIdx) => (
            <React.Fragment key={pIdx}>
              {group[0].chapterRef && (
                <h4
                  className={`mb-4 text-lg font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-800 pb-2 ${pIdx === 0 ? "mt-0" : "mt-8"}`}>
                  {group[0].chapterRef}
                </h4>
              )}
              <p
                className={`text-base leading-[2] text-zinc-700 dark:text-zinc-300 mb-2 last:mb-6 ${group[0].chapterRef || pIdx === 0 ? "indent-0" : "indent-4"}`}>
                {group.map((v) => (
                  <span key={v.verse}>
                    <span className="mr-1.5 inline-flex items-center justify-center rounded-md text-xs font-bold tabular-nums text-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 align-text-top">
                      {v.verse}
                    </span>
                    {v.text}
                  </span>
                ))}
              </p>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
