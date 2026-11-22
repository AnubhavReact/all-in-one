import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter, JetBrains_Mono } from "next/font/google";
import "@/styles/ui/tokens.css";

// The handoff loads these with a CSS @import. next/font self-hosts them
// instead, which removes a render-blocking request and the flash of fallback
// text. app.css points the --font-* tokens at these variables.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});
const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

/**
 * Absolute URLs for the social card. Vercel fills the second one in on a
 * deploy; set NEXT_PUBLIC_SITE_URL once there is a real domain.
 */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "AllInOne — free PDF tools, tax calculator and interview prep",
  description:
    "Merge and split PDFs, compare old vs new tax regimes and prepare for interviews. Free, no account, and your files never leave your browser.",
  // From the brand pack. The .ico is gone: every browser that matters reads
  // the SVG, and the 32px PNG covers the rest.
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32" },
    ],
    apple: "/apple-touch-icon-180.png",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    title: "AllInOne — your everyday tools, all in one tab",
    description:
      "Free PDF tools, a tax calculator and interview prep. No account, and your files never leave your browser.",
    images: ["/og-image-1200x630.png"],
  },
  twitter: { card: "summary_large_image" },
};

/** Matches --page in each theme, so the phone's chrome blends into the page. */
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
    { media: "(prefers-color-scheme: dark)", color: "#141414" },
  ],
};

/**
 * Applies the saved theme before the first paint. Without this the page
 * renders in light and then jumps to dusk for anyone who chose dusk.
 *
 * It goes through next/script with beforeInteractive, not a bare <script>:
 * React never runs a script tag it renders itself, and warns about it.
 */
const THEME_SCRIPT = `try{var t=localStorage.getItem('aio-theme');if(t==='dusk')t='dark';if(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)t='dark';if(t)document.documentElement.setAttribute('data-theme',t)}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${inter.variable} ${jetBrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <Script id="aio-theme" strategy="beforeInteractive">
          {THEME_SCRIPT}
        </Script>
        {children}
      </body>
    </html>
  );
}
