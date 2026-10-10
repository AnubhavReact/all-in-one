import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import type { TileHue } from "@aio/core";

/** The shell every tool page shares: breadcrumb, icon tile, title, standfirst. */
export function ToolPage({
  hue,
  icon,
  section,
  sectionHref,
  title,
  blurb,
  children,
}: {
  hue: TileHue;
  icon: string;
  section: string;
  sectionHref: string;
  title: string;
  blurb: string;
  children: React.ReactNode;
}) {
  return (
    <div className="aio-p-tool">
      <header className="aio-p-toolhead">
        <Link className="aio-p-crumb" href={sectionHref}>
          {/* The set has no left chevron; the down one turned a quarter is it. */}
          <Icon name="chevron" className="aio-p-crumb-caret" />
          {section}
        </Link>

        <div className="aio-row" style={{ gap: "var(--space-3)" }}>
          <span className={`aio-tile aio-tile--${hue}`}>
            <Icon name={icon} />
          </span>
          <h1 className="aio-h2" style={{ fontSize: 34, lineHeight: "40px" }}>
            {title}
          </h1>
        </div>

        <p className="aio-lead" style={{ maxWidth: "62ch" }}>
          {blurb}
        </p>
      </header>

      <div className="aio-p-stack">{children}</div>
    </div>
  );
}
