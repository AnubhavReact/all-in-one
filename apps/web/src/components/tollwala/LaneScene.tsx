"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import s from "./LaneScene.module.css";

/**
 * A sample toll lane seen from above: a car pulls up, its FASTag is read,
 * the barrier lifts and the counter ticks. Pure illustration; no real data.
 */

const STEP_MS = 1300;
const STATUS = [
  { text: "Vehicle at the barrier, reading FASTag…", ok: false },
  { text: "FASTag read, barrier up.", ok: true },
  { text: "Vehicle through, next vehicle.", ok: true },
  { text: "Next vehicle pulling up.", ok: false },
];

/** Where a car sits on the road, in viewBox units, for each phase. */
const STOP = 330;
const QUEUE = 150;
const GONE = 700;

function reducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
const subscribeMotion = (cb: () => void) => {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

function Car({ x, tone, entering }: { x: number; tone: "a" | "b"; entering?: boolean }) {
  return (
    <g className={entering ? `${s.car} ${s.enter}` : s.car} style={{ transform: `translateX(${x}px)` }}>
      <rect x="0" y="108" width="92" height="56" rx="10" className={tone === "a" ? s.bodyA : s.bodyB} />
      <rect x="10" y="116" width="10" height="40" rx="4" className={s.glass} />
      <rect x="62" y="114" width="14" height="44" rx="5" className={s.glass} />
    </g>
  );
}

export function LaneScene() {
  const still = useSyncExternalStore(subscribeMotion, reducedMotion, () => false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (still) return;
    const id = window.setInterval(() => {
      if (!document.hidden) setTick((t) => t + 1);
    }, STEP_MS);
    return () => window.clearInterval(id);
  }, [still]);

  const t = still ? 1 : tick;
  const cycle = Math.floor(t / 4);
  const phase = t % 4;
  const up = phase === 1 || phase === 2;
  const count = cycle + (phase >= 2 ? 1 : 0);
  const status = STATUS[phase]!;

  const current = { id: cycle, x: phase >= 2 ? GONE : STOP };
  const next = { id: cycle + 1, x: phase === 3 ? STOP : QUEUE };

  return (
    <figure className={s.scene}>
      <div className={s.top}>
        <span className={s.sign}>Lane 04 · FASTag</span>
        <span className={s.running}>
          <i aria-hidden />
          Running
        </span>
        <span className={s.counter}>
          <small>Vehicles</small>
          <b>{String(count).padStart(6, "0")}</b>
        </span>
      </div>

      <svg
        className={s.road}
        viewBox="0 0 600 272"
        role="img"
        aria-label="Sample animation: a car pulls up to a toll lane, its FASTag is read and the barrier lifts."
      >
        <rect width="600" height="272" className={s.verge} />
        <rect y="60" width="600" height="152" className={s.tarmac} />
        <rect y="62" width="600" height="3" className={s.edge} />
        <rect y="207" width="600" height="3" className={s.edge} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} x={i * 50} y="134" width="26" height="4" className={s.dash} />
        ))}
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={250 + i * 14} y="76" width="5" height="120" className={s.zebra} />
        ))}

        {/* the booth: the lane under the canopy, the sign and the reader */}
        <rect x="310" y="60" width="130" height="212" className={s.canopy} />
        <rect x="310" y="0" width="130" height="60" className={s.board} />
        <text x="375" y="37" textAnchor="middle" className={s.boardText}>
          TOLL PLAZA
        </text>
        <rect x="310" y="54" width="130" height="8" className={s.hazard} />
        <rect x="320" y="68" width="30" height="20" rx="5" className={s.reader} />
        <circle cx="335" cy="78" r="5" className={status.ok ? s.lightOk : s.lightWait} />
        <rect x="370" y="228" width="58" height="32" rx="5" className={s.boothBox} />
        <rect x="384" y="240" width="30" height="8" rx="3" className={s.boothSlot} />

        {/* cars: the one at the barrier, the one queuing */}
        <Car key={current.id} x={current.x} tone={current.id % 2 ? "b" : "a"} />
        <Car key={next.id} x={next.x} tone={next.id % 2 ? "b" : "a"} entering={phase === 0} />

        {/* the barrier arm, pivoting from the top */}
        <g className={up ? `${s.arm} ${s.armUp}` : s.arm}>
          <rect x="428" y="62" width="12" height="148" rx="6" className={s.armBody} />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <rect key={i} x="428" y={72 + i * 20} width="12" height="10" className={s.armStripe} />
          ))}
        </g>
        <circle cx="434" cy="62" r="9" className={s.pivot} />
      </svg>

      <figcaption className={s.status} aria-hidden>
        <i className={status.ok ? s.dotOk : s.dotWait} />
        {status.text}
        <span className={s.sample}>Sample</span>
      </figcaption>
    </figure>
  );
}
