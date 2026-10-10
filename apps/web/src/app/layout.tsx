import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono, Sora } from "next/font/google";
import "@/styles/tokens.css";
import "@/styles/components.css";
import "@/styles/app.css";

// The handoff loads these with a CSS @import. next/font self-hosts them
// instead, which removes a render-blocking request and the flash of fallback
// text. app.css points the --font-* tokens at these variables.
const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
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

export const metadata: Metadata = {
  title: "AllInOne — PDFs, jobs, resume, tax and AI in one place",
  description:
    "Edit PDFs, build an ATS-ready resume, find jobs, calculate tax and file your ITR, and chat with Claude, GPT and Gemini — all from one place.",
};

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
      className={`${sora.variable} ${dmSans.variable} ${jetBrainsMono.variable}`}
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
