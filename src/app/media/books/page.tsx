import type { Metadata } from "next";
import { asText, isFilled, type Content, type RichTextField } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/SectionHeader";
import { TagFilterBar } from "@/components/tag-filter-bar";
import { type MediaItem, type MediaTag } from "@/lib/media-data";
import { BookCard } from "../../../components/book-card";
import { FeaturedBook } from "./featured-book";
import { createClient } from "@/prismicio";
import { components } from "@/slices";

export const metadata: Metadata = {
  title: "Книги",
  description: "Рекомендованные книги и литература для изучения.",
};

export default async function BooksPage({ searchParams }: { searchParams?: Promise<{ tag?: string | string[] }> }) {
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
  const [landing, bookDocs] = await Promise.all([
    client.getSingle("booklandingpage").catch(() => null),
    client.getAllByType<Content.BookDocument>("book", {
      orderings: [
        { field: "my.book.date_of_release", direction: "desc" },
        { field: "document.first_publication_date", direction: "desc" },
      ],
      fetchLinks: ["tag.name"],
    }),
  ]);

  const books: MediaItem[] = bookDocs.map((book) => {
    const rawTitle = (book.data as { title?: RichTextField | string | null }).title;
    const title = Array.isArray(rawTitle) ? asText(rawTitle) : rawTitle || "Без названия";
    const description = (book.data as { description?: string }).description || "";
    const author = (book.data as { author?: string }).author || undefined;
    const releaseYear = (book.data as { date_of_release?: number | null }).date_of_release ?? null;
    const imageSrc = isFilled.image(book.data.image) ? book.data.image.url : undefined;
    const buyLink = (book.data as { buy_link?: { url?: string | null } }).buy_link?.url ?? null;
    const tagsGroup = (book.data as { tags?: { tag?: unknown }[] }).tags ?? [];
    const tags: MediaTag[] = tagsGroup
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
      .filter(Boolean) as MediaTag[];

    return {
      id: book.id,
      title,
      description,
      author,
      imageSrc,
      tags,
      featured: (book.data as { featured?: boolean }).featured ?? false,
      date: releaseYear,
      href: buyLink || book.url || "#",
    };
  });

  const featured = books.find((book) => book.featured);
  const regularBooks = books.filter((book) => !book.featured);
  const tagStats = new Map<string, { tag: MediaTag; count: number }>();
  regularBooks.forEach((book) => {
    book.tags?.forEach((tag) => {
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
  const visibleBooks = activeTagKey
    ? regularBooks.filter((book) => book.tags?.some((tag) => tag.slug.toLowerCase() === activeTagKey))
    : regularBooks;
  const listHeading = matchedTag?.name ? `Книги · ${matchedTag.name}` : "Все книги";

  return (
    <div className="flex flex-col bg-white dark:bg-zinc-950">
      {landing ? (
        <section className="w-full">
          <SliceZone slices={landing.data.slices} components={components} />
        </section>
      ) : null}

      {featured ? <FeaturedBook book={featured} /> : null}

      <section className="bg-zinc-50 py-12 dark:bg-black">
        <Container className="space-y-8">
          <SectionHeader
            title="Все книги"
            description="Подборка литературы для духовного роста и глубокого изучения."
            size="sm"
            as="div"
            className="text-center"
            descriptionClassName="text-center"
          />

          {books.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-200 bg-white px-6 py-10 text-center text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
              <p className="font-semibold text-zinc-800 dark:text-zinc-100">Скоро здесь появятся книги.</p>
            </div>
          ) : null}

          {books.length > 0 && regularBooks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-200 bg-white px-6 py-10 text-center text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
              <p className="font-semibold text-zinc-800 dark:text-zinc-100">Скоро здесь появится больше книг.</p>
            </div>
          ) : null}

          {regularBooks.length > 0 ? (
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">{listHeading}</p>

              <TagFilterBar
                allCount={regularBooks.length}
                anchorId="book-list"
                allHref="/media/books"
                tags={tagFilters.map(({ tag, count }) => ({
                  slug: tag.slug,
                  name: tag.name,
                  count,
                  href: `/media/books?tag=${encodeURIComponent(tag.slug)}`,
                  active: activeTagKey === tag.slug.toLowerCase(),
                }))}
              />

              <div id="book-list" className="scroll-mt-24">
                {visibleBooks.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-zinc-200 bg-white px-6 py-10 text-center text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
                    <p className="font-semibold text-zinc-800 dark:text-zinc-100">Нет книг для выбранного тега</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Добавьте книги с этим тегом в Prismic, и они появятся здесь.</p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {visibleBooks.map((book) => (
                      <BookCard key={book.id} book={book} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </Container>
      </section>
    </div>
  );
}
