"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toolsAccepting, type Tool } from "@aio/core";
import { formatBytes } from "@aio/core";

/**
 * The front door. Drop a file and we work out which tools can open it, rather
 * than making someone guess the right one from a list of twelve.
 */
export function DropRouter() {
  const router = useRouter();
  const [over, setOver] = useState(false);
  const [dropped, setDropped] = useState<File | null>(null);
  const [matches, setMatches] = useState<Tool[]>([]);
  const [unknown, setUnknown] = useState<string | null>(null);

  function inspect(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    const extension = file.name.split(".").pop() ?? "";
    const found = toolsAccepting(extension).filter((t) => t.ready);

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
    <section
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        inspect(e.dataTransfer.files);
      }}
      className={`rounded-tile border-2 p-7 transition-colors md:p-10 ${
        over ? "border-ink bg-signal/25" : "border-ink bg-card"
      }`}
    >
      <h1 className="max-w-[30ch] text-[30px] leading-[1.1] font-extrabold md:text-[44px]">
        Drop a file. We&rsquo;ll find the tool.
      </h1>
      <p className="mt-3 max-w-[58ch] text-[15px] leading-relaxed text-ink-70">
        PDFs, scans and photos open straight away, and they stay on your
        device. Jobs, resumes and tax need an account.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <label className="cursor-pointer rounded-tile border-2 border-ink bg-ink px-5 py-2.5 text-[15px] font-semibold text-paper hover:bg-card hover:text-ink">
          Choose a file
          <input
            type="file"
            className="sr-only"
            onChange={(e) => {
              inspect(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
        <span className="text-[13px] text-ink-40">
          or drag one anywhere in this box
        </span>
      </div>

      {unknown && (
        <p className="mt-6 border-l-4 border-cat-pdf bg-paper py-2 pl-4 text-[14px]">
          Nothing here opens <strong>{unknown}</strong> yet. PDFs, PNGs and
          JPEGs work today.
        </p>
      )}

      {dropped && matches.length > 1 && (
        <div className="mt-7 border-t-2 border-rule pt-5">
          <p className="text-[14px] text-ink-70">
            <strong className="font-semibold text-ink">{dropped.name}</strong>{" "}
            &middot; {formatBytes(dropped.size)}
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {matches.map((tool) => (
              <li key={tool.href}>
                <button
                  onClick={() => router.push(tool.href)}
                  className="rounded-tile border-2 border-rule bg-card px-3.5 py-2 text-[14px] font-medium hover:border-ink"
                >
                  {tool.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
