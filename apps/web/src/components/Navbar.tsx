"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SECTIONS, TOOLS } from "@aio/core";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

/** The three mega-menu columns, each capped at the design's three rows. */
const MEGA = [
  { heading: "PDF", slugs: ["merge", "split", "to-images"], more: "/pdf" },
  { heading: "Career", slugs: ["jobs", "resume", "ats"], more: null },
  { heading: "Money & AI", slugs: ["tax", "ai"], more: null },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const [megaOpen, setMegaOpen] = useState(false);
  const [megaLeft, setMegaLeft] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const triggerRef = useRef<HTMLAnchorElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Esc closes whichever menu is open.
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setMegaOpen(false);
      setMenuOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  /** Navigating away should never leave a menu hanging open. */
  function closeMenus() {
    setMegaOpen(false);
    setMenuOpen(false);
  }

  /**
   * The panel is a child of the header rather than of .aio-nav-links, because
   * `.aio-nav-links a` sets a 36px height that would crush every row inside
   * it. So its left edge has to be measured from the trigger each time.
   */
  function openMega() {
    const trigger = triggerRef.current;
    if (trigger) setMegaLeft(trigger.offsetLeft);
    setMegaOpen(true);
  }

  function openAfterIntent() {
    hoverTimer.current = setTimeout(openMega, 150);
  }
  function cancelIntent() {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
  }

  return (
    <header
      className="aio-nav"
      onMouseLeave={() => {
        cancelIntent();
        setMegaOpen(false);
      }}
    >
      <Logo />

      <nav className="aio-nav-links" aria-label="Main">
        <Link
          ref={triggerRef}
          href="/pdf"
          aria-current={pathname.startsWith("/pdf") ? "page" : undefined}
          aria-expanded={megaOpen}
          onMouseEnter={openAfterIntent}
          onMouseLeave={cancelIntent}
          onFocus={openMega}
          onClick={(event) => {
            // On a pointer, the first click opens the menu rather than
            // jumping away; "View all PDF tools" is the way through.
            if (!megaOpen && event.detail > 0) {
              event.preventDefault();
              openMega();
            }
          }}
        >
          PDF tools
          <Icon name="chevron" className="caret" />
        </Link>

        {SECTIONS.filter((s) => s.id !== "pdf").map((section) => (
          <Link
            key={section.id}
            href={section.href}
            aria-current={pathname === section.href ? "page" : undefined}
            onClick={closeMenus}
          >
            {section.name}
          </Link>
        ))}
      </nav>

      <Link className="aio-nav-search" href="/pdf">
        <Icon name="search" />
        <span>Search tools</span>
        <span className="aio-kbd">&#8984;K</span>
      </Link>

      <div className="aio-nav-actions">
        <button
          type="button"
          className="aio-icon-btn aio-p-menubtn"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Icon name="menu" />
        </button>
        <ThemeToggle />
        <Link className="aio-btn aio-btn--ghost" href="/dashboard">
          Sign in
        </Link>
        <Link className="aio-btn aio-btn--primary" href="/dashboard">
          Get started
        </Link>
      </div>

      {megaOpen && (
        <div
          className="aio-mega aio-p-mega"
          role="menu"
          style={{ left: megaLeft }}
          onMouseEnter={cancelIntent}
        >
          {MEGA.map((column) => (
            <div className="aio-mega-col" key={column.heading}>
              <h6>{column.heading}</h6>
              {column.slugs.map((slug) => {
                const tool = TOOLS.find((t) => t.slug === slug);
                if (!tool) return null;
                return (
                  <Link
                    href={tool.href}
                    key={slug}
                    role="menuitem"
                    onClick={closeMenus}
                  >
                    <span className={`aio-tile aio-tile--sm aio-tile--${tool.hue}`}>
                      <Icon name={tool.icon} />
                    </span>
                    <div>
                      <strong>{tool.name}</strong>
                      <span>{tool.blurb}</span>
                    </div>
                  </Link>
                );
              })}
              {column.more && (
                <Link
                  className="aio-p-mega-more"
                  href={column.more}
                  role="menuitem"
                  onClick={closeMenus}
                >
                  View all PDF tools &rarr;
                </Link>
              )}
            </div>
          ))}
        </div>
      )}

      {menuOpen && (
        <div className="aio-mega aio-p-sheet" role="menu">
          <div className="aio-mega-col">
            {SECTIONS.map((section) => (
              <Link
                href={section.href}
                key={section.id}
                role="menuitem"
                onClick={closeMenus}
              >
                <div>
                  <strong>{section.name}</strong>
                </div>
              </Link>
            ))}
            {/* Hidden from the bar itself at this width, so it belongs here. */}
            <Link href="/dashboard" role="menuitem" onClick={closeMenus}>
              <div>
                <strong>Sign in</strong>
              </div>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
