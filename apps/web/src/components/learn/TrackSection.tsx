import { ArrowUpRight } from "lucide-react";
import type { LearnTrack } from "@aio/core";
import { Button } from "@/components/ui/Button";
import { DemoWindow, type DemoStep } from "@/components/ui/DemoWindow";
import { FeatureItem } from "@/components/ui/FeatureItem";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { learnIcon } from "./learn-icons";
import s from "./Learn.module.css";

/**
 * One study site: what it is, what it does, a sample run-through, and one
 * way out to it. The section's id is the track id, so /learn#dsa lands here.
 */
export function TrackSection({
  track,
  demoTitle,
  steps,
}: {
  track: LearnTrack;
  demoTitle: string;
  steps: DemoStep[];
}) {
  const headingId = `${track.id}-title`;
  // The main button already opens the home page; only list the deeper links.
  const extra = track.links.filter((link) => link.href !== track.url);

  return (
    <section id={track.id} className={s.section} aria-labelledby={headingId}>
      <div className={s.text}>
        <SectionIntro eyebrow={`${track.number} · ${track.area}`} title={track.headline} id={headingId}>
          {track.body}
        </SectionIntro>

        <dl className={s.stats}>
          {track.stats.map((stat) => (
            <div key={stat.label}>
              <dt>{stat.label}</dt>
              <dd>{stat.value}</dd>
            </div>
          ))}
        </dl>

        <div className={s.actions}>
          <Button variant="primary" href={track.url} external iconRight={ArrowUpRight}>
            Open {track.name}
          </Button>
          {extra.map((link) => (
            <a key={link.href} className={s.link} href={link.href} target="_blank" rel="noopener">
              {link.label}
              <ArrowUpRight aria-hidden strokeWidth={1.8} />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ))}
        </div>
      </div>

      <div className={s.demo}>
        <DemoWindow title={demoTitle} steps={steps} />
      </div>

      <div className={s.features}>
        {track.features.map((feature) => (
          <FeatureItem key={feature.title} icon={learnIcon(feature.icon)} tone="learn" title={feature.title}>
            {feature.body}
          </FeatureItem>
        ))}
      </div>
    </section>
  );
}
