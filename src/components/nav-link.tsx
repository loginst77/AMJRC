/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn";
import { ButtonLink } from "./ui/button";

type NavLinkProps = {
  href: string;
  className?: string;
  children?: ReactNode;
};

export function NavLink({ href, className, children }: NavLinkProps) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/" && pathname?.startsWith(href));

  return (
    <ButtonLink
      href={href}
      variant="ghost"
      size="md"
      className={cn(
        "rounded-full px-6 py-2 text-sm font-medium text-zinc-700 hover:bg-blue-100 hover:text-zinc-950 ",
        active && "bg-zinc-100 text-zinc-950",
        className,
      )}>
      {children}
    </ButtonLink>
  );
}
