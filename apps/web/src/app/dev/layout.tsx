import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kitchen sink | AllInOne",
  robots: { index: false, follow: false },
};

export default function DevLayout({ children }: { children: React.ReactNode }) {
  return children;
}
