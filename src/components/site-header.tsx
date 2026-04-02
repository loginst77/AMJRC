import type { ComponentProps } from "react";
import Link from "next/link";
import Image from "next/image";
import { PrismicNextImage } from "@prismicio/next";

import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { MobileNav } from "@/components/mobile-nav";
import { NavDropdown, type NavDropdownItem } from "@/components/nav-dropdown";
import { NavLink } from "@/components/nav-link";
import type { HeaderNavLinkItem } from "@/components/mobile-nav";

type ButtonVariant = ComponentProps<typeof ButtonLink>["variant"];

export type ActionButton = {
  label: string;
  href: string;
  variant: ButtonVariant;
};

export type SiteHeaderProps = {
  navigationLinks: HeaderNavLinkItem[];
  dropdownItems: NavDropdownItem[];
  dropdownLabel: string;
  dropdownHref: string;
  logo: any;
  primaryAction: ActionButton;
  secondaryAction: ActionButton;
};

export function SiteHeader({
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
          <Link href="/" className="inline-flex items-center" aria-label="Go to homepage">
            {logo?.url ?
              <PrismicNextImage field={logo} alt={logo?.alt || "Logo"} className="h-[70px] w-auto" />
            : <Image src="/logo.svg" alt="Logo" width={70} height={70} />}
          </Link>

          <nav className="ml-10 hidden items-center gap-1 md:flex">
            {navigationLinks.map((item) => (
              <NavLink key={`${item.href}-${item.label}`} href={item.href}>
                {item.label}
              </NavLink>
            ))}
            <NavDropdown label={dropdownLabel} href={dropdownHref} items={dropdownItems} />
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <MobileNav items={navigationLinks} dropdownItems={dropdownItems} logo={logo} />
          <div className="hidden md:flex items-center gap-2">
            {primaryAction ?
              <ButtonLink href={primaryAction.href} variant={primaryAction.variant} size="md">
                {primaryAction.label}
              </ButtonLink>
            : null}
            {secondaryAction ?
              <ButtonLink href={secondaryAction.href} variant={secondaryAction.variant} size="md">
                {secondaryAction.label}
              </ButtonLink>
            : null}
          </div>
        </div>
      </Container>
    </header>
  );
}
