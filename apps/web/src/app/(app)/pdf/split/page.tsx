import { Scissors } from "lucide-react";
import { ToolLayout } from "@/components/ui/ToolLayout";
import { SplitTool } from "@/components/pdf/SplitTool";

export const metadata = {
  title: "Split PDF — AllInOne",
  description: "Take out the pages you need, or save every page as its own PDF. Nothing is uploaded.",
};

export default function SplitPage() {
  return (
    <ToolLayout
      icon={Scissors}
      tone="pdf"
      title="Split PDF"
      blurb="Take out the pages you need, or save every page as its own PDF."
      steps={[
        { title: "Add a PDF", body: "We read how many pages it has." },
        { title: "Pick the pages", body: "Type a range like 3-7, 10, or choose every page." },
        { title: "Download", body: "One PDF, or a zip with one file per page." },
      ]}
    >
      <SplitTool />
    </ToolLayout>
  );
}
