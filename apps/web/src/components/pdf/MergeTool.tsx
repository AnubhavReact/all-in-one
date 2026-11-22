"use client";

import { useEffect, useState } from "react";
import { Combine } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DropZone } from "@/components/ui/DropZone";
import { isPdf, pick, plural, rejectMessage, type Picked } from "./files";
import { ActionBar, AddMore, ErrorNote, ResultCard, Working } from "./Parts";
import { takeHandOff } from "@/lib/handoff";
import { remember, toBlob, type Result } from "./save";
import { SortableList } from "./SortableList";
import s from "./Pdf.module.css";

const ACCEPT = ".pdf,application/pdf";

/** empty → files added (and reordered) → merging → done */
export function MergeTool() {
  const [files, setFiles] = useState<Picked[]>([]);
  const [error, setError] = useState<string>();
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  const counted = files.every((f) => f.pages !== undefined);
  const pages = files.reduce((sum, f) => sum + (f.pages ?? 0), 0);

  function add(dropped: File[]) {
    const good = dropped.filter(isPdf).map(pick);
    const bad = dropped.filter((f) => !isPdf(f));
    const kept = files.length + good.length;
    setError(bad.length ? rejectMessage(bad, kept, "pdf") : undefined);
    if (!good.length) return;
    setFiles((current) => [...current, ...good]);

    // The page count tells people they picked the right file. pdf-lib is
    // only fetched once the first file arrives.
    void import("@/lib/pdf").then(({ pageCount }) => {
      for (const item of good) {
        pageCount(item.file)
          .then((count) =>
            setFiles((current) => current.map((f) => (f.id === item.id ? { ...f, pages: count } : f))),
          )
          .catch(() => {
            setFiles((current) => current.filter((f) => f.id !== item.id));
            setError(`${item.file.name} couldn't be opened. It may be damaged; check it opens in a PDF reader.`);
          });
      }
    });
  }

  // PDFs dropped on the home page arrive here after navigation.
  useEffect(() => {
    const handed = takeHandOff();
    if (handed.length) queueMicrotask(() => add(handed));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function remove(id: string) {
    setFiles((current) => current.filter((f) => f.id !== id));
    setError(undefined);
  }

  async function merge() {
    setError(undefined);
    setProgress({ done: 0, total: files.length });
    try {
      const { mergeDocuments } = await import("@/lib/pdf");
      const data = await mergeDocuments(
        files.map((f) => f.file),
        (done, total) => setProgress({ done, total }),
      );
      const done: Result = {
        blob: toBlob(data, "application/pdf"),
        name: "merged.pdf",
        facts: [plural(pages, "page")],
      };
      remember(done, "Merge PDFs", "merge");
      setResult(done);
    } catch {
      setError("One of these files couldn't be read. Remove it, or check it opens in a PDF reader.");
    } finally {
      setProgress(null);
    }
  }

  function reset() {
    setFiles([]);
    setResult(null);
    setError(undefined);
  }

  if (result) return <ResultCard result={result} onReset={reset} />;

  if (progress) {
    return (
      <Working
        label={`Merging ${plural(pages, "page")} in this tab…`}
        done={progress.done}
        total={progress.total}
      />
    );
  }

  if (files.length === 0) {
    return <DropZone files={[]} error={error} onFiles={add} onRemove={() => {}} accept={ACCEPT} noun="PDFs" />;
  }

  return (
    <div className={s.stack}>
      <SortableList items={files} onChange={setFiles} onRemove={remove} label="PDFs to merge, in order" />
      <AddMore onFiles={add} accept={ACCEPT} noun="PDFs" />
      {error && <ErrorNote>{error}</ErrorNote>}
      <ActionBar total={`${plural(files.length, "file")} · ${counted ? plural(pages, "page") : "counting pages…"}`}>
        <Button variant="primary" icon={Combine} onClick={merge} disabled={files.length < 2 || !counted}>
          {files.length < 2 ? "Add 2+ PDFs" : `Merge ${files.length} PDFs`}
        </Button>
      </ActionBar>
    </div>
  );
}
