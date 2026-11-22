"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import {
  Bot,
  BookOpen,
  Combine,
  Database,
  Download,
  FileImage,
  Headphones,
  IndianRupee,
  Layers3,
  Link2,
  ListOrdered,
  MessageCircle,
  RotateCw,
  Scale,
  Scissors,
  ShieldCheck,
  WifiOff,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { LEARN_TRACKS } from "@aio/core";
import { AskAvtarButton } from "@/components/ui/AskAvtarButton";
import { Button } from "@/components/ui/Button";
import { PromiseChip } from "@/components/ui/Chip";
import { DemoWindow, type DemoStep } from "@/components/ui/DemoWindow";
import { FeatureItem } from "@/components/ui/FeatureItem";
import type { Tone } from "@/components/ui/IconTile";
import { AVTAR_STEPS } from "@/components/ui/demos/AvtarDemo";
import { MERGE_STEPS } from "@/components/ui/demos/MergeDemo";
import { STRUCTURA_STEPS } from "@/components/ui/demos/StructuraDemo";
import { TAX_SAVING, TAX_STEPS } from "@/components/ui/demos/TaxDemo";
import { inr } from "@/lib/format";
import s from "./FeatureTour.module.css";

const learnCount = LEARN_TRACKS.reduce((sum, t) => sum + Number(t.stats[0].value), 0);
const stat = (id: string) => LEARN_TRACKS.find((t) => t.id === id)?.stats[0];

type Panel = {
  id: string;
  tab: string;
  icon: LucideIcon;
  tone: Tone;
  title: string;
  body: string;
  features: { icon: LucideIcon; title: string; line: string }[];
  promises: string[];
  action: ReactNode;
  demo: { title: string; steps: DemoStep[] };
};

const PANELS: Panel[] = [
  {
    id: "pdf",
    tab: "PDF tools",
    icon: Combine,
    tone: "pdf",
    title: "Fix a PDF without uploading it",
    body: "Merge, split, rotate and convert right in this tab. Your file never leaves the device, so there is nothing to leak and no copy to delete.",
    features: [
      { icon: Combine, title: "Merge", line: "Combine files in the order you choose." },
      { icon: Scissors, title: "Split", line: "Pull out pages or ranges into new files." },
      { icon: RotateCw, title: "Rotate and delete", line: "Fix sideways scans, drop blank pages." },
      { icon: FileImage, title: "Images and PDFs", line: "Turn pages into PNGs, or photos into a PDF." },
    ],
    promises: ["0 bytes uploaded", "No watermark", "Works offline"],
    action: <Button variant="primary" href="/pdf">Open PDF tools</Button>,
    demo: { title: "Merge PDFs", steps: MERGE_STEPS },
  },
  {
    id: "tax",
    tab: "Tax calculator",
    icon: IndianRupee,
    tone: "tax",
    title: "See which tax regime costs you less",
    body: `Enter your salary and deductions once and get both regimes for FY 2026-27, slab by slab. In the sample, the new regime saves ${inr(TAX_SAVING)} a year.`,
    features: [
      { icon: Scale, title: "Old vs new", line: "Both totals side by side, with the better one marked." },
      { icon: ListOrdered, title: "Slab by slab", line: "See exactly where every rupee of tax comes from." },
      { icon: ShieldCheck, title: "Caps built in", line: "80C, 80D, HRA and home loan limits applied for you." },
      { icon: Download, title: "Download CSV", line: "Keep the working for your own records." },
    ],
    promises: ["FY 2026-27", "Inputs stay in this browser"],
    action: <Button variant="primary" href="/tax">Open the tax calculator</Button>,
    demo: { title: "Tax calculator", steps: TAX_STEPS },
  },
  {
    id: "learn",
    tab: "Learn",
    icon: BookOpen,
    tone: "learn",
    title: "Prepare for interviews, free",
    body: `Three study sites with ${learnCount}+ topics and problems: system design, databases and SQL, and data structures. Click through, listen, practise.`,
    features: [
      { icon: Layers3, title: "Structura", line: `System design, ${stat("structura")?.value ?? "57"} topics you can click through.` },
      { icon: Database, title: "Schemata", line: `Databases and SQL, ${stat("schemata")?.value ?? "42"} practice questions.` },
      { icon: Zap, title: "DSA Atlas", line: `${stat("dsa")?.value ?? "134"} problems, sorted by how often they're asked.` },
      { icon: Headphones, title: "Audio lessons", line: "Listen on the way to work." },
    ],
    promises: [`${learnCount}+ topics and problems`, "No account"],
    action: <Button variant="primary" href="/learn">Explore Learn</Button>,
    demo: { title: "Structura · system design", steps: STRUCTURA_STEPS },
  },
  {
    id: "avtar",
    tab: "AVTAR",
    icon: MessageCircle,
    tone: "brand",
    title: "Ask AVTAR how anything works",
    body: "AVTAR is the help bot in the corner of every page. It answers from a fixed FAQ, so it's instant and never makes things up.",
    features: [
      { icon: Zap, title: "Instant answers", line: "No waiting, no typing out a long prompt." },
      { icon: Link2, title: "Links to the tool", line: "Every answer points to the right page." },
      { icon: WifiOff, title: "Works offline", line: "Nothing is sent to a server." },
      { icon: Bot, title: "Never guesses", line: "If it doesn't know, it says so." },
    ],
    promises: ["Fixed FAQ", "Chat stays in this browser"],
    action: <AskAvtarButton />,
    demo: { title: "AVTAR · Help", steps: AVTAR_STEPS },
  },
];

