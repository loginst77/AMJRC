"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { TranslationCode, BibleCanon, VERSIONS } from "@/lib/torah-data";
import { Scroll, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuHighlight,
} from "@/components/animate-ui/primitives/radix/dropdown-menu";

export function TranslationSelector({
  currentVersion,
  fetchFailed,
  canon,
}: {
  currentVersion: TranslationCode;
  fetchFailed?: boolean;
  canon?: BibleCanon;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (fetchFailed) {
      toast.error(`Не удалось загрузить перевод: ${VERSIONS[currentVersion].shortName}`);
      const fallback = searchParams.get("fallback") || "NRP";
      const params = new URLSearchParams(searchParams.toString());
      params.set("version", fallback);
      params.delete("fallback");

      // Delay replace slightly to ensure the toast registers correctly during error hydration
      setTimeout(() => {
        router.replace(pathname + "?" + params.toString(), { scroll: false });
      }, 50);
    }
  }, [fetchFailed, currentVersion, searchParams, pathname, router]);

  if (fetchFailed) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1.5 rounded-full bg-blue-100 px-5 py-3 text-xs font-medium text-zinc-500 border border-blue-200 hover:border-zinc-300 transition-colors outline-none cursor-pointer">
        <Scroll className="h-4 w-4 shrink-0" strokeWidth={1.5} />
        <span className="text-zinc-900">{VERSIONS[currentVersion].shortName}</span>
        <ChevronDown className="h-3 w-3 opacity-50" strokeWidth={2} />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="z-[60] min-w-48 rounded-2xl border border-zinc-200 bg-white p-2 shadow-xl flex flex-col outline-none"
      >
        {/* @ts-expect-error Animate-UI's Highlight typings incorrectly require children */}
        <DropdownMenuHighlight className="rounded-xl bg-zinc-100" />
        <DropdownMenuRadioGroup
          value={currentVersion}
          onValueChange={(val) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("version", val);
            params.set("fallback", currentVersion);
            router.push(pathname + "?" + params.toString(), { scroll: false });
          }}
        >
          {Object.entries(VERSIONS)
            .filter(([, v]) => !canon || v.canons.includes(canon))
            .map(([code, { name, shortName }]) => (
              <DropdownMenuRadioItem
                key={code}
                value={code}
                data-value={code}
                className="relative z-10 flex cursor-pointer select-none hover:bg-zinc-100 items-center rounded-xl px-4 py-2.5 text-sm font-medium outline-none text-zinc-600 focus:text-zinc-900 transition-colors group"
              >
                <div className="flex flex-col">
                  <span className="text-zinc-950 group-hover:text-blue-600">{shortName}</span>
                  <span className="text-xs font-normal text-zinc-500">{name}</span>
                </div>
              </DropdownMenuRadioItem>
            ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
