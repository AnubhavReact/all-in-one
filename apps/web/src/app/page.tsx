import Link from "next/link";
import { CATEGORIES, toolsByCategory } from "@aio/core";
import { DropRouter } from "@/components/DropRouter";

export default function Home() {
  return (
    <div className="space-y-12">
      <DropRouter />

      <section>
        <h2 className="border-b-2 border-ink pb-3 text-[20px] font-extrabold">
          Everything in here
        </h2>

        <div className="mt-7 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat) => {
            const tools = toolsByCategory(cat.id);
            return (
              <div key={cat.id}>
                <div className="flex items-center gap-2.5">
                  <span className={`h-3 w-3 ${cat.chip}`} aria-hidden />
                  <h3 className="text-[16px] font-bold">{cat.name}</h3>
                </div>
                <p className="mt-1.5 max-w-[34ch] text-[13.5px] leading-relaxed text-ink-70">
                  {cat.blurb}
                </p>

                <ul className="mt-4 space-y-1.5">
                  {tools.map((tool) =>
                    tool.ready ? (
                      <li key={tool.slug}>
                        <Link
                          href={tool.href}
                          className="group flex items-center justify-between gap-3 rounded-tile border-2 border-rule bg-card px-3.5 py-2.5 text-[14px] font-medium hover:border-ink"
                        >
                          {tool.name}
                          <span
                            className="text-ink-40 group-hover:text-ink"
                            aria-hidden
                          >
                            &rarr;
                          </span>
                        </Link>
                      </li>
                    ) : (
                      <li
                        key={tool.slug}
                        className="flex items-center justify-between gap-3 rounded-tile border-2 border-dashed border-rule px-3.5 py-2.5 text-[14px] text-ink-40"
                      >
                        {tool.name}
                        <span className="shrink-0 text-[12px]">
                          Not built yet
                        </span>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
