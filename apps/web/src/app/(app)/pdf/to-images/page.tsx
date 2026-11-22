import { FileImage } from "lucide-react";
import { ToolLayout } from "@/components/ui/ToolLayout";
import { ToImagesTool } from "@/components/pdf/ToImagesTool";

export const metadata = {
  title: "PDF to images — AllInOne",
  description: "Save every page as a JPG or PNG. Many pages come down as one zip. Nothing is uploaded.",
};

export default function ToImagesPage() {
  return (
    <ToolLayout
      icon={FileImage}
      tone="pdf"
      title="PDF to images"
      blurb="Save every page as a JPG or PNG. Many pages come down as one zip."
      steps={[
        { title: "Add a PDF", body: "Any size works. Big ones just take longer." },
        { title: "Pick format and quality", body: "JPG is smaller, PNG is sharper. Print doubles the detail." },
        { title: "Download", body: "One image, or a zip with every page." },
      ]}
    >
      <ToImagesTool />
    </ToolLayout>
  );
}
