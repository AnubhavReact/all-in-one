import Link from "next/link";
import { TOOLS, toolsByHue } from "@aio/core";
import { AskBar, type AskChip } from "@/components/ai/AskBar";
import { HeroDrop } from "@/components/HeroDrop";
import { RecentFiles } from "@/components/home/RecentFiles";
import { Setup } from "@/components/home/Setup";
import { Icon } from "@/components/ui/Icon";

const CHIPS: readonly AskChip[] = [
  { label: "Merge", icon: "merge", href: "/pdf/merge" },
  { label: "Split", icon: "split", href: "/pdf/split" },
  { label: "PDF to JPG", icon: "image", href: "/pdf/to-images" },
  { label: "Rotate", icon: "rotate", href: "/pdf/organise" },
];

/** The launcher row: the five that work, then the four that don't, tagged. */
const QUICK = [
  { label: "Merge PDFs", href: "/pdf/merge", icon: "merge", hue: "pdf" },
  { label: "Split PDF", href: "/pdf/split", icon: "split", hue: "pdf" },
  { label: "Rotate pages", href: "/pdf/organise", icon: "rotate", hue: "pdf" },
  { label: "PDF to images", href: "/pdf/to-images", icon: "image", hue: "pdf" },
  { label: "Images to PDF", href: "/pdf/from-images", icon: "file", hue: "pdf" },
  { label: "ATS check", href: "/ats", icon: "target", hue: "career", tag: "Soon" },
  { label: "Resume", href: "/resume", icon: "resume", hue: "career", tag: "Soon" },
  { label: "Tax calculator", href: "/tax", icon: "calc", hue: "tax", tag: "Soon" },
  { label: "AI chat", href: "/ai", icon: "chat", hue: "ai", tag: "Key" },
];

/**
 * What is actually being worked on, in order. "Building" is the one in hand;
 * everything below it is a plan, and says so.
 */
const ROADMAP = [
  {
    icon: "target",
    hue: "career",
    status: "Building",
    live: true,
    title: "ATS score check",
    blurb: "Score your resume against any job description.",
    when: "Next up",
  },
  {
    icon: "resume",
    hue: "career",
    status: "Designing",
    live: false,
    title: "Resume builder",
    blurb: "ATS-friendly templates, export to PDF.",
    when: "After ATS",
  },
  {
    icon: "rupee",
    hue: "tax",
    status: "Designing",
    live: false,
    title: "Tax & ITR help",
    blurb: "Old vs new regime, slab by slab. You file on the govt portal.",
    when: "After resume",
  },
  {
    icon: "briefcase",
    hue: "career",
    status: "Planned",
    live: false,
    title: "Find jobs",
    blurb: "From feeds that allow it, like Adzuna and RemoteOK.",
    when: "Later",
  },
];

export default function Home() {
  const pdfTools = toolsByHue("pdf").filter((tool) => tool.status !== "soon");

  return (
    <div className="aio-page">
      <section className="aio-hero-app">
        <div className="aio-glow" aria-hidden />
        <div>
          <span className="aio-eyebrow">Your workspace</span>
          <h1>
            What do you need to{" "}
            <span className="aio-grad-text">get done today?</span>
          </h1>
          <AskBar
            /* The rail leaves this field about 180px wide, so the mock's
               two-example placeholder would be cut off mid-word. */
            placeholder="Ask, or name a tool…"
            chips={CHIPS}
            flat
          />
        </div>
        <HeroDrop variant="bare" />
      </section>

      <section>
        <div className="aio-section-head">
          <div>
            <h2>Quick tools</h2>
            <p>One click, no sign-up.</p>
          </div>
          <Link href="/pdf">All tools &rarr;</Link>
        </div>
        <div className="aio-quick">
          {QUICK.map((item) => (
            <Link
              href={item.href}
              key={item.href}
              className={item.tag ? "is-soon" : undefined}
            >
              {item.tag && <span className="tag">{item.tag}</span>}
              <span className={`q q--${item.hue}`}>
                <Icon name={item.icon} />
              </span>
              {item.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="aio-p-two">
        <RecentFiles />
        <Setup />
      </section>

      <section>
        <div className="aio-section-head">
          <div>
            <h2>PDF tools</h2>
            <p>All five run in your browser.</p>
          </div>
          <Link href="/pdf">Open PDF tools &rarr;</Link>
        </div>
        <div className="aio-grid-auto">
          {pdfTools.map((tool) => (
            <Link className="aio-tool-row" href={tool.href} key={tool.slug}>
              <span className="aio-tile aio-tile--pdf">
                <Icon name={tool.icon} />
              </span>
              <div className="m">
                <strong>{tool.name}</strong>
                <span className="d">{tool.blurb}</span>
              </div>
              <Icon name="arrow" />
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="aio-section-head">
          <div>
            <h2>Coming next</h2>
            <p>
              Honest about what&rsquo;s built. Each one links to what it will
              do and why it isn&rsquo;t here yet.
            </p>
          </div>
        </div>
        <div className="aio-p-road4">
          {ROADMAP.map((item) => {
            const tool = TOOLS.find((t) => t.name === item.title);
            return (
              <div className="aio-road" key={item.title}>
                <div className="aio-road-top">
                  <span className={`aio-tile aio-tile--${item.hue}`}>
                    <Icon name={item.icon} />
                  </span>
                  <span
                    className={
                      item.live
                        ? "aio-badge aio-badge--new"
                        : "aio-badge aio-badge--soon"
                    }
                  >
                    {item.status}
                  </span>
                </div>
                <strong>{item.title}</strong>
                <p>{item.blurb}</p>
                <div className="meta">
                  <span>{item.when}</span>
                  {tool && (
                    <Link
                      className="aio-btn aio-btn--ghost aio-btn--sm"
                      href={tool.href}
                    >
                      What it will do
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
