"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, BookOpen, CarFront, Home, Layers, ShieldCheck, type LucideIcon } from "lucide-react";
import { TOOLS, isLive, type Tool } from "@aio/core";
import { Tag } from "@/components/ui/Tag";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { toolIcon } from "@/lib/tool-ui";
import s from "./Shell.module.css";

const bySlug = (slugs: string[]) => slugs.map((slug) => TOOLS.find((t) => t.slug === slug)).filter((t): t is Tool => !!t);

const GROUPS: { label: string | null; soon?: boolean; tools?: Tool[]; pages?: { label: string; href: string; icon: LucideIcon; tag?: "new"; external?: boolean }[] }[] = [
  { label: null, pages: [{ label: "Home", href: "/", icon: Home }, { label: "Learn", href: "/learn", icon: BookOpen, tag: "new" }] },
  { label: "PDF tools", tools: bySlug(["merge", "split", "organise", "to-images", "from-images"]) },
  { label: "Career", soon: true, tools: bySlug(["ats", "resume", "jobs"]) },
  { label: "Money & AI", tools: bySlug(["tax", "ai"]) },
  { label: "More", pages: [{ label: "Toll plaza solutions", href: "/tollwala", icon: CarFront }] },
];

/**
 * Every row comes from the tool registry. Live tools are links; anything
 * not built yet is plain, dimmed text with a dashed tag and no focus stop.
 */
export function Sidebar({ onNavigate }: { onNavigate: () => void }) {
  const pathname = usePathname();
  const current = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href)) ? "page" : undefined;

  return (
    <>
      <Link href="/" className={s.logo} onClick={onNavigate}>
        <span className={s.mark} aria-hidden>
          <Layers strokeWidth={2} />
        </span>
        AllInOne
      </Link>

      {GROUPS.map((group, gi) => (
        <nav key={gi} className={s.group} aria-label={group.label ?? "Main"}>
          {group.label && (
            <h2 className={s.gh}>
              {group.label}
              {group.soon && <Tag kind="soon" className={s.mini} />}
            </h2>
          )}
          <ul>
            {group.pages?.map((page) => page.external ? (
              <li key={page.href}>
                <a href={page.href} className={s.item} target="_blank" rel="noopener noreferrer" onClick={onNavigate}>
                  <page.icon aria-hidden strokeWidth={1.8} />
                  <span className={s.label}>{page.label}</span>
                  <ArrowUpRight aria-hidden strokeWidth={1.8} className={s.ext} />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ) : (
              <li key={page.href}>
                <Link href={page.href} className={s.item} aria-current={current(page.href)} onClick={onNavigate}>
                  <page.icon aria-hidden strokeWidth={1.8} />
                  <span className={s.label}>{page.label}</span>
                  {page.tag && <Tag kind="new" className={s.mini} />}
                </Link>
              </li>
            ))}
            {group.tools?.map((tool) => {
              const Icon = toolIcon(tool);
              if (!isLive(tool)) {
                return (
                  <li key={tool.slug}>
                    <div className={`${s.item} ${s.off}`} aria-disabled="true">
                      <Icon aria-hidden strokeWidth={1.8} />
                      <span className={s.label}>{tool.name}</span>
                      {!group.soon && <Tag kind={tool.status === "building" ? "building" : "soon"} className={s.mini}>{tool.status === "building" ? "Building" : "Soon"}</Tag>}
                    </div>
                  </li>
                );
              }
              return (
                <li key={tool.slug}>
                  <Link href={tool.href} className={s.item} aria-current={current(tool.href)} onClick={onNavigate}>
                    <Icon aria-hidden strokeWidth={1.8} />
                    <span className={s.label}>{tool.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      ))}

      <div className={s.sideFoot}>
        <div className={s.privacy}>
          <ShieldCheck aria-hidden strokeWidth={1.8} />
          <strong>Your files stay here</strong>
          <small>Everything runs in this tab. 0 bytes uploaded.</small>
        </div>
        <div className={s.themeRow}>
          Theme
          <ThemeToggle />
        </div>
      </div>
    </>
  );
}
