import type { Metadata } from "next";
import Link from "next/link";
import { SliceZone } from "@prismicio/react";
import { asDate, asText, type Content } from "@prismicio/client";
import { X } from "lucide-react";
import { ArticleCard, type ArticleTag, type MediaItem } from "@/components/article-card";
import { ArticleTagChip, ArticleTagChipGroup } from "@/components/article-tag-chip";
import { FeaturedArticle } from "@/components/featured-article";
import { Container } from "@/components/ui/container";
import { createClient } from "@/prismicio";
import { components } from "@/slices";

export const metadata: Metadata = {
  title: "Статьи",
  description: "Все статьи",
};

export default async function ArticlesPage({ searchParams }: { searchParams?: Promise<{ tag?: string | string[] }> }) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const rawTagParam = resolvedSearchParams?.tag;
  const selectedTag =
    Array.isArray(rawTagParam) && rawTagParam.length > 0
      ? decodeURIComponent(rawTagParam[0]!)
      : typeof rawTagParam === "string"
        ? decodeURIComponent(rawTagParam)
        : undefined;
  const selectedTagKey = selectedTag?.toLowerCase();

  const client = createClient();
  const [landing, articles] = await Promise.all([
    client.getSingle("articlelandingpage").catch(() => null),
    client.getAllByType<Content.ArticleDocument>("article", {
      orderings: [
        { field: "my.article.date", direction: "desc" },
        { field: "document.first_publication_date", direction: "desc" },
      ],
      fetchLinks: ["tag.name"],
    }),
  ]);

  const cards: MediaItem[] = articles.map((article) => {
    const title = asText(article.data.title) || article.data.meta_title || "Без названия";
    const contentText = asText((article.data as { content?: any }).content) || "";
    const candidates = [(article.data as { description?: string }).description, article.data.meta_description, contentText]
      .map((v) => (v || "").trim())
      .filter((v) => v && v.toLowerCase() !== "short description");

    const description = candidates[0] || "";

    const tagsGroup = (article.data as { tags?: { tag?: unknown }[] }).tags ?? [];
    const articleTags: ArticleTag[] = tagsGroup
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
      .filter(Boolean) as ArticleTag[];

    const date = asDate(article.data.date ?? article.first_publication_date);

    return {
      id: article.id,
      title,
      description,
      author: (article.data as { author?: string }).author,
      date: date ?? article.first_publication_date ?? null,
      featured: (article.data as { featured?: boolean }).featured ?? false,
      href: `articles/${article.uid}`,
      tags: articleTags,
    };
  });

  const regularCards = cards.filter((c) => !c.featured);
  const tagStats = new Map<string, { tag: ArticleTag; count: number }>();
  regularCards.forEach((card) => {
    card.tags?.forEach((tag) => {
      const current = tagStats.get(tag.slug);
      if (current) {
        current.count += 1;
      } else {
        tagStats.set(tag.slug, { tag, count: 1 });
      }
    });
  });

  const tagFilters = Array.from(tagStats.values()).sort((a, b) => a.tag.name.localeCompare(b.tag.name, "ru"));
  const matchedTag = selectedTagKey ? tagFilters.find((item) => item.tag.slug.toLowerCase() === selectedTagKey)?.tag : undefined;
  const activeTagKey = matchedTag?.slug.toLowerCase();

  const matchesTag = (item: MediaItem) => !activeTagKey || item.tags?.some((tag) => tag.slug.toLowerCase() === activeTagKey);
  const featured = cards.filter((c) => c.featured);
  const rest = regularCards.filter((c) => matchesTag(c));
  const totalVisible = rest.length;

  const activeTagLabel = matchedTag?.name;
  const listHeading = activeTagLabel ? `Статьи · ${activeTagLabel}` : "Все статьи";

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
        <Container className="space-y-6 sm:space-y-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">{listHeading}</p>

          <ArticleTagChipGroup>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <p className="font-semibold text-zinc-700 dark:text-zinc-200">Категории:</p>
                <div className="inline-flex w-fit flex-wrap items-center gap-1 rounded-full bg-zinc-100 p-1 text-zinc-500 dark:bg-zinc-900/70 dark:text-zinc-400">
                  <ArticleTagChip href="/media/articles" label={`Все (${regularCards.length})`} active={!activeTagKey} />
                  {tagFilters.map(({ tag, count }) => (
                    <ArticleTagChip
                      key={tag.slug}
                      href={`/media/articles?tag=${encodeURIComponent(tag.slug)}`}
                      label={`${tag.name} (${count})`}
                      active={activeTagKey === tag.slug.toLowerCase()}
                    />
                  ))}
                </div>
              </div>

              <div className="flex min-h-9 min-w-[152px] items-center justify-end">
                {activeTagKey ? (
                  <Link
                    href="/media/articles"
                    scroll={false}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700 hover:bg-zinc-200/70 bg-zinc-100 rounded-full px-4 py-3"
                  >
                    <X className="h-4 w-4" />
                    Сбросить фильтр
                  </Link>
                ) : null}
              </div>
            </div>
          </ArticleTagChipGroup>

          {totalVisible === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-200 bg-white px-6 py-10 text-center text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
              <p className="font-semibold text-zinc-800 dark:text-zinc-100">Нет статей для выбранного тега</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Создайте статью в Prismic и назначьте ей тег, чтобы она появилась здесь.
              </p>
            </div>
          ) : rest.length === 0 ? (
            <div className="rounded-xl border border-zinc-200 bg-white px-6 py-6 text-sm text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
              Пока нет несекреплённых статей для выбранного тега.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}

// TagChip is now provided by ArticleTagChip component
