"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { searchTools } from "@aio/core";
import { Icon } from "@/components/ui/Icon";

/**
 * Suggested prompts. Each one has to resolve to a tool that exists, because
 * clicking it opens that tool — there is no model to send it to.
 */
const PROMPTS = [
  { icon: "merge", text: "Merge my Form 16 and rent receipts" },
  { icon: "split", text: "Keep only pages 3–5 of this PDF" },
  { icon: "image", text: "Turn these photos into one PDF" },
  { icon: "rotate", text: "Straighten this sideways scan" },
];

/**
 * The docked AI rail from the v3 handoff. With no key it shows the
 * bring-your-own-key card and the suggested prompts; it becomes the chat once
 * a key exists.
 *
 * The design's primary button is "Add API key". Nothing can use a key yet —
 * there is no `/api/ai` route — so storing one would be a liability with no
 * payoff. The card explains the plan and links to the AI page instead, and
 * the button comes back the day the route does.
 */
export function AiRail({ onCollapse }: { onCollapse: () => void }) {
  const router = useRouter();

  function run(prompt: string) {
    const tool = searchTools(prompt, 1)[0];
    if (tool) router.push(tool.href);
  }

  return (
    <aside className="aio-rail">
      <section className="aio-assist" aria-label="AllInOne AI">
        <header className="aio-assist-head">
          <span className="aio-assist-avatar">
            <Icon name="ai" />
          </span>
          <div className="t">
            <strong>AllInOne AI</strong>
            <span className="aio-p-warnstate">
              <i />
              Needs your API key
            </span>
          </div>
          <button
            type="button"
            className="aio-icon-btn"
            style={{ position: "relative" }}
            aria-label="Collapse the assistant"
            onClick={onCollapse}
          >
            <Icon name="x" />
          </button>
        </header>

        <div className="aio-assist-body">
          <div className="aio-ctx">
            <Icon name="home" />
            You&rsquo;re on <b>Home</b> &middot; no file open
          </div>

          <div className="aio-keycard">
            <strong>Bring your own key</strong>
            <p>
              The plan: paste a Claude, OpenAI or Gemini key and chat. It stays
              on this device and goes straight to that provider. Nothing is
              wired up yet, so there is nowhere to put one.
            </p>
            <div className="aio-row">
              <Link className="aio-btn aio-btn--secondary aio-btn--sm" href="/ai">
                <Icon name="lock" />
                How it will work
              </Link>
            </div>
          </div>

          <span className="aio-p-railhint">
            These open the tool today, without a key
          </span>

          <div className="aio-prompt-list">
            {PROMPTS.map((prompt) => (
              <button
                type="button"
                key={prompt.text}
                onClick={() => run(prompt.text)}
              >
                <Icon name={prompt.icon} />
                {prompt.text}
              </button>
            ))}
          </div>
        </div>

        <footer className="aio-assist-foot">
          <div className="aio-input">
            <input
              placeholder="Add a key to chat"
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
    </aside>
  );
}
