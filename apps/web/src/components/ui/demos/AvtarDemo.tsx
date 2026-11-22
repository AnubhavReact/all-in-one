import { ArrowRight, Bot, MessageCircle } from "lucide-react";
import { avtarReply } from "@aio/core";
import type { DemoStep } from "../DemoWindow";
import t from "./SiteScenes.module.css";

const QUESTION = "How do I merge PDFs?";
const CHIPS = [QUESTION, "Old or new tax regime?", "Are my files uploaded?"];
/** The real FAQ answer, so the demo can't drift from the bot. */
const REPLY = avtarReply(QUESTION);
const LINK = REPLY.links[0];

function Panel({ tapped, answered }: { tapped?: boolean; answered?: boolean }) {
  return (
    <div className={t.panel}>
      <div className={t.panelHead}>
        <span>
          <Bot strokeWidth={1.8} />
        </span>
        AVTAR · Help
        <small>Fixed FAQ</small>
      </div>
      {!answered && <p className={t.botMsg}>Hi, I&rsquo;m AVTAR. Ask me how a tool works, or pick a question.</p>}
      {!answered && (
        <div className={t.chips}>
          {CHIPS.map((q) => (
            <span key={q} className={tapped && q === QUESTION ? `${t.chip} ${t.tapped}` : t.chip}>
              {q}
            </span>
          ))}
        </div>
      )}
      {tapped && <p className={t.meMsg}>{QUESTION}</p>}
      {answered && (
        <>
          <p className={t.botMsg}>{REPLY.text}</p>
          {LINK && (
            <span className={`${t.chip} ${t.linkChip}`}>
              Open {LINK.label}
              <ArrowRight strokeWidth={2} />
            </span>
          )}
        </>
      )}
    </div>
  );
}

export const AVTAR_STEPS: DemoStep[] = [
  {
    caption: "AVTAR waits in the corner of every page",
    render: (
      <div className={t.chatStage}>
        <p className={t.hint}>Stuck? Ask me how any tool works.</p>
        <span className={t.launcher}>
          <span className={t.orb}>
            <MessageCircle strokeWidth={2} />
          </span>
          Ask AVTAR
        </span>
      </div>
    ),
  },
  { caption: "Pick a question, or type your own", render: <Panel /> },
  {
    caption: `“${QUESTION}”`,
    render: <Panel tapped />,
  },
  {
    caption: `An instant answer, with a link to ${LINK?.label ?? "the tool"}`,
    render: <Panel tapped answered />,
  },
];
