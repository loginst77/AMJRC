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
        "group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-secondary backdrop-blur-sm transition-shadow sm:flex-row",
        className,
      )}>
      {/* Left Media Area */}
      <div className="relative w-full shrink-0 self-start overflow-hidden bg-zinc-200 aspect-square sm:aspect-[2/3] sm:w-64 md:w-80 lg:aspect-[3/4] lg:w-96">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-transparent to-black/10 sm:bg-gradient-to-r" />
        {imageSrc ?
          <img src={imageSrc} alt={name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        : <div className="relative flex h-full w-full items-center justify-center text-5xl font-bold text-white shadow-inner" />}

        {/* Role Pill */}
        <div className="absolute bottom-4 left-1/2 z-20 w-max max-w-[90%] -translate-x-1/2 rounded-full bg-white/20 px-4 py-2 text-center text-sm font-semibold tracking-wider text-zinc-100 backdrop-blur-sm sm:px-6 sm:py-3 sm:text-base">
          {role}
        </div>
      </div>

      {/* Right Content Area */}
      <div className="flex flex-1 flex-col justify-between border-t border-zinc-200 sm:border-l sm:border-t-0">
        <div className="flex flex-1 flex-col justify-center space-y-3 p-5 sm:space-y-4 sm:p-6 md:p-8">
          <h3 className="text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl">{name}</h3>

          {description && <p className="text-base leading-relaxed text-zinc-500">{description}</p>}
        </div>

        {responsibilities && (
          <div className="shrink-0 border-t border-zinc-200 px-5 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-zinc-400">Ответственность</p>
            <p className="text-base font-medium text-zinc-600">{responsibilities}</p>
          </div>
        )}
      </div>
    </div>
  );
}
