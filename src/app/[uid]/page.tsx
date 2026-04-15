import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SliceZone } from "@prismicio/react";
import { asLink, asText } from "@prismicio/client";

import { createClient } from "@/prismicio";
import { components } from "@/slices";
import { LandingPageHero } from "@/components/LandingPageHero";

type Params = { uid: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { uid } = await params;
  const client = createClient();
  const page = await client.getByUID("landingpage", uid).catch(() => notFound());

  return {
    title: page.data.meta_title ?? undefined,
    description: page.data.meta_description,
    openGraph: {
      title: page.data.meta_title ?? undefined,
      images: [{ url: page.data.meta_image.url ?? "" }],
    },
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { uid } = await params;
  const client = createClient();
  const page = await client.getByUID("landingpage", uid).catch(() => notFound());

  const pageData = page.data as any;

  return (
    <div className="bg-white min-h-screen">
      <section className="w-full">
        <LandingPageHero
          title={pageData.title}
          description={pageData.description}
          backgroundImage={pageData.image}
          button1Link={asLink(pageData.button_1_link)}
          button1Label={(pageData.button_1_link as any)?.text}
          button1Variant={(pageData.button_1_link as any)?.variant}
          button2Link={asLink(pageData.button_2_link)}
          button2Label={(pageData.button_2_link as any)?.text}
          button2Variant={(pageData.button_2_link as any)?.variant}
          breadcrumbHomeLabel="Главная"
          breadcrumbHomeLink="/"
          breadcrumbCurrent={asText(pageData.title) || "Страница"}
        />
      </section>
      <SliceZone slices={page.data.slices} components={components} />
    </div>
  );
}

export async function generateStaticParams() {
  const client = createClient();

  const pages = await client.getAllByType("landingpage");

  return pages.map((page) => {
    return { uid: page.uid };
  });
}
