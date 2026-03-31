"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { PrismicNextImage } from "@prismicio/next";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/cn";
import type { NavDropdownItem } from "./nav-dropdown";

export type HeaderNavLinkItem = { href: string; label: string };

type MobileNavProps = {
  items: HeaderNavLinkItem[];
  dropdownItems?: NavDropdownItem[];
  logo?: any;
};

export function MobileNav({ items, dropdownItems = [], logo }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (open) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

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
      document.body.classList.remove("overflow-hidden");
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div className="relative md:hidden">
      <button
        type="button"
        className={cn(
          "inline-flex w-fit px-4 py-3 items-center justify-center rounded-full text-zinc-900 transition-colors !bg-blue-100 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:hover:bg-zinc-900",
          open && "bg-zinc-100 dark:bg-zinc-900",
        )}
        aria-label="Toggle navigation menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? (
          <X className="h-5 w-5" aria-hidden />
        ) : (
          <span className="flex items-center gap-2">
            <Menu className="h-5 w-5" aria-hidden />
            Menu
          </span>
        )}
      </button>

      {mounted
        ? createPortal(
            <>
              {/* Backdrop kept mounted for smooth fade */}
              <div
                className={cn(
                  "fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm transition-opacity duration-300",
                  open ? "opacity-100 pointer-events-auto" : "pointer-events-none opacity-0",
                )}
                aria-hidden
                onClick={() => setOpen(false)}
              />

              {/* Sliding panel (60-80% of screen, max-sm) */}
              <div
                ref={panelRef}
                className={cn(
                  "fixed inset-y-0 right-0 z-[80] w-[80%] max-w-sm overflow-y-auto border-l border-zinc-200 bg-white p-5 transition-transform duration-300 ease-in-out dark:border-zinc-800 dark:bg-zinc-950",
                  open ? "translate-x-0" : "translate-x-full pointer-events-none",
                )}
                role="dialog"
                aria-modal="true"
                aria-label="Navigation menu"
              >
                <div className="mb-4 flex items-center justify-between">
                  {logo?.url ? (
                    <PrismicNextImage field={logo} alt={logo?.alt || "Logo"} className="h-10 w-auto" />
                  ) : (
                    <span className="text-base font-semibold text-zinc-900 dark:text-white">Меню</span>
                  )}
                  <button
                    type="button"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 text-zinc-900 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-zinc-800 dark:text-white dark:hover:bg-zinc-900 dark:focus-visible:ring-offset-zinc-950"
                    aria-label="Close navigation menu"
                    onClick={() => setOpen(false)}
                  >
                    <X className="h-5 w-5" aria-hidden />
                  </button>
                </div>
                <nav className="flex flex-col gap-1">
                  {items.map((item) => (
                    <Link
                      key={`${item.href}-${item.label}`}
                      href={item.href}
                      className="rounded-xl px-3 py-3 text-base font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 dark:text-white dark:hover:bg-zinc-800"
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}

                  {dropdownItems.length > 0 ? (
                    <div className="mt-2 border-t border-dashed border-zinc-200 pt-2 dark:border-zinc-800">
                      <div className="px-1 pb-1 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Медия</div>
                      <div className="flex flex-col gap-1">
                        {dropdownItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="rounded-xl px-3 py-3 text-base font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 dark:text-white dark:hover:bg-zinc-800"
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
            </>,
            document.body,
          )
        : null}
    </div>
  );
}
