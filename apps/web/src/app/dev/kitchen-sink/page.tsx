"use client";

import { useState, type ReactNode } from "react";
import {
  ArrowRight,
  BookOpen,
  Bot,
  Briefcase,
  Calculator,
  Combine,
  FileImage,
  FileText,
  Images,
  RotateCw,
  ScanSearch,
  Scissors,
  ShieldCheck,
  Sparkles,
  Target,
  Upload,
} from "lucide-react";
import { AmountInput } from "@/components/ui/AmountInput";
import { AskAvtarButton } from "@/components/ui/AskAvtarButton";
import { Button, IconButton } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { FilterChip, LinkChip, PromiseChip, SuggestionChip } from "@/components/ui/Chip";
import { CTABand } from "@/components/ui/CTABand";
import { DemoWindow } from "@/components/ui/DemoWindow";
import { MERGE_STEPS } from "@/components/ui/demos/MergeDemo";
import { DropZone, type DropFile } from "@/components/ui/DropZone";
import { FeatureItem } from "@/components/ui/FeatureItem";
import { Footer } from "@/components/ui/Footer";
import { IconTile } from "@/components/ui/IconTile";
import { PrivacyCard } from "@/components/ui/PrivacyCard";
import { Accent, SectionIntro } from "@/components/ui/SectionIntro";
import { Segmented } from "@/components/ui/Segmented";
import { StepsCard } from "@/components/ui/StepsCard";
import { Tag } from "@/components/ui/Tag";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ToolCard } from "@/components/ui/ToolCard";
import s from "./sink.module.css";

/* ------------------------------------------------------------- frame */

function Both({ both, children }: { both: boolean; children: ReactNode }) {
  if (!both) return <div className={s.single}>{children}</div>;
  return (
    <div className={s.panes}>
      {(["light", "dark"] as const).map((theme) => (
        <div key={theme} className={`ui ${s.pane}`} data-theme={theme} style={{ background: "var(--page)" }}>
          <span className={s.paneLabel}>{theme}</span>
          {children}
        </div>
      ))}
    </div>
  );
}

function Section({ id, title, note, both, children }: { id: string; title: string; note?: string; both: boolean; children: ReactNode }) {
  return (
    <section id={id} className={s.section} aria-labelledby={`${id}-h`}>
      <header>
        <h2 id={`${id}-h`} className="t-h3">
          {title}
        </h2>
        {note && <p>{note}</p>}
      </header>
      <Both both={both}>{children}</Both>
    </section>
  );
}

/* ------------------------------------------------------------ demos */

const SWATCHES = [
  "page", "card", "sunken", "line", "line-strong", "ink", "muted", "faint",
  "brand", "brand-hover", "brand-ink", "brand-soft", "progress",
  "success", "success-soft", "warning", "warning-soft", "danger", "danger-soft",
  "tile-pdf", "tile-career", "tile-tax", "tile-learn", "tile-brand",
  "char", "char-2", "char-ink", "char-muted",
];

const TYPE: [string, string, string][] = [
  ["display-xl", "t-display-xl", "Your everyday tools"],
  ["display-l", "t-display-l", "All in one tab"],
  ["h1", "t-h1", "Merge PDFs"],
  ["h2", "t-h2", "What you can do today"],
  ["h3", "t-h3", "How it works"],
  ["body-l", "t-body-l", "Free, with no account — and your files never leave this browser."],
  ["body", "t-body", "Drop your files in, put them in order, and download one PDF."],
  ["small", "t-small", "3 files · 4 pages"],
  ["eyebrow", "t-eyebrow", "01 · PDF tools"],
  ["mono-num", "t-mono-num", "₹18,00,000"],
];

