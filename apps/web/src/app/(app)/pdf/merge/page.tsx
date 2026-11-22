import { Combine } from "lucide-react";
import { ToolLayout } from "@/components/ui/ToolLayout";
import { MergeTool } from "@/components/pdf/MergeTool";

export const metadata = {
  title: "Merge PDFs — AllInOne",
  description: "Combine PDFs into one file, in the order you choose, without uploading them.",
};

export default function MergePage() {
  return (
    <ToolLayout
      icon={Combine}
      tone="pdf"
      title="Merge PDFs"
      blurb="Put two or more PDFs in the order you want and save them as one file."
      steps={[
        { title: "Add your PDFs", body: "Drop them in or pick them. We count the pages of each." },
        { title: "Set the order", body: "Drag a file by its handle, or use Space and the arrow keys." },
        { title: "Merge and download", body: "One PDF, built in this tab. Nothing is uploaded." },
      ]}
    >
      <MergeTool />
    </ToolLayout>
  );
}
