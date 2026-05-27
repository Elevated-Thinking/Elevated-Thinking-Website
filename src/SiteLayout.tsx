import type { ReactNode } from "react";

import logoUrl from "./assets/elevated-logo.svg";
import { footerEmail } from "./siteConfig";

type SitePage = "home" | "about";

export function SiteLayout({
  currentPage,
  children,
}: {
  currentPage: SitePage;
  children: ReactNode;
}) {
  const isAbout = currentPage === "about";

  return (
    <div
      id="top"
      className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]"
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-[var(--color-primary)] focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 border-b border-black/5 bg-[var(--color-background)]/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-6">
          <a
            href={isAbout ? "../" : "#top"}
            className="flex items-center"
            aria-label="Elevated home"
          >
            <img
              src={logoUrl}
              alt="Elevated"
              className="brand-logo brand-logo-header"
              width="895"
              height="130"
            />
          </a>
          <nav
            className="flex shrink-0 items-center gap-4 text-xs font-medium text-[var(--color-primary)] sm:text-sm md:gap-8"
            aria-label="Primary"
          >
            <a
              href={isAbout ? "./" : "./about/"}
              aria-current={isAbout ? "page" : undefined}
            >
              About
            </a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      <main id="main-content">{children}</main>

      <footer id="contact" className="border-t border-black/5 px-6 py-10">
        <div className="mx-auto grid max-w-7xl gap-y-2 lg:grid-cols-[auto_1fr] lg:items-end lg:gap-x-8">
          <img
            src={logoUrl}
            alt="Elevated"
            className="brand-logo brand-logo-footer lg:col-start-1 lg:row-start-1"
            width="895"
            height="130"
          />
          <p className="text-sm text-[var(--color-primary)]/80 lg:col-start-1 lg:row-start-2">
            Design-led strategy and AI-enabled product work.
          </p>
          <address className="mt-4 text-sm not-italic lg:col-start-2 lg:row-start-2 lg:mt-0 lg:justify-self-end">
            <div>
              <a
                className="text-inherit"
                href={`mailto:${footerEmail}?subject=Hello`}
              >
                {footerEmail}
              </a>
            </div>
          </address>
        </div>
      </footer>
    </div>
  );
}
