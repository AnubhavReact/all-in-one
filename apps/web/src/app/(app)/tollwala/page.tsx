import type { Metadata } from "next";
import {
  ArrowUpRight,
  BatteryCharging,
  Calculator,
  Cctv,
  Clock,
  Gavel,
  Headset,
  LayoutDashboard,
  Phone,
  Ticket,
  Printer,
  ScanLine,
  ScanText,
  Server,
  Tag,
  TrafficCone,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DemoWindow, type DemoStep } from "@/components/ui/DemoWindow";
import { FeatureItem } from "@/components/ui/FeatureItem";
import { IconTile } from "@/components/ui/IconTile";
import { Accent, SectionIntro } from "@/components/ui/SectionIntro";
import { TOLL_SOFTWARE_STEPS, TOLL_SUPPORT_STEPS, TOLL_TOOLS_STEPS } from "@/components/ui/demos/TollDemo";
import s from "@/components/learn/Learn.module.css";
import h from "./TollWala.module.css";
import { LaneScene } from "@/components/tollwala/LaneScene";
import { TollWalaLogo } from "@/components/tollwala/TollWalaLogo";

export const metadata: Metadata = {
  title: "Toll plaza solutions · TollWala · AllInOne",
  description:
    "TollWala keeps toll lanes on India's national highways running: 24×7 plaza support, toll-management software and free toll tools.",
};

const SITE = "https://tollwala.netlify.app";
/** TollWala's published 24×7 line. */
const PHONE = "+917007616634";

const POINTS = ["On call 24×7", "Remote-first fixes", "Hindi & English", "Based in Noida"];

type Part = {
  id: string;
  number: string;
  area: string;
  headline: string;
  body: string;
  stats: { value: string; label: string }[];
  open: { label: string; href: string };
  links: { label: string; href: string }[];
  demo: { title: string; steps: DemoStep[] };
  features: { icon: LucideIcon; title: string; body: string }[];
  card: { icon: LucideIcon; pitch: string; stat: string };
};

/** Everything here is taken from TollWala's own site. */
const PARTS: Part[] = [
  {
    id: "support",
    number: "01",
    area: "Toll plaza support",
    headline: "Lane down at 3 a.m.? They pick up",
    body: "A Noida team on call 24×7, every day of the year, for the equipment that keeps a toll lane moving. Try the lane troubleshooter first, then raise a ticket and follow it until it's closed.",
    stats: [
      { value: "24×7", label: "Toll SOS line" },
      { value: "4", label: "service lines: support, hourly IT, AMC, software" },
      { value: "Noida", label: "base" },
    ],
    open: { label: "Open TollWala", href: SITE },
    links: [
      { label: "Raise a ticket", href: `${SITE}/#ticket` },
      { label: "Track a ticket", href: `${SITE}/track/` },
    ],
    demo: { title: "TollWala · Lane troubleshooter", steps: TOLL_SUPPORT_STEPS },
    features: [
      { icon: ScanLine, title: "FASTag and RFID readers", body: "Readers that stop reading tags, replaced or repaired." },
      { icon: TrafficCone, title: "Boom barriers", body: "Barriers and their controllers." },
      { icon: Printer, title: "Receipt printers and lane PCs", body: "The kit at the booth." },
      { icon: BatteryCharging, title: "UPS and power backup", body: "So a power cut doesn't close a lane." },
      { icon: Cctv, title: "Plaza network and CCTV", body: "Cabling, switches and cameras." },
      { icon: Clock, title: "Hourly IT or a yearly AMC", body: "Book by the hour, or cover a year at a fixed cost with planned visits." },
    ],
    card: { icon: Headset, pitch: "On call for the equipment that keeps a lane moving.", stat: "24×7 · 365 days" },
  },
  {
    id: "software",
    number: "02",
    area: "Software",
    headline: "Five plaza tools, one login",
    body: "Software for plaza owners and managers: see every lane live, reconcile each shift, catch plates that don't match their FASTag, and pull vehicle numbers out of CCTV footage.",
    stats: [
      { value: "5", label: "products" },
      { value: "1", label: "login for all of them" },
    ],
    open: { label: "Open TollWala", href: SITE },
    links: [],
    demo: { title: "TollWala · Portal", steps: TOLL_SOFTWARE_STEPS },
    features: [
      { icon: LayoutDashboard, title: "TollWala Portal", body: "Live lane status, collection and open tickets." },
      { icon: Server, title: "TMS", body: "Crossings by lane, vehicle class and payment mode; shift reconciliation." },
      { icon: ScanText, title: "ANPR", body: "Number plates matched with FASTag data, with mismatch alerts." },
      { icon: Cctv, title: "Number Extractor", body: "Vehicle numbers from CCTV video or image batches, as a CSV." },
      { icon: Tag, title: "Tag Fetch", body: "FASTag status and class, looked up by vehicle number." },
    ],
    card: { icon: LayoutDashboard, pitch: "Lanes, shifts and plates for plaza owners and managers.", stat: "5 products" },
  },
  {
    id: "tools",
    number: "03",
    area: "Free toll tools",
    headline: "Work out a toll before you drive",
    body: "Three free calculators for drivers, plaza managers and contractors. No login, and your numbers stay on your device.",
    stats: [
      { value: "3", label: "free tools" },
      { value: "₹0", label: "no login" },
    ],
    open: { label: "Open the free tools", href: `${SITE}/tools/` },
    links: [{ label: "Toll calculator", href: `${SITE}/tools/toll-calculator/` }],
    demo: { title: "TollWala · Toll calculator", steps: TOLL_TOOLS_STEPS },
    features: [
      { icon: Calculator, title: "Toll calculator", body: "FASTag, UPI (×1.25) and cash (×2) pricing for a trip." },
      { icon: Wallet, title: "Plaza expense manager", body: "Keep track of what running a plaza costs." },
      { icon: Gavel, title: "Bid calculator", body: "Work out a bid for a plaza contract." },
    ],
    card: { icon: Calculator, pitch: "Toll, plaza expense and bid calculators.", stat: "3 tools · no login" },
  },
];

