import { cn } from "@/lib/cn";
import { Badge } from "./badge";
import { cardHoverCn } from "@/lib/variants";

export interface PersonCardProps {
  name: string;
  role: string;
  /** Optional avatar image URL */
  imageSrc?: string;
  /** Optional bio/description text */
  description?: string;
  /** Optional responsibilities text */
  responsibilities?: string;
  /** Optional extra classes */
  className?: string;
}

export function PersonCard({ name, role, imageSrc, description, responsibilities, className }: PersonCardProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col sm:flex-row overflow-hidden rounded-3xl bg-white shadow-secondary backdrop-blur-sm transition-shadow dark:bg-zinc-900/80",
        className,
      )}>
      {/* Left Media Area */}
      <div className="relative shrink-0 overflow-hidden bg-zinc-200 self-start w-full sm:w-80 lg:w-96 aspect-square sm:aspect-[2/3] lg:aspect-[3/4]">
        <div className="absolute inset-0 z-10 bg-gradient-to-t sm:bg-gradient-to-r from-transparent to-black/10" />
        {imageSrc ?
          <img src={imageSrc} alt={name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        : <div className="relative flex h-full w-full items-center justify-center text-5xl font-bold text-white shadow-inner" />}

        {/* Role Pill */}
        <div className="absolute bottom-4 left-1/2 z-20 w-max max-w-[90%] text-center -translate-x-1/2 rounded-full bg-white/20 px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold tracking-wider text-zinc-100 backdrop-blur-sm">
          {role}
        </div>
      </div>

      {/* Right Content Area */}
      <div className="flex flex-1 flex-col justify-between border-l border-zinc-200">
        <div className="flex-1 flex flex-col justify-center space-y-4 p-8">
          <h3 className="text-2xl font-bold tracking-tight text-zinc-900">{name}</h3>

          {description && <p className="text-base leading-relaxed text-zinc-500">{description}</p>}
        </div>

        {responsibilities && (
          <div className="border-t border-zinc-200 shrink-0 p-8 py-6">
            <p className="text-sm font-semibold uppercase tracking-wider text-zinc-400 mb-2">Ответственность</p>
            <p className="text-base text-zinc-600 font-medium">{responsibilities}</p>
          </div>
        )}
      </div>
    </div>
  );
}
