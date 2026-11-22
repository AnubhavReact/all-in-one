"use client";

import { Sparkles } from "lucide-react";
import { askAvtar } from "@/components/shell/events";
import s from "./Rail.module.css";

/** Each prompt is one the AVTAR FAQ really answers. */
export const DEFAULT_PROMPTS = ["How do I merge PDFs?", "Old or new regime for ₹12 LPA?", "What is DSA Atlas?"];

export function AskPrompts({ prompts = DEFAULT_PROMPTS }: { prompts?: string[] }) {
  return (
    <section className={s.card} aria-labelledby="ask-h">
      <div className={s.head}>
        <h2 id="ask-h">Try asking AVTAR</h2>
        <span className={s.kbd} aria-label="Shortcut: Command or Control J">
          ⌘J
        </span>
      </div>
      <div className={s.prompts}>
        {prompts.map((p) => (
          <button key={p} type="button" className={s.prompt} onClick={() => askAvtar(p)}>
            <Sparkles aria-hidden strokeWidth={1.8} />
            {p}
          </button>
        ))}
      </div>
    </section>
  );
}