function ExtLink({ href, children, className }: { href: string; children: React.ReactNode; className: string }) {
  return (
    <a className={className} href={href} target="_blank" rel="noopener">
      {children}
      <ArrowUpRight aria-hidden strokeWidth={1.8} />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

/**
 * TollWala is a separate site, so this page says what it does, with sample
 * run-throughs, before sending anyone there.
 */
export default function TollWalaPage() {
  return (
    <>
      <section className={s.hero} aria-labelledby="toll-title">
        <div className={h.top}>
        <div className={s.heroCopy}>
          <TollWalaLogo />
          <h1 id="toll-title" className="t-display-l">
            Keep toll lanes moving, <Accent>24×7</Accent>
          </h1>
          <p className="t-body-l">
            TollWala is a Noida team that supports toll plazas on India&apos;s national highways: round-the-clock
            plaza support, software for operators, and free toll tools for everyone. It&apos;s a separate site that
            opens in a new tab.
          </p>
          <div className={h.ctas}>
            <Button variant="primary" size="lg" icon={Ticket} href={`${SITE}/#ticket`} external>
              Raise a ticket
            </Button>
            <Button size="lg" icon={Phone} href={`tel:${PHONE}`}>
              Call 24×7
            </Button>
          </div>
          <ul className={h.points}>
            {POINTS.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
        <LaneScene />
        </div>
        <div className={s.cards}>
          {PARTS.map((part) => (
            <a key={part.id} className={s.card} href={`#${part.id}`}>
              <IconTile icon={part.card.icon} tone="brand" />
              <strong className={s.name}>{part.area}</strong>
              <span className={s.area}>{part.number}</span>
              <p className={s.pitch}>{part.card.pitch}</p>
              <span className={s.stat}>{part.card.stat}</span>
              <span className={s.go}>See how it works &darr;</span>
            </a>
          ))}
        </div>
      </section>

      {PARTS.map((part) => (
        <section key={part.id} id={part.id} className={s.section} aria-labelledby={`${part.id}-title`}>
          <div className={s.text}>
            <SectionIntro eyebrow={`${part.number} · ${part.area}`} title={part.headline} id={`${part.id}-title`}>
              {part.body}
            </SectionIntro>
            <dl className={s.stats}>
              {part.stats.map((stat) => (
                <div key={stat.label}>
                  <dt>{stat.label}</dt>
                  <dd>{stat.value}</dd>
                </div>
              ))}
            </dl>
            <div className={s.actions}>
              <Button variant="primary" href={part.open.href} external iconRight={ArrowUpRight}>
                {part.open.label}
              </Button>
              {part.links.map((link) => (
                <ExtLink key={link.href} href={link.href} className={s.link}>
                  {link.label}
                </ExtLink>
              ))}
            </div>
          </div>
          <div className={s.demo}>
            <DemoWindow title={part.demo.title} steps={part.demo.steps} />
          </div>
          <div className={s.features}>
            {part.features.map((f) => (
              <FeatureItem key={f.title} icon={f.icon} tone="brand" title={f.title}>
                {f.body}
              </FeatureItem>
            ))}
          </div>
        </section>
      ))}

      <section className={s.closing} aria-labelledby="toll-note">
        <div>
          <h2 id="toll-note" className="t-h3">
            Good to know
          </h2>
          <p>
            TollWala is not affiliated with NHAI or IHMCL. Fees in its tools are a guide; check the official NHAI fee
            lookup before you rely on them. The demos above use sample data.
          </p>
        </div>
        <Button variant="primary" href={SITE} external iconRight={ArrowUpRight}>
          Visit TollWala
        </Button>
      </section>
    </>
  );
}
