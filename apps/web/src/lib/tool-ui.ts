import {
  BookOpen,
  Briefcase,
  Combine,
  FileImage,
  FileText,
  Images,
  IndianRupee,
  MessageCircle,
  RotateCw,
  ScanSearch,
  Scissors,
  type LucideIcon,
} from "lucide-react";
import type { Tool, TileHue } from "@aio/core";
import type { Tone } from "@/components/ui/IconTile";

/** The registry names its icons; the web app draws them with lucide. */
const ICONS: Record<string, LucideIcon> = {
  merge: Combine,
  split: Scissors,
  rotate: RotateCw,
  image: FileImage,
  file: Images,
  rupee: IndianRupee,
  briefcase: Briefcase,
  resume: FileText,
  target: ScanSearch,
  chat: MessageCircle,
  book: BookOpen,
};

export function toolIcon(tool: Pick<Tool, "icon">): LucideIcon {
  return ICONS[tool.icon] ?? FileText;
}

/** Registry hue → tile tone. AI shares Learn's sky. */
export function toneFor(hue: TileHue): Tone {
  return hue === "ai" ? "learn" : hue;
}
