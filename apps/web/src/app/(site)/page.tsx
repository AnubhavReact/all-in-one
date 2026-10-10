import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { HeroDrop } from "@/components/HeroDrop";
import { ToolGrid } from "@/components/ToolGrid";

const STRIP = [
  { value: "10", label: "tools in one place" },
  { value: "0", label: "files uploaded to our servers" },
  { value: "3", label: "AI models, one chat window" },
  { value: "₹0", label: "to start — no card needed" },
];

export default function Home() {
  return (
    <>
      <section className="aio-p-sec aio-p-hero">
        <div className="aio-p-herobg" aria-hidden />
        <div>
          <span className="aio-eyebrow">Your paperwork, in one window</span>
          <h1 className="aio-h1">
            Drop a file.
            <br />
            We&rsquo;ll find <span className="aio-mark">the tool.</span>
          </h1>
          <p className="aio-lead">
            Edit PDFs, build an ATS-ready resume, find jobs, calculate tax and
            file your ITR, and chat with Claude, GPT and Gemini — all from one
            place.
          </p>
          <div className="aio-p-ctas">
            <Link className="aio-btn aio-btn--primary aio-btn--lg" href="/pdf">
              Start with the PDF tools
            </Link>
            <Link
              className="aio-btn aio-btn--secondary aio-btn--lg"
              href="/dashboard"
            >
              <Icon name="grid" />
              See the dashboard
            </Link>
          </div>
          <div className="aio-p-trust">
            <span>
              <Icon name="shield" />
              Files stay on your device
            </span>
            <span>
              <Icon name="check" />
              No sign-up for PDF tools
            </span>
            <span>
              <Icon name="check" />
              Made in India
            </span>
          </div>
        </div>

        <HeroDrop />
      </section>

      <div className="aio-p-sec aio-p-sec--flush">
        <div className="aio-p-strip">
          {STRIP.map((item) => (
            <div key={item.label}>
              <b>{item.value}</b>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <section className="aio-p-sec">
        <ToolGrid />
      </section>

      <section className="aio-p-sec aio-p-sec--tight">
        <div className="aio-p-split">
          <div className="aio-card aio-p-pad40">
            <span className="aio-eyebrow" style={{ color: "var(--accent)" }}>
              Career toolkit
            </span>
            <h2 className="aio-h2" style={{ marginTop: 10 }}>
              From resume to offer letter.
            </h2>
            <ul className="aio-p-feat">
              <li>
                <Icon name="check" />
                <span>
                  <b>Build</b> a clean, ATS-readable resume from templates.
                </span>
              </li>
              <li>
                <Icon name="check" />
                <span>
                  <b>Score</b> it against any job description and fix gaps.
                </span>
              </li>
              <li>
                <Icon name="check" />
                <span>
                  <b>Apply</b> and track every application in one board.
                </span>
              </li>
            </ul>
            <p className="aio-p-note">
              <Icon name="clock" />
              <span>
                Not built yet. Listings will come from feeds that permit it,
                such as Adzuna and RemoteOK — LinkedIn and Naukri forbid
                scraping.
              </span>
            </p>
          </div>

          <div
            className="aio-card aio-p-pad40"
            style={{ display: "grid", gap: 24, alignContent: "start" }}
          >
            <div className="aio-card-head" style={{ margin: 0 }}>
              <h3>ATS score &middot; how it will look</h3>
              <span className="aio-badge aio-badge--soon">Coming soon</span>
            </div>

            <div style={{ display: "flex", gap: 28, alignItems: "center", flexWrap: "wrap" }}>
              <div className="aio-ring" style={{ width: 150, height: 150 }}>
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
                  82<span>Strong match</span>
                </div>
              </div>

              <div style={{ display: "grid", gap: 14, flex: 1, minWidth: 180 }}>
                <div className="aio-p-metric">
                  <div className="top">
                    Keywords <b>18/22</b>
                  </div>
                  <div className="aio-progress">
                    <i style={{ width: "82%" }} />
                  </div>
                </div>
                <div className="aio-p-metric">
                  <div className="top">
                    Formatting <b>95</b>
                  </div>
                  <div className="aio-progress">
                    <i style={{ width: "95%" }} />
                  </div>
                </div>
                <div className="aio-p-metric">
                  <div className="top">
                    Experience fit <b>64</b>
                  </div>
                  <div className="aio-progress aio-progress--brand">
                    <i style={{ width: "64%" }} />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div
                style={{
                  fontSize: 13,
                  color: "var(--ink-muted)",
                  marginBottom: 8,
                }}
              >
                Missing keywords
              </div>
              <div className="aio-row">
                {["Redux Toolkit", "CI/CD", "Jest", "Fastlane"].map((word) => (
                  <span className="aio-badge aio-badge--plain" key={word}>
                    {word}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="aio-p-sec aio-p-sec--tight">
        <div className="aio-p-split">
          <div className="aio-card aio-p-pad40">
            <span className="aio-eyebrow" style={{ color: "var(--cat-tax)" }}>
              Tax &amp; ITR
            </span>
            <h2 className="aio-h3" style={{ margin: "10px 0 6px" }}>
              File your ITR without the stress.
            </h2>
            <p
              className="aio-lead"
              style={{ fontSize: 15, lineHeight: "24px" }}
            >
              Read Form 16 on your device, compare the old and new regimes, and
              see exactly where the tax comes from.
            </p>

            <div className="aio-p-regime">
              <div>
                <span>Old regime</span>
                <b>&#8377;80,600</b>
              </div>
              <div className="win">
                <span>New regime &middot; saves &#8377;18,200</span>
                <b>&#8377;62,400</b>
              </div>
            </div>

            <div className="aio-steps" style={{ marginTop: 24 }}>
              <div className="aio-step aio-step--now">
                <div>
                  <strong>Read Form 16 &amp; AIS</strong>
                  <span>On your device, like the PDF tools</span>
                </div>
              </div>
              <div className="aio-step">
                <div>
                  <strong>Review deductions</strong>
                  <span>80C, 80D, HRA</span>
                </div>
              </div>
              <div className="aio-step">
                <div>
                  <strong>Compare regimes</strong>
                  <span>Slab by slab, with the working shown</span>
                </div>
              </div>
            </div>

            <p className="aio-p-note" style={{ marginTop: 20 }}>
              <Icon name="shield" />
              <span>
                Filing on your behalf needs an ERI licence from the Income Tax
                Department. This works out what you owe; you file on the
                government portal.
              </span>
            </p>
          </div>

          <div
            className="aio-card aio-p-pad40"
            style={{ display: "grid", alignContent: "start", gap: 16 }}
          >
            <span className="aio-eyebrow" style={{ color: "var(--cat-ai)" }}>
              AI chat
            </span>
            <h2 className="aio-h3" style={{ margin: 0 }}>
              Claude, GPT and Gemini. One window.
            </h2>

            <div className="aio-models" style={{ justifySelf: "start" }}>
              <button type="button" aria-pressed="true">
                <i />
                Claude
              </button>
              <button type="button" aria-pressed="false">
                GPT
              </button>
              <button type="button" aria-pressed="false">
                Gemini
              </button>
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              <div className="aio-bubble aio-bubble--me">
                Summarise this rent agreement PDF and list what I should check.
              </div>
              <div className="aio-bubble aio-bubble--ai">
                It&rsquo;s an 11-month agreement starting 1 Nov. Check three
                things: the lock-in period (6 months), the notice period, and
                who pays maintenance…
              </div>
              <div className="aio-bubble aio-bubble--me">
                Now draft a reply asking for a 2-month notice period.
              </div>
            </div>

            <p className="aio-p-note">
              <Icon name="lock" />
              <span>
                ChatGPT and Gemini block being embedded in another site, so this
                will use their APIs with your own key. The key stays on your
                device.
              </span>
            </p>
          </div>
        </div>
      </section>

      <section className="aio-p-sec aio-p-sec--tight">
        <div className="aio-p-cta">
          <div className="aio-p-ctablocks" aria-hidden>
            <i />
            <i className="b" />
            <i />
            <i className="a" />
            <i />
            <i className="p" />
            <i />
            <i />
            <i className="b" />
          </div>
          <div>
            <h2 className="aio-h2">Stop opening ten tabs.</h2>
            <p className="aio-lead" style={{ marginTop: 10 }}>
              PDFs, jobs, resumes, tax and AI — one place, free to start.
            </p>
          </div>
          <Link className="aio-btn aio-btn--primary aio-btn--lg" href="/pdf">
            Open the PDF tools
          </Link>
        </div>
      </section>
    </>
  );
}
