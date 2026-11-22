import clsx from "clsx";
import { ShieldCheck } from "lucide-react";
import s from "./Cards.module.css";

export function PrivacyCard({
  title = "Your files stay here",
  children,
}: {
  title?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className={clsx(s.panel, s.privacy)} aria-label="Privacy">
      <ShieldCheck aria-hidden strokeWidth={1.8} />
      <h3>{title}</h3>
      <p>{children ?? "Everything runs in this browser tab. Nothing is sent to a server."}</p>
      <span className={s.bytes}>0 bytes uploaded</span>
    </section>
  );
}
