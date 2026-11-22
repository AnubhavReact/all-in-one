import s from "./TollWalaLogo.module.css";

/** TollWala's mark as on its own site: a striped barrier arm on a navy tile. */
export function TollWalaLogo() {
  return (
    <span className={s.logo}>
      <svg className={s.mark} viewBox="0 0 48 48" aria-hidden>
        <rect width="48" height="48" rx="11" className={s.tile} />
        <rect x="12" y="27" width="5" height="13" rx="2" className={s.post} />
        <g transform="rotate(-32 14 29)">
          <rect x="12" y="25" width="28" height="7" rx="3.5" className={s.armBody} />
          {[0, 1, 2].map((i) => (
            <rect key={i} x={17 + i * 8} y="25" width="4" height="7" className={s.armGap} />
          ))}
        </g>
        <circle cx="38" cy="13" r="4" className={s.dot} />
      </svg>
      <span className={s.words}>
        <strong>
          Toll<span>Wala</span>
        </strong>
        <small>Solution · Noida</small>
      </span>
    </span>
  );
}
