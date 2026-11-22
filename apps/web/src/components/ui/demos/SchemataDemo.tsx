import { Check, Database, Play } from "lucide-react";
import type { DemoStep } from "../DemoWindow";
import s from "./Scenes.module.css";
import l from "./LearnScenes.module.css";

/** The answer, one line per row, with the keywords picked out. */
const SQL: [string, string][] = [
  ["SELECT", " c.name, SUM(o.amount) AS spend"],
  ["FROM", " customers c"],
  ["JOIN", " orders o ON o.customer_id = c.id"],
  ["GROUP BY", " c.name"],
  ["ORDER BY", " spend DESC"],
  ["LIMIT", " 3;"],
];

function Code({ typing }: { typing?: boolean }) {
  return (
    <div className={typing ? `${l.code} ${l.typing}` : l.code}>
      {SQL.map(([kw, rest]) => (
        <span key={kw}>
          <b className={l.kw}>{kw}</b>
          {rest}
        </span>
      ))}
    </div>
  );
}

/** Made-up customers and totals. */
const ROWS = [
  { name: "Asha Rao", spend: "₹48,200" },
  { name: "Vikram Iyer", spend: "₹41,950" },
  { name: "Meera Nair", spend: "₹39,300" },
];

function Question() {
  return (
    <div className={l.card}>
      <div className={l.head}>
        <span className={s.label}>Question 14</span>
        <span className={l.pill}>Joins · Medium</span>
      </div>
      <h4>Top 3 customers by spend</h4>
      <p>Return each customer&apos;s name and total spend, for the three who spent the most.</p>
      <div className={l.chips}>
        <span className={l.pill}>customers</span>
        <span className={l.pill}>orders</span>
      </div>
    </div>
  );
}

/** Sample data only: an invented shop dataset. */
export const SCHEMATA_STEPS: DemoStep[] = [
  {
    caption: "Pick a practice question",
    render: (
      <div className={s.col}>
        <Question />
      </div>
    ),
  },
  {
    caption: "Write your SQL in the editor",
    render: (
      <div className={s.col}>
        <div className={l.head}>
          <span className={s.label}>query.sql</span>
          <span className={l.pill}>
            <Play strokeWidth={2} />
            Run
          </span>
        </div>
        <Code typing />
      </div>
    ),
  },
  {
    caption: "It runs on a real PostgreSQL, in your tab",
    render: (
      <div className={s.col}>
        <div className={l.head}>
          <span className={s.label}>Result</span>
          <span className={l.pill}>
            <Database strokeWidth={2} />3 rows · 4 ms
          </span>
        </div>
        <div className={l.table}>
          <div className={l.tr}>
            <span>#</span>
            <span>name</span>
            <span>spend</span>
          </div>
          {ROWS.map((r, i) => (
            <div key={r.name} className={l.tr}>
              <span className={l.num}>{i + 1}</span>
              <span>{r.name}</span>
              <span>{r.spend}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    caption: "Checked: correct, with the query plan to read",
    render: (
      <div className={s.col}>
        <div className={l.verdict}>
          <span className={l.okDot}>
            <Check strokeWidth={2.2} />
          </span>
          <span>
            <strong>Correct</strong>
            <small>Matches the expected 3 rows</small>
          </span>
        </div>
        <div className={l.plan}>
          <span className={s.label}>Query plan</span>
          <div className={l.code}>
            <span>Limit (rows=3)</span>
            <span>→ Sort by spend desc</span>
            <span>→ HashAggregate</span>
            <span>→ Hash Join</span>
          </div>
        </div>
      </div>
    ),
  },
];
