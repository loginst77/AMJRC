import { FC } from "react";
import { Content, asDate, asText, type RichTextField, type LinkField } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { createClient } from "@/prismicio";
import { BookCarouselClient } from "@/components/book-carousel";
import { type MediaItem } from "@/lib/media-data";

/**
 * Props for `BookCarousel`.
 */
export type BookCarouselProps = SliceComponentProps<Content.BookCarouselSlice>;

/**
 * Component for "BookCarousel" Slices.
 */
const BookCarousel: FC<BookCarouselProps> = async ({ slice }) => {
  const client = createClient();
  const response = await client
    .getByType<Content.BookDocument>("book", {
      orderings: [{ field: "document.first_publication_date", direction: "desc" }],
      fetchLinks: ["tag.name"],
      pageSize: 6,
    })
    .catch(() => null);

  const books = response?.results ?? [];

  const items: MediaItem[] = books.map((book) => {
    const rawTitle = (book.data as { title?: RichTextField | string | null }).title;
    const title = Array.isArray(rawTitle) ? asText(rawTitle as RichTextField) : rawTitle || "Книга";

    const description = ((book.data as any).description as string) || "";

    const imageSrc = (book.data as any).image?.url as string | undefined;

    const buyLink = (book.data as any).buy_link as LinkField | undefined;
    const href = buyLink && "url" in buyLink ? buyLink.url : undefined;

    const date = (book.data as any).date_of_release as number | undefined;
    const author = (book.data as any).author as string | undefined;

    const tagsGroup = (book.data as { tags?: { tag?: unknown }[] }).tags ?? [];
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
      id: book.id,
      title,
      description,
      href,
      date,
      author,
      imageSrc,
      tags,
    };
  });

  if (!items.length) return null;

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={slice.primary?.background ? "bg-white dark:bg-zinc-950" : "bg-zinc-50 dark:bg-black"}>
      <Container className="py-14 sm:py-20">
        {/* Section header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white">{slice.primary?.title || "Книги"}</h2>
            {slice.primary?.description && <p className="max-w-xl text-zinc-600 dark:text-zinc-400">{slice.primary.description}</p>}
          </div>
          <ButtonLink href="/media/books" variant="primary" size="md" className="hidden sm:inline-flex">
            Все книги →
          </ButtonLink>
        </div>

        <div className="mt-8">
          <BookCarouselClient books={items} allHref="/media/books" allLabel="Все книги →" />
        </div>
      </Container>
    </section>
  );
};

export default BookCarousel;
