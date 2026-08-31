import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Instrument_Serif, Fragment_Mono } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/layout/site-footer";
import { siteUrl } from "@/lib/site";

/**
 * PROVENANCE type system:
 * - Instrument Sans   → editorial sans: identity, headings, body, UI
 * - Instrument Serif  → restrained human accent (italic only, used sparingly)
 * - Fragment Mono     → metadata only: accession IDs, labels, captions, evidence
 *                     (Helvetica-flavored mono — spec label, not terminal)
 */
const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const fragmentMono = Fragment_Mono({
  variable: "--font-fragment-mono",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Rishav Raj — AI Engineering Portfolio",
  description:
    "Personal engineering library of Rishav Raj — Computer Science Engineering student specializing in Artificial Intelligence.",
  authors: [{ name: "Rishav Raj" }],
  // Canonical homepage. Resolves against metadataBase (src/lib/site.ts —
  // set NEXT_PUBLIC_SITE_URL once the production domain exists).
  alternates: { canonical: "/" },
  openGraph: {
    title: "Rishav Raj — AI Engineering Portfolio",
    description:
      "Personal engineering library — Computer Science Engineering student specializing in Artificial Intelligence.",
    type: "website",
    url: "/",
    siteName: "Rishav Raj — Personal Engineering Library",
    // og:image is provided by the opengraph-image.png file convention.
  },
  twitter: {
    card: "summary_large_image",
    title: "Rishav Raj — AI Engineering Portfolio",
    description:
      "Personal engineering library — Computer Science Engineering student specializing in Artificial Intelligence.",
    // twitter:image is provided by the twitter-image.png file convention.
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0b0e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Dark-forced "Machine Hall" register. The Paper Archive register arrives
    // with the library redesign phase — no theme dependency in this prototype.
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${instrumentSans.variable} ${instrumentSerif.variable} ${fragmentMono.variable} font-sans antialiased`}
      >
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {/* Sticky-footer shell: footer sticks to the viewport bottom on short
            pages and is pushed down naturally once content grows. */}
        <div className="relative flex min-h-svh flex-col bg-background text-foreground">
          {children}
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
