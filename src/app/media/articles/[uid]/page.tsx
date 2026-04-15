import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, Clock } from "lucide-react";
import { asDate, asText } from "@prismicio/client";
import { PrismicRichText } from "@/components/PrismicRichText";

import { Container } from "@/components/ui/container";
import { createClient } from "@/prismicio";

type Params = { uid: string };

function readingTime(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 180));
}

function getUidCandidates(uid: string) {
  const candidates = new Set<string>([uid]);

  try {
    candidates.add(decodeURIComponent(uid));
  } catch {
    // UID is already decoded or malformed; keep original value.
  }

  return [...candidates].map((value) => value.trim()).filter(Boolean);
}

async function getArticleByUid(
  client: ReturnType<typeof createClient>,
  uid: string,
  options: Parameters<ReturnType<typeof createClient>["getByUID"]>[2] = {},
) {
  const queryVariants = [options, { ...options, lang: "*" }];

  for (const candidate of getUidCandidates(uid)) {
    for (const query of queryVariants) {
      const article = await client.getByUID("article", candidate, query).catch(() => null);
      if (article) return article;
    }
  }

  return null;
}

export async function generateStaticParams() {
  const client = createClient();
  const articles = await client.getAllByType("article");
  return articles.map((doc) => ({ uid: doc.uid! }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { uid } = await params;
  const client = createClient();
  const article = await getArticleByUid(client, uid);
  if (!article) return { title: "Статья не найдена" };

  const title = asText(article.data.title) || "Статья";
  const description = (article.data as { description?: string }).description || article.data.meta_description || "";
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: article.data.meta_image?.url ? [article.data.meta_image.url] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const { uid } = await params;
  const client = createClient();
  const article = await getArticleByUid(client, uid, { fetchLinks: ["tag.name"] });
  if (!article) notFound();

  const all = await client.getAllByType("article", {
    orderings: [{ field: "my.article.date", direction: "desc" }],
  });
  const idx = all.findIndex((doc) => doc.id === article.id);
  const prev = all[idx + 1];
  const next = all[idx - 1];

  const title = asText(article.data.title) || "Статья";
  const description = (article.data as { description?: string }).description || article.data.meta_description || "";
  const author = (article.data as { author?: string }).author;
  const plainContent = asText((article.data as { content?: any }).content) || asText(article.data.slices ?? []) || `${title} ${description}`;
  const mins = readingTime(plainContent);
  const date = asDate(article.data.date ?? article.first_publication_date);
  const tagsGroup = (article.data as { tags?: { tag?: unknown }[] }).tags ?? [];
  const tags = tagsGroup
    .map((item) => {
      const rel = item?.tag as Record<string, unknown> | null | undefined;
      if (!rel || typeof rel !== "object") return null;
      if (rel.link_type !== "Document" || !rel.id) return null;
      const slug = String(rel.uid || rel.id);
      const linkedName = (rel.data as { name?: string } | undefined)?.name;
      const name = linkedName || slug;
      return { slug, name };
    })
    .filter(Boolean) as { slug: string; name: string }[];

  return (
    <div className="flex flex-col">
      <section className="border-b border-zinc-200 bg-white py-4">
        <Container>
          <div className="flex items-center justify-between gap-3">
            <nav className="text-sm text-zinc-500">
              <Link href="/" className="transition-colors hover:text-zinc-900">
                Главная
              </Link>
              <span className="mx-2 opacity-40">/</span>
              <Link href="/media/articles" className="transition-colors hover:text-zinc-900">
                Статьи
              </Link>
              <span className="mx-2 opacity-40">/</span>
              <span className="inline-block max-w-xs align-bottom text-zinc-900 line-clamp-1">{title}</span>
            </nav>
            <Link
              href="/media/articles"
              className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Все статьи
            </Link>
          </div>
        </Container>
      </section>

      <section className="bg-white">
        <Container className="py-12 sm:py-12">
          <div className="mx-auto max-w-3xl space-y-8">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-4 py-2 text-base font-medium text-black ring-1 ring-white/20">
                  <BookOpen className="h-4 w-4" />
                  Статья
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm text-zinc-800">
                  <Clock className="h-3.5 w-3.5" />
                  {mins} мин чтения
                </span>
                {date ? <span className="text-sm text-zinc-800">{date.toLocaleDateString("ru-RU")}</span> : null}
              </div>
            </div>
            <div className="space-y-4 border-b border-zinc-200 pb-6">
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-5xl">{title}</h1>
              {description ? <p className="max-w-2xl text-lg leading-8 text-zinc-800">{description}</p> : null}
              {author ? (
                <p className="text-base font-medium text-zinc-700">
                  Автор: <span className="text-zinc-800 font-bold p-1">{author}</span>
                </p>
              ) : null}
              {tags.length ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {tags.map((tag) => (
                    <Link
                      key={tag.slug}
                      href={`/media/articles?tag=${encodeURIComponent(tag.slug)}`}
                      className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-200 transition-colors duration-200"
                    >
                      {tag.name}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
            <article className="prose prose-zinc max-w-none prose-headings:mt-0 prose-headings:mb-0 prose-p:my-0 prose-p:leading-8 prose-strong:font-semibold">
              <PrismicRichText field={article.data.content} />
            </article>

            <div className="mt-12 grid grid-cols-2 overflow-hidden rounded-2xl border border-zinc-200">
              {prev ? (
                <Link
                  href={`/media/articles/${prev.uid}`}
                  className={`group flex flex-col gap-3 p-4 transition-all duration-200 hover:bg-blue-50 sm:gap-1 ${
                    !next ? "col-span-2" : ""
                  }`}
                >
                  <span className="flex items-center gap-1 text-sm text-zinc-400 sm:ml-1">
                    <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
                    Предыдущая
                  </span>
                  <span className="line-clamp-2 text-sm font-semibold text-zinc-700 transition-colors group-hover:text-blue-600">
                    {asText(prev.data.title) || "Статья"}
                  </span>
                </Link>
              ) : null}
              {next ? (
                <Link
                  href={`/media/articles/${next.uid}`}
                  className={`group flex flex-col gap-3 p-4 transition-all duration-200 hover:bg-blue-50 sm:items-end sm:gap-1 sm:text-left ${
                    prev ? "border-l border-zinc-200" : "col-span-2"
                  }`}
                >
                  <span className="flex items-center gap-1 text-sm text-zinc-400 sm:mr-1 sm:justify-end">
                    Следующая
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                  <span className="line-clamp-2 text-sm font-semibold text-zinc-700 transition-colors group-hover:text-blue-600">
                    {asText(next.data.title) || "Статья"}
                  </span>
                </Link>
              ) : null}
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
