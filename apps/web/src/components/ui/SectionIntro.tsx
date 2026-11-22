import clsx from "clsx";
import type { ReactNode } from "react";
import s from "./Cards.module.css";

/**
 * Eyebrow, heading, intro. Left-aligned by default; `center` is only for the
 * Roadmap and FAQ. Put at most one <em> accent phrase in the title.
 */
export function SectionIntro({
  eyebrow,
  title,
  children,
  align = "left",
  as: H = "h2",
  id,
}: {
  eyebrow?: string;
  title: ReactNode;
  children?: ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2";
  id?: string;
}) {
  return (
    <div className={clsx(s.intro, align === "center" && s.center)}>
      {eyebrow && <span className="t-eyebrow">{eyebrow}</span>}
      <H id={id} className={H === "h1" ? "t-h1" : "t-h2"}>
        {title}
      </H>
      {children && <p className="t-body-l">{children}</p>}
    </div>
  );
}

/** The accent phrase: plain --brand-ink colour, never a gradient. */
export function Accent({ children }: { children: ReactNode }) {
  return <span className="t-accent">{children}</span>;
}
