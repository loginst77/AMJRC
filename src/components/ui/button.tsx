import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from "react";
import Link from "next/link";

import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "filled";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary: "bg-zinc-900 text-white hover:bg-zinc-800 border border-zinc-200/30 hover:border-zinc-300",
  secondary: "border border-blue-200/50 bg-blue-50 text-blue-950 hover:border-blue-300 hover:bg-blue-100",
  outline: "bg-white text-white ring-1 ring-inset ring-white/20 hover:bg-white/20",
  ghost: "bg-transparent text-zinc-900 hover:bg-blue-100",
  filled: "border border-zinc-200/20 bg-white/10 text-zinc-100 backdrop-blur-sm hover:border-zinc-300 hover:bg-white/20",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-12 px-6 text-sm",
  lg: "h-16 px-12 text-base",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  children?: ReactNode;
};

export function buttonVariants({ variant = "primary", size = "md", className }: { variant?: Variant; size?: Size; className?: string } = {}) {
  return cn(
    "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );
}

export function Button({ variant = "primary", size = "md", className, children, ...props }: ButtonProps) {
  return (
    <button className={buttonVariants({ variant, size, className })} {...props}>
      {children}
    </button>
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: Variant;
  size?: Size;
  children?: ReactNode;
};

export function ButtonLink({ href, variant = "primary", size = "md", className, children, ...props }: ButtonLinkProps) {
  return (
    <Link href={href} className={buttonVariants({ variant, size, className })} {...props}>
      {children}
    </Link>
  );
}
