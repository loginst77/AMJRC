"use client";

import { useLayoutEffect, useRef, useState } from "react";

type TagLike = {
  name?: string;
};

export function useVisibleTagCount(tags?: TagLike[]) {
  const [visibleTagCount, setVisibleTagCount] = useState(tags?.length ?? 0);
  const measureTagsRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const node = measureTagsRef.current;
    if (!node || !tags?.length) {
      setVisibleTagCount(tags?.length ?? 0);
      return;
    }

    const measureRows = () => {
      const children = Array.from(node.children) as HTMLElement[];
      const rowTops: number[] = [];
      let nextVisibleTagCount = children.length;

      for (let index = 0; index < children.length; index += 1) {
        const top = children[index]?.offsetTop ?? 0;
        const isNewRow = !rowTops.some((rowTop) => Math.abs(rowTop - top) <= 1);

        if (isNewRow) {
          rowTops.push(top);
        }

        if (rowTops.length > 2) {
          nextVisibleTagCount = index;
          break;
        }
      }

      setVisibleTagCount(nextVisibleTagCount);
    };

    measureRows();

    const resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measureRows) : null;
    resizeObserver?.observe(node);
    Array.from(node.children).forEach((child) => resizeObserver?.observe(child));

    window.addEventListener("resize", measureRows);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", measureRows);
    };
  }, [tags]);

  return { measureTagsRef, visibleTagCount };
}
