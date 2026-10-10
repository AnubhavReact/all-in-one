"use client";

import { useSyncExternalStore } from "react";
import { formatBytes } from "@aio/core";
import {
  clearHistory,
  getHistorySnapshot,
  getHistoryServerSnapshot,
  subscribeHistory,
  timeAgo,
} from "@/lib/history";
import { Icon } from "@/components/ui/Icon";

/**
 * What the PDF tools have produced in this browser.
 *
 * The design puts a download button on every row. There is nothing to
 * download: the file was made in the tab and handed to the browser, and we
 * deliberately keep no copy. So the row carries the facts and the section
 * offers the one action that is real — forgetting them.
 */
export function RecentFiles() {
  const rows = useSyncExternalStore(
    subscribeHistory,
    getHistorySnapshot,
    getHistoryServerSnapshot,
  );

  return (
    <div className="aio-card aio-p-recent">
      <div className="aio-section-head">
        <div>
          <h2>Recent files</h2>
          <p>Names only, kept in this browser — clear them any time.</p>
        </div>
        {rows.length > 0 && (
          <button type="button" className="aio-p-linkbtn" onClick={clearHistory}>
            Clear
          </button>
        )}
      </div>

      {rows.length === 0 ? (
        <p className="aio-p-empty">
          Nothing yet. Merge or split something and it shows up here — the file
          itself never leaves your device, so only its name is remembered.
        </p>
      ) : (
        <table className="aio-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Tool</th>
              <th>Size</th>
              <th>When</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.at}-${row.name}`}>
                <td className="name">
                  <div>
                    <span className="aio-tile aio-tile--sm aio-tile--pdf">
                      <Icon name={row.icon} />
                    </span>
                    {row.name}
                  </div>
                </td>
                <td>{row.tool}</td>
                <td className="num">{formatBytes(row.bytes)}</td>
                <td>{timeAgo(row.at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
