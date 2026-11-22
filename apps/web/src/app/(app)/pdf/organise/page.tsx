import { RotateCw } from "lucide-react";
import { ToolLayout } from "@/components/ui/ToolLayout";
import { OrganiseTool } from "@/components/pdf/OrganiseTool";

export const metadata = {
  title: "Rotate & delete pages — AllInOne",
  description: "Turn sideways pages the right way up and drop the ones you don’t need. Nothing is uploaded.",
};

export default function OrganisePage() {
  return (
    <ToolLayout
      icon={RotateCw}
      tone="pdf"
      title="Rotate & delete pages"
      blurb="Turn sideways pages the right way up and drop the ones you don’t need."
      steps={[
        { title: "Add a PDF", body: "Every page is drawn so you can see it." },
        { title: "Rotate or delete", body: "Use the buttons under each page. Tap delete again to keep it." },
        { title: "Save", body: "Download a new PDF with your changes." },
      ]}
    >
      <OrganiseTool />
    </ToolLayout>
  );
}
