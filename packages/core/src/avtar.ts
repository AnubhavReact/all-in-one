/**
 * AVTAR, the site's help bot.
 *
 * It answers from a fixed set of questions written here, never from a model,
 * so it costs nothing, works offline and cannot invent an answer. When a
 * question matches nothing it says so and points at the closest tool, rather
 * than guessing.
 *
 * Plain TypeScript, no DOM: the website and the mobile app share it.
 */
import { TAX_LIMITS, TAX_YEAR } from "./tax";
import { TOOLS, liveTools, searchTools } from "./tools";
import { LEARN_TRACKS } from "./learn";

export const AVTAR = {
  name: "AVTAR",
  subtitle: "PDF tools · tax · learning · career help",
  greeting:
    "Hi! I'm AVTAR. Ask me how to merge or split a PDF, which tax regime suits you, or what's coming next, and I'll point you to the right tool.",
  /** The chips under the greeting. Each one is a question the FAQ answers. */
  starters: [
    "How do I merge PDFs?",
    "Old or new tax regime?",
    "Are my files uploaded?",
    "What tools are live?",
  ],
} as const;

export type AvtarReply = {
  text: string;
  /** Pages to offer as buttons under the answer. */
  links: { label: string; href: string }[];
  /** Which FAQ entry answered, or null when nothing matched. */
  topic: string | null;
};

type Entry = {
  id: string;
  /**
   * Phrases that point at this answer. A longer phrase is stronger evidence,
   * so each scores by its word count. Matched on whole words. A leading "#"
   * marks a specific code (80C, 87A, ITR) that outweighs general words, so
   * "80C in the new regime" is about 80C, not about regimes.
   */
  phrases: string[];
  answer: () => string;
  /** Tool hrefs to offer as buttons. */
  links?: string[];
};

const rupees = (amount: number) =>
  `₹${Math.round(amount).toLocaleString("en-IN")}`;

const liveNames = () =>
  liveTools()
    .map((t) => t.name)
    .join(", ");

