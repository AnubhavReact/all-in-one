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
  const [menuOpen, setMenuOpen] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Esc closes whichever is open; a click outside closes the mega menu.
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setMegaOpen(false);
      setMenuOpen(false);
    }
    function onClick(event: MouseEvent) {
      if (!megaRef.current?.contains(event.target as Node)) setMegaOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  /** Navigating away should never leave a menu hanging open. */
  function closeMenus() {
    setMegaOpen(false);
    setMenuOpen(false);
  }

  function openAfterIntent() {
    hoverTimer.current = setTimeout(() => setMegaOpen(true), 150);
  }
  function cancelIntent() {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
  }

  return (
    <header className="aio-nav">
      <Logo />

      <nav className="aio-nav-links" aria-label="Main">
        <div
          ref={megaRef}
          style={{ position: "relative" }}
          onMouseEnter={openAfterIntent}
          onMouseLeave={() => {
            cancelIntent();
            setMegaOpen(false);
          }}
        >
          <Link
            href="/pdf"
            aria-current={pathname.startsWith("/pdf") ? "page" : undefined}
            aria-expanded={megaOpen}
            onClick={(e) => {
              // On a pointer, the first click opens the menu rather than
              // jumping away; the "View all" row is the way through.
              if (!megaOpen && e.detail > 0) {
                e.preventDefault();
                setMegaOpen(true);
              }
            }}
          >
            PDF tools
            <Icon name="chevron" className="caret" />
          </Link>

          {megaOpen && (
            <div
              className="aio-mega"
              role="menu"
              style={{ position: "absolute", top: "calc(100% + 10px)", left: 0 }}
            >
              {MEGA.map((column) => (
                <div className="aio-mega-col" key={column.heading}>
                  <h6>{column.heading}</h6>
                  {column.slugs.map((slug) => {
                    const tool = TOOLS.find((t) => t.slug === slug);
                    if (!tool) return null;
                    return (
                      <Link href={tool.href} key={slug} role="menuitem" onClick={closeMenus}>
                        <span
                          className={`aio-tile aio-tile--sm aio-tile--${tool.hue}`}
                        >
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
                    <Link href={column.more} role="menuitem" onClick={closeMenus}>
                      <div>
                        <strong style={{ color: "var(--brand-text)" }}>
                          View all PDF tools &rarr;
                        </strong>
                      </div>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

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

      {menuOpen && (
        <div
          className="aio-mega"
          role="menu"
          style={{
            position: "absolute",
            top: "100%",
            left: "var(--space-6)",
            right: "var(--space-6)",
            width: "auto",
            gridTemplateColumns: "1fr",
          }}
        >
          <div className="aio-mega-col">
            {SECTIONS.map((section) => (
              <Link href={section.href} key={section.id} role="menuitem" onClick={closeMenus}>
                <div>
                  <strong>{section.name}</strong>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
