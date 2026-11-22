import type { ReactNode } from "react";
import { ChevronDown, ShieldCheck, type LucideIcon } from "lucide-react";
import { IconTile, type Tone } from "./IconTile";
import { PrivacyCard } from "./PrivacyCard";
import { StepsCard } from "./StepsCard";
import { Tag } from "./Tag";
import s from "./ToolLayout.module.css";
import c from "./Chip.module.css";

/**
 * Every tool page: header (tile, h1, blurb, Live tag, "Runs in your tab"),
 * the tool in an 8/12 column, and "How it works" + privacy in a sticky 4/12
 * side column. Below 1024px the side column folds into one accordion under
 * the tool.
 */
export function ToolLayout({
  icon,
  tone,
  title,
  blurb,
  steps,
  privacy,
  privacyTitle,
  children,
}: {
  icon: LucideIcon;
  tone: Tone;
  title: string;
  blurb: string;
  steps: { title: string; body: string }[];
  /** Overrides the privacy card's sentence (e.g. the tax calculator stores nothing). */
  privacy?: ReactNode;
  /** Overrides "Your files stay here". */
  privacyTitle?: string;
  children: ReactNode;
}) {
  const side = (
    <>
      <StepsCard steps={steps} />
      <PrivacyCard title={privacyTitle}>{privacy}</PrivacyCard>
    </>
  );
  return (
    <div className={s.page}>
      <header className={s.head}>
        <IconTile icon={icon} tone={tone} size={48} />
        <h1>{title}</h1>
        <p className={s.blurb}>{blurb}</p>
        <div className={s.chips}>
          <Tag kind="live" />
          <span className={`${c.chip} ${c.promise}`}>
            <ShieldCheck aria-hidden strokeWidth={2} />
            Runs in your tab
          </span>
        </div>
      </header>
      <div className={s.split}>
        <div className={s.mainCol}>{children}</div>
        <aside className={s.sideCol} aria-label="About this tool">
          {side}
        </aside>
        <details className={s.mobileSide}>
          <summary>
            How it works &middot; Private
            <ChevronDown aria-hidden strokeWidth={2} />
          </summary>
          <div>{side}</div>
        </details>
      </div>
    </div>
  );
}