function FormDemo() {
  const [salary, setSalary] = useState<number | null>(1_800_000);
  const [c80, setC80] = useState<number | null>(150_000);
  const [bad, setBad] = useState<number | null>(200_000);
  const [age, setAge] = useState<"u60" | "60" | "80">("u60");
  const [metro, setMetro] = useState(true);
  return (
    <div className={s.stack}>
      <AmountInput label="Annual salary" value={salary} onChange={setSalary} period="year" />
      <AmountInput label="80C investments" capLabel="80C" value={c80} onChange={setC80} max={150_000} />
      <AmountInput label="80C investments (error state)" capLabel="80C" value={bad} onChange={setBad} max={150_000} />
      <Segmented
        legend="Your age"
        value={age}
        onChange={setAge}
        options={[
          { value: "u60", label: "Below 60" },
          { value: "60", label: "60–79" },
          { value: "80", label: "80 and above" },
        ]}
      />
      <Checkbox
        label="I live in a metro city"
        description="Delhi, Mumbai, Kolkata or Chennai: HRA uses 50% of basic, not 40%."
        checked={metro}
        onChange={setMetro}
      />
    </div>
  );
}

const SAMPLE_FILES: DropFile[] = [
  { id: "a", name: "offer-letter.pdf", size: 421_888, pages: 2 },
  { id: "b", name: "salary-slip-oct.pdf", size: 188_416, pages: 1 },
  { id: "c", name: "degree.pdf", size: 942_080, pages: 1 },
];

function DropDemo({ mode }: { mode: "empty" | "over" | "files" | "error" }) {
  const [files, setFiles] = useState<DropFile[]>(mode === "files" || mode === "error" ? SAMPLE_FILES.slice(0, mode === "error" ? 2 : 3) : []);
  return (
    <DropZone
      files={files}
      previewDragOver={mode === "over" ? 3 : undefined}
      error={mode === "error" ? "resume.docx isn't a PDF. Add .pdf files only. Your other 2 files are still here." : undefined}
      onFiles={(added) =>
        setFiles((list) => [
          ...list,
          ...added.map((f, i) => ({ id: `${f.name}-${Date.now()}-${i}`, name: f.name, size: f.size })),
        ])
      }
      onRemove={(id) => setFiles((list) => list.filter((f) => f.id !== id))}
    />
  );
}

