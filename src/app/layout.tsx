import "./globals.css";

import type { ComponentProps } from "react";
import Link from "next/link";
import { Montserrat } from "next/font/google";
import { asLink, asText, isFilled } from "@prismicio/client";
import { PrismicNextImage, PrismicPreview } from "@prismicio/next";

import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { NavDropdown, type NavDropdownItem } from "@/components/nav-dropdown";
import { createClient, linkResolver, repositoryName } from "@/prismicio";
import type { HeaderNavLinkItem } from "@/components/mobile-nav";
import { cn } from "@/lib/utils";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter, type FooterLinkItem, type FooterServiceTime, type SiteFooterProps } from "@/components/site-footer";
import { Toaster } from "sonner";

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-montserrat",
});

const fallbackMediaDropdownItems: NavDropdownItem[] = [
  { label: "Видео", href: "/media/videos", icon: "Video" },
  { label: "Подкасты", href: "/media/podcasts", icon: "Mic" },
  { label: "Статьи", href: "/media/articles", icon: "FileText" },
  { label: "Книги", href: "/media/books", icon: "BookMarked" },
  { label: "Радио", href: "/media/radio", icon: "Radio" },
  { label: "Газета", href: "/media/newspaper", icon: "Newspaper" },
];

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const client = createClient();
  const navigation = await client.getSingle("navigation").catch(() => null);
  const footer = await client.getSingle("footer").catch(() => null);

  const navigationData = (navigation?.data ?? {}) as any;
  const footerData = (footer?.data ?? {}) as any;
  const navigationLinks = buildHeaderNavLinks(navigationData.nav);
  const { dropdownItems, dropdownLabel, dropdownHref } = buildMediaDropdown(navigationData);
  const { primaryAction, secondaryAction } = buildActionButtons(navigationData);
  const logo = navigationData.logo;
  const footerContent = buildFooterContent(footerData);
  const shouldRenderFooter = hasFooterContent(footerContent);

  return (
    <html lang="en" className={cn("font-sans", montserrat.variable)}>
      <body className="overflow-x-hidden antialiased">
        <SiteHeader
          navigationLinks={navigationLinks}
          dropdownItems={dropdownItems}
          dropdownLabel={dropdownLabel}
          dropdownHref={dropdownHref}
          logo={logo}
          primaryAction={primaryAction}
          secondaryAction={secondaryAction}
        />
        {children}
        {shouldRenderFooter ?
          <SiteFooter {...footerContent} />
        : null}
        <PrismicPreview repositoryName={repositoryName} />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}

function buildHeaderNavLinks(nav: unknown): HeaderNavLinkItem[] {
  if (!Array.isArray(nav)) return [];

  const out: HeaderNavLinkItem[] = [];
  for (const item of nav) {
    if (!isFilled.link(item)) continue;
    const href = ensureAbsoluteHref(asLink(item, linkResolver) as string | null);
    if (!href) continue;
    const label = item.text?.trim() || deriveNavLabelFromHref(href);
    out.push({ href, label });
  }
  return out;
}

function deriveNavLabelFromHref(href: string): string {
  try {
    const path = href.replace(/^https?:\/\/[^/]+/i, "");
    const segments = path.split("/").filter(Boolean);
    const last = segments[segments.length - 1];
    if (last) return decodeURIComponent(last.replace(/-/g, " "));
  } catch {
    /* ignore */
  }
  return href || "Link";
}

function buildMediaDropdown(navigationData: any): { dropdownItems: NavDropdownItem[]; dropdownLabel: string; dropdownHref: string } {
  const fallback = {
    dropdownItems: fallbackMediaDropdownItems,
    dropdownLabel: "Медия",
    dropdownHref: "/media",
  };

  if (!navigationData) return fallback;

  const dropdownItemsRaw = navigationData.dropdown_items;
  const dropdownItems =
    Array.isArray(dropdownItemsRaw) ?
      dropdownItemsRaw
        .map((item: any) => {
          const linkField = item?.link;
          if (!isFilled.link(linkField)) return null;
          const href = asLink(linkField, linkResolver) as string | null;
          if (!href) return null;
          const label = linkField.text?.trim() || "Без названия";
          const icon = normalizeDropdownIcon(item.icon);
          return { label, href, icon };
        })
        .filter(Boolean)
    : [];

  const dropdownLabel = asText(navigationData.dropdown_label) || fallback.dropdownLabel;
  const dropdownHref = ensureAbsoluteHref((asLink(navigationData.dropdown_link, linkResolver) as string | null) ?? fallback.dropdownHref);

  return {
    dropdownItems: dropdownItems.length ? (dropdownItems as NavDropdownItem[]) : fallback.dropdownItems,
    dropdownLabel,
    dropdownHref,
  };
}

function ensureAbsoluteHref(href: string | null | undefined): string {
  if (!href) return "/";
  if (href.startsWith("http://") || href.startsWith("https://") || href.startsWith("/")) return href;
  return `/${href}`;
}

function normalizeDropdownIcon(iconValue: unknown): NavDropdownItem["icon"] {
  if (!iconValue || typeof iconValue !== "string") return undefined;
  const normalized = iconValue.toLowerCase();
  const map: Record<string, NavDropdownItem["icon"]> = {
    video: "Video",
    mic: "Mic",
    filetext: "FileText",
    file_text: "FileText",
    bookmarked: "BookMarked",
    book_marked: "BookMarked",
    radio: "Radio",
    newspaper: "Newspaper",
  };
  return map[normalized];
}

