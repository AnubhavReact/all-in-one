import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

/** The signed-out shell: sticky navbar, page, footer. */
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
    </>
  );
}
