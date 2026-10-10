"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

/**
 * The rail only lists pages that exist. "All tools", "My files" and
 * "Applications" are in the design but have nowhere to go yet, and two rows
 * pointing at the same route would both light up as the current page.
 */
const GROUPS = [
  {
    heading: null,
    items: [{ label: "Dashboard", href: "/dashboard", icon: "home" }],
  },
  {
    heading: "Documents",
    items: [{ label: "PDF tools", href: "/pdf", icon: "file", count: "5" }],
  },
  {
    heading: "Career",
    items: [
      { label: "Jobs", href: "/jobs", icon: "briefcase", soon: true },
      { label: "Resume", href: "/resume", icon: "resume", soon: true },
      { label: "ATS check", href: "/ats", icon: "target", soon: true },
    ],
  },
  {
    heading: "Money & AI",
    items: [
      { label: "Tax & ITR", href: "/tax", icon: "rupee", soon: true },
      { label: "AI chat", href: "/ai", icon: "chat", soon: true },
    ],
  },
];

/** The signed-in shell: rail, top bar, content. Under 1024px the rail is a drawer. */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [drawer, setDrawer] = useState(false);

  return (
    <div className="aio-p-app" data-drawer={drawer ? "open" : "closed"}>
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

        {GROUPS.map((group, index) => (
          <nav className="aio-side-group" key={group.heading ?? index}>
            {group.heading && <h6>{group.heading}</h6>}
            {group.items.map((item) => (
              <Link
                key={`${item.label}-${item.href}`}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                onClick={() => setDrawer(false)}
              >
                <Icon name={item.icon} />
                {item.label}
                {"count" in item && item.count && (
                  <span className="n">{item.count}</span>
                )}
                {"soon" in item && item.soon && (
                  <span className="aio-badge aio-badge--soon">Soon</span>
                )}
              </Link>
            ))}
          </nav>
        ))}

        <div className="aio-side-foot">
          <span className="aio-avatar">AS</span>
          <div>
            <strong>Your account</strong>
            <span>Not signed in yet</span>
          </div>
        </div>
      </aside>

      <div className="aio-p-main">
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

          <Link className="aio-nav-search" href="/pdf">
            <Icon name="search" />
            <span>Search tools, files, jobs…</span>
            <span className="aio-kbd">&#8984;K</span>
          </Link>

          <div className="spacer" />

          <Link className="aio-btn aio-btn--primary aio-btn--sm" href="/">
            <Icon name="upload" />
            Upload file
          </Link>
          <ThemeToggle />
          <span className="aio-avatar">AS</span>
        </div>

        {children}
      </div>
    </div>
  );
}
