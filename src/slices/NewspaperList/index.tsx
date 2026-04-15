import { FC } from "react";
import { Content, asDate, asText, type RichTextField, type LinkField } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { createClient } from "@/prismicio";
import { NewspaperCard } from "@/components/media-components/newspaper-card";
import { type MediaItem } from "@/lib/media-data";

/**
 * Props for `NewspaperList`.
 */
export type NewspaperListProps = SliceComponentProps<Content.NewspaperListSlice>;

/**
 * Component for "NewspaperList" Slices.
 */
const NewspaperList: FC<NewspaperListProps> = async ({ slice }) => {
  const client = createClient();
  const response = await client
    .getByType<Content.NewspaperDocument>("newspaper", {
      orderings: [{ field: "document.first_publication_date", direction: "desc" }],
      fetchLinks: ["tag.name"],
      pageSize: 6,
    })
    .catch(() => null);

  const newspapers = response?.results ?? [];

  const items: MediaItem[] = newspapers.map((newspaper) => {
    const rawTitle = (newspaper.data as { title?: RichTextField | string | null }).title;
    const title = Array.isArray(rawTitle) ? asText(rawTitle as RichTextField) : rawTitle || "Газета";

    const description = ((newspaper.data as any).description as string) || "";

    const pdfLink = (newspaper.data as any).pdf as LinkField | undefined;
    const href = pdfLink && "url" in pdfLink ? pdfLink.url : undefined;

    const dateRaw = newspaper.first_publication_date ? new Date(newspaper.first_publication_date) : null;
    const date = dateRaw ? dateRaw.toISOString() : undefined;

    const author = (newspaper.data as any).author as string | undefined;

    const tagsGroup = (newspaper.data as { tags?: { tag?: unknown }[] }).tags ?? [];
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
      id: newspaper.id,
      title,
      description,
      href: href || "#",
      date,
      author,
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
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-950">{slice.primary?.title || "Газеты"}</h2>
            {slice.primary?.description && <p className="max-w-xl text-zinc-600">{slice.primary.description}</p>}
          </div>
          <ButtonLink href="/media/newspaper" variant="primary" size="md" className="hidden sm:inline-flex">
            Все газеты →
          </ButtonLink>
        </div>

        {/* 3×2 grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((newspaper) => (
            <NewspaperCard key={newspaper.id} issue={newspaper} />
          ))}
        </div>

        <div className="mt-6 sm:hidden">
          <ButtonLink href="/media/newspaper" variant="primary" size="md" className="w-full">
            Все газеты →
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
};

export default NewspaperList;
