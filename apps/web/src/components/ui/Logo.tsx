import Link from "next/link";

/** The working mark: four 9px squares, the first marigold, then the wordmark. */
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
        AllIn<b>One</b>
      </span>
    </Link>
  );
}