const ENTRIES: Entry[] = [
  // ---------------------------------------------------------------- learn
  {
    id: "learn",
    phrases: ["learn", "learning", "study", "course", "courses", "interview prep", "prepare for interview", "interview preparation", "placement", "free resources"],
    answer: () =>
      `The Learn tab has three free study sites: ${LEARN_TRACKS.map((t) => `${t.name} for ${t.area.toLowerCase()}`).join(", ")}. Each one opens in a new tab.`,
    links: ["/learn"],
  },
  {
    id: "learn-system-design",
    phrases: ["system design", "#hld", "#lld", "architecture", "scalability", "load balancer", "rate limiter", "kafka", "structura", "microservices"],
    answer: () =>
      "Structura teaches system design with live diagrams: click any component, follow a request step by step, switch parts off to see what breaks, and run a load test. It covers 57 topics across development, infra, databases and AI.",
    links: ["/learn"],
  },
  {
    id: "learn-databases",
    phrases: ["database", "databases", "#sql", "postgres", "postgresql", "query", "queries", "schema", "#dbms", "schemata", "joins", "indexing"],
    answer: () =>
      "Schemata teaches databases by running a real PostgreSQL in your browser. Follow the roadmap from your first SELECT to MVCC, practise 42 auto-checked questions, and draw schemas as ER diagrams.",
    links: ["/learn"],
  },
  {
    id: "learn-dsa",
    phrases: ["#dsa", "data structures", "algorithms", "algorithm", "leetcode", "coding interview", "coding round", "dsa atlas", "dynamic programming", "graphs"],
    answer: () =>
      "DSA Atlas is a checklist of 134 interview problems in three tiers, grouped by pattern from recursion to advanced DP. It brings solved problems back for revision when they're due and lets you set a goal for a target company.",
    links: ["/learn"],
  },
  // ---------------------------------------------------------------- about
  {
    id: "about",
    phrases: ["what can you do", "what do you do", "help me", "what is this", "what is allinone", "about this site", "features", "how does this work"],
    answer: () =>
      "AllInOne puts everyday paperwork tools in one place. Today you can merge, split, rotate and convert PDFs right in your browser, and compare the old and new income tax regimes. A resume builder, an ATS check, job search and an AI chat are on the way.",
    links: ["/pdf", "/tax"],
  },
  {
    id: "bot",
    phrases: ["who are you", "are you ai", "are you a bot", "are you human", "your name", "avtar", "chatgpt", "are you real"],
    answer: () =>
      "I'm AVTAR, this site's help bot. I answer from a fixed set of answers about AllInOne, so I'm quick and I won't make things up, but I can't chat about other topics.",
  },
  {
    id: "live",
    phrases: ["what tools", "which tools", "tools are live", "tools available", "list of tools", "what works", "what is ready", "all tools"],
    answer: () =>
      `These work right now: ${liveNames()}. The resume builder, ATS check, job search and AI chat are still being built.`,
    links: ["/pdf", "/tax"],
  },
  {
    id: "privacy",
    phrases: ["files uploaded", "file uploaded", "are my files", "is my file", "uploaded", "upload", "privacy", "private", "safe", "secure", "security", "server", "store my", "stored", "delete my", "data", "confidential"],
    answer: () =>
      "No, nothing is uploaded. The PDF tools run entirely in your browser, so your file never leaves your device and there's no copy to delete afterwards. They even work offline. The tax calculator also keeps your figures only in this browser.",
  },
  {
    id: "free",
    phrases: ["free", "cost", "price", "pricing", "paid", "pay", "subscription", "premium", "charge"],
    answer: () =>
      "Everything that's live is free, with no sign-up and no watermark.",
  },
  {
    id: "account",
    phrases: ["account", "sign up", "signup", "sign in", "login", "log in", "register", "password reset"],
    answer: () =>
      "You don't need an account. Every live tool works without one. Accounts will come later, to save resumes and track job applications across devices.",
  },
  {
    id: "history",
    phrases: ["recent files", "history", "my files", "previous files", "find my file", "lost my file", "download again"],
    answer: () =>
      "Recent files on the home page lists what you've made: the name, the tool, the size and when. Only those details are kept, in this browser. The file itself was never uploaded, so if you need it again, run the tool again.",
    links: ["/"],
  },
  {
    id: "shortcuts",
    phrases: ["shortcut", "shortcuts", "keyboard", "cmd k", "ctrl k", "command palette", "search tools"],
    answer: () =>
      "Press ⌘K (Ctrl+K on Windows) to search every tool, and ⌘J (Ctrl+J) to open or close me.",
  },
  {
    id: "theme",
    phrases: ["dark mode", "light mode", "theme", "dark theme", "light theme"],
    answer: () =>
      "Use the moon button in the top bar to switch between dark and light. Your choice is remembered.",
  },
  {
    id: "mobile",
    phrases: ["mobile app", "android", "ios", "iphone", "play store", "app store", "phone app"],
    answer: () =>
      "The site works on phones in the browser. A native Android and iOS app is being built on the same code, so it will give the same answers.",
  },
  {
    id: "offline",
    phrases: ["offline", "without internet", "no internet", "wifi"],
    answer: () =>
      "Once a PDF tool's page has loaded, it keeps working with the internet off, because the work happens on your device.",
  },

  // ------------------------------------------------------------------ pdf
  {
    id: "merge",
    phrases: ["merge", "combine", "join pdf", "join pdfs", "join files", "one pdf", "single pdf", "append"],
    answer: () =>
      "Open Merge PDFs, add your files, drag them into the order you want, then press Merge and download. It happens in your browser, so nothing is uploaded.",
    links: ["/pdf/merge"],
  },
  {
    id: "split",
    phrases: ["split", "extract pages", "extract page", "separate pages", "take out pages", "some pages", "page range", "pages 3"],
    answer: () =>
      "Open Split PDF and add your file. Type the pages you want, like 2-5, 8, the same way you would in a print dialog, and download them. Or choose to get every page as its own file in a zip.",
    links: ["/pdf/split"],
  },
  {
    id: "organise",
    phrases: ["rotate", "sideways", "upside down", "turn page", "delete page", "delete pages", "remove page", "remove pages", "blank page", "reorder"],
    answer: () =>
      "Open Rotate & delete pages. Turn any page that's sideways, drop the ones you don't want, and download the fixed PDF.",
    links: ["/pdf/organise"],
  },
  {
    id: "to-images",
    phrases: ["pdf to image", "pdf to images", "pdf to jpg", "pdf to png", "convert pdf to", "save pages as", "screenshot of page"],
    answer: () =>
      "Open PDF to images. Every page is saved as a PNG, and you get them all in one zip.",
    links: ["/pdf/to-images"],
  },
  {
    id: "from-images",
    phrases: ["image to pdf", "images to pdf", "jpg to pdf", "png to pdf", "photo to pdf", "photos to pdf", "scan to pdf", "picture to pdf"],
    answer: () =>
      "Open Images to PDF, add your photos or scans (JPG or PNG), put them in order, and download one PDF.",
    links: ["/pdf/from-images"],
  },
  {
    id: "compress",
    phrases: ["compress", "reduce size", "smaller", "file size", "shrink"],
    answer: () =>
      "There's no compress tool yet. It's harder to do well in the browser without wrecking image quality, so it isn't offered until it works properly.",
    links: ["/pdf"],
  },
  {
    id: "word",
    phrases: ["word to pdf", "#docx", "doc to pdf", "pdf to word", "excel", "ppt", "powerpoint", "edit text"],
    answer: () =>
      "Converting to or from Word, Excel or PowerPoint isn't available. Today the PDF tools merge, split, rotate and delete pages, and convert between PDFs and images.",
    links: ["/pdf"],
  },
  {
    id: "password",
    phrases: ["password", "locked pdf", "encrypted", "protected pdf", "unlock"],
    answer: () =>
      "PDFs marked \"no editing\" work fine. A PDF that asks for a password just to open it isn't supported yet. Open it in your PDF reader, save a copy without the password, then use that.",
  },
  {
    id: "limits",
    phrases: ["size limit", "how big", "large file", "max size", "maximum", "how many files", "page limit"],
    answer: () =>
      "There's no upload limit, because nothing is uploaded. Very large files depend on your device's memory, and a phone runs out sooner than a laptop.",
  },
  {
    id: "pdf-error",
    phrases: ["not working", "error", "failed", "could not be read", "broken", "corrupt", "doesn't open", "wont open"],
    answer: () =>
      "If a tool says it couldn't read your file, check that the file opens in a PDF reader first. If it does and still fails, try saving a fresh copy from that reader (Print to PDF works) and use the copy.",
  },

  // ------------------------------------------------------------------ tax
  {
    id: "regime",
    phrases: ["which regime", "old or new", "old vs new", "new vs old", "old regime", "new regime", "tax regime", "regime", "better regime", "save tax"],
    answer: () =>
      `It depends on your deductions. The new regime has lower rates but allows almost no deductions. The old regime wins only if your HRA, 80C, home loan interest and the like add up to enough. Enter your figures in the tax calculator and it shows both totals side by side for tax year ${TAX_YEAR}.`,
    links: ["/tax"],
  },
  {
    id: "rebate",
    phrases: ["#87a", "rebate", "12 lakh", "12 lakhs", "no tax", "zero tax", "tax free", "tax-free"],
    answer: () =>
      `In the new regime there's no tax up to ${rupees(TAX_LIMITS.rebate.new.upTo)} of taxable income, thanks to the section 87A rebate (up to ${rupees(TAX_LIMITS.rebate.new.max)}). With the ${rupees(TAX_LIMITS.standardDeduction.new)} standard deduction, that covers a salary of about ₹12.75 lakh. Just above the limit, marginal relief stops the tax from jumping. In the old regime the rebate covers taxable income up to ${rupees(TAX_LIMITS.rebate.old.upTo)}.`,
    links: ["/tax"],
  },
  {
    id: "standard",
    phrases: ["standard deduction"],
    answer: () =>
      `The standard deduction comes off your salary automatically: ${rupees(TAX_LIMITS.standardDeduction.new)} in the new regime and ${rupees(TAX_LIMITS.standardDeduction.old)} in the old.`,
    links: ["/tax"],
  },
  {
    id: "slabs",
    phrases: ["slab", "slabs", "tax rates", "tax rate", "income tax rates", "how much tax"],
    answer: () =>
      "New regime: nothing up to ₹4L, then 5% to ₹8L, 10% to ₹12L, 15% to ₹16L, 20% to ₹20L, 25% to ₹24L and 30% above that, plus 4% cess. The calculator shows your tax slab by slab.",
    links: ["/tax"],
  },
  {
    id: "deductions",
    phrases: ["#80c", "#80d", "#80ccd", "nps", "#hra", "home loan", "deduction", "deductions", "ppf", "elss", "insurance"],
    answer: () =>
      `Those count only in the old regime: 80C up to ${rupees(TAX_LIMITS.section80C)}, your own NPS under 80CCD(1B) up to ${rupees(TAX_LIMITS.section80CCD1B)} more, home loan interest up to ${rupees(TAX_LIMITS.homeLoanInterest)}, health insurance under 80D, and the HRA exemption. Your employer's NPS contribution counts in both. Enter them in the calculator and it applies each limit for you.`,
    links: ["/tax"],
  },
  {
    id: "file-itr",
    phrases: ["file itr", "file my itr", "file return", "itr filing", "file tax", "e-file", "efile", "#itr", "form 16"],
    answer: () =>
      "AllInOne can't file your return. Filing for someone needs a licence from the Income Tax Department. Use the calculator to see what you owe and pick a regime, then file on incometax.gov.in. Your Form 16 has the salary figures you'll need.",
    links: ["/tax"],
  },
  {
    id: "capital-gains",
    phrases: ["capital gains", "#stcg", "#ltcg", "shares", "mutual fund", "crypto", "business income", "freelance"],
    answer: () =>
      "The calculator covers salary and other income taxed at normal slab rates. Capital gains on shares and funds, crypto and business income are taxed differently and aren't included yet, so check those with a tax professional.",
    links: ["/tax"],
  },

  // --------------------------------------------------------------- coming
  {
    id: "resume",
    phrases: ["resume", "cv", "biodata", "resume builder"],
    answer: () =>
      "The resume builder is coming. You'll fill in a form and get a clean, single-column PDF that applicant tracking systems can read, and keep a version for each kind of role.",
    links: ["/resume"],
  },
  {
    id: "ats",
    phrases: ["#ats", "ats score", "applicant tracking", "keywords", "shortlist", "resume score"],
    answer: () =>
      "The ATS check is next in line. You'll upload your resume, paste a job description and get a score out of 100, with the missing keywords and any formatting that trips up parsers.",
    links: ["/ats"],
  },
  {
    id: "jobs",
    phrases: ["job", "jobs", "vacancy", "vacancies", "hiring", "openings", "apply for", "naukri", "linkedin"],
    answer: () =>
      "Job search is planned. Listings will come from feeds that allow it, like Adzuna and RemoteOK, and you'll be able to track each application. LinkedIn and Naukri forbid scraping, so they won't appear.",
    links: ["/jobs"],
  },
  {
    id: "ai-chat",
    phrases: ["ai chat", "gpt", "gemini", "claude", "openai", "api key"],
    answer: () =>
      "An AI chat is planned, where you bring your own Claude, GPT or Gemini key and it stays on your device. I'm not that chat; I answer questions about AllInOne.",
    links: ["/ai"],
  },

  // ------------------------------------------------------------ small talk
  {
    id: "hello",
    phrases: ["hi", "hello", "hey", "good morning", "good evening", "good afternoon"],
    answer: () => "Hello! What would you like to do today?",
  },
  {
    id: "thanks",
    phrases: ["thanks", "thank you", "thankyou", "great", "awesome", "perfect", "nice"],
    answer: () => "You're welcome! Anything else?",
  },
  {
    id: "bye",
    phrases: ["bye", "goodbye", "see you"],
    answer: () => "Bye! Press ⌘J any time to bring me back.",
  },
];

