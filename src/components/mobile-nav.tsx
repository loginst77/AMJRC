"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { asText } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import { PrismicText } from "@prismicio/react";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/cn";
import type { NavigationDocumentDataLinksItem } from "../../prismicio-types";
import type { NavDropdownItem } from "./nav-dropdown";

type MobileNavProps = {
  items: NavigationDocumentDataLinksItem[];
  dropdownItems?: NavDropdownItem[];
};

export function MobileNav({ items, dropdownItems = [] }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!open) return;
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div className="relative md:hidden">
      <button
        type="button"
        className={cn(
          "inline-flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-900 shadow-sm transition-colors hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:hover:bg-zinc-900",
          open && "bg-zinc-100 dark:bg-zinc-900",
        )}
        aria-label="Toggle navigation menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
      </button>

      {open ? (
        <div
          ref={panelRef}
          className="absolute right-0 top-full mt-3 w-72 overflow-hidden rounded-2xl border border-zinc-200 bg-white p-4 shadow-[var(--shadow-primary)] ring-1 ring-black/5 dark:border-zinc-800 dark:bg-zinc-950"
        >
          <nav className="flex flex-col gap-1">
            {items.map((item, index) => (
              <PrismicNextLink
                key={`${asText(item.label)}-${index}`}
                field={item.link}
                className="rounded-xl px-3 py-2 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 dark:text-white dark:hover:bg-zinc-800"
                onClick={() => setOpen(false)}
              >
                <PrismicText field={item.label} />
              </PrismicNextLink>
            ))}

            {dropdownItems.length > 0 ? (
              <div className="mt-2 border-t border-dashed border-zinc-200 pt-2 dark:border-zinc-800">
                <div className="px-1 pb-1 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  Медия
                </div>
                <div className="flex flex-col gap-1">
                  {dropdownItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="rounded-xl px-3 py-2 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 dark:text-white dark:hover:bg-zinc-800"
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </nav>
        </div>
      ) : null}
    </div>
  );
}
