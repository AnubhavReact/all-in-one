"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatBytes, toolsAccepting, type Tool } from "@aio/core";
import { Icon } from "@/components/ui/Icon";

const QUICK = [
  { label: "Merge PDF", href: "/pdf/merge", icon: "merge" },
  { label: "Split PDF", href: "/pdf/split", icon: "split" },
  { label: "PDF to images", href: "/pdf/to-images", icon: "image" },
  { label: "Rotate pages", href: "/pdf/organise", icon: "rotate" },
  { label: "Images to PDF", href: "/pdf/from-images", icon: "file" },
];

/**
 * The front door. Drop a file and we work out which tools can open it, rather
 * than making someone guess the right one from a list.
 */
export function HeroDrop({
  /** "bare" drops the card and the shortcut row, for the v3 hero band. */
  variant = "card",
}: {
  variant?: "card" | "bare";
} = {}) {
  const router = useRouter();
  const [over, setOver] = useState(false);
  const [dropped, setDropped] = useState<File | null>(null);
  const [matches, setMatches] = useState<Tool[]>([]);
  const [unknown, setUnknown] = useState<string | null>(null);

  function inspect(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;

    const extension = file.name.split(".").pop() ?? "";
    const found = toolsAccepting(extension).filter((t) => t.status !== "soon");

    if (found.length === 0) {
      setDropped(null);
      setMatches([]);
      setUnknown(extension ? `.${extension.toLowerCase()}` : file.name);
      return;
    }

    setUnknown(null);
    setDropped(file);
    setMatches(found);

    // Only one tool handles this type, so skip the menu and open it.
    if (found.length === 1 && found[0]) router.push(found[0].href);
  }

  return (
    <div className={variant === "bare" ? "aio-p-dropbare" : "aio-p-dropcard"}>
      <div
        className="aio-drop"
        data-over={over}
        onDragOver={(event) => {
          event.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(event) => {
          event.preventDefault();
          setOver(false);
          inspect(event.dataTransfer.files);
        }}
      >
        <span className="aio-drop-icon">
          <Icon name="upload" />
        </span>
        <strong className="aio-p-droptitle">
          Drop a PDF, resume or Form 16
        </strong>
        <p>
          or{" "}
          <label className="aio-p-droplink">
            choose a file
            <input
              type="file"
              className="sr-only"
              style={{ position: "absolute", width: 1, height: 1, opacity: 0 }}
              onChange={(event) => {
                inspect(event.target.files);
                event.target.value = "";
              }}
            />
          </label>{" "}
          — we&rsquo;ll suggest the right tool
        </p>
        <small>
          <Icon name="lock" />
          Processed in your browser &middot; nothing is uploaded
        </small>
      </div>

      {unknown && (
        <p className="aio-p-note aio-p-note--error" style={{ marginTop: 16 }}>
          <Icon name="file" />
          <span>
            Nothing here opens <strong>{unknown}</strong> yet. PDFs, PNGs and
            JPEGs work today.
          </span>
        </p>
      )}

      {dropped && matches.length > 1 && (
        <div style={{ marginTop: 16 }}>
          <p
            style={{
              margin: "0 0 10px",
              fontSize: 13,
              color: "var(--ink-muted)",
            }}
          >
            <strong style={{ color: "var(--ink)" }}>{dropped.name}</strong>{" "}
            &middot; {formatBytes(dropped.size)} — pick a tool:
          </p>
          <div className="aio-p-quick" style={{ marginTop: 0 }}>
            {matches.map((tool) => (
              <Link href={tool.href} key={tool.slug}>
                <Icon name={tool.icon} />
                {tool.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {variant === "card" && !dropped && !unknown && (
        <div className="aio-p-quick">
          {QUICK.map((item) => (
            <Link href={item.href} key={item.href}>
              <Icon name={item.icon} />
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