function normalise(text: string): string {
  return ` ${text
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9₹]+/g, " ")
    .trim()} `;
}

function linkFor(href: string): { label: string; href: string } {
  const tool = TOOLS.find((t) => t.href === href);
  if (tool) return { label: tool.name, href };
  if (href === "/") return { label: "Home", href };
  if (href === "/pdf") return { label: "All PDF tools", href };
  if (href === "/learn") return { label: "Open Learn", href };
  return { label: href, href };
}

const CODE_WEIGHT = 4;

/** Small talk only wins when the message is nothing but small talk. */
const SMALL_TALK = new Set(["hello", "thanks", "bye"]);

export function avtarReply(message: string): AvtarReply {
  const text = normalise(message);
  if (!text.trim()) {
    return { text: "Type a question and I'll do my best.", links: [], topic: null };
  }

  const scored = ENTRIES.map((entry) => {
    let score = 0;
    for (const phrase of entry.phrases) {
      const code = phrase.startsWith("#");
      if (text.includes(normalise(code ? phrase.slice(1) : phrase))) {
        score += code ? CODE_WEIGHT : phrase.split(" ").length;
      }
    }
    return { entry, score };
  }).filter((row) => row.score > 0);

  const words = text.trim().split(" ").length;
  const best = scored
    .filter((row) => !SMALL_TALK.has(row.entry.id) || words <= 4 || scored.length === 1)
    .sort((a, b) => b.score - a.score)[0];

  if (best) {
    return {
      text: best.entry.answer(),
      links: (best.entry.links ?? []).map(linkFor),
      topic: best.entry.id,
    };
  }

  // No answer written for this. Point at a tool if one fits; never guess.
  const tool = searchTools(message, 1)[0];
  if (tool) {
    return {
      text:
        tool.status === "soon"
          ? `I don't have an answer for that, but it sounds like ${tool.name}, which is still being built.`
          : `I don't have an answer for that, but ${tool.name} looks like the right tool.`,
      links: [{ label: tool.name, href: tool.href }],
      topic: null,
    };
  }

  return {
    text: "Sorry, I don't know that one. I can only answer questions about AllInOne: the PDF tools, the tax calculator, and what's coming next.",
    links: [linkFor("/pdf"), linkFor("/tax")],
    topic: null,
  };
}
