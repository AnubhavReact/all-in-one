import { Check, Flame, RotateCcw } from "lucide-react";
import type { DemoStep } from "../DemoWindow";
import s from "./Scenes.module.css";
import l from "./LearnScenes.module.css";

const PATTERNS = [
  { name: "Two pointers", done: 6, of: 8 },
  { name: "Sliding window", done: 3, of: 7 },
  { name: "Binary search", done: 2, of: 9 },
];

const PROBLEMS = [
  { name: "Two Sum", level: "Easy", done: true },
  { name: "Container With Most Water", level: "Med", tick: true },
  { name: "3Sum", level: "Med" },
];

/** The ring's circumference for r = 40. */
const RING = 251.33;
const GOAL = 0.68;

/** Sample data only: a made-up learner's progress. */
export const DSA_STEPS: DemoStep[] = [
  {
    caption: "Problems grouped by pattern",
    render: (
      <div className={s.col}>
        <span className={s.label}>Patterns</span>
        <span className={s.mono}>20 patterns · 134 problems</span>
        {PATTERNS.map((p) => (
          <div key={p.name} className={l.pattern}>
            <span>{p.name}</span>
            <span className={l.bar}>
              <i style={{ "--w": `${(p.done / p.of) * 100}%` } as React.CSSProperties} />
            </span>
            <b>
              {p.done}/{p.of}
            </b>
          </div>
        ))}
      </div>
    ),
  },
  {
    caption: "Tick off a tier 1 problem when you solve it",
    render: (
      <div className={s.col}>
        <div className={l.head}>
          <span className={s.label}>Tier 1 · Must solve</span>
          <span className={l.pill}>Two pointers</span>
        </div>
        {PROBLEMS.map((p) => (
          <div key={p.name} className={p.tick ? `${l.prob} ${l.probOn}` : l.prob}>
            <span className={p.done ? `${l.box} ${l.boxOn}` : p.tick ? `${l.box} ${l.boxTick}` : l.box}>
              {(p.done || p.tick) && <Check strokeWidth={3} />}
            </span>
            <span>{p.name}</span>
            <span className={s.mono}>{p.level}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    caption: "It comes back for revision when it's due",
    render: (
      <div className={s.col}>
        <span className={s.label}>Revision</span>
        <div className={l.card}>
          <div className={l.verdict}>
            <span className={l.dueTile}>
              <RotateCcw strokeWidth={1.8} />
            </span>
            <div>
              <h4>Review in 3 days</h4>
              <p>Container With Most Water</p>
            </div>
          </div>
          <div className={l.ladder}>
            <span className={`${l.pill} ${l.pillOk}`}>1 day</span>
            <span className={`${l.pill} ${l.pillOn}`}>3 days</span>
            <span className={l.pill}>7 days</span>
            <span className={l.pill}>21 days</span>
          </div>
        </div>
        <div className={l.head}>
          <span className={s.mono}>4 due today</span>
          <span className={`${l.pill} ${l.pillOk}`}>
            <Flame strokeWidth={2} />7-day streak
          </span>
        </div>
      </div>
    ),
  },
  {
    caption: "Set a company goal and keep pace",
    render: (
      <div className={l.goal}>
        <div className={l.ring}>
          <svg viewBox="0 0 100 100">
            <circle className={l.track} cx="50" cy="50" r="40" />
            <circle
              className={l.fill}
              cx="50"
              cy="50"
              r="40"
              style={{ "--off": `${RING * (1 - GOAL)}`, strokeDashoffset: RING * (1 - GOAL) } as React.CSSProperties}
            />
          </svg>
          <span className={l.ringLabel}>
            <b>68%</b>
            <span>of goal</span>
          </span>
        </div>
        <div className={l.goalText}>
          <span className={s.label}>Goal</span>
          <strong>Product company, SDE-1</strong>
          <p>
            <span className={l.num}>61</span> of <span className={l.num}>90</span> problems by 31 Jan
          </p>
          <span className={`${l.pill} ${l.pillOk}`}>On pace · 2 a day</span>
        </div>
      </div>
    ),
  },
];
