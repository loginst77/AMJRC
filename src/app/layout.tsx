import "./globals.css";

import type { ComponentProps } from "react";
import Link from "next/link";
import { Inter } from "next/font/google";
import Image from "next/image";
import { asLink, asText } from "@prismicio/client";
import { PrismicText } from "@prismicio/react";
import { PrismicNextImage, PrismicPreview } from "@prismicio/next";

import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { MobileNav } from "@/components/mobile-nav";
import { NavDropdown, type NavDropdownItem } from "@/components/nav-dropdown";
import { NavLink } from "@/components/nav-link";
import { createClient, repositoryName } from "@/prismicio";
import type { NavigationDocumentDataLinksItem } from "../../prismicio-types";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const fallbackMediaDropdownItems: NavDropdownItem[] = [
  { label: "Видео", href: "/media/videos", icon: "Video" },
  { label: "Подкасты", href: "/media/podcasts", icon: "Mic" },
  { label: "Статьи", href: "/media/articles", icon: "FileText" },
  { label: "Книги", href: "/media/books", icon: "BookMarked" },
  { label: "Радио", href: "/media/radio", icon: "Radio" },
  { label: "Газета", href: "/media/newspaper", icon: "Newspaper" },
];

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const client = createClient();
  const navigation = await client.getSingle("navigation").catch(() => null);
  const footer = await client.getSingle("footer").catch(() => null);

  const navigationData = (navigation?.data ?? {}) as any;
  const footerData = (footer?.data ?? {}) as any;
  const navigationLinks = navigationData.links ?? [];
  const { dropdownItems, dropdownLabel, dropdownHref } = buildMediaDropdown(
    navigationData,
  );
  const { primaryAction, secondaryAction } = buildActionButtons(navigationData);
  const logo = navigationData.logo;
  const footerContent = buildFooterContent(footerData);
  const shouldRenderFooter = hasFooterContent(footerContent);

  return (
    <html lang="en" className={inter.variable}>
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
        {shouldRenderFooter ? <SiteFooter {...footerContent} /> : null}
        <PrismicPreview repositoryName={repositoryName} />
      </body>
    </html>
  );
}

type SiteHeaderProps = {
  navigationLinks: NavigationDocumentDataLinksItem[];
  dropdownItems: NavDropdownItem[];
  dropdownLabel: string;
  dropdownHref: string;
  logo: any;
  primaryAction: ActionButton;
  secondaryAction: ActionButton;
};

type FooterLinkItem = {
  label: string;
  href: string;
};

type FooterServiceTime = {
  label: string;
  time: string;
};

type SiteFooterProps = {
  logo: any;
  addressLine1: string;
  addressLine2: string;
  email: string;
  phone: string;
  navigationTitle: string;
  navigationLinks: FooterLinkItem[];
  actionsTitle: string;
  actionLinks: FooterLinkItem[];
  serviceTimesTitle: string;
  serviceTimes: FooterServiceTime[];
  socialLinks: FooterLinkItem[];
  copyrightText: string;
};

function SiteHeader({
  navigationLinks,
  dropdownItems,
  dropdownLabel,
  dropdownHref,
  logo,
  primaryAction,
  secondaryAction,
}: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/70 bg-white/80 backdrop-blur duration-300 hover:bg-white dark:border-zinc-800/70 dark:bg-zinc-950/70">
      <Container className="flex h-[88px] items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-semibold tracking-tight text-zinc-950 dark:text-white"
            aria-label="Go to homepage"
          >
            {logo?.url ? (
              <PrismicNextImage
                field={logo}
                alt={logo?.alt || "Logo"}
                className="h-[70px] w-auto"
              />
            ) : (
              <Image src="/logo.svg" alt="Logo" width={70} height={70} />
            )}
          </Link>

          <nav className="ml-10 hidden items-center gap-1 md:flex">
            {navigationLinks.map((item, index) => (
              // Resolve Prismic link to a URL; default to "/" if empty
              // eslint-disable-next-line react/no-array-index-key
              <NavLink
                key={`${asText(item.label)}-${index}`}
                href={asLink(item.link) ?? "/"}
              >
                <PrismicText field={item.label} />
              </NavLink>
            ))}
            <NavDropdown label={dropdownLabel} href={dropdownHref} items={dropdownItems} />
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <MobileNav items={navigationLinks} dropdownItems={dropdownItems} logo={logo} />
          <div className="hidden md:flex items-center gap-2">
            {primaryAction ? (
              <ButtonLink href={primaryAction.href} variant={primaryAction.variant} size="md">
                {primaryAction.label}
              </ButtonLink>
            ) : null}
            {secondaryAction ? (
              <ButtonLink
                href={secondaryAction.href}
                variant={secondaryAction.variant}
                size="md"
              >
                {secondaryAction.label}
              </ButtonLink>
            ) : null}
          </div>
        </div>
      </Container>
    </header>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-sm text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
    >
      {children}
    </Link>
  );
}

