import type { Metadata } from "next";
import type { TorahDocument } from "../../../prismicio-types";
import { SliceZone } from "@prismicio/react";
import { asLink } from "@prismicio/client";
import { Container } from "@/components/ui/container";
import { fetchPassage, VERSIONS, TranslationCode } from "@/lib/torah-data";
import { TranslationSelector } from "./components/translation-selector";
import { CommentariesPanel } from "./components/commentaries-panel";
import { ScripturePanel } from "./components/scripture-panel";
import { TorahMobileReader } from "./components/torah-mobile-reader";
import { LandingPageHero } from "@/components/LandingPageHero";
import { ReadingPreviewCard } from "@/components/reading-preview-card";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import { BookOpen } from "lucide-react";
import { FullscreenReaderButton } from "./components/fullscreen-reader";

export const metadata: Metadata = {
  title: "Чтение Торы — Ежедневная глава",
  description: "Читайте ежедневную главу Торы (Хумаш) с красивым оформлением стихов.",
};

export default async function ReadTorahPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }> | { [key: string]: string | string[] | undefined };
}) {
  const client = createClient();
  const searchParams = await Promise.resolve(props.searchParams);
  const versionParam = typeof searchParams?.version === "string" ? searchParams.version.toUpperCase() : "NRP";
  const currentVersionCode: TranslationCode = Object.keys(VERSIONS).includes(versionParam) ? (versionParam as TranslationCode) : "NRP";
  const currentBibleId = VERSIONS[currentVersionCode].id;

  const offsetParam = typeof searchParams?.offset === "string" ? searchParams.offset : "0";
  const offset = parseInt(offsetParam, 10) || 0;

  // Fetch Prismic page data (hero, slices)
  const prismicPage = await client.getSingle("torahlandingpage" as any).catch(() => null);
  const pageData = prismicPage?.data as any;
  const slices = pageData?.slices ?? [];

  // Fetch current Torah reading from Prismic
  const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
  const allReadings = await client.getAllByType<TorahDocument>("torah").catch(() => [] as TorahDocument[]);

  // Sort by startDate
  allReadings.sort((a: any, b: any) => {
    const startA = a.data?.startDate || "";
    const startB = b.data?.startDate || "";
    return startA.localeCompare(startB);
  });

  // Find index of today's active reading
  let baseIndex = allReadings.findIndex((doc: any) => {
    const start = doc.data?.startDate;
    const end = doc.data?.enddate;
    if (!start || !end) return false;
    return today >= start && today <= end;
  });

  // Fallback if no reading active today
  if (baseIndex === -1 && allReadings.length > 0) {
    baseIndex = allReadings.length - 1; // latest
  }

  let currentIndex = baseIndex;
  if (baseIndex !== -1) {
    currentIndex = baseIndex + offset;
    currentIndex = Math.max(0, Math.min(allReadings.length - 1, currentIndex));
  }

  const currentReading = currentIndex !== -1 ? allReadings[currentIndex] : undefined;

  // Previous / Next bindings
  const prevIndex = currentIndex - 1;
  const nextIndex = currentIndex + 1;
  const prevReading = prevIndex >= 0 ? allReadings[prevIndex] : null;
  const nextReading = nextIndex < allReadings.length ? allReadings[nextIndex] : null;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long" }).format(new Date(dateStr));
    } catch {
      return dateStr;
    }
  };

  // Fetch passage text from YouVersion
  const passageRef = currentReading?.data?.bible_passage as string | undefined;
  let fetchFailed = false;
  const passage =
    passageRef ?
      await fetchPassage(passageRef, currentBibleId).catch(() => {
        fetchFailed = true;
        return null;
      })
    : null;

  // Commentaries from Prismic
  const commentaries = (currentReading?.data?.commentarie ?? []) as any[];

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
          {currentReading && passage ?
            <div className="mx-auto max-w-7xl relative">
              {/* Mobile reader (below md) */}
              <TorahMobileReader
                passage={passage}
                passageRef={passageRef!}
                currentVersion={currentVersionCode}
                commentaries={commentaries}
                prevHref={prevReading ? `/torah?version=${currentVersionCode}&offset=${prevIndex - baseIndex}#reader` : undefined}
                nextHref={nextReading ? `/torah?version=${currentVersionCode}&offset=${nextIndex - baseIndex}#reader` : undefined}
              />

              {/* Desktop reader (lg and above) */}
              <div className="hidden lg:flex flex-col lg:flex-row gap-6">
                {/* ── Scripture (left) ── */}
                <ScripturePanel
                  passage={passage}
                  passageRef={passageRef!}
                  currentVersion={currentVersionCode}
                  actions={
                    <FullscreenReaderButton
                      passage={passage}
                      passageRef={passageRef!}
                      currentVersion={currentVersionCode}
                      commentaries={commentaries}
                      prevHref={prevReading ? `/torah?version=${currentVersionCode}&offset=${prevIndex - baseIndex}#reader` : undefined}
                      nextHref={nextReading ? `/torah?version=${currentVersionCode}&offset=${nextIndex - baseIndex}#reader` : undefined}
                    />
                  }
                />

                {/* ── Commentaries (right) ── */}
                <CommentariesPanel commentaries={commentaries} />
              </div>
            </div>
          : <div className="mx-auto max-w-2xl text-center py-20">
              {fetchFailed && <TranslationSelector currentVersion={currentVersionCode} fetchFailed={true} canon="old_testament" />}
              <BookOpen className="h-12 w-12 text-zinc-300 mx-auto mb-4 animate-pulse" />
              <h2 className="text-2xl font-bold text-zinc-950 dark:text-white mb-2">
                {fetchFailed ? "Ошибка при загрузке" : "Нет текущего чтения"}
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400">
                {fetchFailed ?
                  "Не удалось загрузить выбранный перевод. Возвращаемся к предыдущему..."
                : "На эту неделю чтение ещё не назначено. Пожалуйста, проверьте позже."}
              </p>
            </div>
          }
        </Container>
      </section>

      {/* ───── Previous & Next Readings ───── */}
      {(prevReading || nextReading) && (
        <section className="py-14 sm:py-20 bg-zinc-50 dark:bg-black border-t border-zinc-200 dark:border-zinc-900">
          <Container>
            <div className="mx-auto max-w-7xl">
              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
                {prevReading ?
                  <ReadingPreviewCard
                    direction="prev"
                    title={prevReading.data.bible_passage || "Безымянное чтение"}
                    dateRange={`${formatDate(prevReading.data.startDate || "")} — ${formatDate(prevReading.data.enddate || "")}`}
                    href={`/torah?version=${currentVersionCode}&offset=${prevIndex - baseIndex}#reader`}
                  />
                : <div />}
                {nextReading ?
                  <ReadingPreviewCard
                    direction="next"
                    title={nextReading.data.bible_passage || "Безымянное чтение"}
                    dateRange={`${formatDate(nextReading.data.startDate || "")} — ${formatDate(nextReading.data.enddate || "")}`}
                    href={`/torah?version=${currentVersionCode}&offset=${nextIndex - baseIndex}#reader`}
                  />
                : <div />}
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* ───── Prismic Slices ───── */}
      <SliceZone slices={slices} components={components} />
    </div>
  );
}
