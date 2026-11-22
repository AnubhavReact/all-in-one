"use client";

import { useId, useState } from "react";
import { CircleAlert, Scissors } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DropZone } from "@/components/ui/DropZone";
import { Segmented } from "@/components/ui/Segmented";
import { checkPageRange } from "./range";
import { baseName } from "@/lib/download";
import { plural } from "./files";
import { ActionBar, ErrorNote, FileRow, ResultCard, Working } from "./Parts";
import { remember, toBlob, type Result } from "./save";
import { useSinglePdf } from "./useSinglePdf";
import s from "./Pdf.module.css";

type Mode = "range" | "every";

/** "3, 4, 5, 6, 7, 10" — or the first few and a count for long picks. */
function listPages(pages: number[]) {
  const shown = pages.slice(0, 12).map((i) => i + 1).join(", ");
  return pages.length > 12 ? `${shown} and ${pages.length - 12} more` : shown;
}

export function SplitTool() {
  const pdf = useSinglePdf();
  const [mode, setMode] = useState<Mode>("range");
  const [range, setRange] = useState("");
  const [touched, setTouched] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number; label: string } | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const ids = { input: useId(), help: useId(), err: useId() };

  const total = pdf.item?.pages ?? 0;
  const check = checkPageRange(range, total);
  const showError = mode === "range" && !check.ok && (touched || range.trim() !== "") && range.trim() !== "";

  function reset() {
    pdf.clear();
    setResult(null);
    setRange("");
    setTouched(false);
    setMode("range");
  }

  async function run() {
    const item = pdf.item;
    if (!item) return;
    const base = baseName(item.file.name);
    try {
      const { extractPages } = await import("@/lib/pdf");
      let done: Result;
      if (mode === "range") {
        if (!check.ok) return;
        setProgress({ done: 0, total: 1, label: `Saving ${plural(check.pages.length, "page")} in this tab…` });
        const data = await extractPages(item.file, check.pages);
        done = {
          blob: toBlob(data, "application/pdf"),
          name: `${base}-pages.pdf`,
          facts: [plural(check.pages.length, "page")],
        };
      } else {
        const { default: JSZip } = await import("jszip");
        const zip = new JSZip();
        const width = String(total).length;
        for (let index = 0; index < total; index++) {
          setProgress({ done: index, total, label: `Splitting page ${index + 1} of ${total} in this tab…` });
          const data = await extractPages(item.file, [index]);
          zip.file(`${base}-${String(index + 1).padStart(width, "0")}.pdf`, data);
        }
        setProgress({ done: total, total, label: "Packing the zip…" });
        const archive = await zip.generateAsync({ type: "uint8array" });
        done = { blob: toBlob(archive, "application/zip"), name: `${base}-pages.zip`, facts: [plural(total, "PDF")] };
      }
      remember(done, "Split PDF", "split");
      setResult(done);
    } catch {
      pdf.setError("This PDF couldn't be split. Check it opens in a PDF reader.");
    } finally {
      setProgress(null);
    }
  }

  if (result) return <ResultCard result={result} onReset={reset} />;
  if (progress) return <Working label={progress.label} done={progress.done} total={progress.total} />;
  if (pdf.loading) return <Working label="Reading the PDF…" done={0} total={1} />;
  if (!pdf.item) {
    return <DropZone files={[]} error={pdf.error} onFiles={pdf.accept} onRemove={() => {}} noun="a PDF" />;
  }

  const ready = mode === "every" ? total > 1 : check.ok;
  const label =
    mode === "every"
      ? total > 1
        ? `Split into ${total} PDFs`
        : "This PDF has 1 page"
      : check.ok
        ? `Save ${plural(check.pages.length, "page")}`
        : range.trim()
          ? "Fix the page range"
          : "Type the pages first";

  return (
    <div className={s.stack}>
      <FileRow item={pdf.item} onRemove={reset} />
      {pdf.error && <ErrorNote>{pdf.error}</ErrorNote>}

      <div className={s.panel}>
        <Segmented<Mode>
          legend="What do you want?"
          value={mode}
          onChange={setMode}
          options={[
            { value: "range", label: "Pick pages" },
            { value: "every", label: "Every page, own file" },
          ]}
        />

        {mode === "range" ? (
          <div className={s.field}>
            <label className={s.label} htmlFor={ids.input}>
              Pages to keep
            </label>
            <input
              id={ids.input}
              className={s.input}
              value={range}
              inputMode="numeric"
              autoComplete="off"
              placeholder="e.g. 3-7, 10"
              aria-invalid={showError}
              aria-describedby={showError ? `${ids.err} ${ids.help}` : ids.help}
              onChange={(event) => setRange(event.target.value)}
              onBlur={() => setTouched(true)}
            />
            {showError && !check.ok && (
              <p id={ids.err} className={s.fieldError} role="alert">
                <CircleAlert aria-hidden strokeWidth={2} />
                {check.error}
              </p>
            )}
            <p id={ids.help} className={s.helper} aria-live="polite">
              {check.ok ? (
                <>
                  Keeps <b>{check.pages.length}</b> of <b>{total}</b>: <b>{listPages(check.pages)}</b>
                </>
              ) : (
                <>
                  Commas and dashes, like a print dialog. This PDF has <b>{total}</b>{" "}
                  {total === 1 ? "page" : "pages"}.
                </>
              )}
            </p>
          </div>
        ) : (
          <p className={s.helper}>
            You get a zip with <b>{total}</b> {total === 1 ? "PDF" : "PDFs"}, one for each page.
          </p>
        )}
      </div>

      <ActionBar total={`${plural(total, "page")} in this PDF`}>
        <Button variant="primary" icon={Scissors} onClick={run} disabled={!ready}>
          {label}
        </Button>
      </ActionBar>
    </div>
  );
}
