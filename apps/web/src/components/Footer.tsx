import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";

const COLUMNS = [
  {
    heading: "PDF tools",
    links: [
      { label: "Merge PDF", href: "/pdf/merge" },
      { label: "Split PDF", href: "/pdf/split" },
      { label: "Rotate pages", href: "/pdf/organise" },
      { label: "PDF to images", href: "/pdf/to-images" },
      { label: "Images to PDF", href: "/pdf/from-images" },
    ],
  },
  {
    heading: "Career",
    links: [
      { label: "Find jobs", href: "/jobs" },
      { label: "Resume builder", href: "/resume" },
      { label: "ATS score check", href: "/ats" },
    ],
  },
  {
    heading: "Tax & AI",
    links: [
      { label: "Income tax calculator", href: "/tax" },
      { label: "ITR filing help", href: "/tax" },
      { label: "AI chat", href: "/ai" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/" },
      { label: "Privacy", href: "/" },
      { label: "Terms", href: "/" },
      { label: "Contact", href: "/" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="aio-footer">
      <div className="aio-footer-grid">
        <div>
          <Logo />
          <p>
            PDFs, jobs, resumes, tax and AI — your paperwork in one window.
            Files are processed on your device.
          </p>
        </div>

        {COLUMNS.map((column) => (
          <div key={column.heading}>
            <h6>{column.heading}</h6>
            <ul>
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="aio-footer-bottom">
        <span>&copy; 2026 AllInOne &middot; Made in India</span>
        <div className="aio-row">
          <span className="aio-row">
            <Icon name="shield" />
            Files never leave your device
          </span>
        </div>
      </div>
    </footer>
  );
}
