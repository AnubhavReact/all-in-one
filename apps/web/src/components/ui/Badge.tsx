import type { ToolStatus } from "@aio/core";

const LABEL: Record<ToolStatus, string> = {
  live: "Live",
  new: "New",
  soon: "Coming soon",
};

export function StatusBadge({ status }: { status: ToolStatus }) {
  return <span className={`aio-badge aio-badge--${status}`}>{LABEL[status]}</span>;
}
