/**
 * Production origin — single source of truth for metadata and sitemap.
 *
 * LAUNCH NOTE (Phase 10): the production domain is NOT yet known. Once the
 * domain exists, set NEXT_PUBLIC_SITE_URL in the deployment/build environment
 * (Next inlines NEXT_PUBLIC_* at build time), e.g.:
 *
 *   NEXT_PUBLIC_SITE_URL=https://<production-domain>
 *
 * Until then every generated absolute URL — canonical, Open Graph, Twitter,
 * sitemap.xml — resolves to the reserved example.com placeholder below,
 * which is unambiguously a placeholder (never a rankable domain). This file
 * is the only place that needs to change; layout.tsx and sitemap.ts read it.
 */
export const siteUrl: string = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://rishav-raj.example.com"
).replace(/\/+$/, "");
