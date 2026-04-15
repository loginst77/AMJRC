import { PrismicRichText as BasePrismicRichText, type PrismicRichTextProps, type JSXMapSerializer } from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";

import { Heading } from "./Heading";
import { Quote } from "lucide-react";

const defaultComponents: JSXMapSerializer = {
  heading1: ({ children }) => (
    <Heading as="h1" className="mb-5 mt-12 first:mt-0 last:mb-0" color="zinc-800">
      {children}
    </Heading>
  ),
  heading2: ({ children }) => (
    <Heading as="h2" size="md" className="mb-4 mt-12 first:mt-0 last:mb-0 text-zinc-800">
      {children}
    </Heading>
  ),
  heading3: ({ children }) => (
    <Heading as="h3" size="sm" className="mb-4 mt-10 first:mt-0 last:mb-0 text-zinc-800">
      {children}
    </Heading>
  ),
  heading4: ({ children }) => (
    <Heading as="h4" size="xs" className="mb-3 mt-10 first:mt-0 last:mb-0 text-zinc-800">
      {children}
    </Heading>
  ),
  heading5: ({ children }) => (
    <Heading as="h5" size="2xs" className="mb-3 mt-8 first:mt-0 last:mb-0 text-zinc-800">
      {children}
    </Heading>
  ),
  heading6: ({ children }) => (
    <h6 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-zinc-600 first:mt-0 last:mb-0 md:text-base">
      {children}
    </h6>
  ),
  label: ({ children, node }) => {
    if (node.data.label === "quote") {
      return (
        <blockquote className="my-4 border-l-2 border-blue-500 pl-6">
          <div className="flex gap-3">
            <Quote className="mt-1.5 h-5 w-5 shrink-0 text-blue-400" />
            <div>
              <p className="italic leading-8 text-zinc-700">{children}</p>
            </div>
          </div>
        </blockquote>
      );
    }
    return <span className={node.data.label}>{children}</span>;
  },
  paragraph: ({ children }) => <p className="mb-2 leading-8 text-zinc-700 last:mb-0">{children}</p>,
  oList: ({ children }) => <ol className="mb-9 space-y-2 pl-4 leading-8 last:mb-0 md:pl-6 text-zinc-700">{children}</ol>,
  oListItem: ({ children }) => <li className="mb-0 list-decimal pl-1 last:mb-0 md:pl-2">{children}</li>,
  list: ({ children }) => <ul className="mb-9 space-y-2 pl-4 leading-8 last:mb-0 md:pl-6 text-zinc-700">{children}</ul>,
  listItem: ({ children }) => <li className="mb-0 list-disc pl-1 last:mb-0 md:pl-2">{children}</li>,
  preformatted: ({ children }) => (
    <pre className="mb-9 rounded-sm bg-slate-100 p-4 text-sm leading-relaxed last:mb-0 md:p-8 md:text-lg">
      <code>{children}</code>
    </pre>
  ),
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  hyperlink: ({ children, node }) => (
    <PrismicNextLink field={node.data} className="underline decoration-1 underline-offset-2">
      {children}
    </PrismicNextLink>
  ),
};

export function PrismicRichText({ components, ...props }: PrismicRichTextProps) {
  return <BasePrismicRichText components={{ ...defaultComponents, ...components }} {...props} />;
}
