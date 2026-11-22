import { TOOLS, isLive } from "@aio/core";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { ToolCard } from "@/components/ui/ToolCard";
import { toneFor, toolIcon } from "@/lib/tool-ui";
import s from "@/components/pdf/Pdf.module.css";

export const metadata = {
  title: "PDF tools — AllInOne",
  description: "Merge, split, rotate and convert PDFs without uploading them anywhere.",
};

export default function PdfIndex() {
  const tools = TOOLS.filter((tool) => tool.href.startsWith("/pdf/"));

  return (
    <div className={s.indexPage}>
      <SectionIntro eyebrow="PDF tools" title="Every PDF job, in this tab" as="h1">
        Merge, split, rotate and convert. Your files never leave this device, so there is nothing to upload and
        nothing to delete afterwards.
      </SectionIntro>

      <ul className={s.toolGrid} aria-label="PDF tools">
        {tools.map((tool) => (
          <li key={tool.slug}>
            {isLive(tool) ? (
              <ToolCard
                href={tool.href}
                icon={toolIcon(tool)}
                tone={toneFor(tool.hue)}
                title={tool.name}
                blurb={tool.blurb}
                action={tool.action}
              />
            ) : (
              <ToolCard
                variant="soon"
                building={tool.status === "building"}
                icon={toolIcon(tool)}
                tone={toneFor(tool.hue)}
                title={tool.name}
                blurb={tool.blurb}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
