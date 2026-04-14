"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Maximize2, X, BookOpen, MessageSquareQuote, Bookmark, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { TranslationSelector } from "./translation-selector";
import { PrismicRichText } from "@/components/PrismicRichText";
import { cn } from "@/lib/cn";
import type { TorahPassage, TranslationCode } from "@/lib/torah-data";

interface FullscreenReaderProps {
  passage: TorahPassage;
  passageRef: string;
  currentVersion: TranslationCode;
  commentaries: any[];
  prevHref?: string;
  nextHref?: string;
}

export function FullscreenReaderButton({ passage, passageRef, currentVersion, commentaries, prevHref, nextHref }: FullscreenReaderProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const scriptureScrollRef = useRef<HTMLDivElement>(null);
  const commentariesScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [open]);

  // Reset scroll when passage changes
  useEffect(() => {
    scriptureScrollRef.current?.scrollTo(0, 0);
    commentariesScrollRef.current?.scrollTo(0, 0);
  }, [passageRef]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  const paragraphs: (typeof passage.verses)[] = [];
  passage.verses.forEach((v) => {
    if (v.paragraphStart || paragraphs.length === 0) {
      paragraphs.push([v]);
    } else {
      paragraphs[paragraphs.length - 1].push(v);
    }
  });

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden lg:inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        aria-label="Полноэкранный режим"
      >
        <Maximize2 className="h-4 w-4" strokeWidth={1.5} />
      </button>

      {mounted &&
        createPortal(
          <div
            className={cn(
              "fixed inset-0 z-[100] flex flex-col bg-white dark:bg-zinc-950 transition-all duration-300 ease-in-out",
              open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none",
            )}
            role="dialog"
            aria-modal="true"
            aria-label="Полноэкранное чтение"
          >
            {/* Header */}
            <div className="shrink-0 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
              <div className="flex items-center justify-between px-6 py-4 max-w-[1800px] mx-auto w-full">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 dark:bg-white">
                    <BookOpen className="h-5 w-5 text-white dark:text-zinc-900" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-zinc-950 dark:text-white">{passage.reference}</h2>
                    <p className="text-sm text-blue-500 dark:text-zinc-500">{passageRef}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <TranslationSelector currentVersion={currentVersion} canon="old_testament" />
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="inline-flex h-10 px-4 items-center justify-center rounded-full border border-zinc-200 text-zinc-900 hover:bg-zinc-100 dark:border-zinc-800 dark:text-white dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    Закрыть
                    <X className="ml-1.5 h-4 w-4" strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            </div>

            {/* Content: scripture left, commentaries right */}
            <div className="flex-1 flex overflow-hidden max-w-[1800px] mx-auto w-full">
              {/* Scripture */}
              <div ref={scriptureScrollRef} className="flex-1 overflow-y-auto scrollbar-thin border-r border-zinc-200 dark:border-zinc-800">
                <div className="px-8 py-8 lg:px-12 lg:py-10">
                  {paragraphs.map((group, pIdx) => (
                    <React.Fragment key={pIdx}>
                      {group[0].chapterRef && (
                        <h4
                          className={`mb-4 text-lg font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-200 dark:border-zinc-800 pb-2 ${pIdx === 0 ? "mt-0" : "mt-8"}`}
                        >
                          {group[0].chapterRef}
                        </h4>
                      )}
                      <p
                        className={`text-base leading-[2] text-zinc-700 dark:text-zinc-300 mb-2 last:mb-6 ${group[0].chapterRef || pIdx === 0 ? "indent-0" : "indent-4"}`}
                      >
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

              {/* Commentaries */}
              <div className="w-[400px] shrink-0 flex flex-col overflow-hidden bg-zinc-50/50 dark:bg-zinc-900/30">
                <div className="flex items-center gap-3 border-b border-zinc-200 px-6 py-5 dark:border-zinc-800 shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-blue-600">
                    <MessageSquareQuote className="h-5 w-5 text-white" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-zinc-950 dark:text-white">Комментарии</h3>
                    <p className="text-xs text-blue-500 dark:text-zinc-500">К текущему чтению</p>
                  </div>
                </div>
                <div ref={commentariesScrollRef} className="divide-y divide-zinc-100 dark:divide-zinc-800/50 flex-1 overflow-y-auto scrollbar-thin">
                  {commentaries.length > 0 ?
                    commentaries.map((c: any, i: number) => (
                      <div key={i} className="px-6 py-5 transition-colors">
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

            {/* Previous / Next footer */}
            {(prevHref || nextHref) && (
              <div className="shrink-0 flex border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                {prevHref ?
                  <Link
                    href={prevHref}
                    className="flex flex-1 items-center justify-center gap-2 py-4 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
                    Назад
                  </Link>
                : <div className="flex-1" />}
                <div className="w-px bg-zinc-200 dark:bg-zinc-800" />
                {nextHref ?
                  <Link
                    href={nextHref}
                    className="flex flex-1 items-center justify-center gap-2 py-4 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    Вперёд
                    <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
                  </Link>
                : <div className="flex-1" />}
              </div>
            )}
          </div>,
          document.body,
        )}
    </>
  );
}
