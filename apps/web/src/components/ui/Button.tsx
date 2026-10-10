import clsx from "clsx";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "quiet" | "danger";
};

export function Button({ variant = "primary", className, ...rest }: Props) {
  return (
    <button
      {...rest}
      className={clsx(
        "rounded-tile border-2 px-4 py-2 text-[14px] font-semibold transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-40",
        variant === "primary" &&
          "border-ink bg-ink text-paper enabled:hover:bg-card enabled:hover:text-ink",
        variant === "quiet" &&
          "border-rule bg-card text-ink enabled:hover:border-ink",
        variant === "danger" &&
          "border-cat-pdf bg-card text-cat-pdf enabled:hover:bg-cat-pdf enabled:hover:text-card",
        className,
      )}
    />
  );
}
