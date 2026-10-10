import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { AskBar, type AskChip } from "@/components/ai/AskBar";
import { ToolGrid } from "@/components/ToolGrid";

/** The hero's shortcuts. Every one of these goes somewhere that works. */
const CHIPS: readonly AskChip[] = [
  { label: "Merge PDF", icon: "merge", href: "/pdf/merge" },
  { label: "Split PDF", icon: "split", href: "/pdf/split" },
  { label: "PDF to images", icon: "image", href: "/pdf/to-images" },
  { label: "Check ATS score", icon: "target", href: "/ats" },
  { label: "Old vs new regime", icon: "calc", href: "/tax" },
];

const STRIP = [
  { value: "5", label: "PDF tools working today" },
  { value: "0 MB", label: "of your files uploaded" },
  { value: "3", label: "AI models — Claude, GPT, Gemini" },
  { value: "₹0", label: "to start" },
];

/** The copilot section's three claims, each true of the design as specified. */
const COPILOT = [
  {
    icon: "target",
    title: "Knows where you are",
    detail:
      "On the resume page it works on your resume. On the ITR page it explains deductions.",
  },
  {
    icon: "zap",
    title: "Does it, with your OK",
    detail:
      "It merges files, fills forms and edits resumes — and shows every change before applying it.",
  },
  {
    icon: "chat",
    title: "Your choice of model",
    detail: "Switch between Claude, GPT and Gemini in the same chat.",
  },
];