type ButtonVariant = ComponentProps<typeof ButtonLink>["variant"];

type ActionButton = {
  label: string;
  href: string;
  variant: ButtonVariant;
};

function buildActionButtons(navigationData: any): {
  primaryAction: ActionButton;
  secondaryAction: ActionButton;
} {
  const fallback = {
    primaryAction: {
      label: "Контакты",
      href: "/contact",
      variant: "ghost" as ButtonVariant,
    },
    secondaryAction: {
      label: "Вступить в Альянс",
      href: "/join-alliance",
      variant: "primary" as ButtonVariant,
    },
  };

  if (!navigationData) return fallback;

  const primaryLink = navigationData.action_button_primary_link;
  const secondaryLink = navigationData.action_button_secondary_link;

  const primaryHref = isFilled.link(primaryLink) ? ensureAbsoluteHref(asLink(primaryLink, linkResolver) as string | null) : "";
  const primaryLabel = isFilled.link(primaryLink) && primaryHref ? primaryLink.text?.trim() || deriveNavLabelFromHref(primaryHref) : "";
  const primaryVariant =
    isFilled.link(primaryLink) ?
      normalizeButtonVariant(primaryLink.variant, fallback.primaryAction.variant)
    : fallback.primaryAction.variant;

  const secondaryHref = isFilled.link(secondaryLink) ? ensureAbsoluteHref(asLink(secondaryLink, linkResolver) as string | null) : "";
  const secondaryLabel =
    isFilled.link(secondaryLink) && secondaryHref ? secondaryLink.text?.trim() || deriveNavLabelFromHref(secondaryHref) : "";
  const secondaryVariant =
    isFilled.link(secondaryLink) ?
      normalizeButtonVariant(secondaryLink.variant, fallback.secondaryAction.variant)
    : fallback.secondaryAction.variant;

  return {
    primaryAction:
      primaryLabel && primaryHref ? { label: primaryLabel, href: primaryHref, variant: primaryVariant } : fallback.primaryAction,
    secondaryAction:
      secondaryLabel && secondaryHref ?
        { label: secondaryLabel, href: secondaryHref, variant: secondaryVariant }
      : fallback.secondaryAction,
  };
}

function normalizeButtonVariant(value: unknown, fallback: ButtonVariant): ButtonVariant {
  if (!value || typeof value !== "string") return fallback;
  const normalized = value.toLowerCase();
  const allowed: Record<string, ButtonVariant> = {
    primary: "primary",
    secondary: "secondary",
    ghost: "ghost",
    outline: "outline",
    filled: "filled",
  };
  return allowed[normalized] ?? fallback;
}

function buildFooterContent(footerData: any): SiteFooterProps {
  return {
    logo: footerData.logo,
    addressLine1: footerData.address_line_1 ?? "",
    addressLine2: footerData.address_line_2 ?? "",
    email: footerData.email ?? "",
    phone: footerData.phone ?? "",
    navigationTitle: asText(footerData.navigation_column_title) || "",
    navigationLinks: buildFooterLinks(footerData.navigation_links),
    actionsTitle: asText(footerData.actions_column_title) || "",
    actionLinks: buildFooterLinks(footerData.action_links),
    serviceTimesTitle: asText(footerData.service_times_title) || "",
    serviceTimes: buildServiceTimes(footerData.service_times),
    socialLinks: buildSocialLinks(footerData.social_links),
    copyrightText: footerData.copyright_text || "",
  };
}

function hasFooterContent(content: SiteFooterProps): boolean {
  return Boolean(
    content.logo?.url ||
    content.addressLine1 ||
    content.addressLine2 ||
    content.email ||
    content.phone ||
    content.navigationTitle ||
    content.navigationLinks.length ||
    content.actionsTitle ||
    content.actionLinks.length ||
    content.serviceTimesTitle ||
    content.serviceTimes.length ||
    content.socialLinks.length ||
    content.copyrightText,
  );
}

function buildFooterLinks(items: any[] | undefined): FooterLinkItem[] {
  if (!Array.isArray(items)) return [];

  const parsed = items
    .map((item) => {
      const href = ensureAbsoluteHref(asLink(item.link, linkResolver) as string | null);
      const label = item?.link?.text?.trim() || asText(item.label) || deriveNavLabelFromHref(href);
      if (!label || !href) return null;
      return { label, href };
    })
    .filter(Boolean) as FooterLinkItem[];

  return parsed.length > 0 ? parsed : [];
}

function buildServiceTimes(items: any[] | undefined): FooterServiceTime[] {
  if (!Array.isArray(items)) return [];

  const parsed = items
    .map((item) => {
      const label = item?.label;
      const time = item?.time;
      if (!label || !time) return null;
      return { label, time };
    })
    .filter(Boolean) as FooterServiceTime[];

  return parsed.length > 0 ? parsed : [];
}

function buildSocialLinks(items: any[] | undefined): FooterLinkItem[] {
  if (!Array.isArray(items)) return [];

  const parsed = items
    .map((item) => {
      const href = ensureAbsoluteHref(asLink(item.link, linkResolver) as string | null);
      const label = item?.link?.text?.trim() || item?.label || deriveNavLabelFromHref(href);
      if (!label || !href) return null;
      return { label, href };
    })
    .filter(Boolean) as FooterLinkItem[];

  return parsed.length > 0 ? parsed : [];
}
