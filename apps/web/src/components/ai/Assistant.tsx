"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SECTIONS, TOOLS, searchTools } from "@aio/core";
import { Icon } from "@/components/ui/Icon";

/** What the person is looking at, so the panel can say it out loud. */
function pageName(pathname: string): string {
  const tool = TOOLS.find((t) => t.href === pathname);
  if (tool) return tool.name;
  const section = SECTIONS.find((s) => s.href === pathname);
  if (section) return section.name;
  if (pathname.startsWith("/dashboard")) return "your dashboard";
  return "the home page";
}

const FALLBACK = ["merge", "split", "to-images"] as const;

/**
 * The floating assistant from the v2 handoff.
 *
 * The design has it running tools and proposing action cards. That needs a
 * model behind `/api/ai`, and there isn't one yet — no key, no route. So the
 * panel is honest about being disconnected and does the one thing it can do
 * without a model: take what was typed and point at the tool that handles it.
 * When the API is wired, the thread and the action cards replace this body
 * and nothing else here has to change.
 */
export function Assistant({
  open,
  seed,
  onClose,
}: {
  open: boolean;
  /** A query handed over from the ask bar or the ⌘K palette. */
  seed: string;
  onClose: () => void;
}) {
  const pathname = usePathname();
  if (!open) return null;

  const matched = searchTools(seed, 3);
  const suggestions =
    matched.length > 0
      ? matched
      : FALLBACK.map((slug) => TOOLS.find((t) => t.slug === slug)).filter(
          (t): t is (typeof TOOLS)[number] => Boolean(t),
        );

  return (
    <div className="aio-p-assistdock">
      <section className="aio-assist" aria-label="AllInOne AI">
        <header className="aio-assist-head">
          <span className="aio-assist-avatar">
            <Icon name="ai" />
          </span>
          <div className="t">
            <strong>AllInOne AI</strong>
            <span className="aio-p-offline">
              <i />
              Not connected &middot; needs an API key
            </span>
          </div>
          <button
            type="button"
            className="aio-icon-btn"
            style={{ position: "relative" }}
            aria-label="Close the assistant"
            onClick={onClose}
          >
            <Icon name="x" />
          </button>
        </header>

        <div className="aio-assist-body">
          <div className="aio-ctx">
            <Icon name="target" />
            You&rsquo;re on <b>{pageName(pathname)}</b>
          </div>

          {seed && <div className="aio-bubble aio-bubble--me">{seed}</div>}

          <div className="aio-bubble aio-bubble--ai">
            I can&rsquo;t answer yet — no model is connected. Once you add a
            Claude, GPT or Gemini key I&rsquo;ll run these tools for you and
            show every change before applying it.
            {seed && " Meanwhile, this is the closest tool:"}
          </div>

          <div className="aio-suggest">
            {suggestions.map((tool) => (
              <Link className="aio-chip" href={tool.href} key={tool.slug}>
                <Icon name={tool.icon} />
                {tool.name}
              </Link>
            ))}
          </div>
        </div>

        <footer className="aio-assist-foot">
          <div className="aio-input">
            <input
              placeholder="Connect a model to chat"
              aria-label="Message AllInOne AI"
              disabled
            />
            <button
              className="aio-btn aio-btn--primary aio-btn--sm"
              type="button"
              aria-label="Send"
              disabled
            >
              <Icon name="send" />
            </button>
          </div>
          <div className="note">
            AI can make mistakes. Tax answers will carry an expert review
            before anything is filed.
          </div>
        </footer>
      </section>
    </div>
  );
}
