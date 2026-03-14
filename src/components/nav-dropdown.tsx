"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { icons as lucideIcons } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/cn";
import { ButtonLink } from "./ui/button";

export type NavDropdownIcon = string;

export type NavDropdownItem = {
  label: string;
  href: string;
  icon?: NavDropdownIcon;
};

type NavDropdownProps = {
  label: string;
  href: string;
  items: NavDropdownItem[];
  className?: string;
};

function DynamicIcon({
  name,
  className,
  strokeWidth,
}: {
  name: string;
  className?: string;
  strokeWidth?: number;
}) {
  const pascalName = name
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("") as keyof typeof lucideIcons;

  const Icon: LucideIcon | undefined = lucideIcons[pascalName];
  if (!Icon) return null;

  return <Icon className={className} strokeWidth={strokeWidth} />;
}

export function NavDropdown({ label, href, items, className }: NavDropdownProps) {
  return (
    <div className={cn("group relative", className)}>
      <ButtonLink href={href} variant="ghost" size="md">
        {label}
        <svg
          className="size-3.5 opacity-50 transition-transform group-hover:rotate-180"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </ButtonLink>

      <div
        className="invisible fixed left-1/2 top-[var(--header-bottom)] -translate-x-1/2 pt-2 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100"
        style={{ "--header-bottom": "5.5rem" } as CSSProperties}
      >
        <div className="flex h-28 items-stretch gap-1 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center gap-4 whitespace-nowrap px-12 text-sm font-medium text-zinc-700 transition-colors hover:bg-blue-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white"
            >
              {item.icon ? (
                <DynamicIcon name={item.icon} className="size-7" strokeWidth={1.2} />
              ) : null}
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
