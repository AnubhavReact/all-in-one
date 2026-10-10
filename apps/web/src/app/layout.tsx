import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "@/styles/tokens.css";
import "@/styles/components.css";
import "@/styles/app.css";

// The handoff loads these with a CSS @import. next/font self-hosts them
// instead, which removes a render-blocking request and the flash of fallback
// text. app.css points the --font-* tokens at these variables.
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
  title: "AllInOne — PDFs, jobs, resume, tax and AI in one place",
  description:
    "Edit PDFs, build an ATS-ready resume, find jobs, compare tax regimes and get ITR help — just ask, or drop a file.",
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
    title: "AllInOne — every tool you need, one AI that knows them all",
    description:
      "PDF tools, jobs, resume builder, ATS check, tax & ITR help and AI chat in one place.",
    images: ["/og-image-1200x630.png"],
  },
  twitter: { card: "summary_large_image" },
};

/** Matches --surface-0 in dusk, so the phone's chrome blends into the page. */
export const viewport: Viewport = { themeColor: "#111a2e" };

/**
 * Applies the saved theme before the first paint. Without this the page
 * renders in dusk and then jumps to light for anyone who chose light.
 */
const THEME_SCRIPT = `try{var t=localStorage.getItem('aio-theme');if(t)document.documentElement.setAttribute('data-theme',t)}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-theme="dusk"
      className={`${jakarta.variable} ${inter.variable} ${jetBrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        <div className="aio">{children}</div>
      </body>
    </html>
  );
}
