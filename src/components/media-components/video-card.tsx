/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { PlayCircleIcon, XIcon } from "lucide-react";

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
  community?: {
    id: string;
    name: string;
    href: string;
  };
  onClick?: () => void;
}

interface VideoCardProps {
  video: VideoCardItem;
}

export function VideoCard({ video }: VideoCardProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [visibleTagCount, setVisibleTagCount] = useState(video.tags?.length ?? 0);
  const measureTagsRef = useRef<HTMLDivElement | null>(null);

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

  useLayoutEffect(() => {
    const node = measureTagsRef.current;
    if (!node || !video.tags?.length) {
      setVisibleTagCount(video.tags?.length ?? 0);
      return;
    }

    const measureRows = () => {
      const children = Array.from(node.children) as HTMLElement[];
      const rowTops: number[] = [];
      let seenTags = 0;
      let nextVisibleTagCount = video.tags?.length ?? 0;

      for (const child of children) {
        const top = child.offsetTop;
        const isNewRow = !rowTops.some((rowTop) => Math.abs(rowTop - top) <= 1);

        if (isNewRow) {
          rowTops.push(top);
        }

        if (rowTops.length > 2) {
          nextVisibleTagCount = seenTags;
          break;
        }

        if (child.dataset.role === "tag") {
          seenTags += 1;
        }
      }

      setVisibleTagCount(nextVisibleTagCount);
    };

    measureRows();

    const resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measureRows) : null;
    resizeObserver?.observe(node);
    Array.from(node.children).forEach((child) => resizeObserver?.observe(child));

    window.addEventListener("resize", measureRows);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", measureRows);
    };
  }, [video.tags]);

  const visibleTags = video.tags?.slice(0, visibleTagCount) ?? [];
  const overflowTags = video.tags?.slice(visibleTagCount) ?? [];

  return (
    <div className={cn("group flex h-full flex-col overflow-hidden bg-white cursor-pointer", cardHoverCn)}>
      {/* Thumbnail with play */}
      <button
        type="button"
        onClick={handleOpen}
        className="relative block aspect-video w-full overflow-hidden bg-zinc-100 text-left cursor-pointer"
        aria-label={`Смотреть видео: ${video.title}`}
      >
        {video.imageSrc ? (
          <img
            src={video.imageSrc}
            alt={video.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <PlayCircleIcon className="h-12 w-12 text-zinc-300" strokeWidth={1} />
          </div>
        )}
        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm sm:h-14 sm:w-14">
            <svg className="ml-0.5 h-5 w-5 text-zinc-950 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </button>

      {/* Info */}
      <div className="flex flex-1 flex-col justify-between">
        <div className="p-4 sm:p-6">
          <button type="button" onClick={handleOpen} className="block w-full text-left cursor-pointer">
            <h3 className="text-lg font-semibold leading-snug text-zinc-950 transition-colors duration-200 line-clamp-2 group-hover:text-blue-600 sm:text-xl">
              {video.title}
            </h3>
            {video.author ? <p className="mt-2 text-sm font-semibold text-zinc-800 sm:mt-3 sm:text-base">{video.author}</p> : null}
            {video.description ? (
              <p className="mt-2 text-sm leading-relaxed text-zinc-500 line-clamp-2 sm:text-base">{video.description}</p>
            ) : null}
          </button>
          {video.tags && video.tags.length > 0 ? (
            <div className="relative mt-3">
              <div
                ref={measureTagsRef}
                aria-hidden="true"
                className="pointer-events-none invisible absolute inset-0 flex flex-wrap gap-1.5 sm:gap-2"
              >
                {video.tags?.map((tag) => (
                  <span
                    key={tag.id}
                    data-role="tag"
                    className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700 ring-1 ring-inset ring-blue-100 sm:px-3 sm:py-1.5 sm:text-xs"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {visibleTags.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700 ring-1 ring-inset ring-blue-100 transition-colors duration-200 sm:px-3 sm:py-1.5 sm:text-xs"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
              {overflowTags.length > 0 ? (
                <div className="mt-2 flex items-center -space-x-10 overflow-hidden sm:-space-x-18">
                  {overflowTags.slice(0, 5).map((tag) => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700 ring-1 ring-inset ring-blue-100 shadow-sm transition-transform duration-200 hover:z-10 sm:px-3 sm:py-1.5 sm:text-xs"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
        {video.community ? (
          <Link
            href={video.community.href}
            className="mt-auto flex flex-col items-start gap-2 border-t border-zinc-200 p-4 text-zinc-950 transition-colors duration-200 hover:bg-blue-100 sm:p-6 lg:flex-row lg:items-center lg:justify-between"
          >
            <span className="min-w-0 text-sm font-medium leading-snug sm:text-base">{video.community.name}</span>
            {video.date && <span className="text-sm text-zinc-400 sm:text-base lg:ml-auto lg:text-right">{formatDate(video.date)}</span>}
          </Link>
        ) : (
          <div className="flex flex-col items-start gap-2 border-t border-zinc-200 p-6 sm:p-6 lg:flex-row lg:items-center lg:justify-end">
            {video.date && <span className="text-sm text-zinc-400 sm:text-base lg:text-right">{formatDate(video.date)}</span>}
          </div>
        )}
      </div>

      {mounted && open && playableUrl
        ? createPortal(
            <div
              className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
              role="dialog"
              aria-modal="true"
              onClick={(e) => {
                if (e.currentTarget === e.target) setOpen(false);
              }}
            >
              <div className="relative w-full max-w-5xl overflow-hidden rounded-2xl bg-black shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="absolute left-3 top-3 z-10 flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-bold text-zinc-900 hover:bg-white cursor-pointer hover:text-zinc-900 hover:bg-zinc-200"
                >
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
