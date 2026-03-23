import type { Metadata } from "next";
import Link from "next/link";
import { asDate, asText } from "@prismicio/client";
import type { Content } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";

import { Container } from "@/components/ui/container";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import { ArticleCard, type MediaItem } from "@/components/article-card";
import { FeaturedArticle } from "@/components/featured-article";

export const metadata: Metadata = {
  title: "Статьи",
  description: "Все статьи",
};

function readingTime(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 180));
}

export default async function ArticlesPage() {
  const client = createClient();
  const landing = await client.getSingle("articlelandingpage").catch(() => null);
  const articles = await client.getAllByType<Content.ArticleDocument>("article", {
    orderings: [
      { field: "my.article.date", direction: "desc" },
      { field: "document.first_publication_date", direction: "desc" },
    ],
  });

  const cards: MediaItem[] = articles.map((article) => {
    const title = asText(article.data.title) || article.data.meta_title || "Без названия";
    const contentText = asText((article.data as { content?: any }).content) || "";
    const candidates = [(article.data as { description?: string }).description, article.data.meta_description, contentText]
      .map((v) => (v || "").trim())
      .filter((v) => v && v.toLowerCase() !== "short description");

    const description = candidates[0] || "";

    return {
      id: article.id,
      title,
      description,
      author: (article.data as { author?: string }).author,
      date: article.data.date ?? article.first_publication_date ?? null,
      featured: (article.data as { featured?: boolean }).featured ?? false,
      href: `articles/${article.uid}`,
    };
  });

  const featured = cards.filter((c) => c.featured);
  const rest = cards.filter((c) => !c.featured);
  const articlesHeading = cards.length === 1 ? "Статья" : "Статьи";

  return (
    <div className="bg-white dark:bg-zinc-950">
      {landing ? (
        <section className="w-full">
          <SliceZone slices={landing.data.slices} components={components} />
        </section>
      ) : (
        <section className="py-12">
          <Container className="space-y-2">
            <p className="text-sm uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Медия</p>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Статьи</h1>
            <p className="text-zinc-600 dark:text-zinc-400">Новые публикации и материалы</p>
          </Container>
        </section>
      )}

      {featured.length > 0 ? (
        <div className="flex flex-col gap-2 pb-10 sm:gap-8 sm:pb-12">
          {featured.map((article, index) => (
            <FeaturedArticle key={article.id} article={article} showPinnedLabel={index === 0} featuredCount={featured.length} />
          ))}
        </div>
      ) : null}

      <section className="py-12 bg-zinc-50 dark:bg-zinc-900/50">
        <Container className="space-y-8">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Все статьи</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