export default function Home() {
  return (
    <>
      <section className="aio-p-hero">
        <div className="aio-glow" aria-hidden />
        <div className="aio-p-herobg" aria-hidden />
        <div className="aio-p-heroin">
          <Link className="aio-pill" href="/pdf">
            <b>LIVE</b>
            Five PDF tools, running in this tab
            <Icon name="arrow" />
          </Link>

          <h1 className="aio-h1">
            Every tool you need.
            <br />
            <span className="aio-grad-text">One AI that knows them all.</span>
          </h1>

          <p className="aio-lead">
            Edit PDFs, build an ATS-ready resume, find jobs, compare tax
            regimes and get ITR help — just ask, or drop a file.
          </p>

          <AskBar
            placeholder="Try “merge my rent PDFs” or “split a PDF”"
            chips={CHIPS}
          />

          <div className="aio-p-trust">
            <span>
              <Icon name="shield" />
              PDFs never leave your device
            </span>
            <span>
              <Icon name="check" />
              Free to start, no card
            </span>
            <span>
              <Icon name="check" />
              Made in India, for India
            </span>
          </div>
        </div>
      </section>

      <section className="aio-p-sec aio-p-sec--tight">
        <div className="aio-p-bento">
          <div className="aio-p-b aio-p-b--pdf">
            <span className="aio-tile aio-tile--pdf">
              <Icon name="file" />
            </span>
            <h3>PDF tools that run in your browser</h3>
            <p>
              Merge, split, rotate and convert — no uploads, no waiting. These
              five are built and working now.
            </p>
            <div className="aio-p-pdfdemo" aria-hidden>
              <div className="f">
                <div className="pg" />
                <span>agreement.pdf</span>
              </div>
              <div className="f">
                <div className="pg" />
                <span>receipt.jpg</span>
              </div>
              <div className="arrow">
                <Icon name="arrow" />
              </div>
              <div className="f f--out">
                <div className="pg" />
                <span>merged.pdf</span>
              </div>
            </div>
          </div>

          <div className="aio-p-b aio-p-b--ats">
            <div className="aio-p-bglow" aria-hidden />
            <div className="aio-p-b-top">
              <span className="aio-tile aio-tile--career">
                <Icon name="target" />
              </span>
              <span className="aio-badge aio-badge--soon">Coming soon</span>
            </div>
            <h3>ATS score in 10 seconds</h3>
            <p>Match your resume to any job description.</p>
            <div className="aio-p-atsdemo" aria-hidden>
              <div className="aio-ring">
                <svg viewBox="0 0 120 120">
                  <circle className="track" cx="60" cy="60" r="50" />
                  <circle
                    className="bar"
                    cx="60"
                    cy="60"
                    r="50"
                    strokeDasharray="314"
                    strokeDashoffset="57"
                  />
                </svg>
                <div className="aio-ring-num">
                  82<span>Strong</span>
                </div>
              </div>
              <div className="col">
                <span>Missing keywords</span>
                <div className="kw">
                  {["Jest", "CI/CD", "Fastlane"].map((word) => (
                    <span className="aio-badge aio-badge--plain" key={word}>
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="aio-p-b aio-p-b--ai">
            <div className="aio-p-b-top">
              <span className="aio-tile aio-tile--brand">
                <Icon name="ai" />
              </span>
              <span className="aio-badge aio-badge--soon">Needs your key</span>
            </div>
            <h3>An assistant that actually does the work</h3>
            <p>
              Ask in plain words. It picks the tool, fills it in, and asks
              before it changes anything.
            </p>
            <div className="aio-p-thread" aria-hidden>
              <div className="aio-bubble aio-bubble--me">
                Combine my Form 16 and rent receipts into one PDF
              </div>
              <div className="aio-bubble aio-bubble--ai">
                Done — 3 files merged in your browser.
              </div>
              <div className="aio-action">
                <div className="aio-action-row">
                  <span className="aio-tile aio-tile--sm aio-tile--pdf">
                    <Icon name="merge" />
                  </span>
                  <div className="m">
                    <strong>ITR_docs_merged.pdf</strong>
                    <span>14 pages &middot; 2.4 MB</span>
                  </div>
                  <span className="aio-btn aio-btn--secondary aio-btn--sm">
                    <Icon name="download" />
                    Save
                  </span>
                </div>
              </div>
              <div className="aio-bubble aio-bubble--me">
                Which ITR form should I file?
              </div>
              <div className="aio-bubble aio-bubble--ai">
                With salary and one rented house, <b>ITR-1 (Sahaj)</b>. Start
                it with your Form 16?
              </div>
              <div className="aio-suggest">
                <span className="aio-chip aio-chip--active">
                  Yes, start ITR-1
                </span>
                <span className="aio-chip">Compare regimes first</span>
              </div>
            </div>
          </div>

          <div className="aio-p-b aio-p-b--tax">
            <div className="aio-p-b-top">
              <span className="aio-tile aio-tile--tax">
                <Icon name="rupee" />
              </span>
              <span className="aio-badge aio-badge--soon">Coming soon</span>
            </div>
            <h3>Tax &amp; ITR, simplified</h3>
            <p>See which regime saves more, slab by slab.</p>
            <div className="aio-p-regime" aria-hidden>
              <div>
                <span>Old regime</span>
                <b>&#8377;80,600</b>
              </div>
              <div className="win">
                <span>New &middot; saves &#8377;18.2k</span>
                <b>&#8377;62,400</b>
              </div>
            </div>
          </div>

          <div className="aio-p-b aio-p-b--jobs">
            <div className="aio-p-b-top">
              <span className="aio-tile aio-tile--career">
                <Icon name="briefcase" />
              </span>
              <span className="aio-badge aio-badge--soon">Coming soon</span>
            </div>
            <h3>Jobs that fit</h3>
            <p>Ranked by your resume.</p>
            <div className="aio-p-jobmini" aria-hidden>
              <div>
                Sr. React Native Developer <b>92%</b>
              </div>
              <div>
                Mobile Engineer II <b>86%</b>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="aio-p-sec aio-p-sec--flush">
        <div className="aio-p-strip">
          {STRIP.map((item) => (
            <div key={item.label}>
              <b className="aio-grad-text">{item.value}</b>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <section className="aio-p-sec">
        <ToolGrid />
      </section>

      <section className="aio-p-sec aio-p-sec--tight">
        <div className="aio-p-copilot">
          <div>
            <span className="aio-eyebrow">AllInOne AI</span>
            <h2 className="aio-h2" style={{ marginTop: 10 }}>
              Your copilot for{" "}
              <span className="aio-grad-text">paperwork.</span>
            </h2>
            <ul className="aio-p-feat">
              {COPILOT.map((row) => (
                <li key={row.title}>
                  <span className="aio-tile aio-tile--brand">
                    <Icon name={row.icon} />
                  </span>
                  <div>
                    <strong>{row.title}</strong>
                    <span className="d">{row.detail}</span>
                  </div>
                </li>
              ))}
            </ul>
            <Link className="aio-btn aio-btn--primary aio-btn--lg" href="/ai">
              <Icon name="ai" />
              See how the AI hub will work
            </Link>
          </div>

          {/* A picture of the panel, labelled as one. The working panel is the
              "Ask AI" launcher in the corner. */}
          <section className="aio-assist" aria-label="AllInOne AI preview">
            <header className="aio-assist-head">
              <span className="aio-assist-avatar">
                <Icon name="ai" />
              </span>
              <div className="t">
                <strong>AllInOne AI</strong>
                <span className="aio-p-offline">
                  <i />
                  Preview &middot; not connected yet
                </span>
              </div>
              <span className="aio-badge aio-badge--soon">Soon</span>
            </header>
            <div className="aio-assist-body" aria-hidden>
              <div className="aio-ctx">
                <Icon name="target" />
                You&rsquo;re on <b>ATS check</b> &middot; resume v4 attached
              </div>
              <div className="aio-bubble aio-bubble--me">
                Why is my experience score only 64?
              </div>
              <div className="aio-bubble aio-bubble--ai">
                The job description asks for <b>CI/CD</b> and <b>Jest</b>. Your
                EAS build pipeline counts as CI/CD — let&rsquo;s say it
                clearly.
              </div>
              <div className="aio-action">
                <div className="aio-action-row">
                  <span className="aio-tile aio-tile--sm aio-tile--career">
                    <Icon name="resume" />
                  </span>
                  <div className="m">
                    <strong>Add 2 bullet points</strong>
                    <span>Opens Resume builder, changes highlighted</span>
                  </div>
                </div>
                <div className="aio-row">
                  <span className="aio-btn aio-btn--primary aio-btn--sm">
                    <Icon name="zap" />
                    Apply
                  </span>
                  <span className="aio-btn aio-btn--ghost aio-btn--sm">
                    Show me first
                  </span>
                </div>
              </div>
            </div>
            <footer className="aio-assist-foot">
              <div className="note">
                AI can make mistakes. Tax answers will carry an expert review
                before anything is filed.
              </div>
            </footer>
          </section>
        </div>
      </section>

      <section className="aio-p-sec aio-p-sec--tight">
        <span className="aio-eyebrow">Honest about what&rsquo;s built</span>
        <h2 className="aio-h3" style={{ margin: "10px 0 20px" }}>
          Three things this can&rsquo;t do yet, and why.
        </h2>
        <div className="aio-p-split aio-p-split--3">
          <p className="aio-p-note">
            <Icon name="briefcase" />
            <span>
              <b>Jobs</b> will come from feeds that allow it, such as Adzuna and
              RemoteOK. LinkedIn and Naukri forbid scraping, so they are out.
            </span>
          </p>
          <p className="aio-p-note">
            <Icon name="chat" />
            <span>
              <b>ChatGPT and Gemini</b> block being embedded in another site, so
              the AI hub calls their APIs with your own key. The key stays on
              your device.
            </span>
          </p>
          <p className="aio-p-note">
            <Icon name="shield" />
            <span>
              <b>ITR filing</b> on your behalf needs an ERI licence from the
              Income Tax Department. This works out what you owe; you file on
              the government portal.
            </span>
          </p>
        </div>
      </section>

      <section className="aio-p-sec aio-p-sec--tight">
        <div className="aio-p-cta">
          <div className="aio-glow" aria-hidden />
          <span className="aio-eyebrow">Free to start</span>
          <h2 className="aio-h2">
            Stop opening ten tabs for{" "}
            <span className="aio-grad-text">one task.</span>
          </h2>
          <p className="aio-lead">
            PDFs, jobs, resumes, tax and AI — one account.
          </p>
          <div className="aio-row" style={{ justifyContent: "center" }}>
            <Link className="aio-btn aio-btn--primary aio-btn--lg" href="/pdf">
              Open the PDF tools
            </Link>
            <Link
              className="aio-btn aio-btn--secondary aio-btn--lg"
              href="/"
            >
              <Icon name="grid" />
              Open the workspace
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
