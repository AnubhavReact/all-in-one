/**
 * The Learn tab: three free study sites that sit alongside the tools.
 *
 * Each one is its own app on its own domain, so AllInOne describes and links
 * to them rather than copying them. Every figure here was read off the live
 * site (November 2026); when a site grows, update the number here too.
 *
 * Plain TypeScript, no DOM: the website and the mobile app share it.
 */

export type LearnFeature = {
  /** An icon name from the design system's set. */
  icon: string;
  title: string;
  body: string;
};

export type LearnTrack = {
  id: "structura" | "schemata" | "dsa";
  /** "01", "02"… the order the tab shows them in. */
  number: string;
  /** What it teaches, in two or three words. */
  area: string;
  name: string;
  url: string;
  icon: string;
  /** The site's own headline. */
  headline: string;
  /** One line in the accent colour under the name. */
  pitch: string;
  body: string;
  features: LearnFeature[];
  /** Topics, shown as chips. */
  chips: string[];
  stats: { value: string; label: string }[];
  /** Pages worth opening directly. */
  links: { label: string; href: string }[];
};

export const LEARN_TRACKS: LearnTrack[] = [
  {
    id: "structura",
    number: "01",
    area: "System design",
    name: "Structura",
    url: "https://structura-web.netlify.app/",
    icon: "network",
    headline: "Learn system design by seeing it work",
    pitch: "Every topic is a live architecture you can poke.",
    body: "Click any component to see what it does, follow a real request step by step, switch parts off to see what breaks, and put real load on it. Narrated videos, code and interview questions are included.",
    features: [
      {
        icon: "network",
        title: "Live architecture diagrams",
        body: "Click a load balancer, cache or queue and see what it does.",
      },
      {
        icon: "arrow",
        title: "Step-by-step walkthroughs",
        body: "Follow one request through the whole system, hop by hop.",
      },
      {
        icon: "zap",
        title: "Break it and load it",
        body: "Switch parts off, add load, and watch where it fails.",
      },
      {
        icon: "mic",
        title: "Videos, audio and quizzes",
        body: "Narrated videos, offline audio lessons for the commute, and interview questions.",
      },
    ],
    chips: ["URL shortener", "Rate limiter", "Kafka", "Idempotent payments", "Twitter timeline", "RBAC"],
    stats: [
      { value: "57", label: "topics" },
      { value: "4", label: "tracks: Development, Infra, Databases, AI" },
      { value: "58 min", label: "of audio lessons" },
    ],
    links: [{ label: "Start the roadmap", href: "https://structura-web.netlify.app/" }],
  },
  {
    id: "schemata",
    number: "02",
    area: "Databases & SQL",
    name: "Schemata",
    url: "https://schemata-web.netlify.app/",
    icon: "database",
    headline: "Learn databases by running them",
    pitch: "A real PostgreSQL, running in your browser tab.",
    body: "Follow a roadmap from your first SELECT to MVCC, draw schemas as diagrams, and practise the questions interviews ask. Every answer is checked against a real database.",
    features: [
      {
        icon: "code",
        title: "SQL editor",
        body: "Real Postgres with three datasets, query plans and saved queries.",
      },
      {
        icon: "check",
        title: "Practice questions",
        body: "42 questions, checked automatically as you run them.",
      },
      {
        icon: "network",
        title: "Schema diagrams",
        body: "Write DBML and see the ER diagram, or draw any dataset.",
      },
      {
        icon: "database",
        title: "Design problems and a database guide",
        body: "5 schemas to design, from blog tags to cinema seats, and when to use 11 different databases.",
      },
    ],
    chips: ["Foundations", "Joins", "Indexes", "Query plans", "Transactions", "MVCC"],
    stats: [
      { value: "42", label: "practice questions" },
      { value: "4", label: "levels, Foundations to Expert" },
      { value: "11", label: "databases compared" },
    ],
    links: [
      { label: "Open the roadmap", href: "https://schemata-web.netlify.app/roadmap" },
      { label: "SQL playground", href: "https://schemata-web.netlify.app/playground" },
    ],
  },
  {
    id: "dsa",
    number: "03",
    area: "DSA & interviews",
    name: "DSA Atlas",
    url: "https://dsa-atz.netlify.app/",
    icon: "target",
    headline: "Crack DSA rounds with a checklist that remembers",
    pitch: "The problems that get asked, in the order to solve them.",
    body: "134 hand-picked problems in three tiers, grouped by pattern from recursion to advanced DP. Tick off what you solve, revise it when it comes due, and set a goal for the company you're aiming at.",
    features: [
      {
        icon: "clipboard",
        title: "Master checklist",
        body: "Tier 1 must-solve, tier 2 very common, tier 3 for senior and tough rounds.",
      },
      {
        icon: "rotate",
        title: "Spaced revision",
        body: "Solved problems come back when they're due, with a daily streak.",
      },
      {
        icon: "target",
        title: "Company goals",
        body: "Pick a company and a date, and see the pace you need.",
      },
      {
        icon: "pen",
        title: "Notes on every problem",
        body: "Keep your approach next to the problem for quick revision.",
      },
    ],
    chips: ["Recursion", "Arrays & strings", "Linked list", "Trees", "Graphs", "DP", "Binary search", "Heap", "Backtracking", "Trie"],
    stats: [
      { value: "134", label: "problems" },
      { value: "3", label: "tiers by how often they're asked" },
      { value: "20", label: "patterns" },
    ],
    links: [
      { label: "Open the checklist", href: "https://dsa-atz.netlify.app/?page=checklist" },
    ],
  },
];

export function learnTrack(id: LearnTrack["id"]): LearnTrack {
  const track = LEARN_TRACKS.find((t) => t.id === id);
  if (!track) throw new Error(`No learn track "${id}"`);
  return track;
}
