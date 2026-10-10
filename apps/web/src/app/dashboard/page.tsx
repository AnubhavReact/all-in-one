import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { AskBar, type AskChip } from "@/components/ai/AskBar";
import { Icon } from "@/components/ui/Icon";
import { Note } from "@/components/ui/Note";

export const metadata = {
  title: "Dashboard — AllInOne",
  description: "Your files, applications, tax estimate and tools in one view.",
};

/** The dashboard ask bar's shortcuts, all of them live routes. */
const CHIPS: readonly AskChip[] = [
  { label: "Merge PDF", icon: "merge", href: "/pdf/merge" },
  { label: "Rotate pages", icon: "rotate", href: "/pdf/organise" },
  { label: "Check ATS score", icon: "target", href: "/ats" },
  { label: "Continue ITR", icon: "rupee", href: "/tax" },
];

const QUICK = [
  { label: "Merge PDF", href: "/pdf/merge", icon: "merge" },
  { label: "Split PDF", href: "/pdf/split", icon: "split" },
  { label: "Rotate pages", href: "/pdf/organise", icon: "rotate" },
  { label: "PDF to images", href: "/pdf/to-images", icon: "image" },
  { label: "Images to PDF", href: "/pdf/from-images", icon: "file" },
  { label: "ATS check", href: "/ats", icon: "target" },
];

export default function Dashboard() {
  return (
    <AppShell>
      <div className="aio-p-content">
        <div className="aio-p-greet">
          <div>
            <h1 className="aio-h3">Welcome to AllInOne</h1>
            <p>
              The PDF tools work now. Everything else is on its way — sign-in
              comes with it.
            </p>
          </div>
          <div className="aio-row">
            <Link className="aio-btn aio-btn--primary aio-btn--sm" href="/pdf">
              <Icon name="file" />
              Open PDF tools
            </Link>
          </div>
        </div>

        <AskBar
          placeholder="Ask AllInOne AI — “merge my rent receipts”"
          chips={CHIPS}
          flat
        />

        <Note icon="clock">
          This is the shape of the signed-in app. The numbers below are
          placeholders until accounts exist — nothing here is your real data.
        </Note>

        <div className="aio-p-stats">
          <div className="aio-stat">
            <div className="aio-stat-label">
              <span className="aio-tile aio-tile--sm aio-tile--pdf">
                <Icon name="file" />
              </span>
              PDF tools ready
            </div>
            <div className="aio-stat-value">5</div>
            <div className="aio-stat-delta">All run on your device</div>
          </div>

          <div className="aio-stat">
            <div className="aio-stat-label">
              <span className="aio-tile aio-tile--sm aio-tile--pdf">
                <Icon name="shield" />
              </span>
              Files uploaded
            </div>
            <div className="aio-stat-value">0</div>
            <div className="aio-stat-delta">Nothing leaves this tab</div>
          </div>

          <div className="aio-stat">
            <div className="aio-stat-label">
              <span className="aio-tile aio-tile--sm aio-tile--career">
                <Icon name="target" />
              </span>
              Best ATS score
            </div>
            <div className="aio-stat-value">
              &mdash;<small>/100</small>
            </div>
            <div className="aio-progress">
              <i style={{ width: "0%" }} />
            </div>
          </div>

          <div className="aio-stat">
            <div className="aio-stat-label">
              <span className="aio-tile aio-tile--sm aio-tile--tax">
                <Icon name="rupee" />
              </span>
              Est. tax &middot; FY 25&ndash;26
            </div>
            <div className="aio-stat-value">&mdash;</div>
            <div className="aio-stat-delta">Calculator not built yet</div>
          </div>
        </div>

        <div className="aio-p-row2">
          <div className="aio-card">
            <div className="aio-card-head">
              <h3>Job matches</h3>
              <span className="aio-badge aio-badge--soon">Coming soon</span>
            </div>
            <p style={{ margin: 0, fontSize: 14, color: "var(--ink-muted)" }}>
              Once this is built, roles from public job feeds appear here with a
              match score, and every application you send gets tracked from
              applied through to offer.
            </p>
            <div style={{ marginTop: "var(--space-4)" }}>
              <Link className="aio-btn aio-btn--secondary aio-btn--sm" href="/jobs">
                What it will do
              </Link>
            </div>
          </div>

          <div className="aio-card">
            <div className="aio-card-head">
              <h3>ITR-1 &middot; AY 2026&ndash;27</h3>
              <span className="aio-badge aio-badge--soon">Coming soon</span>
            </div>
            <div className="aio-progress aio-progress--brand" style={{ marginBottom: 20 }}>
              <i style={{ width: "0%" }} />
            </div>
            <div className="aio-steps">
              <div className="aio-step">
                <div>
                  <strong>Pick your ITR form</strong>
                  <span>ITR-1 (Sahaj)</span>
                </div>
              </div>
              <div className="aio-step">
                <div>
                  <strong>Read Form 16 &amp; AIS</strong>
                  <span>On your device</span>
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
                  <span>You file on the government portal</span>
                </div>
              </div>
            </div>
            <Link
              className="aio-btn aio-btn--secondary"
              href="/tax"
              style={{ width: "100%", marginTop: 20 }}
            >
              What it will do
            </Link>
          </div>
        </div>

        <div className="aio-p-row3">
          <div className="aio-card">
            <div className="aio-card-head">
              <h3>Recent files</h3>
            </div>
            <p style={{ margin: 0, fontSize: 14, color: "var(--ink-muted)" }}>
              Nothing here. Files you work on stay in your browser and are never
              uploaded, so there is no history to show until accounts exist.
            </p>
          </div>

          <div className="aio-card">
            <div className="aio-card-head">
              <h3>Quick tools</h3>
              <Link href="/pdf">All tools</Link>
            </div>
            <div className="aio-p-qt">
              {QUICK.map((item) => (
                <Link href={item.href} key={item.label}>
                  <span className="aio-tile aio-tile--sm aio-tile--pdf">
                    <Icon name={item.icon} />
                  </span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="aio-card" style={{ display: "grid", gap: 12, alignContent: "start" }}>
            <div className="aio-card-head" style={{ margin: 0 }}>
              <h3>AI chat</h3>
              <span className="aio-badge aio-badge--soon">Coming soon</span>
            </div>
            <div className="aio-models">
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
            <div className="aio-bubble aio-bubble--ai" style={{ maxWidth: "100%" }}>
              This will run on your own API keys, kept on your device. Nothing
              is sent to us.
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
