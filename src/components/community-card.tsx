import { cn } from "@/lib/cn";
import { cardHoverCn } from "@/lib/variants";
import { Building2Icon } from "lucide-react";

export interface CommunityCardProps {
  /** Path or URL for the community image (optional — shows placeholder if omitted) */
  imageSrc?: string;
  imageAlt?: string;
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

export function CommunityCard({ imageSrc, imageAlt, name, address, leader, serviceTime, href, className }: CommunityCardProps) {
  const Wrapper = href ? "a" : "div";

  return (
    <Wrapper
      {...(href ? { href } : {})}
      className={cn(
        cn("group flex flex-col overflow-hidden rounded-3xl bg-white group", cardHoverCn),
        href && "cursor-pointer",
        className,
      )}>
      {/* Image area — ~65% of card height */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
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
      </div>

      {/* Info area */}
      <div className="flex flex-1 flex-col justify-center p-6">
        <h3 className="text-xl font-semibold leading-snug text-zinc-950 group-hover:text-blue-600 dark:text-white">{name}</h3>
        <p className="mt-1 leading-relaxed text-zinc-500 dark:text-zinc-400">{address}</p>
        {leader && (
          <p className="mt-4 text-zinc-600">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">Лидер:</span> {leader}
          </p>
        )}
        {serviceTime && (
          <p className="mt-1 text-zinc-600">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">Служение:</span> {serviceTime}
          </p>
        )}
      </div>
    </Wrapper>
  );
}
