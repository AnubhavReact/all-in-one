"use client";

import { useSyncExternalStore } from "react";
import { getHistoryServerSnapshot, getHistorySnapshot, subscribeHistory, type HistoryEntry } from "@/lib/history";
import s from "./Rail.module.css";

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

/** Monday 00:00 of the current week, local time. */
function weekStart(now: Date) {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d.getTime();
}

function greetingNow() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}
const noop = () => () => {};

export function weekSummary(items: HistoryEntry[], now = new Date()) {
  const start = weekStart(now);
  const week = items.filter((i) => i.at >= start);
  const perDay = DAYS.map((_, d) => week.filter((i) => Math.floor((i.at - start) / 86_400_000) === d).length);
  return {
    files: week.length,
    tools: new Set(week.map((i) => i.tool)).size,
    perDay,
    todayIndex: (now.getDay() + 6) % 7,
  };
}

/** "Your week": counts from this browser's PDF history. Zeros on a first visit, never sample numbers. */
export function WeekStats() {
  const items = useSyncExternalStore(subscribeHistory, getHistorySnapshot, getHistoryServerSnapshot);
  const greeting = useSyncExternalStore(noop, greetingNow, () => "Hello");
  const { files, tools, perDay, todayIndex } = weekSummary(items);
  const max = Math.max(...perDay, 1);
  const summary = perDay.map((n, i) => `${DAY_NAMES[i]} ${n}`).join(", ");

  return (
    <section className={s.card} aria-labelledby="week-h">
      <div>
        <h2 id="week-h" className={s.learnTitle}>
          {greeting}
        </h2>
        <p className={s.note}>Your week in this browser</p>
      </div>
      <div className={s.stats}>
        <div className={s.stat}>
          <b>{files}</b>
          <span>files done</span>
        </div>
        <div className={s.stat}>
          <b>0 B</b>
          <span>uploaded</span>
        </div>
        <div className={s.stat}>
          <b>{tools}</b>
          <span>tools used</span>
        </div>
      </div>
      <div className={s.chart} role="img" aria-label={`Files done each day this week: ${summary}.`}>
        {perDay.map((n, i) => (
          <div key={i} className={i === todayIndex ? `${s.bar} ${s.today}` : s.bar}>
            <i style={{ height: `${Math.max((n / max) * 44, 4)}px` }} />
            <span aria-hidden>{DAYS[i]}</span>
          </div>
        ))}
      </div>
      {files === 0 && <p className={s.note}>Your first file will show up here.</p>}
    </section>
  );
}
