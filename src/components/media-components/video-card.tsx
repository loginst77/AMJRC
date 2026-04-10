/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, PlayCircleIcon, XIcon } from "lucide-react";

import { cn } from "@/lib/cn";
import { formatDate, type MediaTag } from "@/lib/media-data";
import { cardHoverCn } from "@/lib/variants";

export interface VideoCardItem {
  id: string;
  title: string;
  description?: string;
  imageSrc?: string;
  href?: string;
  embedUrl?: string;
  author?: string;
  authorHref?: string;
  date?: string | Date | null;
  featured?: boolean;
  tags?: MediaTag[];
  onClick?: () => void;
}

interface VideoCardProps {
  video: VideoCardItem;
}

export function VideoCard({ video }: VideoCardProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const originalOverflow = document.body.style.overflow;
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = originalOverflow;
    }
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open, mounted]);

  const playableUrl = useMemo(() => {
    if (video.embedUrl) return video.embedUrl;
    if (!video.href) return null;
    try {
      const parsed = new URL(video.href);
      // youtu.be/<id>
      if (parsed.hostname.includes("youtu.be")) {
        const id = parsed.pathname.slice(1);
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }
      // youtube.com/watch?v=<id> or youtube.com/embed/<id>
      if (parsed.hostname.includes("youtube.com")) {
        const id = parsed.searchParams.get("v");
        if (id) return `https://www.youtube.com/embed/${id}`;
        const parts = parsed.pathname.split("/");
        const embedIdx = parts.indexOf("embed");
        if (embedIdx >= 0 && parts[embedIdx + 1]) return `https://www.youtube.com/embed/${parts[embedIdx + 1]}`;
      }
      return video.href;
    } catch {
      return null;
    }
  }, [video.embedUrl, video.href]);

  const handleOpen = () => {
    if (playableUrl) {
      setOpen(true);
    } else if (video.href) {
      window.open(video.href, "_blank", "noreferrer");
    }
  };

  return (
    <div className={cn("group flex h-full flex-col overflow-hidden bg-white cursor-pointer", cardHoverCn)}>
      {/* Thumbnail with play */}
      <button
        type="button"
        onClick={handleOpen}
        className="relative block aspect-video w-full overflow-hidden bg-zinc-100 text-left cursor-pointer"
        aria-label={`Смотреть видео: ${video.title}`}>
        {video.imageSrc ?
          <img
            src={video.imageSrc}
            alt={video.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
          />
        : <div className="flex h-full w-full items-center justify-center">
            <PlayCircleIcon className="h-12 w-12 text-zinc-300" strokeWidth={1} />
          </div>
        }
        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm">
            <svg className="ml-0.5 h-6 w-6 text-zinc-950" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </button>

      {/* Info */}
      <div className="flex flex-1 flex-col justify-between">
        <button type="button" onClick={handleOpen} className="block w-full p-6 text-left cursor-pointer">
          <h3 className="text-xl font-semibold leading-snug text-zinc-950 transition-colors duration-200 line-clamp-2 group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-blue-300">
            {video.title}
          </h3>
          {video.description ?
            <p className="mt-2 text-base leading-relaxed text-zinc-500 line-clamp-2">{video.description}</p>
          : null}
          {video.tags && video.tags.length > 0 ?
            <div className="mt-3 flex flex-wrap gap-2">
              {video.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-100 transition-colors duration-200 dark:bg-blue-900/40 dark:text-blue-200 dark:ring-blue-800/70">
                  {tag.name}
                </span>
              ))}
            </div>
          : null}
        </button>
        <button
          type="button"
          onClick={handleOpen}
          className="group/link flex items-center justify-between border-t border-zinc-200 p-6  transition-colors hover:bg-blue-100 hover:text-zinc-900 text-left cursor-pointer">
          <span className="flex items-center gap-2 font-medium text-zinc-700 text-base">{video.author}</span>
          <span className="text-zinc-400">{formatDate(video.date)}</span>
        </button>
      </div>

      {mounted && open && playableUrl ?
        createPortal(
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            role="dialog"
            aria-modal="true"
            onClick={(e) => {
              if (e.currentTarget === e.target) setOpen(false);
            }}>
            <div className="relative w-full max-w-5xl overflow-hidden rounded-2xl bg-black shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute left-3 top-3 z-10 flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-bold text-zinc-900 hover:bg-white cursor-pointer hover:text-zinc-900 hover:bg-zinc-200">
                <XIcon className="h-4 w-4" />
                Закрыть
              </button>
              <div className="aspect-video w-full">
                <iframe
                  src={playableUrl}
                  title={video.title}
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
    </div>
  );
}
