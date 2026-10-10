"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AiShell, openPalette } from "@/components/ai/AiShell";
import { AiRail } from "@/components/ai/AiRail";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

type Row = {
  label: string;
  href: string;
  icon: string;
  /** "live" draws the green dot; anything else is printed as a tag. */
  mark: "live" | "Soon" | "Key" | null;
};

/**
 * The rail from AppHome.md, minus two rows.
 *
 * The design lists "All tools" and "Recent files" above the categories. There
 * is no page behind either one — recent files live on the home page — and a
 * row pointing nowhere is worse than a row that is missing.
 */
const GROUPS: { heading: string | null; rows: Row[] }[] = [
  {
    heading: null,
    rows: [{ label: "Home", href: "/", icon: "home", mark: null }],
  },
  {
    heading: "PDF tools",
    rows: [
      { label: "Merge PDFs", href: "/pdf/merge", icon: "merge", mark: "live" },
      { label: "Split PDF", href: "/pdf/split", icon: "split", mark: "live" },
      {
        label: "Rotate & delete",
        href: "/pdf/organise",
        icon: "rotate",
        mark: "live",
      },
      {
        label: "PDF to images",
        href: "/pdf/to-images",
        icon: "image",
        mark: "live",
      },
      {
        label: "Images to PDF",
        href: "/pdf/from-images",
        icon: "file",
        mark: "live",
      },
    ],
  },
  {
    heading: "Career",
    rows: [
      { label: "Find jobs", href: "/jobs", icon: "briefcase", mark: "Soon" },
      { label: "Resume", href: "/resume", icon: "resume", mark: "Soon" },
      { label: "ATS check", href: "/ats", icon: "target", mark: "Soon" },
    ],
  },
  {
    heading: "Money & AI",
    rows: [
      { label: "Tax & ITR", href: "/tax", icon: "rupee", mark: "Soon" },
      { label: "AI chat", href: "/ai", icon: "chat", mark: "Key" },
    ],
  },
];

/**
 * The v3 shell: a 248px rail, a fluid workspace and a docked AI rail. It
 * wraps the home page and every tool page, so the sidebar does the job the
 * category tabs used to.
 *
 * Below 1440 the AI rail hides and the floating launcher takes over; below
 * 1024 the sidebar becomes a drawer. The handoff's CSS does the first and
 * hides the sidebar outright for the second, so the drawer is in app.css.
 */
export function AppShell({
  children,
  rail,
}: {
  children: React.ReactNode;
  /** Defaults to the home page only; a tool page needs the room. */
  rail?: boolean;
}) {
  const pathname = usePathname();
  const [drawer, setDrawer] = useState(false);
  // Collapsing the rail hands the assistant back to the floating launcher.
  const [railOpen, setRailOpen] = useState(true);
  const showRail = (rail ?? pathname === "/") && railOpen;

  return (
    <div
      className={showRail ? "aio-shell" : "aio-shell aio-shell--no-rail"}
      data-drawer={drawer ? "open" : "closed"}
    >
      {drawer && (
        <button
          type="button"
          className="aio-p-scrim"
          aria-label="Close menu"
          onClick={() => setDrawer(false)}
        />
      )}

      <aside className="aio-side">
        <Logo style={{ padding: "4px 10px 0" }} />

        <Link
          className="aio-btn aio-btn--primary aio-side-new"
          href="/pdf"
          onClick={() => setDrawer(false)}
        >
          <Icon name="upload" />
          Open a file
        </Link>

        {GROUPS.map((group, index) => (
          <nav className="aio-side-group" key={group.heading ?? index}>
            {group.heading && <h6>{group.heading}</h6>}
            {group.rows.map((row) => (
              <Link
                key={row.href}
                href={row.href}
                className={group.heading ? "sub" : undefined}
                aria-current={pathname === row.href ? "page" : undefined}
                onClick={() => setDrawer(false)}
              >
                <Icon name={row.icon} />
                {row.label}
                {row.mark === "live" ? (
                  <span className="live" title="Live" />
                ) : (
                  row.mark && <span className="soon">{row.mark}</span>
                )}
              </Link>
            ))}
          </nav>
        ))}

        <div className="aio-side-card" style={{ marginTop: "auto" }}>
          <strong>Accounts are coming</strong>
          <p>
            Everything here already works without one — PDFs never leave your
            device either way.
          </p>
          <Link className="aio-btn aio-btn--secondary aio-btn--sm" href="/welcome">
            What&rsquo;s planned
          </Link>
        </div>
      </aside>

      <main className="aio-main">
        <div className="aio-topbar">
          <button
            type="button"
            className="aio-icon-btn aio-p-drawerclose"
            aria-label="Open menu"
            aria-expanded={drawer}
            onClick={() => setDrawer(true)}
          >
            <Icon name="menu" />
          </button>

          <button
            type="button"
            className="aio-nav-search aio-p-navsearch"
            style={{ width: 440 }}
            onClick={openPalette}
          >
            <Icon name="search" />
            <span>Search tools, files, or ask AI…</span>
            <span className="aio-kbd">&#8984;K</span>
          </button>

          <div className="spacer" />

          <span className="aio-p-livepill">
            <i />5 PDF tools live
          </span>
          <ThemeToggle />
          <Link className="aio-btn aio-btn--ghost aio-btn--sm" href="/welcome">
            Sign in
          </Link>
          <Link className="aio-btn aio-btn--primary aio-btn--sm" href="/pdf">
            Open a tool
          </Link>
        </div>

        {children}

        <footer className="aio-app-foot">
          <span>
            &copy; 2026 AllInOne &middot; Made in India &middot; Files never
            leave your device
          </span>
          <nav>
            <Link href="/welcome">About</Link>
            <Link href="/pdf">PDF tools</Link>
            <Link href="/tax">Tax &amp; ITR</Link>
            <Link href="/ai">AI chat</Link>
          </nav>
        </footer>
      </main>

      {showRail && <AiRail onCollapse={() => setRailOpen(false)} />}

      <AiShell hasRail={showRail} />
    </div>
  );
}
