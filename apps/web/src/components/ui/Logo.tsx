import Link from "next/link";

/**
 * The brand mark: a gradient tile holding three squares and a sparkle, then
 * the lowercase wordmark. The four <i> elements are what components.css
 * styles — the last one is clipped into the sparkle.
 */
export function Logo({
  href = "/",
  style,
}: {
  href?: string;
  style?: React.CSSProperties;
}) {
  return (
    <Link className="aio-logo" href={href} style={style}>
      <span className="aio-logo-mark" aria-hidden>
        <i />
        <i />
        <i />
        <i />
      </span>
      <span>
        allin<b>one</b>
      </span>
    </Link>
  );
}
