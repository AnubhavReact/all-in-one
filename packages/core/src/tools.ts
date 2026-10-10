export type CategoryId = "pdf" | "jobs" | "resume" | "ats" | "ai" | "tax";

export type Category = {
  id: CategoryId;
  name: string;
  blurb: string;
  /** Tailwind class for the category's flat colour chip. */
  chip: string;
  text: string;
};

export type Tool = {
  slug: string;
  name: string;
  /** What it does, in the user's words. */
  blurb: string;
  category: CategoryId;
  href: string;
  ready: boolean;
  /** File extensions this tool can accept from the drop router. */
  accepts?: string[];
};

export const CATEGORIES: Category[] = [
  {
    id: "pdf",
    name: "PDF",
    blurb: "Merge, split, rotate and convert, all inside your browser.",
    chip: "bg-cat-pdf",
    text: "text-cat-pdf",
  },
  {
    id: "jobs",
    name: "Jobs",
    blurb: "Search openings from public job feeds and track what you applied to.",
    chip: "bg-cat-jobs",
    text: "text-cat-jobs",
  },
  {
    id: "resume",
    name: "Resume",
    blurb: "Build a clean, machine-readable resume and export it as PDF.",
    chip: "bg-cat-resume",
    text: "text-cat-resume",
  },
  {
    id: "ats",
    name: "ATS check",
    blurb: "See how a resume scores against a job description before you apply.",
    chip: "bg-cat-ats",
    text: "text-cat-ats",
  },
  {
    id: "ai",
    name: "AI chat",
    blurb: "Talk to Claude, GPT and Gemini from one window with your own API keys.",
    chip: "bg-cat-ai",
    text: "text-cat-ai",
  },
  {
    id: "tax",
    name: "Tax",
    blurb: "Work out your income tax under both regimes and see what you owe.",
    chip: "bg-cat-tax",
    text: "text-cat-tax",
  },
];

export const TOOLS: Tool[] = [
  // PDF — all of these run entirely on the device.
  {
    slug: "merge",
    name: "Merge PDFs",
    blurb: "Join several PDFs into one, in the order you choose.",
    category: "pdf",
    href: "/pdf/merge",
    ready: true,
    accepts: ["pdf"],
  },
  {
    slug: "split",
    name: "Split PDF",
    blurb: "Pull out a page range, or break every page into its own file.",
    category: "pdf",
    href: "/pdf/split",
    ready: true,
    accepts: ["pdf"],
  },
  {
    slug: "organise",
    name: "Rotate & delete pages",
    blurb: "Turn pages the right way up and drop the ones you don't need.",
    category: "pdf",
    href: "/pdf/organise",
    ready: true,
    accepts: ["pdf"],
  },
  {
    slug: "to-images",
    name: "PDF to images",
    blurb: "Save each page as a PNG, downloaded together in a zip.",
    category: "pdf",
    href: "/pdf/to-images",
    ready: true,
    accepts: ["pdf"],
  },
  {
    slug: "from-images",
    name: "Images to PDF",
    blurb: "Turn photos or scans into a single PDF.",
    category: "pdf",
    href: "/pdf/from-images",
    ready: true,
    accepts: ["png", "jpg", "jpeg"],
  },

  // Everything below is scaffolded but not built yet.
  {
    slug: "search",
    name: "Find jobs",
    blurb: "Search public job feeds by role, city and experience.",
    category: "jobs",
    href: "/jobs",
    ready: false,
  },
  {
    slug: "builder",
    name: "Build a resume",
    blurb: "Fill in a form, get a PDF that parsers can actually read.",
    category: "resume",
    href: "/resume",
    ready: false,
  },
  {
    slug: "score",
    name: "Check ATS score",
    blurb: "Compare your resume against a job description, line by line.",
    category: "ats",
    href: "/ats",
    ready: false,
    accepts: ["pdf", "docx"],
  },
  {
    slug: "chat",
    name: "Open AI chat",
    blurb: "One chat window, several models, your keys stay on your device.",
    category: "ai",
    href: "/ai",
    ready: false,
  },
  {
    slug: "calculator",
    name: "Income tax calculator",
    blurb: "Old regime against new regime, for the current assessment year.",
    category: "tax",
    href: "/tax",
    ready: false,
  },
];

export function categoryById(id: CategoryId): Category {
  const found = CATEGORIES.find((c) => c.id === id);
  if (!found) throw new Error(`Unknown category: ${id}`);
  return found;
}

export function toolsByCategory(id: CategoryId): Tool[] {
  return TOOLS.filter((t) => t.category === id);
}

/** Tools that can open a file with this extension, readiest first. */
export function toolsAccepting(extension: string): Tool[] {
  const ext = extension.toLowerCase().replace(/^\./, "");
  return TOOLS.filter((t) => t.accepts?.includes(ext)).sort(
    (a, b) => Number(b.ready) - Number(a.ready),
  );
}
