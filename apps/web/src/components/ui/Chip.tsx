import Link from "next/link";
import clsx from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowRight, Check, type LucideIcon } from "lucide-react";
import s from "./Chip.module.css";

/** A static promise ("No account"). Not interactive, so not a button. */
export function PromiseChip({ children }: { children: ReactNode }) {
  return (
    <span className={clsx(s.chip, s.promise)}>
      <Check aria-hidden strokeWidth={2.2} />
      {children}
    </span>
  );
}

/** A suggestion the user can tap to ask or start something. */
export function SuggestionChip({
  icon: I,
  children,
  className,
  ...rest
}: { icon?: LucideIcon; children: ReactNode } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">) {
  return (
    <button type="button" className={clsx(s.chip, s.tap, s.suggestion, className)} {...rest}>
      {I && <I aria-hidden strokeWidth={1.8} />}
      {children}
    </button>
  );
}

/** A chip that goes somewhere: "Open Merge PDFs →". */
export function LinkChip({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className={clsx(s.chip, s.tap, s.link)}>
      {children}
      <ArrowRight aria-hidden strokeWidth={2} />
    </Link>
  );
}

/** A toggle, for filters. Selected = ink fill. */
export function FilterChip({
  pressed,
  children,
  ...rest
}: { pressed: boolean; children: ReactNode } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "aria-pressed">) {
  return (
    <button type="button" aria-pressed={pressed} className={clsx(s.chip, s.tap, s.filter)} {...rest}>
      {children}
    </button>
  );
}
