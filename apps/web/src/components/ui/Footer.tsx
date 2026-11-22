import Link from "next/link";
import { Layers, ShieldCheck } from "lucide-react";
import { LEARN_TRACKS, TOOLS, isLive } from "@aio/core";
import { AskAvtarButton } from "./AskAvtarButton";
import { BackToTop } from "./BackToTop";
import { CTABand } from "./CTABand";
import s from "./Footer.module.css";

const live = TOOLS.filter((t) => isLive(t));
const soon = TOOLS.filter((t) => !isLive(t));
const learnCount = LEARN_TRACKS.reduce((sum, t) => sum + Number(t.stats[0]?.value ?? 0), 0);

/** Real figures only, worked out from the registry so they can't drift. */
const FACTS = [
  { value: String(live.length), label: "free tools" },
  { value: "0 bytes", label: "uploaded" },
  { value: `${learnCount}+`, label: "topics to study" },
];

const ABOUT = [
  { label: "How it works", href: "/welcome#how" },
  { label: "Roadmap", href: "/welcome#roadmap" },
  { label: "Questions", href: "/welcome#faq" },
];

const TOLLWALA = [
  { label: "Toll plaza solutions", href: "/tollwala" },
  { label: "Plaza support", href: "/tollwala#support" },
  { label: "Plaza software", href: "/tollwala#software" },
  { label: "Free toll tools", href: "/tollwala#tools" },
];

/**
 * Charcoal in both themes. Every list comes from the tool registry, so a tool
 * can't be live here and "Soon" somewhere else. Soon items are plain text.
 * Inside the app the "Open AllInOne" band would point at the page you're on,
 * so `inApp` drops it and leaves room for the AVTAR launcher.
 */
export function Footer({ inApp = false }: { inApp?: boolean }) {
  return (
    <footer className={inApp ? `${s.foot} ${s.inApp}` : s.foot}>
      <div className={s.inner}>
        {!inApp && (
          <CTABand
            title="Got a PDF to fix, or an interview to prepare for?"
            primary={{ label: "Open AllInOne", href: "/" }}
            secondary={<AskAvtarButton variant="onBrandOutline" size="lg" />}
          >
            Free, with no account. Your files never leave this browser.
          </CTABand>
        )}

        <div className={s.grid}>
          <div className={s.brand}>
            <Link href="/" className={s.logo}>
              <span className={s.mark} aria-hidden>
                <Layers strokeWidth={2} />
              </span>
              AllInOne
            </Link>
            <p>
              Free PDF tools, an old-vs-new tax calculator and interview prep in one browser tab. No account, no ads,
              and your files are never uploaded.
            </p>
            <dl className={s.facts}>
              {FACTS.map((fact) => (
                <div key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
            <div className={s.actions}>
              <AskAvtarButton variant="onBrandOutline" />
              <Link href="/welcome#how" className={s.how}>
                <ShieldCheck aria-hidden strokeWidth={1.8} />
                How your files stay private
              </Link>
            </div>
          </div>

          <nav className={s.col} aria-label="Tools">
            <h3>Tools</h3>
            <ul>
              {live.map((tool) => (
                <li key={tool.slug}>
                  <Link href={tool.href}>{tool.name}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className={s.col} aria-label="Learn">
            <h3>Learn</h3>
            <ul>
              {LEARN_TRACKS.map((track) => (
                <li key={track.id}>
                  <Link href={`/learn#${track.id}`}>{track.name}</Link>
                </li>
              ))}
              <li>
                <Link href="/learn">All of Learn</Link>
              </li>
            </ul>
            <h3 className={s.later}>Coming soon</h3>
            <ul>
              {soon.map((tool) => (
                <li key={tool.slug}>
                  <span className={s.off} aria-disabled="true">
                    {tool.name}
                    <span className={s.soon}>Soon</span>
                  </span>
                </li>
              ))}
            </ul>
          </nav>

          <nav className={s.col} aria-label="TollWala">
            <h3>TollWala</h3>
            <ul>
              {TOLLWALA.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className={s.col} aria-label="AllInOne">
            <h3>AllInOne</h3>
            <ul>
              {!inApp && (
                <li>
                  <Link href="/">Open the app</Link>
                </li>
              )}
              {ABOUT.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className={s.bottom}>
          <div className={s.legal}>
            <span>&copy; 2026 AllInOne &middot; No ads, no tracking, no account.</span>
            <span>Tax figures are estimates, not advice. Made in India.</span>
          </div>
          <BackToTop className={s.top} />
        </div>
      </div>
    </footer>
  );
}
