import Link from "next/link";
import { categoryById, type CategoryId } from "@aio/core";

export function ToolShell({
  category,
  title,
  blurb,
  children,
}: {
  category: CategoryId;
  title: string;
  blurb: string;
  children: React.ReactNode;
}) {
  const cat = categoryById(category);
  return (
    <div className="space-y-8">
      <header className="space-y-3 border-b-2 border-ink pb-6">
        <Link
          href={`/${cat.id}`}
          className="inline-flex items-center gap-2 text-[13px] font-medium text-ink-70 hover:text-ink"
        >
          <span className={`h-2 w-2 ${cat.chip}`} aria-hidden />
          {cat.name}
        </Link>
        <h1 className="text-3xl font-extrabold md:text-4xl">{title}</h1>
        <p className="max-w-[62ch] text-[15px] leading-relaxed text-ink-70">
          {blurb}
        </p>
      </header>
      {children}
    </div>
  );
}
