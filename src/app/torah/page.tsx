import type { Metadata } from "next";
import Link from "next/link";
import { SliceZone } from "@prismicio/react";
import { asLink } from "@prismicio/client";
import { Container } from "@/components/ui/container";
import { getDailyReading, torahPortions, torahVersion } from "@/lib/torah-data";
import { ReadingPreviewCard } from "@/components/reading-preview-card";
import { LandingPageHero } from "@/components/LandingPageHero";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import {
  BookOpen,
  Scroll,
  ChevronLeft,
  ChevronRight,
  BookMarked,
  Info,
  MessageSquareQuote,
  Feather,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Чтение Торы — Ежедневная глава",
  description: "Читайте ежедневную главу Торы (Хумаш) с красивым оформлением стихов.",
};

// ─── Fake commentary data ────────────────────────────────────────────────────

interface Commentary {
  verse: number;
  author: string;
  source: string;
  era: string;
  text: string;
}

const commentaries: Commentary[] = [
  {
    verse: 1,
    author: "Раши",
    source: "Раши на Тору",
    era: "11 век",
    text: "Тора должна была начинаться с первой заповеди, данной Израилю. Почему же она начинается с Сотворения мира? Чтобы, если народы скажут Израилю: «Вы грабители», Израиль мог ответить: «Вся земля принадлежит Богу; Он сотворил её и отдал тому, кому счёл нужным».",
  },
  {
    verse: 1,
    author: "Рамбан",
    source: "Нахманид",
    era: "13 век",
    text: "Слово «Берешит» содержит глубокую тайну. Оно намекает на шесть дней Творения и шесть тысяч лет существования мира. Буква «бет» закрыта с трех сторон и открыта с одной — это учит тому, что мы можем исследовать мир с момента его сотворения и далее, но не то, что было до него.",
  },
  {
    verse: 2,
    author: "Ибн Эзра",
    source: "Ибн Эзра на Тору",
    era: "12 век",
    text: "«Безвидна и пуста» описывает материю до того, как Бог придал ей узнаваемые формы. Тьма была не сотворённой субстанцией, а отсутствием сотворённого света. «Бездна» относится к первобытному океану, покрывавшему всю землю.",
  },
  {
    verse: 3,
    author: "Сфорно",
    source: "Сфорно на Тору",
    era: "16 век",
    text: "Этот свет не был светом солнца, которое было создано в четвёртый день, но светом духовным — светом сознания и осознания. Это свет, благодаря которому возможно всякое понимание.",
  },
  {
    verse: 1,
    author: "Ramban",
    source: "Nachmanides",
    era: "13th century",
    text: "The word 'Bereishit' contains a profound mystery. It hints at the six days of Creation and the six thousand years of the world's existence. The letter 'bet' is closed on three sides and open on one, teaching that we may explore from the time of Creation forward, but not what was before.",
  },
  {
    verse: 2,
    author: "Ibn Ezra",
    source: "Ibn Ezra on Torah",
    era: "12th century",
    text: "The 'formless and void' describes matter before God shaped it into recognizable forms. The darkness was not a created substance but the absence of created light. The 'deep' refers to the primordial ocean that covered the entire earth.",
  },
  {
    verse: 3,
    author: "Sforno",
    source: "Sforno on Torah",
    era: "16th century",
    text: "This light was not the light of the sun, which was created on the fourth day, but a spiritual light — the light of consciousness and awareness. It is the light through which all understanding is possible.",
  },
];

