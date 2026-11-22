import type { Metadata } from "next";
import { IndianRupee } from "lucide-react";
import { TAX_YEAR } from "@aio/core";
import { ToolLayout } from "@/components/ui/ToolLayout";
import { TaxCalculator } from "@/components/tax/TaxCalculator";

export const metadata: Metadata = {
  title: `Tax calculator, FY ${TAX_YEAR}`,
  description: `Old regime against new for FY ${TAX_YEAR}, slab by slab. Runs in your browser; nothing is sent.`,
};

export default function TaxPage() {
  return (
    <ToolLayout
      icon={IndianRupee}
      tone="tax"
      title="Tax calculator"
      blurb={`Old regime against new for FY ${TAX_YEAR}, slab by slab, so you can see where every rupee of tax comes from.`}
      steps={[
        { title: "Enter your salary", body: "Add basic pay too if you get HRA or employer NPS." },
        { title: "Add your deductions", body: "80C, 80D, HRA and the rest. Only the old regime uses them." },
        { title: "Compare the two", body: "See which regime costs less, and why, slab by slab." },
      ]}
      privacyTitle="Your numbers stay here"
      privacy="Your numbers stay in this tab. Nothing is saved or sent."
    >
      <TaxCalculator />
    </ToolLayout>
  );
}
