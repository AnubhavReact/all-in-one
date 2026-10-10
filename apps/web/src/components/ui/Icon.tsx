// Icon set ported from the design handoff (scripts/icons.js). The path data is
// copied exactly, so an icon here is the same shape as in the mocks.
//
// 24px line icons, 1.75 stroke, round caps and joins, drawn in currentColor.

export const ICON_PATHS = {
  file: `<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/>`,
  merge: `<path d="M12 3 3 8l9 5 9-5z"/><path d="m3 13 9 5 9-5"/>`,
  split: `<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M8.1 8.1 20 20M8.1 15.9 20 4"/>`,
  rotate: `<path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/>`,
  image: `<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>`,
  compress: `<path d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7"/>`,
  briefcase: `<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/>`,
  resume: `<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><circle cx="12" cy="12" r="2"/><path d="M8.5 17.5a3.5 3.5 0 0 1 7 0"/>`,
  target: `<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>`,
  chat: `<path d="M21 12a8 8 0 0 1-11.7 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>`,
  spark: `<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/>`,
  rupee: `<path d="M6 3h12M6 8h12M15 21 6 13h3a5 5 0 0 0 0-10"/>`,
  calc: `<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M9 6h6M9 11h.01M12 11h.01M15 11h.01M9 15h.01M12 15h.01M15 15v3M9 18h3"/>`,
  home: `<path d="m3 11 9-8 9 8"/><path d="M5 9.5V20h14V9.5"/>`,
  grid: `<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>`,
  search: `<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>`,
  bell: `<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/>`,
  sliders: `<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>`,
  upload: `<path d="M12 15V3M7 8l5-5 5 5M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"/>`,
  download: `<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/>`,
  arrow: `<path d="M5 12h14M13 6l6 6-6 6"/>`,
  chevron: `<path d="m6 9 6 6 6-6"/>`,
  lock: `<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>`,
  check: `<path d="m5 12 5 5L20 7"/>`,
  clipboard: `<rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4h6v3H9zM9 12h6M9 16h4"/>`,
  moon: `<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>`,
  shield: `<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="m9 12 2 2 4-4"/>`,
  pin: `<path d="M12 21s7-6 7-12a7 7 0 0 0-14 0c0 6 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/>`,
  clock: `<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>`,
  plus: `<path d="M12 5v14M5 12h14"/>`,
  pen: `<path d="M4 20h4L19 9l-4-4L4 16z"/>`,
  menu: `<path d="M4 7h16M4 12h16M4 17h16"/>`,
  send: `<path d="M21 3 10 14M21 3l-7 18-4-7-7-4z"/>`,

  // v2 handoff additions: the AI sparkle and the ask-bar controls.
  ai: `<path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>`,
  clip: `<path d="m21 11-8.6 8.6a5 5 0 0 1-7-7L14 4a3.3 3.3 0 0 1 4.7 4.7l-8.6 8.6a1.7 1.7 0 0 1-2.4-2.4L15.5 7"/>`,
  mic: `<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>`,
  x: `<path d="M6 6l12 12M18 6 6 18"/>`,
  enter: `<path d="M20 5v7a3 3 0 0 1-3 3H5"/><path d="m9 11-4 4 4 4"/>`,
  zap: `<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>`,
  expand: `<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>`,
} as const;

export type IconName = keyof typeof ICON_PATHS;

export function Icon({
  name,
  size,
  className,
}: {
  name: string;
  /** Overrides the 18px the stylesheet sets. */
  size?: number;
  className?: string;
}) {
  return (
    <svg
      className={className ? `i ${className}` : "i"}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      style={size ? { width: size, height: size } : undefined}
      dangerouslySetInnerHTML={{ __html: ICON_PATHS[name as IconName] ?? ICON_PATHS.file }}
    />
  );
}