/**
 * One section, four features: a tab list and the active feature's demo.
 * Only the active tab's DemoWindow is mounted.
 */
export function FeatureTour() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (index: number) => {
    const next = (index + PANELS.length) % PANELS.length;
    setActive(next);
    const el = tabs.current[next];
    el?.focus();
    el?.scrollIntoView({ block: "nearest", inline: "nearest" });
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, () => void> = {
      ArrowDown: () => select(active + 1),
      ArrowRight: () => select(active + 1),
      ArrowUp: () => select(active - 1),
      ArrowLeft: () => select(active - 1),
      Home: () => select(0),
      End: () => select(PANELS.length - 1),
    };
    const run = keys[e.key];
    if (run) {
      e.preventDefault();
      run();
    }
  };

  const panel = PANELS[active];

  return (
    <div className={s.tour}>
      <div className={s.tabs} role="tablist" aria-label="Features" aria-orientation="vertical" onKeyDown={onKey}>
        {PANELS.map((p, index) => {
          const I = p.icon;
          const selected = index === active;
          return (
            <button
              key={p.id}
              ref={(el) => {
                tabs.current[index] = el;
              }}
              type="button"
              role="tab"
              id={`tour-tab-${p.id}`}
              aria-selected={selected}
              aria-controls={`tour-panel-${p.id}`}
              tabIndex={selected ? 0 : -1}
              className={s.tab}
              onClick={() => setActive(index)}
            >
              <span className={s.num}>{String(index + 1).padStart(2, "0")}</span>
              <I aria-hidden strokeWidth={1.8} />
              {p.tab}
            </button>
          );
        })}
      </div>

      <div
        className={s.panel}
        role="tabpanel"
        id={`tour-panel-${panel.id}`}
        aria-labelledby={`tour-tab-${panel.id}`}
        key={panel.id}
      >
        <div className={s.copy}>
          <span className="t-eyebrow">
            {String(active + 1).padStart(2, "0")} &middot; {panel.tab}
          </span>
          <h3 className="t-h2">{panel.title}</h3>
          <p className={s.body}>{panel.body}</p>
          <div className={s.promises}>
            {panel.promises.map((p) => (
              <PromiseChip key={p}>{p}</PromiseChip>
            ))}
          </div>
          <div>{panel.action}</div>
        </div>
        <div className={s.features}>
          {panel.features.map((f) => (
            <FeatureItem key={f.title} icon={f.icon} tone={panel.tone} title={f.title}>
              {f.line}
            </FeatureItem>
          ))}
        </div>
        <DemoWindow className={s.demo} title={panel.demo.title} steps={panel.demo.steps} />
      </div>
    </div>
  );
}
