import { CheckCircle2, Download, FileText, Upload } from "lucide-react";
import type { DemoStep } from "../DemoWindow";
import s from "./Scenes.module.css";

type F = { name: string; pages: number; size: string };
const OFFER: F = { name: "offer-letter.pdf", pages: 2, size: "412 KB" };
const SLIP: F = { name: "salary-slip-oct.pdf", pages: 1, size: "184 KB" };
const DEGREE: F = { name: "degree.pdf", pages: 1, size: "920 KB" };

function Row({ file, picked }: { file: F; picked?: boolean }) {
  return (
    <div className={picked ? `${s.row} ${s.picked}` : s.row}>
      <span className={s.ficon}>
        <FileText strokeWidth={1.8} />
      </span>
      <strong>{file.name}</strong>
      <span className={s.mono}>
        {file.pages}p · {file.size}
      </span>
    </div>
  );
}

/** Sample data only: three made-up files, four pages in all. */
export const MERGE_STEPS: DemoStep[] = [
  {
    caption: "Drop your PDFs in",
    render: (
      <div className={s.col}>
        <div className={s.drop}>
          <Upload width={18} height={18} strokeWidth={1.8} />
          Drop PDFs here
        </div>
        <Row file={OFFER} />
        <Row file={SLIP} />
        <Row file={DEGREE} />
      </div>
    ),
  },
  {
    caption: "Drag them into the order you want",
    render: (
      <div className={s.col}>
        <span className={s.label}>Order</span>
        <Row file={OFFER} />
        <Row file={DEGREE} picked />
        <Row file={SLIP} />
      </div>
    ),
  },
  {
    caption: "Merging 4 pages in this tab",
    render: (
      <div className={s.center}>
        <span className={s.big}>Merging 4 pages…</span>
        <div className={s.progressBar} style={{ width: "70%" }}>
          <i />
        </div>
        <span className={`${s.mono} ${s.ok}`}>0 bytes uploaded</span>
      </div>
    ),
  },
  {
    caption: "merged.pdf is ready to download",
    render: (
      <div className={s.center}>
        <span className={s.okTile}>
          <CheckCircle2 strokeWidth={1.8} />
        </span>
        <span className={s.big}>merged.pdf is ready</span>
        <span className={s.mono}>4 pages · 1.5 MB · 0 bytes uploaded</span>
        <span className={s.fakeBtn}>
          <Download strokeWidth={2} />
          Download
        </span>
      </div>
    ),
  },
];
