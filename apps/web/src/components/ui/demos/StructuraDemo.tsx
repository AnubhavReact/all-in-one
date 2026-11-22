import { Database, Gauge, HardDrive, Laptop, Network, Server, type LucideIcon } from "lucide-react";
import type { DemoStep } from "../DemoWindow";
import s from "./Scenes.module.css";
import l from "./LearnScenes.module.css";

const NODES: { label: string; icon: LucideIcon }[] = [
  { label: "Client", icon: Laptop },
  { label: "LB", icon: Network },
  { label: "App", icon: Server },
  { label: "Cache", icon: HardDrive },
  { label: "DB", icon: Database },
];

function Diagram({ on, hops }: { on?: number; hops?: boolean }) {
  return (
    <div className={hops ? `${l.diagram} ${l.hops}` : l.diagram}>
      {NODES.map(({ label, icon: I }, i) => (
        <div key={label} className={i === on ? `${l.node} ${l.nodeOn}` : l.node}>
          <I strokeWidth={1.8} />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

const TOPICS = ["Rate limiter", "Kafka"];
/** Requests per second as the load test ramps up, as a share of the peak. */
const RAMP = [8, 14, 22, 32, 44, 56, 68, 80, 90, 100];

/** Sample data only: a made-up short link and made-up timings. */
export const STRUCTURA_STEPS: DemoStep[] = [
  {
    caption: "Pick a topic: URL shortener",
    render: (
      <div className={s.col}>
        <span className={s.label}>Topics · Development</span>
        <div className={`${s.row} ${s.picked}`}>
          <span className={s.ficon}>
            <Network strokeWidth={1.8} />
          </span>
          <strong>URL shortener</strong>
          <span className={s.mono}>12 min</span>
        </div>
        {TOPICS.map((t) => (
          <div key={t} className={s.row}>
            <span className={s.ficon}>
              <Network strokeWidth={1.8} />
            </span>
            <strong>{t}</strong>
            <span className={s.mono}>Open</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    caption: "The architecture draws itself, part by part",
    render: (
      <div className={s.col}>
        <span className={s.label}>URL shortener · architecture</span>
        <Diagram on={3} />
        <div className={l.card}>
          <div className={l.head}>
            <h4>Cache</h4>
            <span className={`${l.pill} ${l.pillOn}`}>clicked</span>
          </div>
          <p>Keeps hot short codes in memory, so most redirects never touch the database.</p>
        </div>
      </div>
    ),
  },
  {
    caption: "Follow one request, hop by hop",
    render: (
      <div className={s.col}>
        <Diagram hops />
        <div className={l.log}>
          <div className={l.logRow}>
            <b>1</b>
            <span>GET /aZ3k reaches the load balancer</span>
            <span className={s.mono}>1 ms</span>
          </div>
          <div className={l.logRow}>
            <b>2</b>
            <span>App looks up aZ3k in the cache</span>
            <span className={s.mono}>2 ms</span>
          </div>
          <div className={l.logRow}>
            <b>3</b>
            <span>Cache miss, so it reads the DB</span>
            <span className={s.mono}>9 ms</span>
          </div>
          <div className={l.logRow}>
            <b>4</b>
            <span>301 redirect back to the client</span>
            <span className={`${s.mono} ${s.ok}`}>14 ms</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    caption: "Put load on it and watch where it bends",
    render: (
      <div className={s.col}>
        <div className={l.head}>
          <span className={s.label}>Load test</span>
          <span className={`${l.pill} ${l.pillOn}`}>
            <Gauge width={12} height={12} strokeWidth={2} />
            ramping
          </span>
        </div>
        <div className={l.chart}>
          {RAMP.map((h, i) => (
            <i
              key={i}
              className={i >= 8 ? l.hot : undefined}
              style={{ "--h": `${h}%`, "--d": `${i * 0.15}s` } as React.CSSProperties}
            />
          ))}
        </div>
        <div className={l.stats}>
          <div className={l.stat}>
            <b>10k</b>
            <span>requests / s</span>
          </div>
          <div className={l.stat}>
            <b>42 ms</b>
            <span>p99 latency</span>
          </div>
          <div className={l.stat}>
            <b className={s.ok}>94%</b>
            <span>cache hits</span>
          </div>
        </div>
      </div>
    ),
  },
];
