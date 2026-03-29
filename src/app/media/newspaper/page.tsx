import type { Metadata } from "next";
import Link from "next/link";
import { asDate, asText, type Content } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";

import { FeaturedNewspaperCard } from "@/components/featured-newspaper-card";
import { NewspaperCard } from "@/components/newspaper-card";
import { SectionHeader } from "@/components/SectionHeader";
import { Container } from "@/components/ui/container";
import { createClient } from "@/prismicio";
import { components } from "@/slices";

type IssueTag = { id: string; slug: string; name: string };
type IssueCard = {
  id: string;
  title: string;
  description?: string;
  pdfUrl?: string;
  author?: string;
  date?: Date | null;
  featured: boolean;
  tags: IssueTag[];
};

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const page = await client.getSingle("newspaperlandingpage").catch(() => null);

  const titleField = page?.data ? (page.data as any).meta_title : null;
  const descField = page?.data ? (page.data as any).meta_description : null;

  const title = typeof titleField === "string" ? titleField || "Газета" : page ? asText(titleField) || "Газета" : "Газета";
  const description =
    typeof descField === "string"
      ? descField || "Архив выпусков газеты."
      : page
        ? asText(descField) || "Архив выпусков газеты."
        : "Архив выпусков газеты.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: page?.data?.meta_image?.url ? [page.data.meta_image.url] : undefined,
    },
  };
}

export default async function NewspaperPage() {
  const client = createClient();
  const [landing, issues] = await Promise.all([
    client.getSingle("newspaperlandingpage").catch(() => null),
    client.getAllByType<Content.NewspaperDocument>("newspaper", {
      orderings: [{ field: "document.first_publication_date", direction: "desc" }],
      fetchLinks: ["tag.name"],
    }),
  ]);

  const cards: IssueCard[] = issues.map((issue) => {
    const title = asText((issue.data as { title?: any }).title) || "Выпуск газеты";
    const description = (issue.data as { description?: string }).description || "";
    const pdfField = (issue.data as { pdf?: { url?: string } }).pdf;
    const pdfUrl = pdfField?.url;
    const author = (issue.data as { author?: string }).author || undefined;
    const featured = Boolean((issue.data as { featured?: boolean }).featured);
    const tagsGroup = (issue.data as { tags?: { tag?: unknown }[] }).tags ?? [];
    const tags: IssueTag[] = tagsGroup
      .map((item) => {
        const rel = item?.tag as Record<string, unknown> | null | undefined;
        if (!rel || typeof rel !== "object") return null;
        if (rel.link_type !== "Document" || !rel.id) return null;
        const id = String(rel.id);
        const slug = String(rel.uid || id);
        const linkedName = (rel.data as { name?: string } | undefined)?.name;
        const name = linkedName || slug;
        return { id, slug, name };
      })
      .filter(Boolean) as IssueTag[];
    const date = asDate(issue.first_publication_date);

    return { id: issue.id, title, description, pdfUrl, author, date, featured, tags };
  });

  const landingTitle =
    landing && (asText((landing.data as { title?: any }).title) || (landing.data as any)?.meta_title)
      ? asText((landing.data as { title?: any }).title) || (landing.data as any)?.meta_title
      : "Газета";
  const landingDescription =
    (landing?.data as { description?: string })?.description || (landing?.data as any)?.meta_description || "Архив выпусков газеты.";
  const featuredIssue = cards.find((card) => card.featured) ?? null;
  const restCards = featuredIssue ? cards.filter((card) => card.id !== featuredIssue.id) : cards;

  return (
    <div className="flex flex-col bg-white dark:bg-zinc-950">
      {landing ? (
        <section className="w-full">
          <SliceZone slices={landing.data.slices} components={components} />
        </section>
      ) : (
        <section className="relative min-h-[360px] overflow-hidden py-14 sm:py-24">
          <img src="/church1.jpg" alt="Газета" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
          <Container className="relative z-10">
            <div className="max-w-2xl space-y-4">
              <nav className="text-sm text-zinc-300">
                <Link href="/" className="transition-colors hover:text-white">
                  Главная
                </Link>
                <span className="mx-2">/</span>
                <Link href="/media" className="transition-colors hover:text-white">
                  Медия
                </Link>
                <span className="mx-2">/</span>
                <span className="text-white">Газета</span>
              </nav>
              <div className="border-l-4 border-white pl-4">
                <h1 className="text-5xl font-semibold tracking-tight text-white">{landingTitle}</h1>
              </div>
              <p className="text-lg leading-8 text-zinc-200">{landingDescription}</p>
            </div>
          </Container>
        </section>
      )}

      {featuredIssue ? <FeaturedNewspaperCard issue={featuredIssue} /> : null}

      <section className="bg-zinc-50 py-12 dark:bg-black">
        <Container className="space-y-8">
          <SectionHeader
            title="Все выпуски"
            description="Архив PDF выпусков газеты."
            size="sm"
            as="div"
            className="text-center"
            descriptionClassName="text-center"
          />

          {restCards.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-200 bg-white px-6 py-10 text-center text-zinc-600  dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
              <p className="font-semibold text-zinc-800 dark:text-zinc-100">Скоро здесь появятся выпуски.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {restCards.map((issue) => (
                <div key={issue.id} className="flex h-full flex-col">
                  <NewspaperCard
                    issue={{
                      id: issue.id,
                      title: issue.title,
                      description: issue.description || "",
                      href: issue.pdfUrl || "#",
                      author: issue.author,
                      date: issue.date,
                      tags: issue.tags.map((tag) => tag.name),
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
