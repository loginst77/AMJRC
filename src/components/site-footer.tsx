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
    <Link href={href} className="text-sm text-zinc-600 hover:text-zinc-950">
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
    <footer className="border-t border-zinc-200 bg-white">
      <Container className="py-10">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="space-y-3">
            <div className="font-semibold tracking-tight text-zinc-950">
              {logo?.url ? <PrismicNextImage field={logo} alt={logo?.alt || "Логотип"} className="h-[100px] w-auto" /> : null}
            </div>
            <div className="text-sm text-zinc-600">
              {addressLine1}
              {addressLine2 ? (
                <>
                  <br />
                  {addressLine2}
                </>
              ) : null}
            </div>
            <div className="text-sm text-zinc-600">
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

          {navigationLinks.length || actionLinks.length ? (
            <div className="grid auto-rows-max grid-cols-2 gap-6">
              {navigationLinks.length ? (
                <div className="space-y-2">
                  {navigationTitle ? <div className="text-sm font-semibold text-zinc-950">{navigationTitle}</div> : null}
                  <div className="flex flex-col gap-2">
                    {navigationLinks.map((item) => (
                      <FooterLink key={`${item.label}-${item.href}`} href={item.href}>
                        {item.label}
                      </FooterLink>
                    ))}
                  </div>
                </div>
              ) : null}
              {actionLinks.length ? (
                <div className="space-y-2">
                  {actionsTitle ? <div className="text-sm font-semibold text-zinc-950">{actionsTitle}</div> : null}
                  <div className="flex flex-col gap-2">
                    {actionLinks.map((item) => (
                      <FooterLink key={`${item.label}-${item.href}`} href={item.href}>
                        {item.label}
                      </FooterLink>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="space-y-3">
            <div className="text-sm font-semibold text-zinc-950">{serviceTimesTitle}</div>
            <ul className="space-y-2 text-sm text-zinc-600">
              {serviceTimes.map((service) => (
                <li key={`${service.label}-${service.time}`} className="flex items-center gap-2">
                  <span>{service.label}</span>
                  <span className="font-medium text-zinc-950">{service.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-zinc-200 pt-6 text-sm text-zinc-600 md:flex-row md:items-center md:justify-between">
          <div>{copyrightText}</div>
          <div className="flex flex-wrap gap-4">
            {socialLinks.map((item) => (
              <a
                key={`${item.label}-${item.href}`}
                className="hover:text-zinc-950"
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
