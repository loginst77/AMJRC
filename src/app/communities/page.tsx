import type { Metadata } from "next";
import { SliceZone } from "@prismicio/react";
import { asText, asLink } from "@prismicio/client";
import { LandingPageHero } from "@/components/LandingPageHero";
import { CommunityCard, type CommunityItem } from "@/components/media-components/community-card";
import { Container } from "@/components/ui/container";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import { SectionHeader } from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "Общины",
  description: "Все общины и домашние группы",
};

export default async function CommunitiesPage() {
  const client = createClient();
  const [landing, communities] = await Promise.all([
    client.getSingle("communitylandingpage" as any).catch(() => null),
    client
      .getAllByType("community" as any, {
        orderings: [{ field: "document.first_publication_date", direction: "desc" }],
      })
      .catch(() => []), // fallback to empty array if type missing
  ]);

  const cards: CommunityItem[] = communities.map((comm) => {
    // Cast to any to safely extract properties before types are generated
    const doc = comm as any;
    const title = asText(doc.data?.title) || doc.data?.meta_title || "Без названия";
    const contentText = asText(doc.data?.content) || "";
    const candidates = [doc.data?.description, doc.data?.meta_description, contentText].map((v) => (v || "").trim()).filter(Boolean);

    const description = candidates[0] || "";

    return {
      id: doc.uid,
      title,
      description,
      image: doc.data?.image,
      href: `/communities/${doc.uid}`,
    };
  });

  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen pb-12">
      {landing ? (() => {
        const landingData = landing.data as any;
        return (
          <section className="w-full">
            <LandingPageHero 
              title={landingData.title}
              description={landingData.description}
              backgroundImage={landingData.image}
              button1Link={asLink(landingData.button_1_link)}
              button1Label={(landingData.button_1_link as any)?.text}
              button1Variant={(landingData.button_1_link as any)?.variant}
              button2Link={asLink(landingData.button_2_link)}
              button2Label={(landingData.button_2_link as any)?.text}
              button2Variant={(landingData.button_2_link as any)?.variant}
              breadcrumbHomeLabel="Главная"
              breadcrumbHomeLink="/"
              breadcrumbCurrent="Общины"
            />
            {/* @ts-ignore - Slices type might not be synced yet */}
            {landingData.slices && <SliceZone slices={landingData.slices} components={components} />}
          </section>
        );
      })() : (
        <section className="py-12 border-b border-zinc-200 dark:border-zinc-800">
          <Container className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Общины</h1>
            <p className="text-zinc-600 dark:text-zinc-400">Наши общины и домашние группы</p>
          </Container>
        </section>
      )}

      <section className="py-12">
        <Container className="space-y-6">
          <SectionHeader title="Все общины" size="sm" as="div" className="text-left" descriptionClassName="text-left" />

          {cards.length === 0 ?
            <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-6 py-12 text-center text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400">
              <p className="font-semibold text-zinc-800 dark:text-zinc-100">Пока нет добавленных общин</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Создайте новую общину в Prismic, чтобы она появилась здесь.</p>
            </div>
          : <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {cards.map((comm) => (
                <CommunityCard key={comm.id} community={comm} />
              ))}
            </div>
          }
        </Container>
      </section>
    </div>
  );
}
