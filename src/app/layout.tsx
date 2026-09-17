import type { Metadata, Viewport } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import { MotionProvider } from "@/components/motion-provider";
import { SiteLoader } from "@/components/site-loader";
import { site } from "@/lib/site";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  // Real italic cut for the wordmark descriptor, instead of a browser-slanted fake.
  style: ["normal", "italic"],
});

// Static (non-variable) Geist Black for stroked SVG headings. Variable fonts keep overlapping
// contours, which show up as stray lines when text is outlined.
const geistBlack = localFont({
  src: "../../node_modules/geist/dist/fonts/geist-sans/Geist-Black.woff2",
  variable: "--font-geist-black",
  weight: "900",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "AHMXD Technologies | Calgary Web Development & IT Systems",
    template: "%s | AHMXD Technologies",
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.founder, url: site.links.portfolio }],
  keywords: [
    "Calgary web development",
    "Calgary web design",
    "small business website Calgary",
    "Next.js developer Calgary",
    "IT infrastructure Calgary",
    "website hosting and maintenance",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: "/",
    siteName: site.name,
    title: "AHMXD Technologies | Calgary Web Development & IT Systems",
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "AHMXD Technologies",
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
  ],
};

// Runs before paint so the saved theme never flashes. Dark is the brand default.
const themeScript = `(function(){try{var t=localStorage.getItem("ahmxd-theme");document.documentElement.dataset.theme=t==="light"?"light":"dark"}catch(e){document.documentElement.dataset.theme="dark"}})();`;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.name,
  url: site.url,
  email: site.email,
  description: site.description,
  founder: { "@type": "Person", name: site.founder, url: site.links.portfolio },
  address: {
    "@type": "PostalAddress",
    addressLocality: site.city,
    addressRegion: site.regionCode,
    addressCountry: site.country,
  },
  areaServed: [
    { "@type": "City", name: "Calgary" },
    { "@type": "Country", name: "Canada" },
  ],
  knowsAbout: ["Web development", "Web applications", "IT infrastructure", "Website hosting", "Automation"],
  sameAs: [site.links.portfolio, site.links.github, site.links.linkedin],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-CA"
      data-theme="dark"
      suppressHydrationWarning
      className={`${geist.variable} ${geistBlack.variable} ${jetbrains.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <noscript>
          <style>{"#site-loader{display:none}"}</style>
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-dvh bg-bg text-ink">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-60 focus:rounded-full focus:bg-accent-fill focus:px-4 focus:py-2 focus:text-accent-contrast"
        >
          Skip to content
        </a>
        <SiteLoader />
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
