/**
 * The tool catalogue, shared by the website and the mobile app so the two can
 * never disagree about what exists or whether it is ready.
 *
 * The shape follows the design system: a tool belongs to one of four colour
 * hues used on its icon tile, carries a status badge, and names the verb its
 * footer should use.
 */

/** Icon tile colours. Only ever tint an icon, never a fill or body text. */
export type TileHue = "pdf" | "career" | "ai" | "tax";

export type ToolStatus = "live" | "new" | "soon";

export type Tool = {
  slug: string;
  name: string;
  /** One sentence, what it does for the person. Keep it under 70 characters. */
  blurb: string;
  hue: TileHue;
  /** An icon name from the design system's set. */
  icon: string;
  href: string;
  status: ToolStatus;
  /** The footer verb, e.g. "Open tool", "Check score", "Start ITR". */
  action: string;
  /** File extensions the home drop zone can route to this tool. */
  accepts?: string[];
};

/** A top-level section: one nav link, one page. */
export type Section = {
  id: string;
  name: string;
  href: string;
  hue: TileHue;
  /** Shown as the section page's standfirst. */
  blurb: string;
};

export const SECTIONS: Section[] = [
  {
    id: "pdf",
    name: "PDF tools",
    href: "/pdf",
    hue: "pdf",
    blurb:
      "Merge, split, rotate and convert. Every one of these runs in this tab, so your file never leaves the device.",
  },
  {
    id: "jobs",
    name: "Jobs",
    href: "/jobs",
    hue: "career",
    blurb:
      "Search openings from public job feeds and track every application in one board.",
  },
  {
    id: "resume",
    name: "Resume",
    href: "/resume",
    hue: "career",
    blurb:
      "Build a clean, machine-readable resume and export it as a PDF parsers can read.",
  },
  {
    id: "ats",
    name: "ATS check",
    href: "/ats",
    hue: "career",
    blurb:
      "Score your resume against a job description and see exactly what is missing.",
  },
  {
    id: "ai",
    name: "AI chat",
    href: "/ai",
    hue: "ai",
    blurb:
      "Claude, GPT and Gemini in one window, using your own API keys.",
  },
  {
    id: "tax",
    name: "Tax & ITR",
    href: "/tax",
    hue: "tax",
    blurb:
      "Compare the old and new regimes, work out what you owe, and get help filing.",
  },
];

export const TOOLS: Tool[] = [
  // --- PDF. All of these are built and run entirely on the device. ---
  {
    slug: "merge",
    name: "Merge PDFs",
    blurb: "Combine files in the order you choose.",
    hue: "pdf",
    icon: "merge",
    href: "/pdf/merge",
    status: "live",
    action: "Open tool",
    accepts: ["pdf"],
  },
  {
    slug: "split",
    name: "Split PDF",
    blurb: "Pull out pages or ranges into new files.",
    hue: "pdf",
    icon: "split",
    href: "/pdf/split",
    status: "live",
    action: "Open tool",
    accepts: ["pdf"],
  },
  {
    slug: "organise",
    name: "Rotate & delete pages",
    blurb: "Fix sideways scans, drop blank pages.",
    hue: "pdf",
    icon: "rotate",
    href: "/pdf/organise",
    status: "live",
    action: "Open tool",
    accepts: ["pdf"],
  },
  {
    slug: "to-images",
    name: "PDF to images",
    blurb: "Save every page as a PNG, in one zip.",
    hue: "pdf",
    icon: "image",
    href: "/pdf/to-images",
    status: "live",
    action: "Open tool",
    accepts: ["pdf"],
  },
  {
    slug: "from-images",
    name: "Images to PDF",
    blurb: "Turn photos and scans into a single PDF.",
    hue: "pdf",
    icon: "file",
    href: "/pdf/from-images",
    status: "live",
    action: "Open tool",
    accepts: ["png", "jpg", "jpeg"],
  },

  // --- Not built yet. These never link to an empty page. ---
  {
    slug: "jobs",
    name: "Find jobs",
    blurb: "Search openings and track every application.",
    hue: "career",
    icon: "briefcase",
    href: "/jobs",
    status: "soon",
    action: "Notify me",
  },
  {
    slug: "resume",
    name: "Resume builder",
    blurb: "ATS-friendly templates, export to PDF.",
    hue: "career",
    icon: "resume",
    href: "/resume",
    status: "soon",
    action: "Notify me",
  },
  {
    slug: "ats",
    name: "ATS score check",
    blurb: "Match your resume to a job description.",
    hue: "career",
    icon: "target",
    href: "/ats",
    status: "soon",
    action: "Notify me",
    accepts: ["pdf", "docx"],
  },
  {
    slug: "ai",
    name: "AI chat",
    blurb: "Claude, GPT and Gemini in one window.",
    hue: "ai",
    icon: "chat",
    href: "/ai",
    status: "soon",
    action: "Notify me",
  },
  {
    slug: "tax",
    name: "Tax & ITR help",
    blurb: "Compare regimes, then file with guidance.",
    hue: "tax",
    icon: "rupee",
    href: "/tax",
    status: "soon",
    action: "Notify me",
  },
];

/** The pill tabs on the home grid. */
export const TOOL_FILTERS = [
  { id: "all", name: "All", hue: null },
  { id: "pdf", name: "PDF", hue: "pdf" },
  { id: "career", name: "Career", hue: "career" },
  { id: "tax", name: "Tax", hue: "tax" },
  { id: "ai", name: "AI", hue: "ai" },
] as const satisfies readonly { id: string; name: string; hue: TileHue | null }[];

export function sectionById(id: string): Section | undefined {
  return SECTIONS.find((s) => s.id === id);
}

export function toolsByHue(hue: TileHue): Tool[] {
  return TOOLS.filter((t) => t.hue === hue);
}

export function liveTools(): Tool[] {
  return TOOLS.filter((t) => t.status !== "soon");
}

/** Tools that can open a file with this extension. Built ones come first. */
export function toolsAccepting(extension: string): Tool[] {
  const ext = extension.toLowerCase().replace(/^\./, "");
  return TOOLS.filter((t) => t.accepts?.includes(ext)).sort(
    (a, b) => Number(b.status !== "soon") - Number(a.status !== "soon"),
  );
}
