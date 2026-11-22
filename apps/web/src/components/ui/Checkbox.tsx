"use client";

import s from "./Field.module.css";

export function Checkbox({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className={s.check}>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <strong>{label}</strong>
      {description && <small>{description}</small>}
    </label>
  );
}
