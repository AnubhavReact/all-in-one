import Link from "next/link";
import type { TileHue } from "@aio/core";
import { Icon } from "@/components/ui/Icon";

/**
 * One header for every page inside the app shell.
 *
 * The pages used to carry marketing-scale headings — a 40px title under an
 * eyebrow — which belong on /welcome, not next to a sidebar. This is the app
 * version: tile, title, one line of explanation, and anything actionable on
 * the right.
 */
export function PageHead({
  icon,
  hue,
  title,
  blurb,
  badge,
  back,
  actions,
}: {
  icon: string;
  hue: TileHue;
  title: string;
  blurb: string;
  /** e.g. a "Coming soon" badge beside the title. */
  badge?: React.ReactNode;
  back?: { label: string; href: string };
  actions?: React.ReactNode;
}) {
  return (
    <header className="aio-p-pagehead">
      {back && (
        <Link className="aio-p-crumb" href={back.href}>
          {/* The set has no left chevron; the down one turned a quarter is it. */}
          <Icon name="chevron" className="aio-p-crumb-caret" />
          {back.label}
        </Link>
      )}

      <div className="aio-p-pagehead-row">
        <span className={`aio-tile aio-tile--${hue}`}>
          <Icon name={icon} />
        </span>
        <div className="m">
          <div className="t">
            <h1>{title}</h1>
            {badge}
          </div>
          <p>{blurb}</p>
        </div>
        {actions && <div className="aio-p-pagehead-act">{actions}</div>}
      </div>
    </header>
  );
}
