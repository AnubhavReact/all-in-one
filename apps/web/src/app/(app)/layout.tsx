import { AppShell } from "@/components/AppShell";

/**
 * Every working page lives inside the v3 shell: the sidebar is the
 * navigation, so these pages carry no navbar of their own. The AI rail is
 * docked on the home page only; a tool page needs the room.
 */
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
