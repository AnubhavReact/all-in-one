"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { Pause, Play } from "lucide-react";
import s from "./DemoWindow.module.css";

export type DemoStep = {
  /** The accessible text for this step, shown under the window. */
  caption: string;
  /** What the stage draws. Decoration: hidden from screen readers. */
  render: ReactNode;
};

const MOTION = "(prefers-reduced-motion: reduce)";

function subscribeMotion(cb: () => void) {
  const q = window.matchMedia(MOTION);
  q.addEventListener("change", cb);
  return () => q.removeEventListener("change", cb);
}
function subscribeVisibility(cb: () => void) {
  document.addEventListener("visibilitychange", cb);
  return () => document.removeEventListener("visibilitychange", cb);
}

/**
 * A charcoal app window that plays a feature through like a short video.
 *
 * The filling progress segment is the clock: when its animation ends the
 * step advances, so pausing the animation pauses everything and the two can
 * never drift. It runs only while at least a quarter of it is on screen and
 * the tab is visible, and starts paused for reduced motion.
 */
export function DemoWindow({
  title,
  steps,
  stepMs = 3000,
  className,
}: {
  title: string;
  steps: DemoStep[];
  stepMs?: number;
  className?: string;
}) {
  const [step, setStep] = useState(0);
  const [chosen, setChosen] = useState<boolean | null>(null);
  const [inView, setInView] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const reduce = useSyncExternalStore(subscribeMotion, () => window.matchMedia(MOTION).matches, () => false);
  const hidden = useSyncExternalStore(subscribeVisibility, () => document.hidden, () => false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.intersectionRatio >= 0.25), {
      threshold: [0, 0.25, 0.5, 1],
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const paused = chosen ?? reduce;
  const running = !paused && inView && !hidden;
  const current = steps[Math.min(step, steps.length - 1)];

  return (
    <div
      ref={root}
      className={className ? `${s.win} ${className}` : s.win}
      style={{ "--step-ms": `${stepMs}ms` } as React.CSSProperties}
      role="group"
      aria-label={`${title} (sample demo)`}
    >
      <div className={s.bar}>
        <span className={s.dots} aria-hidden>
          <i />
          <i />
          <i />
        </span>
        <span className={s.title}>{title}</span>
        <span className={s.pill}>SAMPLE DEMO</span>
      </div>

      <div className={s.stage} aria-hidden>
        <div className={s.scene} key={step}>
          {current.render}
        </div>
      </div>

      <div className={s.foot}>
        <button
          type="button"
          className={s.play}
          aria-label={paused ? "Play demo" : "Pause demo"}
          onClick={() => setChosen(!paused)}
        >
          {paused ? <Play aria-hidden strokeWidth={2} /> : <Pause aria-hidden strokeWidth={2} />}
        </button>
        <div className={s.meta}>
          <p className={s.cap} aria-live={running ? "off" : "polite"}>
            <b>
              {step + 1}/{steps.length}
            </b>
            &middot; {current.caption}
          </p>
          <div className={s.progress}>
            {steps.map((item, index) => (
              <button
                key={item.caption}
                type="button"
                className={`${s.seg} ${index < step ? s.done : ""}`}
                aria-label={`Go to step ${index + 1} of ${steps.length}`}
                aria-current={index === step ? "step" : undefined}
                onClick={() => setStep(index)}
              >
                {index === step && (
                  <span
                    key={`run-${step}`}
                    style={{ animationPlayState: running ? "running" : "paused" }}
                    onAnimationEnd={() => setStep((n) => (n + 1) % steps.length)}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