function SiteFooter({
  logo,
  addressLine1,
  addressLine2,
  email,
  phone,
  navigationTitle,
  navigationLinks,
  actionsTitle,
  actionLinks,
  serviceTimesTitle,
  serviceTimes,
  socialLinks,
  copyrightText,
}: SiteFooterProps) {
  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <Container className="py-10">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="space-y-3">
            <div className="font-semibold tracking-tight text-zinc-950 dark:text-white">
              {logo?.url ? (
                <PrismicNextImage
                  field={logo}
                  alt={logo?.alt || "Логотип"}
                  className="h-[100px] w-auto"
                />
              ) : null}
            </div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              {addressLine1}
              {addressLine2 ? (
                <>
                  <br />
                  {addressLine2}
                </>
              ) : null}
            </div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              {email ? (
                <a className="hover:underline" href={`mailto:${email}`}>
                  {email}
                </a>
              ) : null}
              {email && phone ? <br /> : null}
              {phone ? (
                <a className="hover:underline" href={`tel:${phone}`}>
                  {phone}
                </a>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="text-sm font-semibold text-zinc-950 dark:text-white">
                {navigationTitle}
              </div>
              <div className="flex flex-col gap-2">
                {navigationLinks.map((item) => (
                  <FooterLink key={`${item.label}-${item.href}`} href={item.href}>
                    {item.label}
                  </FooterLink>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-semibold text-zinc-950 dark:text-white">
                {actionsTitle}
              </div>
              <div className="flex flex-col gap-2">
                {actionLinks.map((item) => (
                  <FooterLink key={`${item.label}-${item.href}`} href={item.href}>
                    {item.label}
                  </FooterLink>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-semibold text-zinc-950 dark:text-white">
              {serviceTimesTitle}
            </div>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              {serviceTimes.map((service) => (
                <li
                  key={`${service.label}-${service.time}`}
                  className="flex items-center gap-2"
                >
                  <span>{service.label}</span>
                  <span className="font-medium text-zinc-950 dark:text-white">
                    {service.time}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-zinc-200 pt-6 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400 md:flex-row md:items-center md:justify-between">
          <div>{copyrightText}</div>
          <div className="flex flex-wrap gap-4">
            {socialLinks.map((item) => (
              <a
                key={`${item.label}-${item.href}`}
                className="hover:text-zinc-950 dark:hover:text-white"
                href={item.href}
                target="_blank"
                rel="noreferrer"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}

function buildMediaDropdown(
  navigationData: any,
): { dropdownItems: NavDropdownItem[]; dropdownLabel: string; dropdownHref: string } {
  const fallback = {
    dropdownItems: fallbackMediaDropdownItems,
    dropdownLabel: "Медия",
    dropdownHref: "/media",
  };

  if (!navigationData) return fallback;

  const dropdownItemsRaw = navigationData.dropdown_items;
  const dropdownItems = Array.isArray(dropdownItemsRaw)
    ? dropdownItemsRaw
        .map((item: any) => {
          const href = item?.link?.url as string | undefined;
          if (!href) return null;
          const label = asText(item.label) || "Без названия";
          const icon = normalizeDropdownIcon(item.icon);
          return { label, href, icon };
        })
        .filter(Boolean)
    : [];

  const dropdownLabel =
    asText(navigationData.dropdown_label) || fallback.dropdownLabel;
  const dropdownHref = navigationData.dropdown_link?.url ?? fallback.dropdownHref;

  return {
    dropdownItems: dropdownItems.length ? (dropdownItems as NavDropdownItem[]) : fallback.dropdownItems,
    dropdownLabel,
    dropdownHref,
  };
}

function normalizeDropdownIcon(iconValue: unknown): NavDropdownItem["icon"] {
  if (!iconValue || typeof iconValue !== "string") return undefined;
  const normalized = iconValue.toLowerCase();
  const map: Record<string, NavDropdownItem["icon"]> = {
    video: "Video",
    mic: "Mic",
    filetext: "FileText",
    "file_text": "FileText",
    bookmarked: "BookMarked",
    "book_marked": "BookMarked",
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

  const primaryLabel = asText(navigationData.action_button_primary_label);
  const primaryHref = navigationData.action_button_primary_link?.url as string | undefined;
  const primaryVariant = normalizeButtonVariant(
    navigationData.action_button_primary_variant,
    fallback.primaryAction.variant,
  );

  const secondaryLabel = asText(navigationData.action_button_secondary_label);
  const secondaryHref = navigationData.action_button_secondary_link?.url as string | undefined;
  const secondaryVariant = normalizeButtonVariant(
    navigationData.action_button_secondary_variant,
    fallback.secondaryAction.variant,
  );

  return {
    primaryAction:
      primaryLabel && primaryHref
        ? { label: primaryLabel, href: primaryHref, variant: primaryVariant }
        : fallback.primaryAction,
    secondaryAction:
      secondaryLabel && secondaryHref
        ? { label: secondaryLabel, href: secondaryHref, variant: secondaryVariant }
        : fallback.secondaryAction,
  };
}

function normalizeButtonVariant(
  value: unknown,
  fallback: ButtonVariant,
): ButtonVariant {
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
      const label = asText(item.label);
      const href = asLink(item.link);
      if (!label || !href) return null;
      return { label, href };
    })
    .filter(Boolean) as FooterLinkItem[];

  return parsed.length > 0 ? parsed : [];
}

function buildServiceTimes(
  items: any[] | undefined,
): FooterServiceTime[] {
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

function buildSocialLinks(
  items: any[] | undefined,
): FooterLinkItem[] {
  if (!Array.isArray(items)) return [];

  const parsed = items
    .map((item) => {
      const label = item?.label;
      const href = asLink(item.link);
      if (!label || !href) return null;
      return { label, href };
    })
    .filter(Boolean) as FooterLinkItem[];

  return parsed.length > 0 ? parsed : [];
}
