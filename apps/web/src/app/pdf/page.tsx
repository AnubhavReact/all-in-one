import Link from "next/link";
import { categoryById, toolsByCategory } from "@aio/core";

export const metadata = {
  title: "PDF tools — All In One",
  description:
    "Merge, split, rotate and convert PDFs without uploading them anywhere.",
};

export default function PdfIndex() {
  const cat = categoryById("pdf");
  const tools = toolsByCategory("pdf");

  return (
    <div className="space-y-8">
      <header className="space-y-3 border-b-2 border-ink pb-6">
        <div className="flex items-center gap-2.5">
          <span className={`h-3 w-3 ${cat.chip}`} aria-hidden />
          <span className="text-[13px] font-medium text-ink-70">PDF</span>
        </div>
        <h1 className="text-3xl font-extrabold md:text-4xl">PDF tools</h1>
        <p className="max-w-[62ch] text-[15px] leading-relaxed text-ink-70">
          Each of these runs inside this tab. Your file is never uploaded, so
          they also work with no internet and there is nothing to delete
          afterwards.
        </p>
      </header>

      <ul className="grid gap-3 sm:grid-cols-2">
        {tools.map((tool) => (
          <li key={tool.slug}>
            <Link
              href={tool.href}
              className="block h-full rounded-tile border-2 border-rule bg-card p-5 hover:border-ink"
            >
              <span className="text-[16px] font-bold">{tool.name}</span>
              <span className="mt-1.5 block text-[13.5px] leading-relaxed text-ink-70">
                {tool.blurb}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
