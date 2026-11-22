import type { LucideIcon } from "lucide-react";
import { IconTile, type Tone } from "./IconTile";
import s from "./Cards.module.css";

/** Flat, never hovers: it explains, it doesn't go anywhere. */
export function FeatureItem({ icon, tone, title, children }: { icon: LucideIcon; tone: Tone; title: string; children: React.ReactNode }) {
  return (
    <div className={s.feature}>
      <IconTile icon={icon} tone={tone} />
      <strong>{title}</strong>
      <p>{children}</p>
    </div>
  );
}
