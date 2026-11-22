import type { ReactNode } from "react";
import { Button } from "./Button";
import s from "./Cards.module.css";

/**
 * A solid indigo band. The white button is the view's primary action, so
 * nothing else on the same screen should be filled.
 */
export function CTABand({
  title,
  children,
  primary,
  secondary,
}: {
  title: ReactNode;
  children?: ReactNode;
  primary: { label: string; href: string };
  /** Usually an outline-white "Ask AVTAR" button (variant="onBrandOutline"). */
  secondary?: ReactNode;
}) {
  return (
    <section className={s.cta}>
      <div>
        <h2>{title}</h2>
        {children && <p>{children}</p>}
      </div>
      <div className={s.actions}>
        <Button variant="onBrand" size="lg" href={primary.href}>
          {primary.label}
        </Button>
        {secondary}
      </div>
    </section>
  );
}
