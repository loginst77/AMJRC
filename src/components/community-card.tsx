"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Building2Icon, XIcon } from "lucide-react";

import { cn } from "@/lib/cn";
import { cardHoverCn } from "@/lib/variants";

export interface CommunityCardProps {
  /** Path or URL for the community image (optional — shows placeholder if omitted) */
  imageSrc?: string;
  imageAlt?: string;
  /** YouTube embed URL — when set, shows video thumbnail and opens a modal on click */
  embedUrl?: string;
  /** Community name */
  name: string;
  /** Physical address */
  address: string;
  /** Community leader name */
  leader?: string;
  /** Service start time */
  serviceTime?: string;
  /** Optional link destination */
  href?: string;
  className?: string;
}

export function CommunityCard({
  imageSrc,
  imageAlt,
  embedUrl,
  name,
  address,
  leader,
  serviceTime,
  href,
  className,
}: CommunityCardProps) {
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

  const playableUrl = useMemo(() => embedUrl ?? null, [embedUrl]);

  const handleOpenVideo = () => {
    if (playableUrl) setOpen(true);
  };

  const mediaContent = (
    <>
      {imageSrc ?
        <img
          src={imageSrc}
          alt={imageAlt || name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      : <div className="flex h-full w-full items-center justify-center">
          <Building2Icon className="h-12 w-12 text-zinc-300" strokeWidth={1} />
        </div>
      }
      {playableUrl ?
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm sm:h-14 sm:w-14">
            <svg className="ml-0.5 h-5 w-5 text-zinc-950 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      : null}
    </>
  );

  const infoContent = (
    <div className="flex flex-1 flex-col justify-center p-6">
      <h3 className="text-xl font-semibold leading-snug text-zinc-950 group-hover:text-blue-600">{name}</h3>
      <p className="mt-1 leading-relaxed text-zinc-500">{address}</p>
      {leader && (
        <p className="mt-4 text-zinc-600">
          <span className="font-medium text-zinc-700">Лидер:</span> {leader}
        </p>
      )}
      {serviceTime && (
        <p className="mt-1 text-zinc-600">
          <span className="font-medium text-zinc-700">Служение:</span> {serviceTime}
        </p>
      )}
    </div>
  );

  if (playableUrl) {
    return (
      <>
        <div className={cn("group flex flex-col overflow-hidden rounded-3xl bg-white", cardHoverCn, className)}>
          <button
            type="button"
            onClick={handleOpenVideo}
            className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100 text-left cursor-pointer"
            aria-label={`Смотреть видео: ${name}`}
          >
            {mediaContent}
          </button>
          {href ?
            <Link href={href} className="block">
              {infoContent}
            </Link>
          : infoContent}
        </div>

        {mounted && open && playableUrl ?
          createPortal(
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
                  className="absolute left-3 top-3 z-10 flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-bold text-zinc-900 hover:bg-zinc-200 cursor-pointer"
                >
                  <XIcon className="h-4 w-4" />
                  Закрыть
                </button>
                <div className="aspect-video w-full">
                  <iframe
                    src={playableUrl}
                    title={name}
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
      </>
    );
  }

  const Wrapper = href ? "a" : "div";

  return (
    <Wrapper
      {...(href ? { href } : {})}
      className={cn("group flex flex-col overflow-hidden rounded-3xl bg-white", cardHoverCn, href && "cursor-pointer", className)}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100">{mediaContent}</div>
      {infoContent}
    </Wrapper>
  );
}
