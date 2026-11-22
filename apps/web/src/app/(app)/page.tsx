import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, BookOpen, Bot, Combine, IndianRupee, ShieldCheck, type LucideIcon } from "lucide-react";
import { EMPTY_TAX_INPUTS, LEARN_TRACKS, compareRegimes } from "@aio/core";
import { AskHero } from "@/components/home/AskHero";
import { DemoTabs } from "@/components/home/DemoTabs";
import { QuickTools } from "@/components/home/QuickTools";
import { RailMobile, RightRail, railStyles as r } from "@/components/rail/RightRail";
import { AskAvtarButton } from "@/components/ui/AskAvtarButton";
import { IconTile, type Tone } from "@/components/ui/IconTile";
import { AVTAR_STEPS } from "@/components/ui/demos/AvtarDemo";
import { MERGE_STEPS } from "@/components/ui/demos/MergeDemo";
import { TAX_STEPS } from "@/components/ui/demos/TaxDemo";
import { inr } from "@/lib/format";
import s from "@/components/home/Home.module.css";

export const metadata: Metadata = {
  title: "AllInOne — free PDF tools, tax calculator and interview prep",
  description:
    "Merge and split PDFs, compare old vs new tax regimes and prepare for interviews. Free, no account, and your files never leave your browser.",
};

const TAX = compareRegimes({ ...EMPTY_TAX_INPUTS, salary: 1_800_000, section80C: 150_000, section80D: 25_000 });
const LEARN_COUNT = LEARN_TRACKS.reduce((sum, t) => sum + Number(t.stats[0].value), 0);

type Goal = {
  icon: LucideIcon;
  tone: Tone;
  title: string;
  body: string;
  links: { label: string; href: string }[];
  stat: string;
  ask?: boolean;
};

const GOALS: Goal[] = [
  {
    icon: Combine,
    tone: "pdf",
    title: "Sort out PDFs",
    body: "Merge, split, rotate and convert, right here in the tab.",
    links: [
      { label: "Merge", href: "/pdf/merge" },
      { label: "Split", href: "/pdf/split" },
      { label: "Rotate", href: "/pdf/organise" },
      { label: "PDF ↔ images", href: "/pdf/to-images" },
    ],
    stat: "0 bytes uploaded",
  },
  {
    icon: IndianRupee,
    tone: "tax",
    title: "Save on tax",
    body: "See which regime costs less for FY 2026-27, slab by slab.",
    links: [{ label: "Tax calculator", href: "/tax" }],
    stat: `Sample: ${inr(TAX.saving)} saved on ₹18L`,
  },
  {
    icon: BookOpen,
    tone: "learn",
    title: "Prepare for interviews",
    body: "System design, databases and DSA on three free study sites.",
    links: LEARN_TRACKS.map((t) => ({ label: t.name, href: `/learn#${t.id}` })),
    stat: `${LEARN_COUNT}+ topics and problems`,
  },
  {
    icon: Bot,
    tone: "brand",
    title: "Get help",
    body: "Ask AVTAR how any tool works. It answers from a fixed FAQ.",
    links: [],
    stat: "Works offline",
    ask: true,
  },
];

/**
 * Task first: "what do you want to do?" before any explaining. A returning
 * visitor sees their recent files; a first-timer can start in one click.
 */
export default function Home() {
  return (
    <div className={r.layout}>
      <div className={r.left}>
      <AskHero />

      <section className={s.sec} aria-labelledby="quick-h">
        <div className={s.secHead}>
          <h2 id="quick-h" className="t-h3">
            Quick tools
          </h2>
          <Link href="/pdf">All PDF tools &rarr;</Link>
        </div>
        <QuickTools />
      </section>

      <RailMobile />

      <section className={s.sec} aria-labelledby="goals-h">
        <div className={s.secHead}>
          <div>
            <h2 id="goals-h" className="t-h3">
              Pick by goal
            </h2>
            <p>Not sure which tool? Start from what you need.</p>
          </div>
        </div>
        <div className={s.goals}>
          {GOALS.map((goal) => (
            <article key={goal.title} className={s.goal}>
              <IconTile icon={goal.icon} tone={goal.tone} size={48} />
              <h3>{goal.title}</h3>
              <p>{goal.body}</p>
              <div className={s.goalLinks}>
                {goal.links.map((link) => (
                  <Link key={link.href} href={link.href}>
                    {link.label}
                    <ArrowRight aria-hidden strokeWidth={2} />
                  </Link>
                ))}
                {goal.ask && <AskAvtarButton variant="ghost" label="Open AVTAR" />}
              </div>
              <span className={s.stat}>{goal.stat}</span>
            </article>
          ))}
        </div>
      </section>

      <section className={s.sec} aria-labelledby="demo-h">
        <div className={s.secHead}>
          <div>
            <h2 id="demo-h" className="t-h3">
              See it in action
            </h2>
            <p>Short sample demos. Press pause, or tap a step to look closer.</p>
          </div>
        </div>
        <DemoTabs
          demos={[
            { id: "merge", label: "PDF merge", title: "AllInOne · Merge PDFs", steps: MERGE_STEPS },
            { id: "tax", label: "Tax", title: "AllInOne · Tax calculator", steps: TAX_STEPS },
            { id: "avtar", label: "AVTAR", title: "AllInOne · AVTAR help", steps: AVTAR_STEPS },
          ]}
        />
      </section>

      <aside className={s.strip} aria-label="Privacy">
        <ShieldCheck aria-hidden strokeWidth={1.8} />
        <span>Everything here runs in your browser. Nothing is uploaded.</span>
        <Link href="/welcome#how" className="t-small t-accent">
          How this works
        </Link>
      </aside>
      </div>

      <RightRail />
    </div>
  );
}
