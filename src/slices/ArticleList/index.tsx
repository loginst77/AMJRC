import { FC } from "react";
import { Content, asDate, asText, type RichTextField } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { createClient } from "@/prismicio";
import { ArticleCard, type MediaItem } from "@/components/media-components/article-card";

/**
 * Props for `ArticleList`.
 */
export type ArticleListProps = SliceComponentProps<Content.ArticleListSlice>;

/**
 * Component for "ArticleList" Slices.
 */
const ArticleList: FC<ArticleListProps> = async ({ slice }) => {
  const client = createClient();
  const response = await client
    .getByType<Content.ArticleDocument>("article", {
      orderings: [
        { field: "my.article.date", direction: "desc" },
        { field: "document.first_publication_date", direction: "desc" },
      ],
      fetchLinks: ["tag.name"],
      pageSize: 6,
    })
    .catch(() => null);

  const articles = response?.results ?? [];

  const items: MediaItem[] = articles.map((article) => {
    const rawTitle = (article.data as { title?: RichTextField | string | null }).title;
    const title = Array.isArray(rawTitle) ? asText(rawTitle as RichTextField) : rawTitle || "Статья";

    const description = ((article.data as any).description as string) || "";

    const dateRaw =
      asDate((article.data as any).date) ?? (article.first_publication_date ? new Date(article.first_publication_date) : null);
    const date = dateRaw ? dateRaw.toISOString() : undefined;

    const author = (article.data as any).author as string | undefined;

    const tagsGroup = (article.data as { tags?: { tag?: unknown }[] }).tags ?? [];
    const tags = tagsGroup
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
      .filter(Boolean) as { id: string; slug: string; name: string }[];

    return {
      id: article.id,
      title,
      description,
      href: `articles/${article.uid || article.id}`,
      date,
      author: author || undefined,
      tags,
    };
  });

  if (!items.length) return null;

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={slice.primary?.background ? "bg-white" : "bg-zinc-50"}>
      <Container className="py-14 sm:py-20">
        {/* Section header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-950">{slice.primary?.title || "Статьи"}</h2>
            {slice.primary?.description && <p className="max-w-xl text-zinc-600">{slice.primary.description}</p>}
          </div>
          <ButtonLink href="/media/articles" variant="primary" size="md" className="hidden sm:inline-flex">
            Все статьи →
          </ButtonLink>
        </div>

        {/* 3×2 grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

        <div className="mt-6 sm:hidden">
          <ButtonLink href="/media/articles" variant="primary" size="md" className="w-full">
            Все статьи →
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
};

export default ArticleList;
