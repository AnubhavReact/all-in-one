"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { searchTools, toolsAccepting, type Tool } from "@aio/core";
import { askAssistant } from "@/components/ai/AiShell";
import { Icon } from "@/components/ui/Icon";

export type AskChip = { label: string; icon: string; href: string };

/**
 * The ask bar: the front door on the home page and the marketing page.
 *
 * It does the half of the job that needs no model. Whatever is typed is
 * matched against the tool catalogue and opens that tool, and an attached
 * file is routed by its extension. Anything that is a real question waits on
 * the assistant, which is not connected to a model yet — so the bar says so
 * instead of pretending to answer.
 *
 * The mock also draws a microphone. It is left out until dictation is wired,
 * because a button that does nothing is worse than no button.
 */
export function AskBar({
  placeholder,
  chips,
  flat = false,
}: {
  placeholder: string;
  chips: readonly AskChip[];
  /** Inside a card or a hero band, so it drops the outer glow. */
  flat?: boolean;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [miss, setMiss] = useState(false);

  const matches: Tool[] = searchTools(query, 4);

  function submit() {
    const target = matches[0];
    if (target) {
      router.push(target.href);
      return;
    }
    // Not a tool, so it is a question: hand it to the assistant panel.
    setMiss(true);
    askAssistant(query);
  }

  function routeFile(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    const extension = file.name.split(".").pop() ?? "";
    const tool = toolsAccepting(extension).find((t) => t.status !== "soon");
    if (tool) {
      router.push(tool.href);
      return;
    }
    setQuery(file.name);
    setMiss(true);
  }

  return (
    <div className="aio-ask" style={flat ? { boxShadow: "none" } : undefined}>
      <form
        className="aio-ask-row"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <Icon name="ai" />
        <input
          value={query}
          placeholder={placeholder}
          aria-label="Ask AllInOne AI, or name a tool"
          onChange={(event) => {
            setQuery(event.target.value);
            setMiss(false);
          }}
        />
        <label className="aio-icon-btn" title="Attach a file">
          <Icon name="clip" />
          <span className="aio-p-sr">Attach a file</span>
          <input
            type="file"
            onChange={(event) => {
              routeFile(event.target.files);
              event.target.value = "";
            }}
          />
        </label>
        {/* The mock's helper puts every icon first; after the label reads
            better for a verb this short. */}
        <button className="aio-btn aio-btn--primary" type="submit">
          Go
          <Icon name="arrow" />
        </button>
      </form>

      {query && matches.length > 0 ? (
        <div className="aio-ask-tools">
          {matches.map((tool) => (
            <Link className="aio-chip" href={tool.href} key={tool.slug}>
              <Icon name={tool.icon} />
              {tool.name}
              {tool.status === "soon" && <span>· coming soon</span>}
            </Link>
          ))}
        </div>
      ) : (
        <div className="aio-ask-tools">
          {chips.map((chip) => (
            <Link className="aio-chip" href={chip.href} key={chip.href}>
              <Icon name={chip.icon} />
              {chip.label}
            </Link>
          ))}
        </div>
      )}

      {miss && (
        <p className="aio-p-askmiss">
          <Icon name="ai" />
          <span>
            No tool matches that. A question like this needs a model, and none
            is connected yet &mdash; add an API key and AllInOne AI will answer
            it here.
          </span>
        </p>
      )}
    </div>
  );
}
