"use client";

import { useState } from "react";
import clsx from "clsx";
import { Calculator, Check, ChevronDown, Download, Scale } from "lucide-react";
import {
  EMPTY_TAX_INPUTS,
  TAX_LIMITS,
  TAX_YEAR,
  compareRegimes,
  type AgeBand,
  type Regime,
  type TaxInputs,
} from "@aio/core";
import { AmountInput } from "@/components/ui/AmountInput";
import { Segmented } from "@/components/ui/Segmented";
import { Checkbox } from "@/components/ui/Checkbox";
import { Button } from "@/components/ui/Button";
import { inr } from "@/lib/format";
import { SlabBreakdown, percent } from "./SlabBreakdown";
import { downloadCsv, taxCsv } from "./csv";
import s from "./Tax.module.css";

type AmountKey = Exclude<keyof TaxInputs, "age" | "metro">;
type Amounts = Record<AmountKey, number | null>;

const EMPTY_AMOUNTS = Object.fromEntries(
  (Object.keys(EMPTY_TAX_INPUTS) as (keyof TaxInputs)[])
    .filter((key) => key !== "age" && key !== "metro")
    .map((key) => [key, null]),
) as Amounts;

const AGES: { value: AgeBand; label: string }[] = [
  { value: "below60", label: "Below 60" },
  { value: "senior", label: "60–79" },
  { value: "superSenior", label: "80 and above" },
];

const REGIMES: { value: Regime; label: string }[] = [
  { value: "new", label: "New regime" },
  { value: "old", label: "Old regime" },
];


const OLD_ONLY: AmountKey[] = [
  "hraReceived",
  "rentPaid",
  "section80C",
  "section80D",
  "section80CCD1B",
  "homeLoanInterest",
  "professionalTax",
  "otherDeductions",
];

