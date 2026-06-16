import type { Metadata } from "next";
import { SliceZone } from "@prismicio/react";
import { asText, asLink } from "@prismicio/client";
import { LandingPageHero } from "@/components/LandingPageHero";
import { CommunityCard } from "@/components/community-card";
import { Container } from "@/components/ui/container";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import { SectionHeader } from "@/components/SectionHeader";

function toYouTubeEmbed(url?: string): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.slice(1);
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
      const paths = parsed.pathname.split("/");
      const embedIdx = paths.indexOf("embed");
      if (embedIdx >= 0 && paths[embedIdx + 1]) return `https://www.youtube.com/embed/${paths[embedIdx + 1]}`;
    }
    return null;
  } catch {
    return null;
  }
}

function youtubeThumbnail(url?: string): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
      const parts = parsed.pathname.split("/");
      const embedIdx = parts.indexOf("embed");
      if (embedIdx >= 0 && parts[embedIdx + 1]) return `https://img.youtube.com/vi/${parts[embedIdx + 1]}/hqdefault.jpg`;
    }
    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.slice(1);
      if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
    }
  } catch {
    return null;
  }
  return null;
}

export const metadata: Metadata = {
  title: "Общины",
  description: "Все общины и домашние группы",
};

export default async function CommunitiesPage() {
  const client = createClient();
  const [landing, communities] = await Promise.all([
    client.getSingle("communitylandingpage" as any).catch(() => null),
    client
      .getAllByType("community" as any, {
        orderings: [{ field: "document.first_publication_date", direction: "desc" }],
      })
      .catch(() => []), // fallback to empty array if type missing
  ]);

  const cards = communities.map((comm) => {
    // Cast to any to safely extract properties before types are generated
    const doc = comm as any;
    const name = asText(doc.data?.title) || doc.data?.meta_title || "Без названия";
    const address: string = (doc.data?.address as string) || "";
    const leader: string | undefined = doc.data?.leader || undefined;
    const serviceTime: string | undefined = doc.data?.service_time || undefined;
    const videoUrl = doc.data?.youtube_url?.embed_url || doc.data?.youtube_url?.url;
    const embedUrl = toYouTubeEmbed(videoUrl) ?? undefined;
    const imageSrc: string | undefined =
      embedUrl ? youtubeThumbnail(videoUrl) || undefined
      : doc.data?.image?.url || undefined;
    const imageAlt: string | undefined = doc.data?.image?.alt || name;

    return {
      id: doc.uid as string,
      name,
      address,
      leader,
      serviceTime,
      imageSrc,
      imageAlt,
      embedUrl,
      href: `/communities/${doc.uid}`,
    };
  });

  return (
    <div className="bg-white min-h-screen">
      {landing ?
        (() => {
          const landingData = landing.data as any;
          return (
            <section className="w-full">
              <LandingPageHero
                title={landingData.title}
                description={landingData.description}
                backgroundImage={landingData.image}
                button1Link={asLink(landingData.button_1_link)}
                button1Label={(landingData.button_1_link as any)?.text}
                button1Variant={(landingData.button_1_link as any)?.variant}
                button2Link={asLink(landingData.button_2_link)}
                button2Label={(landingData.button_2_link as any)?.text}
                button2Variant={(landingData.button_2_link as any)?.variant}
                breadcrumbHomeLabel="Главная"
                breadcrumbHomeLink="/"
                breadcrumbCurrent="Общины"
              />
            </section>
          );
        })()
      : <section className="py-12 border-b border-zinc-200 ">
          <Container className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Общины</h1>
            <p className="text-zinc-600">Наши общины и домашние группы</p>
          </Container>
        </section>
      }

      <section className="py-14">
        <Container className="space-y-6 pb-12">
          <SectionHeader title="Все общины" as="div" className="text-left" descriptionClassName="text-left" />

          {cards.length === 0 ?
            <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-6 py-12 text-center text-zinc-600 shadow-sm">
              <p className="font-semibold text-zinc-800">Пока нет добавленных общин</p>
              <p className="text-sm text-zinc-500 mt-1">Создайте новую общину в Prismic, чтобы она появилась здесь.</p>
            </div>
          : <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
              {cards.map((comm) => (
                <CommunityCard
                  key={comm.id}
                  name={comm.name}
                  address={comm.address}
                  leader={comm.leader}
                  serviceTime={comm.serviceTime}
                  imageSrc={comm.imageSrc}
                  imageAlt={comm.imageAlt}
                  embedUrl={comm.embedUrl}
                  href={comm.href}
                />
              ))}
            </div>
          }
        </Container>
      </section>

      {/* @ts-ignore - Slices type might not be synced yet */}
      {landing && (landing.data as any).slices && <SliceZone slices={(landing.data as any).slices} components={components} />}
    </div>
  );
}
