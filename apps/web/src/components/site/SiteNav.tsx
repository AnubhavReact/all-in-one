"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Layers, Menu, X } from "lucide-react";
import { Button, IconButton } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import s from "./SiteNav.module.css";

const LINKS = [
  { label: "Tools", href: "/welcome#tools" },
  { label: "Learn", href: "/learn" },
  { label: "How it works", href: "/welcome#how" },
  { label: "Roadmap", href: "/welcome#roadmap" },
  { label: "FAQ", href: "/welcome#faq" },
];

/**
 * The public navbar. Below 900px the links fold into a sheet: focus moves
 * in and is trapped, Esc closes it, focus returns to the menu button.
 */
export function SiteNav() {
  const [open, setOpen] = useState(false);
  const sheet = useRef<HTMLDivElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const el = sheet.current;
    const focusables = () => Array.from(el?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []);
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
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
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={s.nav}>
      <div className={s.inner}>
        <Link href="/welcome" className={s.logo}>
          <span className={s.mark} aria-hidden>
            <Layers strokeWidth={2} />
          </span>
          AllInOne
        </Link>

        <nav className={s.links} aria-label="Main">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={s.end}>
          <ThemeToggle />
          <Button variant="primary" href="/" className={s.open}>
            Open AllInOne
          </Button>
          <IconButton
            ref={menuBtn}
            icon={Menu}
            label="Open menu"
            className={s.menuBtn}
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen(true)}
          />
        </div>
      </div>

      {open && (
        <>
          <button type="button" className={s.scrim} aria-label="Close menu" tabIndex={-1} onClick={close} />
          <div ref={sheet} id="site-menu" className={s.sheet} role="dialog" aria-modal="true" aria-label="Menu">
            <div className={s.sheetHead}>
              <span className={s.logo}>
                <span className={s.mark} aria-hidden>
                  <Layers strokeWidth={2} />
                </span>
                AllInOne
              </span>
              <IconButton icon={X} label="Close menu" onClick={close} />
            </div>
            <nav aria-label="Main" className={s.sheetLinks}>
              {LINKS.map((link) => (
                <Link key={link.href} href={link.href} onClick={close}>
                  {link.label}
                </Link>
              ))}
            </nav>
            <Button variant="primary" href="/" block size="lg">
              Open AllInOne
            </Button>
          </div>
        </>
      )}
    </header>
  );
}
