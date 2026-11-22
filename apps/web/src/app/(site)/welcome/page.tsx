import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  Check,
  Cpu,
  Download,
  IndianRupee,
  LayoutGrid,
  X,
} from "lucide-react";
import { EMPTY_TAX_INPUTS, TOOLS, avtarReply, compareRegimes, isLive } from "@aio/core";
import { Button } from "@/components/ui/Button";
import { LinkChip, PromiseChip } from "@/components/ui/Chip";
import { DemoWindow } from "@/components/ui/DemoWindow";
import { IconTile } from "@/components/ui/IconTile";
import { Accent, SectionIntro } from "@/components/ui/SectionIntro";
import { Tag } from "@/components/ui/Tag";
import { ToolCard } from "@/components/ui/ToolCard";
import { MERGE_STEPS } from "@/components/ui/demos/MergeDemo";
import { FeatureTour } from "@/components/site/FeatureTour";
import { toneFor, toolIcon } from "@/lib/tool-ui";
import { inr } from "@/lib/format";
import s from "./welcome.module.css";

export const metadata: Metadata = {
  title: "AllInOne — free PDF tools, tax calculator and interview prep",
  description:
    "Merge and split PDFs, compare old and new tax regimes, and prepare for interviews. Free, with no account, and your files never leave your browser.",
};

const live = TOOLS.filter((t) => isLive(t));
const notLive = TOOLS.filter((t) => !isLive(t));
const building = notLive.filter((t) => t.status === "building");
const soon = notLive.filter((t) => t.status !== "building");

const TAX = compareRegimes({ ...EMPTY_TAX_INPUTS, salary: 1_800_000, section80C: 150_000, section80D: 25_000 });
const BETTER = TAX.better === "new" ? "New regime" : "Old regime";

const STEPS = [
  { icon: LayoutGrid, title: "Pick a tool", body: "No sign-up and no download. Open it from the menu, or ask AVTAR." },
  { icon: Cpu, title: "It runs in your tab", body: "Your file is worked on inside this browser tab, on your own device." },
  { icon: Download, title: "Download — nothing is uploaded", body: "Save the result straight away. No watermark, no email to hand over." },
];

const KEPT = [
  "Your files, while a PDF tool works on them",
  "Your tax inputs, kept only in this browser",
  "Your AVTAR chat history, in this browser's storage",
];
const NEVER = ["Upload your files", "Track you", "Show ads", "Ask you to sign up"];

const LIMITS = [
  "Very large PDFs (200+ MB) may be slow on older phones.",
  "The tax calculator is an estimate, not filing advice.",
  "AVTAR answers from a fixed FAQ and can't chat freely.",
  "Data lives in this browser — clearing it removes your history.",
];

/** The FAQ asks AVTAR, so the page and the bot can never disagree. */
const FAQ = [
  "Is it really free?",
  "Are my files uploaded?",
  "Do I need an account?",
  "Old or new tax regime?",
  "What is 87A rebate?",
  "What can I learn here?",
  "When is ATS score check coming?",
  "Where is my history saved?",
].map((question) => {
  const answer = avtarReply(question);
  // Only link to pages that work today.
  const links = answer.links.filter((l) => {
    const tool = TOOLS.find((t) => t.href === l.href);
    return !tool || isLive(tool);
  });
  return { question, text: answer.text, links };
});

/**
 * The front door for someone who has never heard of AllInOne: what works
 * today, how it treats your files, what's coming, and what it can't do.
 */
