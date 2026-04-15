import Link from "next/link";
import { Users } from "lucide-react";
import { cn } from "@/lib/cn";
import { cardHoverCn } from "@/lib/variants";
import { truncateWords } from "@/lib/text";
import { PrismicNextImage } from "@prismicio/next";

export type CommunityItem = {
  id: string;
  title: string;
  description: string;
  href?: string;
  image?: any;
};

type CommunityCardProps = {
  community: CommunityItem;
  className?: string;
};

export function CommunityCard({ community, className = "" }: CommunityCardProps) {
  return (
    <Link
      href={community.href || `/communities/${community.id}`}
      aria-label={`Открыть общину: ${community.title}`}
      className={cn(
        "group flex flex-col bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 rounded-2xl border border-zinc-200 overflow-hidden",
        cardHoverCn,
        className,
      )}>
      <div className="aspect-[16/9] w-full relative overflow-hidden bg-zinc-100">
        {community.image && community.image.url ?
          <PrismicNextImage field={community.image} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
        : <div className="absolute inset-0 flex items-center justify-center opacity-5">
            <Users className="w-24 h-24 text-zinc-500" />
          </div>
        }
      </div>

      <div className="p-6 flex-1 flex flex-col h-full bg-white">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
            <Users className="h-4 w-4" />
            Община
          </span>
        </div>

        <h3 className="text-xl font-bold leading-snug text-zinc-900 group-hover:text-blue-600 transition-colors duration-200 mb-2">
          {community.title}
        </h3>

        <p className="text-base leading-relaxed text-zinc-500 line-clamp-3 flex-1">
          {truncateWords(community.description || "")}
        </p>
      </div>
    </Link>
  );
}
