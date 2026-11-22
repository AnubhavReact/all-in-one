"use client";

import { useId, useLayoutEffect, useRef } from "react";
import clsx from "clsx";
import { CircleAlert } from "lucide-react";
import { inr, lakhDigits, words } from "@/lib/format";
import s from "./Field.module.css";

/**
 * A rupee amount, formatted in lakhs while you type.
 *
 * The caret is kept after the same number of digits it was after before the
 * commas moved, so typing in the middle of "18,00,000" doesn't jump to the end.
 */
export function AmountInput({
  label,
  value,
  onChange,
  max,
  capLabel,
  period,
  error,
  placeholder = "0",
}: {
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
  /** Shows "of ₹1,50,000" and an error above it. */
  max?: number;
  /** The name used in the cap message, e.g. "80C". Defaults to the label. */
  capLabel?: string;
  /** "year" adds the monthly figure to the helper line. */
  period?: "year";
  /** An error from the parent. Wins over the cap error. */
  error?: string;
  placeholder?: string;
}) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const caretDigits = useRef<number | null>(null);

  useLayoutEffect(() => {
    const el = input.current;
    const digits = caretDigits.current;
    if (!el || digits === null || document.activeElement !== el) return;
    let pos = 0;
    let seen = 0;
    while (pos < el.value.length && seen < digits) {
      if (/\d/.test(el.value[pos])) seen += 1;
      pos += 1;
    }
    el.setSelectionRange(pos, pos);
    caretDigits.current = null;
  });

  const overCap = max !== undefined && value !== null && value > max;
  const message =
    error ?? (overCap ? `${capLabel ?? label} is capped at ${inr(max)}. Enter ${inr(max)} or less.` : undefined);

  let helper: React.ReactNode = null;
  if (value && !message) {
    helper =
      period === "year" ? (
        <>
          = {words(value)} a year &middot; <b>{inr(value / 12)}</b> a month
        </>
      ) : (
        <>= {words(value)}</>
      );
  }

  return (
    <div className={clsx(s.field, message && s.invalid)}>
      <label className={s.label} htmlFor={id}>
        {label}
        {max !== undefined && <span className={s.cap}>of {inr(max)}</span>}
      </label>
      <div className={s.box}>
        <span className={s.prefix} aria-hidden>
          ₹
        </span>
        <input
          ref={input}
          id={id}
          className={s.input}
          inputMode="numeric"
          autoComplete="off"
          placeholder={placeholder}
          value={value === null ? "" : lakhDigits(value)}
          aria-invalid={message ? true : undefined}
          aria-describedby={message || helper ? `${id}-msg` : undefined}
          onChange={(event) => {
            const raw = event.target.value;
            const caret = event.target.selectionStart ?? raw.length;
            caretDigits.current = raw.slice(0, caret).replace(/\D/g, "").length;
            const digits = raw.replace(/\D/g, "").slice(0, 12);
            onChange(digits === "" ? null : Number(digits));
          }}
        />
      </div>
      {message ? (
        <p id={`${id}-msg`} className={s.error} role="alert">
          <CircleAlert aria-hidden strokeWidth={2} />
          {message}
        </p>
      ) : (
        helper && (
          <p id={`${id}-msg`} className={s.helper}>
            {helper}
          </p>
        )
      )}
    </div>
  );
}
