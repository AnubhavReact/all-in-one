"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { CircleCheck } from "lucide-react";
import { TOOLS, isLive } from "@aio/core";
import { localStore } from "./store";
import s from "./Rail.module.css";

const pings = localStore<string[]>("aio-pings", [], (v): v is string[] => Array.isArray(v) && v.every((x) => typeof x === "string"));

const SLUGS = ["ats", "resume", "jobs"];

/**
 * "Get a ping": a note on this device when a tool goes live. There is no
 * server and no account, so there is no email to send; asking for one would
 * promise something the site can't do.
 */
export function ComingSoonList() {
  const on = useSyncExternalStore(pings.subscribe, pings.read, pings.server);
  const tools = SLUGS.map((slug) => TOOLS.find((t) => t.slug === slug)).filter((t) => !!t);
  const nowLive = tools.filter((t) => on.includes(t.slug) && isLive(t));

  return (
    <section className={s.card} aria-labelledby="soon-rail-h">
      <div className={s.head}>
        <h2 id="soon-rail-h">Coming soon</h2>
        <small>Get a ping</small>
      </div>
      {nowLive.map((t) => (
        <Link key={t.slug} href={t.href} className={s.liveNote}>
          <CircleCheck aria-hidden width={16} height={16} strokeWidth={2} />
          {t.name} is live now
        </Link>
      ))}
      <ul>
        {tools.map((t) => {
          const checked = on.includes(t.slug);
          return (
            <li key={t.slug} className={s.soonRow}>
              <div>
                <strong id={`ping-${t.slug}`}>{t.name}</strong>
                <span>{t.status === "building" ? "Building now" : "Soon"}</span>
              </div>
              {!isLive(t) && (
                <button
                  type="button"
                  role="switch"
                  aria-checked={checked}
                  aria-labelledby={`ping-${t.slug}`}
                  aria-describedby="ping-how"
                  className={s.switch}
                  onClick={() => pings.write(checked ? on.filter((x) => x !== t.slug) : [...on, t.slug])}
                />
              )}
            </li>
          );
        })}
      </ul>
      <p id="ping-how" className={s.note}>
        {on.length ? "We'll show a note here, on this device, when it goes live. No email needed." : "Switch one on and this card tells you when it goes live."}
      </p>
    </section>
  );
}
