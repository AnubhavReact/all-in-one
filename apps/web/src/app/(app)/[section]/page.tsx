import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { SECTIONS, TOOLS, sectionById } from "@aio/core";
import { AskAvtarButton } from "@/components/ui/AskAvtarButton";
import { Button } from "@/components/ui/Button";
import { IconTile } from "@/components/ui/IconTile";
import { Tag } from "@/components/ui/Tag";
import { toneFor, toolIcon } from "@/lib/tool-ui";
import s from "./Section.module.css";

/** Sections with their own route; the rest are still being built. */
const BUILT = ["pdf", "tax"];
const PLANNED = SECTIONS.filter((section) => !BUILT.includes(section.id)).map((section) => section.id);

/**
 * What each tool is meant to do, kept modest, plus the honest catch where
 * there is one. The question is one AVTAR's FAQ can answer.
 */
const PLAN: Record<string, { steps: string[]; snag?: string; question: string }> = {
  jobs: {
    steps: [
      "Search openings by role and city from public job feeds",
      "Save a listing and track it from applied to offer",
      "Keep every application in one board",
    ],
    snag: "Listings will only come from feeds that allow it. LinkedIn and Naukri forbid scraping, so they won't appear here.",
    question: "Where will job listings come from?",
  },
  resume: {
    steps: [
      "Fill in a form and get a clean, single-column resume",
      "Export it as a PDF that parsers can read",
      "Keep one version for each kind of role you apply to",
    ],
    question: "What will the resume builder do?",
  },
  ats: {
    steps: [
      "Upload your resume and paste a job description",
      "Get a match score and the job's terms your resume is missing",
      "Spot formatting that trips up parsers, like tables and columns",
    ],
    snag: "No tool can see a real employer's scoring rules. This shows how a typical parser reads your resume, which is the part you control.",
    question: "How will the ATS score work?",
  },
  ai: {
    steps: [
      "Chat with Claude, GPT and Gemini in one window",
      "Use your own API keys, kept on your device",
      "Ask two models the same question and compare",
    ],
    snag: "ChatGPT and Gemini can't be embedded in another site, so this will use their APIs, which means bringing your own key.",
    question: "What will the AI chat do?",
  },
};

export function generateStaticParams() {
  return PLANNED.map((section) => ({ section }));
}

export async function generateMetadata({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const found = sectionById(section);
  if (!found) return {};
  return { title: `${found.name} — AllInOne`, description: found.blurb };
}

/** An honest placeholder for a tool that isn't built yet. No fake forms. */
export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (!PLANNED.includes(section)) notFound();

  const found = sectionById(section);
  if (!found) notFound();

  const plan = PLAN[section];
  const tool = TOOLS.find((t) => t.slug === section);
  const building = tool?.status === "building";
  const Icon = toolIcon(tool ?? { icon: "" });

  return (
    <article className={s.page} aria-labelledby="section-title">
      <header className={s.head}>
        <IconTile icon={Icon} tone={building ? toneFor(found.hue) : "soon"} size={48} />
        <div className={s.titleRow}>
          <h1 id="section-title" className="t-h1">
            {found.name}
          </h1>
          <Tag kind={building ? "building" : "soon"} />
        </div>
        <p className={`t-body-l ${s.blurb}`}>{found.blurb}</p>
      </header>

      {plan && (
        <section className={s.panel} aria-labelledby="section-plan">
          <h2 id="section-plan" className="t-h3">
            What it will do
          </h2>
          <ol className={s.list}>
            {plan.steps.map((step, i) => (
              <li key={step}>
                <span className={s.n} aria-hidden>
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          {plan.snag && (
            <p className={s.snag}>
              <strong>The catch: </strong>
              {plan.snag}
            </p>
          )}
        </section>
      )}

      <div className={s.foot}>
        <p className={s.promise}>We&apos;ll mark it Live when it actually works.</p>
        <div className={s.actions}>
          <Button variant="primary" href="/" icon={ArrowLeft}>
            Browse live tools
          </Button>
          <AskAvtarButton question={plan?.question ?? `What is ${found.name}?`} variant="ghost" />
        </div>
      </div>
    </article>
  );
}
