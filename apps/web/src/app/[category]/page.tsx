import { notFound } from "next/navigation";
import { CATEGORIES, categoryById, toolsByCategory, type CategoryId } from "@aio/core";

/** The PDF section has its own page; these are the five still being built. */
const PLANNED: CategoryId[] = ["jobs", "resume", "ats", "ai", "tax"];

/** What each section will do, and the honest catch where there is one. */
const NEXT_UP: Record<CategoryId, { steps: string[]; catch?: string }> = {
  pdf: { steps: [] },
  jobs: {
    steps: [
      "Search by role, city and experience across public job feeds",
      "Save a listing and track it from applied through to offer",
      "A weekly email of new matches for your saved searches",
    ],
    catch:
      "Listings come from feeds that allow it, such as Adzuna and RemoteOK. LinkedIn and Naukri forbid scraping, so they will not appear here.",
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
    catch:
      "No tool can see a real employer's scoring rules. This tells you how a typical parser reads your resume, which is the part you can actually control.",
  },
  ai: {
    steps: [
      "One chat window, with Claude, GPT and Gemini side by side",
      "Your API keys stay on your device and are never sent to us",
      "Ask the same question to two models and compare the answers",
    ],
    catch:
      "ChatGPT and Gemini cannot be embedded in another site — they block it, and it breaks their terms. So this uses their APIs instead, which means bringing your own key.",
  },
  tax: {
    steps: [
      "Enter your salary and deductions, see old regime against new",
      "A slab-by-slab breakdown, so you can see where the tax comes from",
      "Export the figures you need to fill your return",
    ],
    catch:
      "Filing on your behalf needs an ERI licence from the Income Tax Department. Until then this works out what you owe and explains it; you file on the government portal.",
  },
};

export function generateStaticParams() {
  return PLANNED.map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const found = CATEGORIES.find((c) => c.id === category);
  if (!found) return {};
  return { title: `${found.name} — All In One`, description: found.blurb };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (!PLANNED.includes(category as CategoryId)) notFound();

  const cat = categoryById(category as CategoryId);
  const plan = NEXT_UP[cat.id];
  const tools = toolsByCategory(cat.id);

  return (
    <div className="space-y-8">
      <header className="space-y-3 border-b-2 border-ink pb-6">
        <div className="flex items-center gap-2.5">
          <span className={`h-3 w-3 ${cat.chip}`} aria-hidden />
          <span className="text-[13px] font-medium text-ink-70">
            {cat.name}
          </span>
        </div>
        <h1 className="text-3xl font-extrabold md:text-4xl">
          {tools[0]?.name ?? cat.name}
        </h1>
        <p className="max-w-[62ch] text-[15px] leading-relaxed text-ink-70">
          {cat.blurb}
        </p>
      </header>

      <div className="rounded-tile border-2 border-dashed border-rule bg-card p-6">
        <h2 className="text-[16px] font-bold">Not built yet</h2>
        <p className="mt-1.5 max-w-[60ch] text-[14px] leading-relaxed text-ink-70">
          The PDF tools work today. This is what this section will do:
        </p>
        <ul className="mt-4 space-y-2.5">
          {plan.steps.map((step) => (
            <li key={step} className="flex gap-3 text-[14px] leading-relaxed">
              <span className={`mt-1.5 h-2 w-2 shrink-0 ${cat.chip}`} aria-hidden />
              {step}
            </li>
          ))}
        </ul>
        {plan.catch && (
          <p className="mt-5 max-w-[60ch] border-l-4 border-signal bg-paper py-3 pl-4 text-[13.5px] leading-relaxed">
            {plan.catch}
          </p>
        )}
      </div>
    </div>
  );
}