export default function Welcome() {
  return (
    <div className={s.page}>
      {/* ------------------------------------------------------------ hero */}
      <section className={s.hero} aria-labelledby="hero-title">
        <div className={s.heroCopy}>
          <Tag kind="live">{live.length} tools live · free</Tag>
          <h1 id="hero-title" className="t-display-xl">
            Your everyday tools, <Accent>all in one tab.</Accent>
          </h1>
          <p className="t-body-l">
            Merge PDFs, compare tax regimes and prep for interviews. Free, with no account — and your files never
            leave this browser.
          </p>
          <div className={s.actions}>
            <Button variant="primary" href="/pdf" size="lg" iconRight={ArrowRight}>
              Open a tool
            </Button>
            <Button href="#roadmap" size="lg" variant="ghost" iconRight={ArrowDown}>
              See what&rsquo;s coming
            </Button>
          </div>
          <div className={s.promises}>
            <PromiseChip>
              Free, <span className="t-mono">₹0</span>
            </PromiseChip>
            <PromiseChip>No account</PromiseChip>
            <PromiseChip>
              <span className="t-mono">0 bytes</span> uploaded
            </PromiseChip>
          </div>
        </div>

        <div className={s.heroDemo}>
          <DemoWindow title="Sample view · Merge PDFs" steps={MERGE_STEPS} />
          <div className={`${s.float} ${s.floatA}`}>
            <IconTile icon={CheckCircle2} tone="tax" />
            <div>
              <strong>merged.pdf is ready</strong>
              <span className="t-mono">0 bytes uploaded</span>
            </div>
          </div>
          <div className={`${s.float} ${s.floatB}`}>
            <IconTile icon={IndianRupee} tone="brand" />
            <div>
              <strong>
                {BETTER} saves <span className="t-mono">{inr(TAX.saving)}</span>
              </strong>
              <span>Sample · on {inr(1_800_000)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- tools */}
      <section id="tools" className={s.section} aria-labelledby="tools-title">
        <SectionIntro id="tools-title" eyebrow="Tools" title="What you can do today">
          Six tools that work right now, each free and without an account.
        </SectionIntro>
        <div className={s.grid3}>
          {live.map((tool) => (
            <ToolCard
              key={tool.slug}
              href={tool.href}
              icon={toolIcon(tool)}
              tone={toneFor(tool.hue)}
              title={tool.name}
              blurb={tool.blurb}
              action={tool.action}
            />
          ))}
        </div>
        <h3 className={s.subhead}>On the way</h3>
        <div className={s.grid4}>
          {[...building, ...soon].map((tool) => (
            <ToolCard
              key={tool.slug}
              variant="soon"
              building={tool.status === "building"}
              icon={toolIcon(tool)}
              tone={toneFor(tool.hue)}
              title={tool.name}
              blurb={tool.blurb}
            />
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------- feature tour */}
      <section className={s.section} aria-labelledby="tour-title">
        <SectionIntro id="tour-title" eyebrow="A closer look" title={<>Four things, <Accent>each one free</Accent></>}>
          Every window plays the real feature through with sample data. Pause it, or tap a step to look closer.
        </SectionIntro>
        <FeatureTour />
      </section>

      {/* ---------------------------------------------------- how it works */}
      <section id="how" className={s.section} aria-labelledby="how-title">
        <SectionIntro id="how-title" eyebrow="How it works" title="Three steps, and no upload" />
        <ol className={s.how}>
          {STEPS.map((step, index) => (
            <li key={step.title}>
              <div className={s.howTop}>
                <span className={s.n}>{index + 1}</span>
                <IconTile icon={step.icon} tone="brand" />
              </div>
              <strong>{step.title}</strong>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* --------------------------------------------------------- privacy */}
      <section className={s.section} aria-labelledby="privacy-title">
        <SectionIntro id="privacy-title" eyebrow="Privacy" title="Privacy, explained">
          No policy to decode. Here is all of it.
        </SectionIntro>
        <div className={s.split}>
          <div className={s.splitCol}>
            <h3 className="t-h3">What stays on your device</h3>
            <ul className={s.bullets}>
              {KEPT.map((item) => (
                <li key={item}>
                  <span className={s.yes}>
                    <Check aria-hidden strokeWidth={2.2} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className={s.splitCol}>
            <h3 className="t-h3">What we never do</h3>
            <ul className={s.bullets}>
              {NEVER.map((item) => (
                <li key={item}>
                  <span className={s.no}>
                    <X aria-hidden strokeWidth={2.2} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- roadmap */}
      <section id="roadmap" className={s.section} aria-labelledby="roadmap-title">
        <SectionIntro id="roadmap-title" eyebrow="Roadmap" title="What's live, and what's next" align="center">
          Straight from the tool list, so it is always current.
        </SectionIntro>
        <div className={s.roadmap}>
          <div className={s.lane}>
            <div className={s.laneHead}>
              <h3>Live</h3>
              <span className="t-mono">{live.length}</span>
            </div>
            <ul>
              {live.map((tool) => (
                <li key={tool.slug}>
                  <Link href={tool.href} className={s.laneLink}>
                    {tool.name}
                    <Tag kind="live" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className={s.lane}>
            <div className={s.laneHead}>
              <h3>Building now</h3>
              <span className="t-mono">{building.length}</span>
            </div>
            <ul>
              {building.map((tool) => (
                <li key={tool.slug}>
                  <span className={s.laneItem} aria-disabled="true">
                    {tool.name}
                    <Tag kind="building" />
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className={`${s.lane} ${s.laneSoon}`}>
            <div className={s.laneHead}>
              <h3>Soon</h3>
              <span className="t-mono">{soon.length}</span>
            </div>
            <ul>
              {soon.map((tool) => (
                <li key={tool.slug}>
                  <span className={s.laneItem} aria-disabled="true">
                    {tool.name}
                    <Tag kind="soon" />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- limits */}
      <section className={s.section} aria-labelledby="limits-title">
        <div className={s.limits}>
          <SectionIntro id="limits-title" eyebrow="Honest limits" title="What it can't do (yet)">
            Better to say so now than to disappoint you later.
          </SectionIntro>
          <ul className={s.limitList}>
            {LIMITS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* ------------------------------------------------------------- FAQ */}
      <section id="faq" className={s.section} aria-labelledby="faq-title">
        <SectionIntro id="faq-title" eyebrow="Questions" title="Asked and answered" align="center">
          These answers come from AVTAR, the help bot in the corner of every page.
        </SectionIntro>
        <div className={s.faq}>
          {FAQ.map(({ question, text, links }) => (
            <details key={question} className={s.qa}>
              <summary>
                {question}
                <span className={s.plus} aria-hidden />
              </summary>
              <div className={s.answer}>
                <p>{text}</p>
                {links.length > 0 && (
                  <div className={s.links}>
                    {links.map((link) => (
                      <LinkChip key={link.href} href={link.href}>
                        {link.label}
                      </LinkChip>
                    ))}
                  </div>
                )}
              </div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
