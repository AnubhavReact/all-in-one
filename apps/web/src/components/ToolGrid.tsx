"use client";

import { useState } from "react";
import { TOOLS, TOOL_FILTERS } from "@aio/core";
import { ToolCard } from "@/components/ToolCard";

/** The home grid with its pill tabs. Filtering happens on the device. */
export function ToolGrid() {
  const [filter, setFilter] = useState<string>("all");
  const shown = filter === "all" ? TOOLS : TOOLS.filter((t) => t.hue === filter);

  return (
    <>
      <div className="aio-p-head">
        <div>
          <span className="aio-eyebrow">Everything in here</span>
          <h2 className="aio-h2">One login. Every tool you need.</h2>
        </div>

        <div className="aio-tabs" role="tablist" aria-label="Filter tools">
          {TOOL_FILTERS.map((tab) => {
            const count =
              tab.id === "all"
                ? TOOLS.length
                : TOOLS.filter((t) => t.hue === tab.id).length;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={filter === tab.id}
                onClick={() => setFilter(tab.id)}
              >
                {tab.name} <span className="count">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="aio-p-grid4">
        {shown.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </>
  );
}
