"use client";

import Link from "next/link";
import { LayoutGroup, motion } from "framer-motion";

import { cn } from "@/lib/cn";

type ArticleTagChipProps = {
  href: string;
  label: string;
  active: boolean;
  layoutId?: string;
};

export function ArticleTagChip({ href, label, active, layoutId = "tag-chip-highlight" }: ArticleTagChipProps) {
  const chipClassName = cn(
    "relative inline-flex items-center justify-center rounded-full px-5 py-2 text-base font-medium whitespace-nowrap transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2",
    active ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-900",
  );

  if (active) {
    return (
      <span aria-current="page" className={chipClassName}>
        <motion.span
          className="absolute inset-0 z-0 rounded-full border border-transparent bg-white"
          layoutId={layoutId}
          transition={{ type: "spring", stiffness: 380, damping: 32, mass: 0.9 }}
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
        />
        <span className="relative z-10">{label}</span>
      </span>
    );
  }

  return (
    <Link href={href} scroll={false} className={chipClassName}>
      {label}
    </Link>
  );
}

export function ArticleTagChipGroup({ children }: { children: React.ReactNode }) {
  return <LayoutGroup>{children}</LayoutGroup>;
}