function ChipDemo() {
  const [filter, setFilter] = useState("all");
  return (
    <div className={s.stack}>
      <div className={s.row}>
        <PromiseChip>Free, ₹0</PromiseChip>
        <PromiseChip>No account</PromiseChip>
        <PromiseChip>0 bytes uploaded</PromiseChip>
      </div>
      <div className={s.row}>
        <SuggestionChip>How do I merge PDFs?</SuggestionChip>
        <SuggestionChip icon={Calculator}>Old or new tax regime?</SuggestionChip>
      </div>
      <div className={s.row}>
        <LinkChip href="/pdf/merge">Open Merge PDFs</LinkChip>
        <LinkChip href="/tax">Open Tax calculator</LinkChip>
      </div>
      <div className={s.row} role="group" aria-label="Filter tools">
        {["all", "pdf", "money", "learn"].map((f) => (
          <FilterChip key={f} pressed={filter === f} onClick={() => setFilter(f)}>
            {f === "all" ? "All" : f === "pdf" ? "PDF" : f === "money" ? "Money" : "Learn"}
          </FilterChip>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- page */

const TOC = [
  ["colours", "Colours"],
  ["type", "Type"],
  ["buttons", "Buttons"],
  ["tags", "Tags"],
  ["chips", "Chips"],
  ["tiles", "Icon tiles"],
  ["cards", "Tool cards"],
  ["features", "Feature items"],
  ["side", "Steps + privacy"],
  ["forms", "Form fields"],
  ["drop", "Drop zone"],
  ["intro", "Section intro"],
  ["demo", "Demo window"],
  ["cta", "CTA band"],
  ["footer", "Footer"],
];

export default function KitchenSink() {
  const [both, setBoth] = useState(true);

  return (
    <div className={`ui ${s.page}`}>
      <div className={s.top}>
        <h1>
          Kitchen sink <span>· design system v5</span>
        </h1>
        <div className={s.row} role="group" aria-label="Show">
          <FilterChip pressed={both} onClick={() => setBoth(true)}>
            Both themes
          </FilterChip>
          <FilterChip pressed={!both} onClick={() => setBoth(false)}>
            Page theme only
          </FilterChip>
        </div>
        <ThemeToggle outline />
      </div>

      <div className={s.layout}>
        <nav className={s.toc} aria-label="Sections">
          {TOC.map(([id, label]) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
        </nav>

        <main className={s.main}>
          <Section id="colours" title="Colours" note="Every colour is a token. Hex values live only in styles/ui/tokens.css." both={both}>
            <div className={s.swatches}>
              {SWATCHES.map((name) => (
                <span key={name} className={s.swatch}>
                  <i style={{ background: `var(--${name})` }} />
                  --{name}
                </span>
              ))}
            </div>
          </Section>

          <Section id="type" title="Type scale" note="Inter for everything, JetBrains Mono for numbers. Shrinks at 600px." both={both}>
            <div className={s.stack}>
              {TYPE.map(([name, cls, sample]) => (
                <div key={name} className={s.typeRow}>
                  <code>{name}</code>
                  <span className={cls}>
                    {name === "display-xl" ? (
                      <>
                        {sample}, <Accent>all in one tab.</Accent>
                      </>
                    ) : (
                      sample
                    )}
                  </span>
                </div>
              ))}
            </div>
          </Section>

          <Section id="buttons" title="Buttons" note="One primary per view. A disabled button says what is needed." both={both}>
            <div className={s.stack}>
              <div className={s.row}>
                <Button variant="primary" iconRight={ArrowRight}>Open a tool</Button>
                <Button variant="secondary">See what&rsquo;s coming</Button>
                <Button variant="ghost">How this works</Button>
              </div>
              <div className={s.row}>
                <Button variant="primary" size="lg" icon={Combine}>Merge 3 PDFs</Button>
                <Button variant="secondary" size="lg" icon={Upload}>Choose files</Button>
              </div>
              <div className={s.row}>
                <Button variant="primary" disabled>Add 2+ PDFs</Button>
                <IconButton icon={RotateCw} label="Rotate page" />
                <IconButton icon={RotateCw} label="Rotate page" outline />
                <ThemeToggle outline />
              </div>
            </div>
          </Section>

          <Section id="tags" title="Tags" both={both}>
            <div className={s.row}>
              <Tag kind="live" />
              <Tag kind="live">6 tools live · free</Tag>
              <Tag kind="new" />
              <Tag kind="building" />
              <Tag kind="soon" />
              <Tag kind="sample" />
            </div>
          </Section>

          <Section id="chips" title="Chips" note="Promise (static) · suggestion (button) · link · filter (toggle)." both={both}>
            <ChipDemo />
          </Section>

          <Section id="tiles" title="Icon tiles" note="PDF coral · Career teal · Tax green · Learn/AI sky · AVTAR indigo · Soon dashed." both={both}>
            <div className={s.row}>
              <IconTile icon={Combine} tone="pdf" size={48} />
              <IconTile icon={Briefcase} tone="career" size={48} />
              <IconTile icon={Calculator} tone="tax" size={48} />
              <IconTile icon={BookOpen} tone="learn" size={48} />
              <IconTile icon={Bot} tone="brand" size={48} />
              <IconTile icon={Target} tone="soon" size={48} />
              <IconTile icon={Combine} tone="pdf" />
              <IconTile icon={Calculator} tone="tax" />
              <IconTile icon={Target} tone="soon" />
            </div>
          </Section>

          <Section id="cards" title="Tool cards" note="Live cards are links and lift on hover. Soon cards are not focusable, have no hover and no arrow." both={both}>
            <div className={s.grid2}>
              <ToolCard icon={Combine} tone="pdf" title="Merge PDFs" blurb="Put several PDFs into one, in the order you choose." href="/pdf/merge" />
              <ToolCard icon={Calculator} tone="tax" title="Tax calculator" blurb="Old vs new regime for FY 2026-27, slab by slab." href="/tax" />
              <ToolCard variant="soon" icon={ScanSearch} tone="career" title="ATS score check" blurb="Match your resume to a job description." />
              <ToolCard variant="soon" icon={Sparkles} tone="learn" title="AI chat" blurb="Claude, GPT and Gemini with your own key." />
            </div>
          </Section>

          <Section id="features" title="Feature items" note="Flat: they explain, they don't link." both={both}>
            <div className={s.grid2}>
              <FeatureItem icon={Combine} tone="pdf" title="Merge in any order">Drag files into place before you merge.</FeatureItem>
              <FeatureItem icon={Scissors} tone="pdf" title="Split by range">Pull out pages 3–7, or every page on its own.</FeatureItem>
              <FeatureItem icon={FileImage} tone="pdf" title="PDF to images">JPG or PNG, saved together in one zip.</FeatureItem>
              <FeatureItem icon={ShieldCheck} tone="tax" title="Nothing uploaded">It all runs inside this tab.</FeatureItem>
            </div>
          </Section>

          <Section id="side" title="Steps card + privacy card" note="The side column of every tool page." both={both}>
            <div className={s.grid2}>
              <StepsCard
                steps={[
                  { title: "Add your PDFs", body: "Drop them in or choose them from your device." },
                  { title: "Put them in order", body: "Drag a file, or use Space and the arrow keys." },
                  { title: "Merge and download", body: "One PDF, made in this tab." },
                ]}
              />
              <PrivacyCard />
            </div>
          </Section>

          <Section id="forms" title="Form fields" note="Amounts format in lakhs as you type. Errors say how to fix them." both={both}>
            <FormDemo />
          </Section>

          <Section id="drop" title="Drop zone" note="Empty · drag-over · files added · error." both={both}>
            <div className={s.stack}>
              <span className={s.caption}>Empty</span>
              <DropDemo mode="empty" />
              <span className={s.caption}>Drag-over</span>
              <DropDemo mode="over" />
              <span className={s.caption}>Files added</span>
              <DropDemo mode="files" />
              <span className={s.caption}>Error</span>
              <DropDemo mode="error" />
            </div>
          </Section>

          <Section id="intro" title="Section intro" note="Left by default; centred only for Roadmap and FAQ." both={both}>
            <div className={s.stack}>
              <SectionIntro eyebrow="What you can do today" title={<>Six tools, <Accent>all free</Accent></>}>
                Each one runs in your browser. Nothing is uploaded.
              </SectionIntro>
              <SectionIntro eyebrow="Roadmap" title="What's coming next" align="center">
                We&rsquo;ll mark these Live when they actually work.
              </SectionIntro>
            </div>
          </Section>

          <Section id="demo" title="Demo window" note="Pauses when under 25% visible or the tab is hidden; starts paused with reduced motion. Same charcoal in both themes." both={both}>
            <DemoWindow title="AllInOne · Merge PDFs" steps={MERGE_STEPS} />
          </Section>

          <Section id="cta" title="CTA band" note="The white button is the view's one primary." both={both}>
            <CTABand
              title="Got a PDF to fix?"
              primary={{ label: "Open AllInOne", href: "/" }}
              secondary={<AskAvtarButton variant="onBrandOutline" size="lg" />}
            >
              Free, with no account. Your files never leave this browser.
            </CTABand>
          </Section>

          <section id="footer" className={s.section} aria-labelledby="footer-h">
            <header>
              <h2 id="footer-h" className="t-h3">
                Footer
              </h2>
              <p>Charcoal in both themes. Lists come from the tool registry; Soon items are text, not links.</p>
            </header>
            <div className={s.footWrap}>
              <Footer />
            </div>
          </section>

          <p className="t-small t-muted">
            Icons are lucide-react at 1.8 stroke: <FileText width={16} height={16} aria-hidden /> <Images width={16} height={16} aria-hidden />{" "}
            <Scissors width={16} height={16} aria-hidden />
          </p>
        </main>
      </div>
    </div>
  );
}
