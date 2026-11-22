import { ArrowUpRight } from "lucide-react";
import type { LearnTrack } from "@aio/core";
import { IconTile } from "@/components/ui/IconTile";
import { learnIcon } from "./learn-icons";
import s from "./Learn.module.css";

/** One study site in the hero row. The whole card opens the site. */
export function TrackCard({ track }: { track: LearnTrack }) {
  const lead = track.stats[0];
  return (
    <a className={s.card} href={track.url} target="_blank" rel="noopener">
      <IconTile icon={learnIcon(track.icon)} tone="learn" />
      <strong className={s.name}>{track.name}</strong>
      <span className={s.area}>{track.area}</span>
      <p className={s.pitch}>{track.pitch}</p>
      {lead && (
        <span className={s.stat}>
          {lead.value} {lead.label}
        </span>
      )}
      <span className={s.go} aria-hidden>
        Opens in a new tab
        <ArrowUpRight aria-hidden strokeWidth={1.8} />
      </span>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
