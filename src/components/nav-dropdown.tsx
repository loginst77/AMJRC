"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { icons as lucideIcons, ChevronDown } from "lucide-react";
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

function DynamicIcon({ name, className, strokeWidth }: { name: string; className?: string; strokeWidth?: number }) {
  const pascalName = name
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("") as keyof typeof lucideIcons;

  const Icon: LucideIcon | undefined = lucideIcons[pascalName];
  if (!Icon) return null;

  return <Icon className={className} strokeWidth={strokeWidth} />;
}

export function NavDropdown({ label, href, items, className }: NavDropdownProps) {
  const pathname = usePathname();
  const active = pathname === href || pathname?.startsWith(href + "/");

  return (
    <div className={cn("group relative", className)}>
      <ButtonLink
        href={href}
        variant="ghost"
        size="md"
        className={cn(
          "text-zinc-700 !font-medium hover:text-zinc-950 active:bg-zinc-100",
          active && "bg-zinc-100 text-zinc-950",
        )}>
        {label}
        <ChevronDown className="size-3.5 opacity-50 transition-transform group-hover:rotate-180" />
      </ButtonLink>

      <div
        className="invisible fixed left-1/2 top-[var(--header-bottom)] -translate-x-1/2 pt-2 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100"
        style={{ "--header-bottom": "5.5rem" } as CSSProperties}>
        <div className="grid h-28 grid-flow-col auto-cols-fr items-stretch overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-lg">
          {items.map((item) => {
            const isItemActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex h-full w-full flex-col items-center justify-center gap-4 whitespace-nowrap px-8 text-sm font-medium text-zinc-700 transition-colors hover:bg-blue-100 hover:text-zinc-950",
                  isItemActive && "bg-zinc-50 text-zinc-950",
                )}>
                {item.icon ?
                  <DynamicIcon name={item.icon} className="size-7" strokeWidth={1.2} />
                : null}
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
