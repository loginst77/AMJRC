"use client";

import React, { useRef, useEffect } from "react";
import { BookOpen } from "lucide-react";
import { TranslationSelector } from "./translation-selector";
import type { TorahPassage, TranslationCode } from "@/lib/torah-data";

export function ScripturePanel({
  passage,
  passageRef,
  currentVersion,
  actions,
}: {
  passage: TorahPassage;
  passageRef: string;
  currentVersion: TranslationCode;
  actions?: React.ReactNode;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset scroll position when passage changes
  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
  }, [passage.reference, passageRef]);

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
      <div className="rounded-3xl border border-zinc-200 bg-white shadow-secondary h-[70vh] sm:h-[75vh] lg:h-[85vh] flex flex-col overflow-hidden">
        {/* Chapter heading */}
        <div className="flex items-center bg-zinc-50 justify-between border-b border-zinc-200 px-5 py-4 sm:px-8 sm:py-5 md:px-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900">
              <BookOpen className="h-5 w-5 text-white" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-zinc-950">{passage.reference}</h3>
              <p className="text-sm text-blue-500">{passageRef}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TranslationSelector currentVersion={currentVersion} canon="old_testament" />
            {actions}
          </div>
        </div>

        {/* Verses */}
        <div ref={scrollRef} className="px-5 py-6 sm:px-8 sm:py-8 md:px-10 md:py-10 flex-1 bg-white overflow-y-auto scrollbar-thin">
          {paragraphs.map((group, pIdx) => (
            <React.Fragment key={pIdx}>
              {group[0].chapterRef && (
                <h4
                  className={`mb-4 text-lg font-bold text-zinc-900 border-b border-zinc-200 pb-2 ${pIdx === 0 ? "mt-0" : "mt-8"}`}>
                  {group[0].chapterRef}
                </h4>
              )}
              <p
                className={`text-base leading-[2] text-zinc-700 mb-2 last:mb-6 ${group[0].chapterRef || pIdx === 0 ? "indent-0" : "indent-4"}`}>
                {group.map((v) => (
                  <span key={v.verse}>
                    <span className="mr-1.5 inline-flex items-center justify-center rounded-md text-xs font-bold tabular-nums text-zinc-700 align-text-top">
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
