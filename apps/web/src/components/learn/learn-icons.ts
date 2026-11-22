import {
  CheckCircle2,
  ClipboardList,
  Code2,
  Database,
  Mic,
  Network,
  PenLine,
  RotateCcw,
  Route,
  Target,
  Zap,
  BookOpen,
  type LucideIcon,
} from "lucide-react";

/** `LEARN_TRACKS` names its icons; the web app draws them with lucide. */
const ICONS: Record<string, LucideIcon> = {
  network: Network,
  arrow: Route,
  zap: Zap,
  mic: Mic,
  code: Code2,
  check: CheckCircle2,
  database: Database,
  clipboard: ClipboardList,
  rotate: RotateCcw,
  target: Target,
  pen: PenLine,
};

export function learnIcon(name: string): LucideIcon {
  return ICONS[name] ?? BookOpen;
}
