import Link from "next/link";
import type { Tool } from "@aio/core";
import { Icon } from "@/components/ui/Icon";
import { StatusBadge } from "@/components/ui/Badge";

/**
 * The building block of the home grid. A tool that isn't built is not a link —
 * it says so and stays put, rather than sending someone to an empty page.
 */
export function ToolCard({ tool }: { tool: Tool }) {
  const inside = (
    <>
      <div className="aio-tool-top">
        <span className={`aio-tile aio-tile--${tool.hue}`}>
          <Icon name={tool.icon} />
        </span>
        <StatusBadge status={tool.status} />
      </div>
      <h4>{tool.name}</h4>
      <p>{tool.blurb}</p>
      <div className="aio-tool-foot">
        <Icon name={tool.status === "soon" ? "bell" : "arrow"} />
        {tool.action}
      </div>
    </>
  );

  if (tool.status === "soon") {
    return <div className="aio-tool aio-tool--disabled">{inside}</div>;
  }

  return (
    <Link className="aio-tool" href={tool.href}>
      {inside}
    </Link>
  );
}
