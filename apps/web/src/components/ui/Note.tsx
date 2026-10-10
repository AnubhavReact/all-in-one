import { Icon } from "@/components/ui/Icon";

/** An inline message. Errors say how to fix the problem, never just "failed". */
export function Note({
  tone = "info",
  icon,
  children,
}: {
  tone?: "info" | "error";
  icon?: string;
  children: React.ReactNode;
}) {
  return (
    <p className={tone === "error" ? "aio-p-note aio-p-note--error" : "aio-p-note"}>
      <Icon name={icon ?? (tone === "error" ? "file" : "shield")} />
      <span>{children}</span>
    </p>
  );
}