export function TaxCalculator() {
  const [amounts, setAmounts] = useState<Amounts>(EMPTY_AMOUNTS);
  const [age, setAge] = useState<AgeBand>("below60");
  const [metro, setMetro] = useState(false);
  const [view, setView] = useState<Regime | null>(null);

  const inputs: TaxInputs = {
    ...(Object.fromEntries(Object.entries(amounts).map(([k, v]) => [k, v ?? 0])) as Record<AmountKey, number>),
    age,
    metro,
  };
  const result = compareRegimes(inputs);
  const hasIncome = result.old.grossIncome > 0;
  const shown = view ?? result.better;
  const oldEntered = OLD_ONLY.reduce((sum, key) => sum + (amounts[key] ?? 0), 0);

  const amount = (key: AmountKey) => ({
    value: amounts[key],
    onChange: (value: number | null) => setAmounts((before) => ({ ...before, [key]: value })),
  });

  return (
    <>
      <section className={s.card} aria-labelledby="tax-income">
        <div className={s.cardHead}>
          <h2 id="tax-income" className={s.h2}>Your income</h2>
          <span className={s.year}>FY {TAX_YEAR}</span>
        </div>
        <div className={s.grid}>
          <div className={s.wide}>
            <AmountInput label="Annual salary" period="year" {...amount("salary")} />
          </div>
          <AmountInput label="Basic salary (for HRA)" period="year" {...amount("basicSalary")} />
          <AmountInput label="Other income" {...amount("otherIncome")} />
          <AmountInput label="Employer's NPS contribution" {...amount("employerNps")} />
          <div className={s.wide}>
            <Segmented legend="Your age" options={AGES} value={age} onChange={setAge} />
          </div>
        </div>
      </section>

      <details className={s.disclosure}>
        <summary>
          <span className={s.sumText}>
            <strong>Deductions (old regime only)</strong>
            <small>
              {oldEntered > 0 ? (
                <>
                  <span className="t-mono">{inr(oldEntered)}</span> entered
                </>
              ) : (
                "HRA, 80C, 80D, NPS and home loan interest"
              )}
            </small>
          </span>
          <ChevronDown aria-hidden strokeWidth={1.8} />
        </summary>
        <div className={s.grid}>
          <AmountInput label="HRA received" period="year" {...amount("hraReceived")} />
          <AmountInput label="Rent paid" period="year" {...amount("rentPaid")} />
          <div className={s.wide}>
            <Checkbox
              label="I rent in a metro city"
              description="In a metro, up to 50% of basic is exempt from tax. Elsewhere it is 40%."
              checked={metro}
              onChange={setMetro}
            />
          </div>
          <AmountInput label="80C" capLabel="80C" max={TAX_LIMITS.section80C} {...amount("section80C")} />
          <AmountInput label="80D, health insurance (you and parents)" capLabel="80D" max={TAX_LIMITS.section80D} {...amount("section80D")} />
          <AmountInput label="NPS, 80CCD(1B)" capLabel="80CCD(1B)" max={TAX_LIMITS.section80CCD1B} {...amount("section80CCD1B")} />
          <AmountInput label="Home loan interest" max={TAX_LIMITS.homeLoanInterest} {...amount("homeLoanInterest")} />
          <AmountInput label="Professional tax" max={TAX_LIMITS.professionalTax} {...amount("professionalTax")} />
          <AmountInput label="Other deductions (80E, 80G, 80TTA)" {...amount("otherDeductions")} />
        </div>
      </details>

      {hasIncome ? (
        <>
          <section className={s.compare} aria-label="Old and new regime compared">
            {(["old", "new"] as const).map((regime) => {
              const r = result[regime];
              const cheaper = result.better === regime && result.saving > 0;
              return (
                <div key={regime} className={clsx(s.result, cheaper && s.cheaper)}>
                  <div className={s.resultHead}>
                    <h2 className={s.h3}>{regime === "new" ? "New regime" : "Old regime"}</h2>
                    {cheaper && (
                      <span className={s.badge}>
                        <Check aria-hidden strokeWidth={2} />
                        Costs less
                      </span>
                    )}
                  </div>
                  <p className={s.total}>{inr(r.total)}</p>
                  <p className={s.meta}>
                    <span className="t-mono">{percent(r.effectiveRate)}</span> of income ·{" "}
                    <span className="t-mono">{inr(r.total / 12)}</span> a month
                  </p>
                </div>
              );
            })}
          </section>

          <p className={s.banner} aria-live="polite">
            <Scale aria-hidden strokeWidth={1.8} />
            {result.saving === 0 ? (
              <span>Both regimes cost the same: {inr(result.new.total)}.</span>
            ) : (
              <span>
                {result.better === "new" ? "New" : "Old"} regime costs less — you save{" "}
                <span className="t-mono">{inr(result.saving)}</span>
              </span>
            )}
          </p>

          <section className={s.card} aria-labelledby="tax-breakdown">
            <div className={s.cardHead}>
              <h2 id="tax-breakdown" className={s.h2}>Where the tax comes from</h2>
            </div>
            <div className={s.switch}>
              <Segmented legend="Show the breakdown for" options={REGIMES} value={shown} onChange={setView} />
            </div>
            <SlabBreakdown result={result[shown]} age={age} />
            <div className={s.actions}>
              <Button
                variant="primary"
                icon={Download}
                onClick={() => downloadCsv(taxCsv(inputs, result), `tax-FY-${TAX_YEAR}-old-vs-new.csv`)}
              >
                Download CSV
              </Button>
            </div>
          </section>
        </>
      ) : (
        <section className={s.empty} aria-live="polite">
          <Calculator aria-hidden strokeWidth={1.8} />
          <div>
            <h2 className={s.h3}>Your comparison shows up here</h2>
            <p>Enter your annual salary and both regimes are worked out as you type.</p>
          </div>
        </section>
      )}

      <p className={s.disclaimer}>An estimate for salaried individuals. Not tax advice. Check with a CA before filing.</p>
    </>
  );
}
