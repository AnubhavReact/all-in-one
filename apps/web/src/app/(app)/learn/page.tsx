import type { Metadata } from "next";
import { LEARN_TRACKS, type LearnTrack } from "@aio/core";
import type { DemoStep } from "@/components/ui/DemoWindow";
import { AskAvtarButton } from "@/components/ui/AskAvtarButton";
import { Accent } from "@/components/ui/SectionIntro";
import { DSA_STEPS } from "@/components/ui/demos/DsaDemo";
import { SCHEMATA_STEPS } from "@/components/ui/demos/SchemataDemo";
import { STRUCTURA_STEPS } from "@/components/ui/demos/StructuraDemo";
import { TrackCard } from "@/components/learn/TrackCard";
import { TrackSection } from "@/components/learn/TrackSection";
import s from "@/components/learn/Learn.module.css";

export const metadata: Metadata = {
  title: "Learn system design, databases and DSA for free · AllInOne",
  description:
    "Three free study sites: Structura for system design, Schemata for databases and SQL, and DSA Atlas for coding interviews.",
};

const DEMOS: Record<LearnTrack["id"], { title: string; steps: DemoStep[] }> = {
  structura: { title: "Structura · URL shortener", steps: STRUCTURA_STEPS },
  schemata: { title: "Schemata · SQL editor", steps: SCHEMATA_STEPS },
  dsa: { title: "DSA Atlas · Checklist", steps: DSA_STEPS },
};

/**
 * The Learn tab. Three free study sites that sit beside the tools. Each is
 * its own app on its own domain, so this page shows what each one does and
 * sends you there.
 */
export default function LearnPage() {
  return (
    <>
      <section className={s.hero} aria-labelledby="learn-title">
        <div className={s.heroCopy}>
          <span className="t-eyebrow">Learn · free</span>
          <h1 id="learn-title" className="t-display-l">
            Study for interviews, <Accent>free</Accent>
          </h1>
          <p className="t-body-l">
            Three study sites for system design, databases and DSA. Each one is free, and you can start without
            signing up.
          </p>
        </div>
        <div className={s.cards}>
          {LEARN_TRACKS.map((track) => (
            <TrackCard key={track.id} track={track} />
          ))}
        </div>
      </section>

      {LEARN_TRACKS.map((track) => (
        <TrackSection key={track.id} track={track} demoTitle={DEMOS[track.id].title} steps={DEMOS[track.id].steps} />
      ))}

      <section className={s.closing} aria-labelledby="learn-start">
        <div>
          <h2 id="learn-start" className="t-h3">
            Not sure where to start?
          </h2>
          <p>Ask AVTAR what each site covers and which one fits what you&apos;re preparing for.</p>
        </div>
        <AskAvtarButton question="What can I learn here?" />
      </section>
    </>
  );
}
