import type { Metadata } from "next";
import { asDate, asText, isFilled, type Content, type RichTextField } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/SectionHeader";
import { type MediaItem, type MediaTag } from "@/lib/media-data";
import { BookCard } from "../../../components/book-card";
import { FeaturedBook } from "./featured-book";
import { createClient } from "@/prismicio";
import { components } from "@/slices";

export const metadata: Metadata = {
  title: "Книги",
  description: "Рекомендованные книги и литература для изучения.",
};

export default async function BooksPage() {
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
    const date = asDate((book.data as { date_of_release?: string | null }).date_of_release ?? book.first_publication_date);
    const imageSrc = isFilled.image(book.data.image) ? book.data.image.url : undefined;
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
      date: date ? date.toISOString() : (book.first_publication_date ?? null),
      href: book.url || "#",
    };
  });

  const featured = books[0];
  const recommended = books.slice(1, 4);
  const rest = books.slice(4);

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

          {books.length > 0 && recommended.length ? (
            <div className="space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Рекомендуем начать с этого</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {recommended.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            </div>
          ) : null}

          {books.length > 0 ? (
            <div className="space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Каталог книг</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {rest.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            </div>
          ) : null}
        </Container>
      </section>
    </div>
  );
}
