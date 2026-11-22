"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronRight, Menu, Search, X } from "lucide-react";
import { TOOLS, isLive } from "@aio/core";
import { Avtar } from "@/components/avtar/Avtar";
import { Button, IconButton } from "@/components/ui/Button";
import { Footer } from "@/components/ui/Footer";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { CommandPalette } from "./CommandPalette";
import { ASK_EVENT, PALETTE_EVENT, openPalette } from "./events";
import { Sidebar } from "./Sidebar";
import s from "./Shell.module.css";

/** What the breadcrumb and the phone title call the current page. */
function pageTitle(pathname: string): { section?: { label: string; href: string }; title: string } {
  if (pathname === "/") return { title: "Home" };
  if (pathname.startsWith("/learn")) return { title: "Learn" };
  if (pathname.startsWith("/tollwala")) return { title: "Toll plaza solutions" };
  const tool = TOOLS.find((t) => pathname.startsWith(t.href));
  if (tool?.href.startsWith("/pdf/")) return { section: { label: "PDF tools", href: "/pdf" }, title: tool.name };
  if (tool) return { title: tool.name };
  if (pathname.startsWith("/pdf")) return { title: "PDF tools" };
  return { title: "AllInOne" };
}

/** Pages with their own primary button, where "Open a tool" would be a second one. */
const isToolPage = (pathname: string) =>
  pathname.startsWith("/tollwala") || TOOLS.some((t) => isLive(t) && pathname.startsWith(t.href));

/**
 * The app shell: sidebar (a drawer below 1024px), sticky top bar, the ⌘K
 * palette and AVTAR. Owns the keyboard shortcuts and the window events that
 * let any button open the palette or AVTAR.
 */
export function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [drawer, setDrawer] = useState(false);
  const [palette, setPalette] = useState<{ filter: "tools" | null } | null>(null);
  const [avtarOpen, setAvtarOpen] = useState(false);
  const [seed, setSeed] = useState<{ text: string; id: number } | null>(null);
  const side = useRef<HTMLElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);

  const ask = useCallback((text: string) => {
    setSeed({ text, id: Date.now() });
    setAvtarOpen(true);
  }, []);
  const closeDrawer = useCallback(() => setDrawer(false), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey)) return;
      const k = e.key.toLowerCase();
      if (k === "k") {
        e.preventDefault();
        setPalette((p) => (p ? null : { filter: null }));
      } else if (k === "j") {
        e.preventDefault();
        setAvtarOpen((o) => !o);
      }
    };
    const onPalette = (e: Event) => setPalette({ filter: (e as CustomEvent).detail === "tools" ? "tools" : null });
    const onAsk = (e: Event) => ask(String((e as CustomEvent).detail ?? ""));
    document.addEventListener("keydown", onKey);
    window.addEventListener(PALETTE_EVENT, onPalette);
    window.addEventListener(ASK_EVENT, onAsk);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener(PALETTE_EVENT, onPalette);
      window.removeEventListener(ASK_EVENT, onAsk);
    };
  }, [ask]);

  // Drawer: focus in, trap Tab, Esc closes, focus back to the menu button.
  useEffect(() => {
    if (!drawer) return;
    const el = side.current;
    const focusables = () => Array.from(el?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []);
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDrawer(false);
        return;
      }
      if (e.key !== "Tab") return;
      const list = focusables();
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const btn = menuBtn.current;
    return () => {
      document.removeEventListener("keydown", onKey);
      btn?.focus();
    };
  }, [drawer]);

  const { section, title } = pageTitle(pathname);
  const toolPage = isToolPage(pathname);

  return (
    <div className={`ui ${s.frame}`} data-drawer={drawer ? "open" : "closed"}>
      <button type="button" className={s.scrim} aria-label="Close menu" tabIndex={-1} onClick={closeDrawer} />
      <aside ref={side} className={s.side} aria-label="Sidebar">
        {drawer && (
          <IconButton icon={X} label="Close menu" onClick={closeDrawer} style={{ position: "absolute", top: 14, right: 10 }} />
        )}
        <Sidebar onNavigate={closeDrawer} />
      </aside>

      <div className={s.main}>
        <header className={s.top}>
          <IconButton ref={menuBtn} icon={Menu} label="Open menu" className={s.menuBtn} aria-expanded={drawer} onClick={() => setDrawer(true)} />
          <nav className={s.crumbs} aria-label="Breadcrumb">
            {pathname !== "/" && (
              <>
                <Link href="/">Home</Link>
                <ChevronRight aria-hidden />
              </>
            )}
            {section && (
              <>
                <Link href={section.href}>{section.label}</Link>
                <ChevronRight aria-hidden />
              </>
            )}
            <span aria-current="page">{title}</span>
          </nav>
          <span className={s.mobileTitle}>{title}</span>

          <button type="button" className={s.searchBtn} onClick={() => openPalette()} aria-label="Search tools, or ask AVTAR (Ctrl or Command K)">
            <Search aria-hidden strokeWidth={1.8} />
            <span>Search tools, or ask AVTAR</span>
            <kbd aria-hidden>⌘K</kbd>
          </button>
          <ThemeToggle />
          {!toolPage && (
            <Button variant="primary" className={s.openTool} onClick={() => openPalette("tools")}>
              Open a tool
            </Button>
          )}
        </header>

        <main id="main" className={s.content} data-wide={pathname === "/" ? "" : undefined} tabIndex={-1}>
          {children}
        </main>
        <div className={s.appFoot}>
          <Footer inApp />
        </div>
      </div>

      {palette && <CommandPalette filter={palette.filter} onClose={() => setPalette(null)} onAsk={ask} />}
      <Avtar open={avtarOpen} seed={seed} onOpen={() => setAvtarOpen(true)} onClose={() => setAvtarOpen(false)} />
    </div>
  );
}
