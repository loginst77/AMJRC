import Link from "next/link";
import { PrismicNextImage } from "@prismicio/next";

import { Container } from "@/components/ui/container";

export type FooterLinkItem = {
  label: string;
  href: string;
};

export type FooterServiceTime = {
  label: string;
  time: string;
};

export type SiteFooterProps = {
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

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-sm text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white">
      {children}
    </Link>
  );
}

export function SiteFooter({
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
              {logo?.url ? <PrismicNextImage field={logo} alt={logo?.alt || "Логотип"} className="h-[100px] w-auto" /> : null}
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
              <div className="text-sm font-semibold text-zinc-950 dark:text-white">{navigationTitle}</div>
              <div className="flex flex-col gap-2">
                {navigationLinks.map((item) => (
                  <FooterLink key={`${item.label}-${item.href}`} href={item.href}>
                    {item.label}
                  </FooterLink>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-semibold text-zinc-950 dark:text-white">{actionsTitle}</div>
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
            <div className="text-sm font-semibold text-zinc-950 dark:text-white">{serviceTimesTitle}</div>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              {serviceTimes.map((service) => (
                <li key={`${service.label}-${service.time}`} className="flex items-center gap-2">
                  <span>{service.label}</span>
                  <span className="font-medium text-zinc-950 dark:text-white">{service.time}</span>
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
