import { sectionById, toolsByHue } from "@aio/core";
import { HeroDrop } from "@/components/HeroDrop";
import { ToolCard } from "@/components/ToolCard";
import { Note } from "@/components/ui/Note";
import { PageHead } from "@/components/ui/PageHead";

export const metadata = {
  title: "PDF tools — AllInOne",
  description:
    "Merge, split, rotate and convert PDFs without uploading them anywhere.",
};

export default function PdfIndex() {
  const section = sectionById("pdf");
  const tools = toolsByHue("pdf");

  return (
    <div className="aio-page">
      <PageHead
        icon="file"
        hue="pdf"
        title="PDF tools"
        blurb={section?.blurb ?? ""}
      />

      {/* Dropping a file is the fastest way in: it picks the tool for you. */}
      <HeroDrop variant="bare" />

      <section>
        <div className="aio-section-head">
          <div>
            <h2>All five, one click away</h2>
            <p>Every one runs in this tab.</p>
          </div>
        </div>
        <div className="aio-p-grid5">
          {tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      <Note icon="shield">
        These run on your device, so they also work with no internet and there
        is nothing stored for you to delete afterwards.
      </Note>
    </div>
  );
}
