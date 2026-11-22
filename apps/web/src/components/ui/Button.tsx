import Link from "next/link";
import clsx from "clsx";
import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import s from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "onBrand" | "onBrandOutline";

type Common = {
  variant?: ButtonVariant;
  size?: "md" | "lg";
  icon?: LucideIcon;
  iconRight?: LucideIcon;
  block?: boolean;
  className?: string;
  children: ReactNode;
};

type AsButton = Common & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & { href?: undefined };
type AsLink = Common & { href: string; external?: boolean };

export function buttonClass({ variant = "secondary", size = "md", block, className }: Partial<Common>) {
  return clsx(s.btn, s[variant], size === "lg" && s.lg, block && s.block, className);
}

/**
 * The one button. `primary` is the filled indigo action — use it once per
 * view. A disabled button keeps a label that says what is needed
 * ("Add 2+ PDFs"), never just a greyed "Merge".
 */
export function Button(props: AsButton | AsLink) {
  const { variant, size, icon: Lead, iconRight: Trail, block, className, children } = props;
  const cls = buttonClass({ variant, size, block, className });
  const inner = (
    <>
      {Lead && <Lead aria-hidden strokeWidth={1.8} />}
      {children}
      {Trail && <Trail aria-hidden strokeWidth={1.8} />}
    </>
  );

  if (props.href !== undefined) {
    const { href, external } = props as AsLink;
    if (external) {
      return (
        <a className={cls} href={href} target="_blank" rel="noopener">
          {inner}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      );
    }
    return (
      <Link className={cls} href={href}>
        {inner}
      </Link>
    );
  }

  const {
    variant: _v, size: _s, icon: _i, iconRight: _r, block: _b, className: _c, children: _ch,
    type = "button", ...rest
  } = props as AsButton;
  void _v; void _s; void _i; void _r; void _b; void _c; void _ch;
  return (
    <button type={type} className={cls} {...rest}>
      {inner}
    </button>
  );
}

/** A 44×44 icon-only button. The label is required: it is all a screen reader gets. */
export function IconButton({
  icon: I,
  label,
  outline,
  className,
  ...rest
}: { icon: LucideIcon; label: string; outline?: boolean } & Omit<ComponentProps<"button">, "children">) {
  return (
    <button type="button" aria-label={label} className={clsx(s.iconBtn, outline && s.iconBtnOutline, className)} {...rest}>
      <I aria-hidden strokeWidth={1.8} />
    </button>
  );
}
