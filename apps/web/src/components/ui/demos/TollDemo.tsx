import {
  BatteryCharging,
  Calculator,
  CircleCheck,
  Gavel,
  LayoutDashboard,
  Printer,
  ScanLine,
  ScanText,
  Square,
  Tag,
  TrafficCone,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { DemoStep } from "../DemoWindow";
import s from "./Scenes.module.css";
import l from "./LearnScenes.module.css";
import t from "./TollScenes.module.css";

/*
 * Storyboards for the TollWala page. Every figure here is sample data, the
 * same kind TollWala's own demos show; the window is labelled "Sample demo".
 */

const EQUIPMENT: { label: string; icon: LucideIcon }[] = [
  { label: "FASTag reader", icon: ScanLine },
  { label: "Boom barrier", icon: TrafficCone },
  { label: "Receipt printer", icon: Printer },
  { label: "UPS / power", icon: BatteryCharging },
];

const CHECKS = ["Reader has power and its light is on", "Cable to the lane PC is seated", "Restarted the reader service"];

const MILESTONES = ["You report", "We triage", "Remote fix first", "On site if needed", "Closed & logged"];

export const TOLL_SUPPORT_STEPS: DemoStep[] = [
  {
    caption: "Pick what's down in the lane",
    render: (
      <div className={s.col}>
        <span className={s.label}>Lane troubleshooter · Lane 3</span>
        {EQUIPMENT.map(({ label, icon: I }, i) => (
          <div key={label} className={i === 0 ? `${s.row} ${s.picked}` : s.row}>
            <span className={s.ficon}>
              <I strokeWidth={1.8} />
            </span>
            <strong>{label}</strong>
            <span className={s.mono}>{i === 0 ? "down" : "ok"}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    caption: "Try the quick checks first",
    render: (
      <div className={s.col}>
        <span className={s.label}>FASTag reader · checklist</span>
        <div className={t.checks}>
          {CHECKS.map((c, i) => (
            <div key={c} className={t.check}>
              {i < 2 ? <CircleCheck strokeWidth={2} className={s.ok} /> : <Square strokeWidth={1.8} />}
              <span>{c}</span>
            </div>
          ))}
        </div>
        <div className={l.card}>
          <div className={l.head}>
            <h4>Still down?</h4>
            <span className={`${l.pill} ${l.pillOn}`}>raise a ticket</span>
          </div>
          <p>The checklist goes with the ticket, so nobody asks you the same questions twice.</p>
        </div>
      </div>
    ),
  },
  {
    caption: "Raise a ticket; it goes out on WhatsApp",
    render: (
      <div className={s.col}>
        <span className={s.label}>Raise a ticket</span>
        <div className={t.form}>
          <div className={t.field}>
            <span>Plaza</span>
            <b>Sample plaza, NH-48</b>
          </div>
          <div className={t.field}>
            <span>Service</span>
            <b>Toll plaza support</b>
          </div>
          <div className={t.field}>
            <span>Issue</span>
            <b>Lane 3 FASTag reader not reading tags</b>
          </div>
        </div>
        <div className={l.head}>
          <span className={s.mono}>Ticket</span>
          <span className={`${l.pill} ${l.pillOk}`}>TE-261122-7KQM</span>
        </div>
      </div>
    ),
  },
  {
    caption: "Follow it from report to closed",
    render: (
      <div className={s.col}>
        <span className={s.label}>TE-261122-7KQM · progress</span>
        <div className={l.log}>
          {MILESTONES.map((m, i) => (
            <div key={m} className={l.logRow}>
              <b>KM{i}</b>
              <span>{m}</span>
              <span className={`${s.mono} ${i < 3 ? s.ok : ""}`}>{i < 3 ? "done" : "next"}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

const LANES = ["up", "up", "down", "up", "up", "up", "up", "up"];

export const TOLL_SOFTWARE_STEPS: DemoStep[] = [
  {
    caption: "The portal: every lane at a glance",
    render: (
      <div className={s.col}>
        <div className={l.head}>
          <span className={s.label}>TollWala Portal · lanes</span>
          <span className={`${l.pill} ${l.pillOk}`}>7 / 8 up</span>
        </div>
        <div className={t.lanes}>
          {LANES.map((state, i) => (
            <div key={i} className={state === "down" ? `${t.lane} ${t.laneDown}` : t.lane}>
              <span>L{i + 1}</span>
              <i aria-hidden />
            </div>
          ))}
        </div>
        <div className={l.stats}>
          <div className={l.stat}>
            <b>₹4,82,350</b>
            <span>collected today</span>
          </div>
          <div className={l.stat}>
            <b>2</b>
            <span>open tickets</span>
          </div>
          <div className={l.stat}>
            <b>Shift B</b>
            <span>on duty</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    caption: "TMS: crossings by lane, class and payment",
    render: (
      <div className={s.col}>
        <span className={s.label}>TMS · crossings</span>
        <div className={l.table}>
          <div className={l.tr}>
            <span>Class</span>
            <span>Mode</span>
            <span>Count</span>
          </div>
          <div className={l.tr}>
            <span>Car</span>
            <span>FASTag</span>
            <span>1,204</span>
          </div>
          <div className={l.tr}>
            <span>Bus / truck</span>
            <span>FASTag</span>
            <span>388</span>
          </div>
          <div className={l.tr}>
            <span>Car</span>
            <span>UPI</span>
            <span>61</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    caption: "ANPR flags a plate that doesn't match its tag",
    render: (
      <div className={s.col}>
        <span className={s.label}>ANPR · mismatch</span>
        <div className={t.plate}>
          <ScanText strokeWidth={1.8} aria-hidden />
          <b>UP16 AB 1234</b>
        </div>
        <div className={l.card}>
          <div className={l.head}>
            <h4>Class mismatch</h4>
            <span className={`${l.pill} ${l.pillOn}`}>alert</span>
          </div>
          <p>Camera reads a truck; the FASTag says car. Flagged for the shift supervisor.</p>
        </div>
      </div>
    ),
  },
  {
    caption: "Tag Fetch: look up a tag by vehicle number",
    render: (
      <div className={s.col}>
        <span className={s.label}>Tag Fetch</span>
        <div className={t.form}>
          <div className={t.field}>
            <span>Vehicle</span>
            <b>UP16 AB 1234</b>
          </div>
          <div className={t.field}>
            <span>Tag status</span>
            <b className={s.ok}>Active</b>
          </div>
          <div className={t.field}>
            <span>Class</span>
            <b>Car / jeep / van</b>
          </div>
        </div>
      </div>
    ),
  },
];

/** The surcharges TollWala's calculator states: UPI ×1.25, cash ×2. */
const BASE = 165;
const MODES = [
  { label: "FASTag", mult: 1 },
  { label: "UPI", mult: 1.25 },
  { label: "Cash", mult: 2 },
];

const TOOLS: { label: string; icon: LucideIcon; note: string }[] = [
  { label: "Toll calculator", icon: Calculator, note: "Open" },
  { label: "Plaza expense manager", icon: Wallet, note: "Open" },
  { label: "Bid calculator", icon: Gavel, note: "Open" },
];

export const TOLL_TOOLS_STEPS: DemoStep[] = [
  {
    caption: "Three free tools, no login",
    render: (
      <div className={s.col}>
        <span className={s.label}>Free toll tools</span>
        {TOOLS.map(({ label, icon: I, note }, i) => (
          <div key={label} className={i === 0 ? `${s.row} ${s.picked}` : s.row}>
            <span className={s.ficon}>
              <I strokeWidth={1.8} />
            </span>
            <strong>{label}</strong>
            <span className={s.mono}>{note}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    caption: "See what one plaza costs by how you pay",
    render: (
      <div className={s.col}>
        <span className={s.label}>Toll calculator · one crossing</span>
        <div className={l.table}>
          <div className={l.tr}>
            <span>Pay by</span>
            <span>Rule</span>
            <span>Fee</span>
          </div>
          {MODES.map((m) => (
            <div key={m.label} className={l.tr}>
              <span>{m.label}</span>
              <span>{m.mult === 1 ? "base fee" : `×${m.mult}`}</span>
              <span>₹{Math.round(BASE * m.mult)}</span>
            </div>
          ))}
        </div>
        <span className={s.mono}>Sample fee. Check the official NHAI fee lookup.</span>
      </div>
    ),
  },
  {
    caption: "Inputs stay in your browser",
    render: (
      <div className={s.col}>
        <div className={l.verdict}>
          <span className={l.okDot}>
            <Tag strokeWidth={2} />
          </span>
          <div>
            <strong>Nothing sent to TollWala</strong>
            <small>Your numbers are remembered on this device only.</small>
          </div>
        </div>
        <div className={s.row}>
          <span className={s.ficon}>
            <LayoutDashboard strokeWidth={1.8} />
          </span>
          <strong>No login needed</strong>
          <span className={`${s.mono} ${s.ok}`}>free</span>
        </div>
      </div>
    ),
  },
];
