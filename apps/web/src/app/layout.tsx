import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "800"],
});

export const metadata: Metadata = {
  title: "All In One — document, career and tax tools",
  description:
    "Merge and split PDFs, build a resume, check its ATS score, search jobs and work out your income tax, in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${archivo.variable} min-h-dvh`}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
        >
          Skip to content
        </a>
        <div className="md:flex">
          <Sidebar />
          <main id="main" className="min-w-0 flex-1 px-5 py-8 md:px-10 md:py-12">
            <div className="mx-auto max-w-5xl">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
