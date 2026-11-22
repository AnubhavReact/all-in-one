import { SiteAvtar } from "@/components/site/SiteAvtar";
import { SiteNav } from "@/components/site/SiteNav";
import { Footer } from "@/components/ui/Footer";

/**
 * The public shell: navbar, page, footer, and AVTAR in the corner. Only
 * /welcome uses it — the working pages live in the app shell.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="ui">
      <SiteNav />
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <SiteAvtar />
    </div>
  );
}
