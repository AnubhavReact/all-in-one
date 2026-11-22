import { AskPrompts } from "./AskPrompts";
import { ComingSoonList } from "./ComingSoonList";
import { LearnProgress } from "./LearnProgress";
import { RecentFiles } from "./RecentFiles";
import { WeekStats } from "./WeekStats";
import s from "./Rail.module.css";

/**
 * The home page's right rail: a sticky column from 1200px, a two-column grid
 * under the main column from 900px, hidden below that (where `RailMobile`
 * puts Continue and Learn under Quick tools instead).
 */
export function RightRail() {
  return (
    <aside className={s.rail} aria-label="Your activity">
      <WeekStats />
      <RecentFiles id="rail-recent" />
      <LearnProgress id="rail-learn" />
      <AskPrompts />
      <ComingSoonList />
    </aside>
  );
}

/** Below 900px: just Continue and Learn, placed by the page under Quick tools. */
export function RailMobile() {
  return (
    <div className={s.mobileSlot}>
      <RecentFiles id="m-recent" />
      <LearnProgress id="m-learn" />
    </div>
  );
}

export { s as railStyles };
