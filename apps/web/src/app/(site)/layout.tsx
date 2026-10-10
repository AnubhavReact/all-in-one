import { AiShell } from "@/components/ai/AiShell";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

/**
 * The marketing shell: navbar, page, footer. Only /welcome uses it now — the
 * working pages moved into the app shell, where the sidebar is the
 * navigation.
 */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <AiShell />
    </>
  );
}
