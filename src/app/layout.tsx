import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Montserrat, Newsreader } from "next/font/google";
import { siteConfig } from "@/config/site";
import "./globals.css";

const display = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  weight: ["400", "500"],
  style: ["normal"],
  display: "swap",
});
const sans = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });
// Logo wordmark only (one weight), matching the GB brand lockup.
const logo = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", weight: ["800"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.title,
  description: siteConfig.description,
  keywords: [
    "surplus inventory management",
    "B2B bulk sourcing",
    "inventory recovery",
    "unsold stock solutions",
    "business surplus inventory",
    "bulk procurement",
    "supplier and buyer connections",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f9f7f3",
  width: "device-width",
  initialScale: 1,
};

/**
 * Runs before first paint. Decides whether the intro plays (once per browser
 * session, never under reduced motion) so the page never flashes underneath it.
 */
const introScript = `(function(){var d=document.documentElement;try{var seen=sessionStorage.getItem('gb-intro')==='1';var rm=window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(seen||rm){d.classList.add('gb-seen','gb-ready');}else{d.classList.add('gb-loading');}}catch(e){d.classList.add('gb-seen','gb-ready');}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-IN"
      className={`${display.variable} ${sans.variable} ${mono.variable} ${logo.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
        <noscript>
          <style>{`.loader{display:none!important}.reveal,.hero-fade,.rise-line>span{opacity:1!important;transform:none!important}html.gb-loading,html.gb-loading body{overflow:auto!important}`}</style>
        </noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
