/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, PinIcon, XIcon } from "lucide-react";

import { Container } from "@/components/ui/container";
import { cn } from "@/lib/cn";
import { formatDate } from "@/lib/media-data";
import { cardHoverCn } from "@/lib/variants";
import type { VideoCardItem } from "../../../../components/media-components/video-card";

type FeaturedVideoProps = {
  videos: VideoCardItem[];
};

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
      const parts = parsed.pathname.split("/");
      const embedIdx = parts.indexOf("embed");
      if (embedIdx >= 0 && parts[embedIdx + 1]) return `https://www.youtube.com/embed/${parts[embedIdx + 1]}`;
    }
    return url;
  } catch {
    return null;
  }
}

export function FeaturedVideo({ videos }: FeaturedVideoProps) {
  if (!videos.length) return null;

  const [openUrl, setOpenUrl] = useState<string | null>(null);
  const [openTitle, setOpenTitle] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const original = document.body.style.overflow;
    if (openUrl) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [openUrl, mounted]);

  return (
    <section className="bg-white">
      <Container className="pb-14 sm:py-16">
        <p className="mb-6 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          <PinIcon className="h-5 w-5" /> Закрепленные видео
        </p>
        <div className="flex flex-col gap-12">
          {videos.map((video) => {
            const playable = useMemo(() => toYouTubeEmbed(video.embedUrl || video.href || undefined), [video.embedUrl, video.href]);
            const handleClick =
              video.onClick ??
              (() => {
                if (playable) {
                  setOpenUrl(playable);
                  setOpenTitle(video.title);
                }
              });
            return (
              <div key={video.id} className={cn("group grid items-center gap-6 sm:gap-6 lg:grid-cols-5 cursor-pointer", cardHoverCn)}>
                <button
                  type="button"
                  onClick={handleClick}
                  className="relative block aspect-video w-full overflow-hidden bg-zinc-100 text-left lg:col-span-3 cursor-pointer"
                  aria-label={`Смотреть видео: ${video.title}`}
                >
                  {video.imageSrc ? (
                    <img
                      src={video.imageSrc}
                      alt={video.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <svg className="h-12 w-12 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
                        />
                      </svg>
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 sm:h-20 sm:w-20">
                      <svg className="ml-1 h-8 w-8 text-zinc-950" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </button>

                <div className="lg:col-span-2 flex flex-col justify-center space-y-4 py-2 sm:py-4">
                  <button type="button" onClick={handleClick} className="block w-full text-left cursor-pointer">
                    <h3 className="text-2xl font-semibold tracking-tight text-zinc-950 transition-colors group-hover:text-blue-600 sm:text-3xl">
                      {video.title}
                    </h3>
                    <p className="mt-3 text-base leading-relaxed text-zinc-600 line-clamp-3 sm:text-lg">{video.description}</p>
                  </button>
                  <div className="flex items-center gap-4 pt-2 text-sm text-zinc-500">
                    {video.author && video.authorHref ? (
                      <Link
                        href={video.authorHref}
                        className="group/link flex items-center gap-1.5 font-medium text-zinc-700 transition-colors hover:text-zinc-950"
                      >
                        {video.author} <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                      </Link>
                    ) : (
                      <div className="flex items-center gap-1.5 font-medium">
                        {video.author} <ArrowRight className="h-4 w-4" />
                      </div>
                    )}
                    <span>{formatDate(video.date)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
      {mounted && openUrl
        ? createPortal(
            <div
              className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
              role="dialog"
              aria-modal="true"
              onClick={(e) => {
                if (e.currentTarget === e.target) setOpenUrl(null);
              }}
            >
              <div className="relative w-full max-w-5xl overflow-hidden rounded-2xl bg-black shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => setOpenUrl(null)}
                  className="absolute left-3 top-3 z-10 flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-bold text-zinc-900 hover:bg-zinc-200 cursor-pointer hover:text-zinc-900"
                >
                  <XIcon className="h-4 w-4" />
                  Закрыть
                </button>
                <div className="aspect-video w-full">
                  <iframe
                    src={openUrl}
                    title={openTitle}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="h-full w-full"
                  />
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </section>
  );
}
