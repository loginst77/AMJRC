/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { PinIcon, XIcon } from "lucide-react";

import { Container } from "@/components/ui/container";
import { cn } from "@/lib/cn";
import { formatDate } from "@/lib/media-data";
import { cardHoverCn } from "@/lib/variants";
import { authorColor } from "@/components/media-components/article-card";
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
            const color = authorColor(video.author);
            return (
              <div key={video.id} className={cn("group grid items-stretch gap-0 lg:grid-cols-7 cursor-pointer", cardHoverCn)}>
                <button
                  type="button"
                  onClick={handleClick}
                  className="relative block aspect-video w-full overflow-hidden bg-zinc-100 text-left lg:col-span-4 cursor-pointer"
                  aria-label={`Смотреть видео: ${video.title}`}>
                  {video.imageSrc ?
                    <img
                      src={video.imageSrc}
                      alt={video.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  : <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200">
                      <svg className="h-16 w-16 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.8}>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
                        />
                      </svg>
                    </div>
                  }
                  {/* Gradient overlay so play button pops on any image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-white/95 shadow-xl ring-4 ring-white/30 backdrop-blur-sm transition-all duration-300 opacity-90 group-hover:opacity-100 group-hover:scale-110">
                      <svg className="ml-1 h-7 w-7 sm:h-9 sm:w-9 text-zinc-950" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </button>

                <div className="lg:col-span-3 flex flex-col py-6">
                  <button type="button" onClick={handleClick} className="block w-full text-left cursor-pointer px-6">
                    <h3 className="text-2xl font-bold tracking-tight text-zinc-950 group-hover:text-blue-600 sm:text-3xl lg:text-3xl leading-tight">
                      {video.title}
                    </h3>
                    {video.description && (
                      <p className="mt-3 text-base sm:text-lg leading-relaxed text-zinc-500 line-clamp-3">{video.description}</p>
                    )}
                  </button>
                  {video.tags && video.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2 px-6">
                      {video.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag.id}
                          className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-200 transition-colors duration-200 dark:bg-blue-900/40 dark:text-blue-200 dark:ring-blue-800/70">
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-auto pt-6 flex items-center justify-between border-t border-zinc-100 px-6">
                    {video.author ?
                      <div className="flex items-center gap-3">
                        <div
                          className={cn("flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold", color.bg, color.text)}>
                          {video.author.charAt(0)}
                        </div>
                        <div>
                          <p className="text-base font-semibold text-zinc-800">{video.author}</p>
                          <p className="text-sm text-zinc-500">Автор</p>
                        </div>
                      </div>
                    : <span />}
                    {video.date && <span className="text-zinc-400">{formatDate(video.date)}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
      {mounted && openUrl ?
        createPortal(
          <div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            role="dialog"
            aria-modal="true"
            onClick={(e) => {
              if (e.currentTarget === e.target) setOpenUrl(null);
            }}>
            <div className="relative w-full max-w-5xl overflow-hidden rounded-2xl bg-black shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => setOpenUrl(null)}
                className="absolute left-3 top-3 z-10 flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-bold text-zinc-900 hover:bg-zinc-200 cursor-pointer hover:text-zinc-900">
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
