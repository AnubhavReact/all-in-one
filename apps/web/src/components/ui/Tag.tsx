import clsx from "clsx";
import type { ReactNode } from "react";
import s from "./Tag.module.css";

export type TagKind = "live" | "new" | "building" | "soon" | "sample";

const DEFAULT_LABEL: Record<TagKind, string> = {
  live: "Live",
  new: "New",
  building: "Building now",
  soon: "Soon",
  sample: "Sample",
};

/** One pill shape for every status. Uppercase only for "Sample". */
export function Tag({ kind, children, className }: { kind: TagKind; children?: ReactNode; className?: string }) {
  const dot = kind === "live" || kind === "building";
  return (
    <span className={clsx(s.tag, s[kind], className)}>
      {dot && <span className={s.dot} aria-hidden />}
      {children ?? DEFAULT_LABEL[kind]}
    </span>
  );
}
