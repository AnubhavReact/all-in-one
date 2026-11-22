"use client";

import { useState } from "react";
import { DemoWindow, type DemoStep } from "@/components/ui/DemoWindow";
import { FilterChip } from "@/components/ui/Chip";
import s from "./Home.module.css";

/** One demo at a time, picked with toggle chips. */
export function DemoTabs({ demos }: { demos: { id: string; label: string; title: string; steps: DemoStep[] }[] }) {
  const [current, setCurrent] = useState(demos[0].id);
  const demo = demos.find((d) => d.id === current) ?? demos[0];
  return (
    <>
      <div className={s.tabs} role="group" aria-label="Choose a demo">
        {demos.map((d) => (
          <FilterChip key={d.id} pressed={d.id === current} onClick={() => setCurrent(d.id)}>
            {d.label}
          </FilterChip>
        ))}
      </div>
      <DemoWindow key={demo.id} title={demo.title} steps={demo.steps} />
    </>
  );
}
