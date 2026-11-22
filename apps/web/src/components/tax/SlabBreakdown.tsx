import { EMPTY_TAX_INPUTS, calculateTax, type AgeBand, type Regime, type RegimeResult } from "@aio/core";
import clsx from "clsx";
import { inr } from "@/lib/format";
import s from "./Tax.module.css";

const NAME: Record<Regime, string> = { old: "Old regime", new: "New regime" };

/** 0.05 -> "5%", 0.073 -> "7.3%". */
export const percent = (value: number) => `${Number((value * 100).toFixed(1))}%`;

/** The surcharge rates the engine uses. Anything else means marginal relief cut it. */
const SURCHARGE_RATES = [0.1, 0.15, 0.25, 0.37];

/**
 * Every slab of the regime with its real bounds. The engine stops at your
 * income, so it is asked once about an income nobody has to get them all.
 */
function allSlabs(regime: Regime, age: AgeBand) {
  const rows = calculateTax({ ...EMPTY_TAX_INPUTS, otherIncome: 1e12, age }, regime).slabs;
  return rows.map((row, i) => ({ from: row.from, to: i === rows.length - 1 ? Infinity : row.to, rate: row.rate }));
}

function range(from: number, to: number) {
  if (!Number.isFinite(to)) return `Above ${inr(from)}`;
  // The no-break space keeps the dash with the first figure when it wraps.
  return `${inr(from)}\u00a0– ${inr(to)}`;
}

export function SlabBreakdown({ result, age }: { result: RegimeResult; age: AgeBand }) {
  const regime = result.regime;
  const afterRebate = result.slabTax - result.rebate;
  const surchargeRate = afterRebate > 0 ? result.surcharge / afterRebate : 0;
  const surchargeRelief =
    result.surcharge > 0 && !SURCHARGE_RATES.some((rate) => Math.abs(rate - surchargeRate) < 1e-6);
  const rebateRelief = regime === "new" && result.rebate > 0 && result.taxableIncome > 1_200_000;

  return (
    <div className={s.breakdown}>
      <table className={clsx(s.table, s.narrow)}>
        <caption className={s.caption}>{NAME[regime]}: from income to taxable income</caption>
        <tbody>
          <tr>
            <th scope="row">Gross income</th>
            <td className={s.num}>{inr(result.grossIncome)}</td>
          </tr>
          {result.lines.map((line) => (
            <tr key={line.label}>
              <th scope="row">
                {line.label}
                {line.allowed < line.claimed && (
                  <span className={s.note}>Capped. You entered {inr(line.claimed)}.</span>
                )}
              </th>
              <td className={s.num}>−{inr(line.allowed)}</td>
            </tr>
          ))}
          <tr className={s.sum}>
            <th scope="row">Taxable income</th>
            <td className={s.num}>{inr(result.taxableIncome)}</td>
          </tr>
        </tbody>
      </table>

      <div
        className={s.scroll}
        tabIndex={0}
        role="region"
        aria-label={`${NAME[regime]} slab table, scrolls sideways`}
      >
        <table className={s.table}>
          <caption className={s.caption}>{NAME[regime]}: tax slab by slab</caption>
          <thead>
            <tr>
              <th scope="col">Slab</th>
              <th scope="col" className={s.num}>Rate</th>
              <th scope="col" className={s.num}>Taxable in slab</th>
              <th scope="col" className={s.num}>Tax</th>
            </tr>
          </thead>
          <tbody>
            {allSlabs(regime, age).map((slab) => {
              const hit = result.slabs.find((row) => row.from === slab.from);
              return (
                <tr key={slab.from} className={hit ? undefined : s.unused}>
                  <th scope="row" className={s.range}>{range(slab.from, slab.to)}</th>
                  <td className={s.num}>{percent(slab.rate)}</td>
                  <td className={s.num}>{inr(hit ? hit.to - hit.from : 0)}</td>
                  <td className={s.num}>{inr(hit?.tax ?? 0)}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row" colSpan={3}>Tax on slabs</th>
              <td className={s.num}>{inr(result.slabTax)}</td>
            </tr>
            <tr>
              <th scope="row" colSpan={3}>
                Rebate, section 87A
                {rebateRelief && <span className={s.note}>Includes marginal relief above ₹12,00,000.</span>}
              </th>
              <td className={s.num}>{result.rebate > 0 ? `−${inr(result.rebate)}` : inr(0)}</td>
            </tr>
            <tr>
              <th scope="row" colSpan={3}>
                Surcharge
                {surchargeRelief && <span className={s.note}>After marginal relief.</span>}
              </th>
              <td className={s.num}>{inr(result.surcharge)}</td>
            </tr>
            <tr>
              <th scope="row" colSpan={3}>Health and education cess, 4%</th>
              <td className={s.num}>{inr(result.cess)}</td>
            </tr>
            <tr className={s.sum}>
              <th scope="row" colSpan={3}>
                Total tax for the year
                <span className={s.note}>Rounded to the nearest ₹10.</span>
              </th>
              <td className={s.num}>{inr(result.total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
