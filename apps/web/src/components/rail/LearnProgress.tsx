"use client";

import { useSyncExternalStore } from "react";
import { ArrowRight } from "lucide-react";
import { LEARN_TRACKS } from "@aio/core";
import { DSA_PLAN, dayNumber, markDsaVisit, readDsa, streak, subscribeDsa } from "@/lib/dsa-plan";
import { buttonClass } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import s from "./Rail.module.css";

const DSA = LEARN_TRACKS.find((t) => t.id === "dsa");
const DSA_URL = DSA?.links.find((l) => l.href.includes("checklist"))?.href ?? DSA?.url ?? "/learn#dsa";

/**
 * A 30-day DSA plan kept in this browser. The day and the streak come only
 * from when you started and the days you pressed Continue: AllInOne can't
 * see your progress on DSA Atlas, so it doesn't pretend to.
 */
export function LearnProgress({ id = "learn" }: { id?: string }) {
  const state = useSyncExternalStore(subscribeDsa, readDsa, () => null);
  const day = state ? dayNumber(state) : 0;
  const run = state ? streak(state) : 0;
  const topic = DSA_PLAN[day - 1];
  const next = DSA_PLAN.slice(day).find((x) => x !== topic);

  return (
    <section className={s.card} aria-labelledby={`${id}-h`}>
      <div className={s.head}>
        <h2 id={`${id}-h`}>Learn</h2>
        <Tag kind="new" />
      </div>

      {state ? (
        <>
          <div>
            <p className={s.learnTitle}>DSA prep · {topic}</p>
            <p className={s.note}>
              <span className={s.mono}>
                Day {day} of {DSA_PLAN.length}
              </span>
              {next && <> · next: {next}</>}
            </p>
          </div>
          <div
            className={s.track}
            role="progressbar"
            aria-label="30-day plan"
            aria-valuemin={0}
            aria-valuemax={DSA_PLAN.length}
            aria-valuenow={day}
          >
            <i style={{ width: `${(day / DSA_PLAN.length) * 100}%` }} />
          </div>
          <div className={s.learnFoot}>
            <span className={s.note}>{run > 1 ? `${run}-day streak` : run === 1 ? "1 day so far. Keep it going." : "Pick it back up today."}</span>
            <a className={buttonClass({ variant: "primary" })} href={DSA_URL} target="_blank" rel="noopener" onClick={markDsaVisit}>
              Continue
              <ArrowRight aria-hidden strokeWidth={2} width={16} height={16} />
              <span className="sr-only"> (opens DSA Atlas in a new tab)</span>
            </a>
          </div>
        </>
      ) : (
        <>
          <div>
            <p className={s.learnTitle}>Start DSA prep · 10 min a day</p>
            <p className={s.note}>A 30-day plan on DSA Atlas, one pattern a day. Your day and streak are kept in this browser.</p>
          </div>
          <a className={buttonClass({ variant: "primary", block: true })} href={DSA_URL} target="_blank" rel="noopener" onClick={markDsaVisit}>
            Start DSA prep
            <span className="sr-only"> (opens DSA Atlas in a new tab)</span>
          </a>
        </>
      )}
    </section>
  );
}
