import { Images } from "lucide-react";
import { ToolLayout } from "@/components/ui/ToolLayout";
import { FromImagesTool } from "@/components/pdf/FromImagesTool";

export const metadata = {
  title: "Images to PDF — AllInOne",
  description: "Turn photos and scans into one PDF, in the order you choose. Nothing is uploaded.",
};

export default function FromImagesPage() {
  return (
    <ToolLayout
      icon={Images}
      tone="pdf"
      title="Images to PDF"
      blurb="Turn photos and scans into one PDF, in the order you choose."
      steps={[
        { title: "Add images", body: "JPG and PNG work. Each one becomes a page." },
        { title: "Set order and layout", body: "Drag to reorder, then pick page size and margins." },
        { title: "Make the PDF", body: "Built in this tab and ready to download." },
      ]}
    >
      <FromImagesTool />
    </ToolLayout>
  );
}
