"use client";

import React, { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { BookOpen, MessageSquareQuote, X, Bookmark, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { TranslationSelector } from "./translation-selector";
import { PrismicRichText } from "@/components/PrismicRichText";
import { cn } from "@/lib/cn";
import type { TorahPassage, TranslationCode } from "@/lib/torah-data";

type Tab = "scripture" | "commentaries";

interface TorahMobileReaderProps {
  passage: TorahPassage;
  passageRef: string;
  currentVersion: TranslationCode;
  commentaries: any[];
  prevHref?: string;
  nextHref?: string;
}

export function TorahMobileReader({ passage, passageRef, currentVersion, commentaries, prevHref, nextHref }: TorahMobileReaderProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("scripture");
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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

  // Reset scroll when switching tabs or when the passage changes
  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
  }, [activeTab, passageRef]);

  // Group verses into paragraphs
  const paragraphs: (typeof passage.verses)[] = [];
  passage.verses.forEach((v) => {
    if (v.paragraphStart || paragraphs.length === 0) {
      paragraphs.push([v]);
    } else {
      paragraphs[paragraphs.length - 1].push(v);
    }
  });

  const openWithTab = (tab: Tab) => {
    setActiveTab(tab);
    setOpen(true);
  };

  return (
    <>
      {/* ── Two entry buttons (mobile only) ── */}
      <div className="flex flex-col gap-3 lg:hidden">
        <div className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900">
          <span className="text-sm font-semibold text-zinc-950 dark:text-white">Перевод</span>
          <div className="relative z-[95]">
            <TranslationSelector currentVersion={currentVersion} canon="old_testament" />
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:items-stretch gap-3">
        <button
          type="button"
          onClick={() => openWithTab("scripture")}
          className="group flex flex-1 items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-5 text-left transition-colors hover:border-blue-200 hover:bg-blue-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-800 dark:hover:bg-blue-950/30">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-900 dark:bg-white">
            <BookOpen className="h-6 w-6 text-white dark:text-zinc-900" strokeWidth={1.5} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold text-zinc-950 dark:text-white">{passage.reference}</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Нажмите, чтобы читать стихи</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => openWithTab("commentaries")}
          className="group flex flex-1 items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-5 text-left transition-colors hover:border-blue-200 hover:bg-blue-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-800 dark:hover:bg-blue-950/30">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-blue-600">
            <MessageSquareQuote className="h-6 w-6 text-white" strokeWidth={1.5} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold text-zinc-950 dark:text-white">Комментарии</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {commentaries.length > 0 ?
                `${commentaries.length} комментари${
                  commentaries.length === 1 ? "й"
                  : commentaries.length < 5 ? "я"
                  : "ев"
                }`
              : "Нет комментариев"}
            </p>
          </div>
        </button>
        </div>
      </div>

      {/* ── Full-screen modal (mobile only) ── */}
      {mounted &&
        createPortal(
          <div
            className={cn(
              "fixed inset-0 z-[90] flex flex-col bg-white dark:bg-zinc-950 transition-transform duration-300 ease-in-out lg:hidden",
              open ? "translate-y-0" : "translate-y-full pointer-events-none",
            )}
            role="dialog"
            aria-modal="true"
            aria-label="Torah reader">
            {/* ── Header with close & tabs ── */}
            <div className="shrink-0 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
              <div className="flex items-center justify-between px-4 py-3">
                <h2 className="text-base font-semibold text-zinc-950 dark:text-white truncate pr-2">
                  {activeTab === "scripture" ? passage.reference : "Комментарии"}
                </h2>
                <div className="flex items-center gap-2">
                  {activeTab === "scripture" && <TranslationSelector currentVersion={currentVersion} canon="old_testament" />}
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="inline-flex h-10 px-4 items-center justify-center rounded-full border border-zinc-200 text-zinc-900 hover:bg-zinc-100 dark:border-zinc-800 dark:text-white dark:hover:bg-zinc-800"
                    aria-label="Закрыть">
                    Закрыть
                    <X className="ml-1 h-4 w-4" strokeWidth={1.5} />
                  </button>
                </div>
              </div>

              {/* Tab switcher */}
              <div className="flex px-4 pb-3 gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("scripture")}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors",
                    activeTab === "scripture" ?
                      "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                    : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
                  )}>
                  <BookOpen className="h-4 w-4" strokeWidth={1.5} />
                  Стихи
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("commentaries")}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors",
                    activeTab === "commentaries" ?
                      "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                    : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
                  )}>
                  <MessageSquareQuote className="h-4 w-4" strokeWidth={1.5} />
                  Комментарии
                </button>
              </div>
            </div>

            {/* ── Scrollable content ── */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin">
              {activeTab === "scripture" ?
                <div className="px-5 py-6">
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
              : <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                  {commentaries.length > 0 ?
                    commentaries.map((c: any, i: number) => (
                      <div key={i} className="px-5 py-5 bg-white dark:bg-zinc-950 transition-colors">
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
                  : <div className="flex flex-col items-center justify-center text-center px-6 text-zinc-400 dark:text-zinc-600 py-20">
                      <MessageSquareQuote className="h-10 w-10 text-zinc-200 dark:text-zinc-800 mb-4" />
                      <p className="text-sm">Комментариев к этому чтению пока нет.</p>
                    </div>
                  }
                </div>
              }
            </div>

            {/* ── Previous / Next footer ── */}
            {(prevHref || nextHref) && (
              <div className="shrink-0 flex border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                {prevHref ?
                  <Link
                    href={prevHref}
                    scroll={false}
                    className="flex flex-1 items-center justify-center gap-2 py-4 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800">
                    <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
                    Назад
                  </Link>
                : <div className="flex-1" />}
                <div className="w-px bg-zinc-200 dark:bg-zinc-800" />
                {nextHref ?
                  <Link
                    href={nextHref}
                    scroll={false}
                    className="flex flex-1 items-center justify-center gap-2 py-4 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800">
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
