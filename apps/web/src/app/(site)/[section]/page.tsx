import Link from "next/link";
import { notFound } from "next/navigation";
import { SECTIONS, TOOLS, sectionById } from "@aio/core";
import { Icon } from "@/components/ui/Icon";
import { Note } from "@/components/ui/Note";

/** PDF has its own page; these five are the ones still being built. */
const PLANNED = SECTIONS.filter((s) => s.id !== "pdf").map((s) => s.id);

/** What each section will do, and the honest catch where there is one. */
const PLAN: Record<string, { steps: string[]; snag?: string }> = {
  jobs: {
    steps: [
      "Search by role, city and experience across public job feeds",
      "Save a listing and track it from applied through to offer",
      "A weekly email of new matches for your saved searches",
    ],
    snag:
      "Listings will come from feeds that allow it, such as Adzuna and RemoteOK. LinkedIn and Naukri forbid scraping, so they will not appear here.",
  },
  resume: {
    steps: [
      "Fill in a form and get a single-column PDF parsers can read",
      "Keep several versions, one per kind of role you apply to",
      "Send a version straight into the ATS check",
    ],
  },
  ats: {
    steps: [
      "Upload a resume, paste a job description, get a score out of 100",
      "See which of the job's terms are missing from your resume",
      "Catch the formatting that breaks parsers: tables, columns, images",
    ],
    snag:
      "No tool can see a real employer's scoring rules. This tells you how a typical parser reads your resume, which is the part you can actually control.",
  },
  ai: {
    steps: [
      "One chat window, with Claude, GPT and Gemini side by side",
      "Your API keys stay on your device and are never sent to us",
      "Ask the same question to two models and compare the answers",
    ],
    snag:
      "ChatGPT and Gemini cannot be embedded in another site — they block it, and it breaks their terms. So this uses their APIs instead, which means bringing your own key.",
  },
  tax: {
    steps: [
      "Enter your salary and deductions, see old regime against new",
      "A slab-by-slab breakdown, so you can see where the tax comes from",
      "Export the figures you need to fill your return",
    ],
    snag:
      "Filing on your behalf needs an ERI licence from the Income Tax Department. Until then this works out what you owe and explains it; you file on the government portal.",
  },
};

export function generateStaticParams() {
  return PLANNED.map((section) => ({ section }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const found = sectionById(section);
  if (!found) return {};
  return { title: `${found.name} — AllInOne`, description: found.blurb };
}

export default async function SectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  if (!PLANNED.includes(section)) notFound();

  const found = sectionById(section);
  if (!found) notFound();

  const plan = PLAN[section];
  const tool = TOOLS.find((t) => t.slug === section);

  return (
    <div className="aio-p-sec">
      <div className="aio-row" style={{ gap: "var(--space-3)" }}>
        <span className={`aio-tile aio-tile--${found.hue}`}>
          <Icon name={tool?.icon ?? "grid"} />
        </span>
        <span className="aio-badge aio-badge--soon">Coming soon</span>
      </div>

      <h1 className="aio-h2" style={{ marginTop: "var(--space-4)" }}>
        {found.name}
      </h1>
      <p className="aio-lead" style={{ marginTop: 12, maxWidth: "62ch" }}>
        {found.blurb}
      </p>

      <div
        className="aio-card"
        style={{ marginTop: "var(--space-8)", maxWidth: "70ch" }}
      >
        <div className="aio-card-head">
          <h3>What this will do</h3>
        </div>
        <ul className="aio-p-feat" style={{ margin: 0 }}>
          {plan?.steps.map((step) => (
            <li key={step}>
              <Icon name="check" />
              <span>{step}</span>
            </li>
          ))}
        </ul>
      </div>

      {plan?.snag && (
        <div style={{ marginTop: "var(--space-4)", maxWidth: "70ch" }}>
          <Note icon="lock">{plan.snag}</Note>
        </div>
      )}

      <div className="aio-p-actions" style={{ marginTop: "var(--space-8)" }}>
        <Link className="aio-btn aio-btn--primary" href="/pdf">
          <Icon name="file" />
          Use the PDF tools meanwhile
        </Link>
      </div>
    </div>
  );
}
