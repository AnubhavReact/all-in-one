"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES, TOOLS } from "@aio/core";

/** First destination for a category: its own page, or its first tool. */
function categoryHref(id: string) {
  const own = TOOLS.filter((t) => t.category === id);
  if (own.length === 1) return own[0].href;
  return `/${id}`;
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Sections"
      className="border-b-2 border-ink bg-card md:sticky md:top-0 md:h-dvh md:w-60 md:shrink-0 md:border-b-0 md:border-r-2"
    >
      <div className="flex items-center gap-3 px-5 py-4 md:block md:px-6 md:py-6">
        <Link
          href="/"
          className="flex items-baseline gap-1.5 text-[17px] font-extrabold leading-none"
        >
          <span>All</span>
          <span className="h-2.5 w-2.5 translate-y-[-1px] bg-signal" aria-hidden />
          <span>In One</span>
        </Link>
        <p className="hidden pt-2 text-[13px] leading-snug text-ink-70 md:block">
          Your paperwork, in one window.
        </p>
      </div>

      <ul className="flex gap-1 overflow-x-auto px-3 pb-3 md:block md:space-y-0.5 md:overflow-visible md:px-3 md:pb-6">
        {CATEGORIES.map((cat) => {
          const href = categoryHref(cat.id);
          const active = pathname === href || pathname.startsWith(`/${cat.id}`);
          return (
            <li key={cat.id} className="shrink-0">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-2.5 rounded-tile px-3 py-2 text-[14px] font-medium whitespace-nowrap transition-colors ${
                  active ? "bg-ink text-paper" : "text-ink hover:bg-paper"
                }`}
              >
                <span
                  className={`h-2.5 w-2.5 shrink-0 ${cat.chip} ${
                    active ? "ring-1 ring-paper" : ""
                  }`}
                  aria-hidden
                />
                {cat.name}
              </Link>
            </li>
          );
        })}
      </ul>

      <p className="hidden px-6 text-[12px] leading-relaxed text-ink-40 md:block">
        PDF tools run on your device. Nothing is uploaded.
      </p>
    </nav>
  );
}