export default async function ReadTorahPage({ searchParams }: { searchParams: Promise<{ offset?: string }> }) {
  const params = await searchParams;
  const offset = Math.max(-1, Math.min(1, parseInt(params.offset || "0", 10) || 0));

  // Fetch Prismic slices for the Torah landing page
  const client = createClient();
  const prismicPage = await client.getSingle("torahlandingpage" as any).catch(() => null);
  const pageData = prismicPage?.data as any;
  const slices = pageData?.slices ?? [];
  const { portion: dailyPortion, chapter: dailyChapter, readingIndex: dailyReadingIndex, totalReadings } = getDailyReading();

  // Build flat readings list
  const allReadings: { portionIndex: number; chapterIndex: number }[] = [];
  for (let p = 0; p < torahPortions.length; p++) {
    for (let c = 0; c < torahPortions[p].chapters.length; c++) {
      allReadings.push({ portionIndex: p, chapterIndex: c });
    }
  }

  // Current reading adjusted by offset
  const currentIdx = (((dailyReadingIndex + offset) % allReadings.length) + allReadings.length) % allReadings.length;
  const currentReading = allReadings[currentIdx];
  const portion = torahPortions[currentReading.portionIndex];
  const chapter = portion.chapters[currentReading.chapterIndex];

  // Format today's date
  const today = new Date();
  const formattedDate = today.toLocaleDateString("ru-RU", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Group commentaries by verse
  const commentaryByVerse = commentaries.reduce(
    (acc, c) => {
      if (!acc[c.verse]) acc[c.verse] = [];
      acc[c.verse].push(c);
      return acc;
    },
    {} as Record<number, Commentary[]>,
  );

  const prevIdx = (currentIdx - 1 + allReadings.length) % allReadings.length;
  const nextIdx = (currentIdx + 1) % allReadings.length;

  const prevReading = allReadings[prevIdx];
  const nextReading = allReadings[nextIdx];

  const prevPortion = torahPortions[prevReading.portionIndex];
  const prevChapter = prevPortion.chapters[prevReading.chapterIndex];

  const nextPortion = torahPortions[nextReading.portionIndex];
  const nextChapter = nextPortion.chapters[nextReading.chapterIndex];

  return (
    <div className="flex flex-col min-h-screen">
      {/* ───── Hero ───── */}
      <LandingPageHero
        title={pageData?.title}
        description={pageData?.description}
        backgroundImage={pageData?.image}
        button1Link={asLink(pageData?.button_1_link)}
        button1Label={(pageData?.button_1_link as any)?.text}
        button1Variant={(pageData?.button_1_link as any)?.variant}
        button2Link={asLink(pageData?.button_2_link)}
        button2Label={(pageData?.button_2_link as any)?.text}
        button2Variant={(pageData?.button_2_link as any)?.variant}
        breadcrumbHomeLabel="Главная"
        breadcrumbHomeLink="/"
        breadcrumbCurrent="Тора"
      />

      {/* ───── Torah Reader ───── */}
      <section id="reader" className="py-14 sm:py-20 bg-white dark:bg-zinc-950 flex-1 scroll-mt-20">
        <Container>
          {/* Reading header */}
          <div className="mx-auto max-w-7xl mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">{portion.name}</h2>
                <span className="text-2xl font-medium text-zinc-300 dark:text-zinc-600" dir="rtl">
                  {portion.hebrewName}
                </span>
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {portion.book} &middot; {portion.summary}
              </p>
            </div>

            {/* Day navigation */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center gap-2 px-4 py-4">
                  <BookMarked className="h-4 w-4 text-zinc-400" />
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    День {currentIdx + 1} из {totalReadings}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Two-column layout: Scripture (left) + Commentaries (right) */}
          <div className="mx-auto max-w-7xl relative">
            {/* Wrapper: on lg, left col in flow + right col absolute */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* ── Scripture (left) ── */}
              <div className="lg:w-3/5">
                <div className="rounded-3xl border border-zinc-200 bg-white shadow-secondary h-[70vh] flex flex-col overflow-hidden">
                  {/* Chapter heading */}
                  <div className="flex items-center justify-between border-b border-zinc-200 px-8 py-5 dark:border-zinc-800 sm:px-10">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 dark:bg-white">
                        <BookOpen className="h-5 w-5 text-white dark:text-zinc-900" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-zinc-950 dark:text-white">Глава {chapter.chapter}</h3>
                        <p className="text-sm text-blue-500 dark:text-zinc-500">
                          {portion.book} · {portion.name}
                        </p>
                      </div>
                    </div>
                    <div className="hidden items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-2 text-xs font-medium text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400 sm:flex">
                      <Scroll className="h-3 w-3" strokeWidth={1.5} />
                      {torahVersion}
                    </div>
                  </div>

                  {/* Verses */}
                  <div className="px-8 py-8 sm:px-10 sm:py-10 flex-1 bg-neutral-50 overflow-y-auto scrollbar-thin">
                    <div className="space-y-0">
                      {chapter.verses.map((v, i) => (
                        <p
                          key={v.verse}
                          className={`
                            text-[17px] leading-[2] text-zinc-700 dark:text-zinc-300
                            ${i === 0 ? "" : ""}
                          `}>
                          <span className="mr-1.5 inline-flex h-6 w-6 items-center justify-center rounded-md bg-zinc-100 text-[11px] font-bold tabular-nums text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400 align-text-top">
                            {v.verse}
                          </span>
                          {v.text}{" "}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Bottom bar with navigation */}
                  <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 shrink-0 bg-white dark:bg-zinc-950">
                    {offset > -1 ?
                      <Link
                        href={`/read-torah?offset=${offset - 1}#reader`}
                        className="flex items-center justify-start gap-2 w-full py-6 px-8 hover:bg-blue-100 border-zinc-200 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-700 dark:hover:bg-zinc-900 dark:hover:text-zinc-200 group/link">
                        <ChevronLeft className="h-4 w-4 transition-transform group-hover/link:-translate-x-1" />
                        Предыдущая
                      </Link>
                    : <span className="flex items-center gap-2 w-full border-r py-6 px-8 border-zinc-200 text-sm font-medium text-zinc-300 dark:text-zinc-700 cursor-default">
                        <ChevronLeft className="h-4 w-4" />
                        Предыдущая
                      </span>
                    }

                    {offset < 1 ?
                      <Link
                        href={`/read-torah?offset=${offset + 1}#reader`}
                        className="flex items-center justify-end gap-2 w-full py-6 px-8 hover:bg-blue-100 border-zinc-200 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-700 dark:hover:bg-zinc-900 dark:hover:text-zinc-200 group/link">
                        Следующая
                        <ChevronRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                      </Link>
                    : <span className="flex items-center justify-end gap-2 w-full py-6 px-8 border-zinc-200 text-sm font-medium text-zinc-300 dark:text-zinc-700 cursor-default">
                        Следующая
                        <ChevronRight className="h-4 w-4" />
                      </span>
                    }
                  </div>
                </div>
              </div>

              {/* ── Commentaries (right) — absolute on lg to match scripture height ── */}
              <div className="lg:absolute lg:top-0 lg:bottom-0 lg:right-0 lg:w-[calc(40%-0.75rem)] flex flex-col h-[70vh]">
                <div className="rounded-3xl shadow-secondary border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 overflow-hidden flex flex-col flex-1">
                  <div className="flex items-center gap-3 border-b border-zinc-200 px-6 py-6 dark:border-zinc-800 shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-blue-600">
                      <MessageSquareQuote className="h-5 w-5 text-white" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-zinc-950 dark:text-white">Комментарии</h3>
                      <p className="text-xs text-blue-500 dark:text-zinc-500">Классические раввинистические труды</p>
                    </div>
                  </div>

                  {/* Commentary entries */}
                  <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50 flex-1 overflow-y-auto scrollbar-thin">
                    {commentaries.map((c, i) => (
                      <div key={i} className="px-6 py-5 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/30">
                        {/* Author & verse reference */}
                        <div className="flex items-center justify-between mb-2.5">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/40">
                              <Feather className="h-4 w-4 text-blue-600 dark:text-blue-400" strokeWidth={1.5} />
                            </div>
                            <div>
                              <span className="text-base font-semibold text-zinc-900 dark:text-white">{c.author}</span>
                              <span className="ml-1.5 text-[11px] text-zinc-400 dark:text-zinc-500">· {c.era}</span>
                            </div>
                          </div>
                          <span className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-bold tabular-nums text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                            ст. {c.verse}
                          </span>
                        </div>

                        {/* Commentary source */}
                        <p className="mb-1.5 text-xs font-medium text-blue-600/80 dark:text-blue-500/70">{c.source}</p>

                        {/* Commentary text */}
                        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{c.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ───── Previous & Next Readings ───── */}
      <section className="py-14 sm:py-20 bg-zinc-50 dark:bg-black">
        <Container>
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-6 sm:grid-cols-2">
              {offset > -1 ?
                <ReadingPreviewCard direction="prev" portion={prevPortion} chapter={prevChapter} currentOffset={offset} />
              : <div />}
              {offset < 1 ?
                <ReadingPreviewCard direction="next" portion={nextPortion} chapter={nextChapter} currentOffset={offset} />
              : <div />}
            </div>
          </div>
        </Container>
      </section>

      {/* ───── Prismic Slices ───── */}
      <SliceZone slices={slices} components={components} />
    </div>
  );
}
