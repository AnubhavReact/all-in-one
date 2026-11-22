"use client";

import { useId } from "react";
import s from "./Field.module.css";

/**
 * A radio group that looks like a segmented control. Native radios give us
 * arrow keys, one tab stop and the right announcements for free.
 */
export function Segmented<T extends string>({
  legend,
  options,
  value,
  onChange,
}: {
  legend: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  const name = useId();
  return (
    <fieldset className={s.seg}>
      <legend>{legend}</legend>
      <div className={s.track}>
        {options.map((option) => (
          <label key={option.value} className={s.opt}>
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
