import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-full font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-zinc-950 text-zinc-50",
        secondary:
          "bg-zinc-100 text-zinc-900 ring-zinc-500/10 hover:bg-zinc-100/80",
        destructive: "bg-red-50 text-red-600 ring-red-500/20 hover:bg-red-50/80",
        filled: "bg-zinc-300 text-zinc-900",
        outline: "text-zinc-950 border border-zinc-300",
      },
      size: {
        default: "px-6 py-2 gap-2 text-xl font-semibold",
        sm: "px-4 py-1 gap-2 text-sm font-medium",
        lg: "px-8 py-4 gap-3 text-xl font-semibold",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      <span className="h-2 w-2 shrink-0 rounded-full bg-current opacity-100" aria-hidden="true" />
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
