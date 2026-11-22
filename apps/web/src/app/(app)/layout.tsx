import { AppFrame } from "@/components/shell/AppFrame";

/** Every working page lives inside the app shell: sidebar, top bar, ⌘K, AVTAR. */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppFrame>{children}</AppFrame>;
}
