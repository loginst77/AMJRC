import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Users } from "lucide-react";
import { asText, asLink } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";
import { PrismicRichText } from "@/components/PrismicRichText";
import { LandingPageHero } from "@/components/LandingPageHero";
import { PrismicNextLink, PrismicNextImage } from "@prismicio/next";

import { Container } from "@/components/ui/container";
import { components } from "@/slices";
import { createClient } from "@/prismicio";

type Params = { uid: string };

export async function generateStaticParams() {
  const client = createClient();
  const communities = await client.getAllByType("community" as any).catch(() => []);
  return communities.map((doc: any) => ({ uid: doc.uid! }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { uid } = await params;
  const client = createClient();
  const community = await client.getByUID("community" as any, uid).catch(() => null);
  if (!community) return { title: "Община не найдена" };
  const doc = community as any;

  const title = asText(doc.data?.title) || "Община";
  const description = doc.data?.description || doc.data?.meta_description || "";
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: doc.data?.meta_image?.url ? [doc.data.meta_image.url] : undefined,
    },
  };
}

export default async function CommunityPage({ params }: { params: Promise<Params> }) {
  const { uid } = await params;
  const client = createClient();
  const community = await client.getByUID("community" as any, uid).catch(() => null);
  if (!community) notFound();

  const doc = community as any;

  const title = asText(doc.data?.title) || "Община";
  const description = doc.data?.description || doc.data?.meta_description || "";

  return (
    <div className="flex flex-col min-h-screen pb-12 bg-white dark:bg-zinc-950">
      <LandingPageHero
        title={doc.data?.title}
        description={doc.data?.description}
        backgroundImage={doc.data?.image}
        button1Link={asLink(doc.data?.button_1_link)}
        button1Label={doc.data?.button_1_link?.text}
        button1Variant={doc.data?.button_1_link?.variant}
        button2Link={asLink(doc.data?.button_2_link)}
        button2Label={doc.data?.button_2_link?.text}
        button2Variant={doc.data?.button_2_link?.variant}
        breadcrumbHomeLabel="Главная"
        breadcrumbHomeLink="/"
        breadcrumbCurrent={title}
        community={{
          leader: doc.data?.location,
          serviceTime: doc.data?.service_time,
          address: doc.data?.address,
        }}
      />

      <section className="bg-white !bg-red-200">
        <Container>
          <div className="mx-auto max-w-3xl space-y-8">
            <article className="prose prose-zinc prose-lg max-w-none dark:prose-invert prose-headings:mt-8 prose-headings:mb-4 prose-p:my-4 prose-p:leading-8 prose-strong:font-semibold">
              <PrismicRichText field={doc.data?.content} />
            </article>
          </div>
        </Container>
      </section>

      <SliceZone slices={doc.data.slices} components={components} />
    </div>
  );
}
