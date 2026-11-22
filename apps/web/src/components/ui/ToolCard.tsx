import Link from "next/link";
import clsx from "clsx";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { IconTile, type Tone } from "./IconTile";
import { Tag } from "./Tag";
import s from "./Cards.module.css";

type Props = { icon: LucideIcon; tone: Tone; title: string; blurb: string };

/**
 * A live tool is a link with a lift on hover. A "soon" tool is a plain,
 * dashed box: no href, no hover, no arrow, no focus stop.
 */
export function ToolCard(props: Props & ({ variant?: "live"; href: string; action?: string } | { variant: "soon"; building?: boolean })) {
  const { icon, tone, title, blurb } = props;

  if (props.variant === "soon") {
    return (
      <div className={clsx(s.tool, s.soon)} aria-disabled="true">
        <IconTile icon={icon} tone="soon" />
        <div className={s.head}>
          <h3>{title}</h3>
          <Tag kind={props.building ? "building" : "soon"} />
        </div>
        <p>{blurb}</p>
      </div>
    );
  }

  return (
    <Link href={props.href} className={s.tool}>
      <IconTile icon={icon} tone={tone} />
      <div className={s.head}>
        <h3>{title}</h3>
        <Tag kind="live" />
      </div>
      <p>{blurb}</p>
      <span className={s.go}>
        {props.action ?? "Open tool"}
        <ArrowRight aria-hidden strokeWidth={2} />
      </span>
    </Link>
  );
}
