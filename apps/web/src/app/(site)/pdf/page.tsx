import { sectionById, toolsByHue } from "@aio/core";
import { HeroDrop } from "@/components/HeroDrop";
import { ToolCard } from "@/components/ToolCard";
import { Note } from "@/components/ui/Note";

export const metadata = {
  title: "PDF tools — AllInOne",
  description:
    "Merge, split, rotate and convert PDFs without uploading them anywhere.",
};

export default function PdfIndex() {
  const section = sectionById("pdf");
  const tools = toolsByHue("pdf");

  return (
    <div className="aio-p-sec">
      <div className="aio-p-head">
        <div>
          <span className="aio-eyebrow">PDF tools</span>
          <h1 className="aio-h2">Every PDF job, in this tab.</h1>
          <p className="aio-lead" style={{ marginTop: 12, maxWidth: "62ch" }}>
            {section?.blurb}
          </p>
        </div>
      </div>

      {/* The hero's drop zone moved here when v2 made the home hero an ask
          bar. Dropping a file is still the fastest way into the right tool. */}
      <div style={{ marginBottom: "var(--space-8)", maxWidth: 720 }}>
        <HeroDrop />
      </div>

      <div className="aio-p-grid4">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>

      <div style={{ marginTop: "var(--space-8)", maxWidth: "70ch" }}>
        <Note icon="shield">
          These run on your device, so they also work with no internet and there
          is nothing stored for you to delete afterwards.
        </Note>
      </div>
    </div>
  );
}
