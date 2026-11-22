"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, useSyncExternalStore } from "react";
import { ArrowUpRight, Upload } from "lucide-react";
import { TOOLS } from "@aio/core";
import { getHistoryServerSnapshot, getHistorySnapshot, subscribeHistory, timeAgo } from "@/lib/history";
import { handOff } from "@/lib/handoff";
import { toolIcon } from "@/lib/tool-ui";
import s from "./Rail.module.css";
import t from "@/components/ui/IconTile.module.css";

/**
 * The last files made here. Only names and facts are kept, never the file, so
 * each row offers to open the tool again rather than a download that can't
 * work. First visit: a drop target that opens Merge with the files.
 */
export function RecentFiles({ id = "recent" }: { id?: string }) {
  const router = useRouter();
  const items = useSyncExternalStore(subscribeHistory, getHistorySnapshot, getHistoryServerSnapshot);
  const [all, setAll] = useState(false);
  const [over, setOver] = useState(false);
  const picker = useRef<HTMLInputElement>(null);

  const start = (files: File[]) => {
    const pdfs = files.filter((f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"));
    if (!pdfs.length) return;
    handOff(pdfs);
    router.push("/pdf/merge");
  };

  const shown = all ? items.slice(0, 10) : items.slice(0, 3);

  return (
    <section className={s.card} aria-labelledby={`${id}-h`}>
      <div className={s.head}>
        <h2 id={`${id}-h`}>Continue where you left off</h2>
        {items.length > 3 && (
          <button type="button" className={s.textBtn} aria-expanded={all} onClick={() => setAll(!all)}>
            {all ? "Less" : "All"}
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div
          className={over ? `${s.drop} ${s.over}` : s.drop}
          onClick={() => picker.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setOver(true);
          }}
          onDragLeave={() => setOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setOver(false);
            start(Array.from(e.dataTransfer.files));
          }}
        >
          <Upload aria-hidden strokeWidth={1.8} />
          <strong>Drop a PDF to start</strong>
          <button type="button" className={s.textBtn} onClick={(e) => (e.stopPropagation(), picker.current?.click())}>
            or choose files
          </button>
          <input
            ref={picker}
            type="file"
            accept=".pdf,application/pdf"
            multiple
            hidden
            onChange={(e) => e.target.files && start(Array.from(e.target.files))}
          />
        </div>
      ) : (
        <ul className={s.list}>
          {shown.map((item) => {
            const tool = TOOLS.find((x) => x.name === item.tool);
            const Icon = tool ? toolIcon(tool) : Upload;
            const facts = [item.tool, item.detail, timeAgo(item.at)].filter(Boolean).join(" · ");
            return (
              <li key={`${item.at}-${item.name}`} className={s.row}>
                <span className={`${s.ficon} ${t.pdf}`} aria-hidden>
                  <Icon strokeWidth={1.8} />
                </span>
                <span className={s.name}>
                  <strong title={item.name}>{item.name}</strong>
                  <span>{facts}</span>
                </span>
                {tool && (
                  <Link href={tool.href} className={s.iconLink} aria-label={`Open ${tool.name} again`}>
                    <ArrowUpRight aria-hidden strokeWidth={2} />
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
