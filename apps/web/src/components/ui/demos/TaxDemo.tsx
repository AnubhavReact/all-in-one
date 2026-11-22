import { CheckCircle2, Download } from "lucide-react";
import { EMPTY_TAX_INPUTS, compareRegimes } from "@aio/core";
import { inr } from "@/lib/format";
import type { DemoStep } from "../DemoWindow";
import s from "./Scenes.module.css";
import t from "./SiteScenes.module.css";

/** Sample figures. The totals are worked out by the real tax engine. */
const INPUT = { ...EMPTY_TAX_INPUTS, salary: 1_800_000, section80C: 150_000, section80D: 25_000 };
const TAX = compareRegimes(INPUT);
const BETTER = TAX.better === "new" ? "New regime" : "Old regime";

function Field({ label, value, active }: { label: string; value: string; active?: boolean }) {
  return (
    <div className={active ? `${t.field} ${t.active}` : t.field}>
      <span>{label}</span>
      <b>{value}</b>
    </div>
  );
}

function Bars() {
  const widest = Math.max(TAX.old.total, TAX.new.total) || 1;
  return (
    <div className={t.bars}>
      {(["old", "new"] as const).map((regime) => (
        <div className={t.bar} key={regime}>
          <div className={t.barTop}>
            <span>{regime === "old" ? "Old regime" : "New regime"}</span>
            <b>{inr(TAX[regime].total)}</b>
          </div>
          <div className={t.track}>
            <i className={regime === TAX.better ? t.best : undefined} style={{ width: `${(TAX[regime].total / widest) * 100}%` }} />
          </div>
          <span className={t.barNote}>Taxable {inr(TAX[regime].taxableIncome)}</span>
        </div>
      ))}
    </div>
  );
}

export const TAX_SAVING = TAX.saving;

export const TAX_STEPS: DemoStep[] = [
  {
    caption: `Type your yearly salary: ${inr(INPUT.salary)}`,
    render: (
      <div className={t.form}>
        <span className={s.label}>Income · FY 2026-27</span>
        <Field label="Salary for the year" value={inr(INPUT.salary)} active />
        <Field label="Other income" value="₹0" />
        <Field label="Age" value="Below 60" />
      </div>
    ),
  },
  {
    caption: `Add 80C ${inr(INPUT.section80C)} and 80D ${inr(INPUT.section80D)}`,
    render: (
      <div className={t.form}>
        <span className={s.label}>Deductions · old regime only</span>
        <Field label="80C: PPF, ELSS, LIC" value={inr(INPUT.section80C)} />
        <Field label="80D: health insurance" value={inr(INPUT.section80D)} active />
        <Field label="Home loan interest" value="₹0" />
      </div>
    ),
  },
  {
    caption: `Old ${inr(TAX.old.total)} vs new ${inr(TAX.new.total)}, slab by slab`,
    render: <Bars />,
  },
  {
    caption: `${BETTER} saves ${inr(TAX.saving)} a year`,
    render: (
      <div className={s.center}>
        <span className={s.okTile}>
          <CheckCircle2 strokeWidth={1.8} />
        </span>
        <span className={s.big}>
          {BETTER} saves {inr(TAX.saving)}
        </span>
        <span className={s.mono}>Sample · on {inr(INPUT.salary)} · stays in this browser</span>
        <span className={s.fakeBtn}>
          <Download strokeWidth={2} />
          Download CSV
        </span>
      </div>
    ),
  },
];
