"use client";

import { cn } from "@/lib/cn";

interface LightRaysProps {
  className?: string;
}

export function LightRays({ className }: LightRaysProps) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {/* Ray 1 */}
      <div className="absolute -top-[10%] left-[10%] h-[120%] w-[15%] origin-top rotate-[8deg] animate-[ray-shimmer_8s_ease-in-out_infinite] bg-gradient-to-b from-blue-500/20 via-blue-400/5 to-transparent blur-2xl dark:from-blue-500/10 dark:via-blue-400/5" />
      {/* Ray 2 */}
      <div className="absolute -top-[10%] left-[28%] h-[120%] w-[10%] origin-top rotate-[-4deg] animate-[ray-shimmer_10s_ease-in-out_1.5s_infinite] bg-gradient-to-b from-blue-500/15 via-blue-400/5 to-transparent blur-3xl dark:from-blue-500/10 dark:via-blue-400/5" />
      {/* Ray 3 — widest, center */}
      <div className="absolute -top-[10%] left-[42%] h-[120%] w-[22%] origin-top rotate-[2deg] animate-[ray-shimmer_12s_ease-in-out_0.5s_infinite] bg-gradient-to-b from-blue-500/25 via-blue-400/10 to-transparent blur-3xl dark:from-blue-500/15 dark:via-blue-400/10" />
      {/* Ray 4 */}
      <div className="absolute -top-[10%] left-[62%] h-[120%] w-[12%] origin-top rotate-[-6deg] animate-[ray-shimmer_9s_ease-in-out_2s_infinite] bg-gradient-to-b from-blue-500/15 via-blue-400/5 to-transparent blur-2xl dark:from-blue-500/10 dark:via-blue-400/5" />
      {/* Ray 5 */}
      <div className="absolute -top-[10%] left-[80%] h-[120%] w-[14%] origin-top rotate-[5deg] animate-[ray-shimmer_11s_ease-in-out_3s_infinite] bg-gradient-to-b from-blue-500/20 via-blue-400/5 to-transparent blur-3xl dark:from-blue-500/10 dark:via-blue-400/5" />
    </div>
  );
}
