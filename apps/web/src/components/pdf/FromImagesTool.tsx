"use client";

import { useEffect, useRef, useState } from "react";
import { FileStack } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DropZone } from "@/components/ui/DropZone";
import { Segmented } from "@/components/ui/Segmented";
import type { ImagePageSize } from "@/lib/pdf";
import { isImage, pick, plural, rejectMessage, type Picked } from "./files";
import { ActionBar, AddMore, ErrorNote, ResultCard, Working } from "./Parts";
import { remember, toBlob, type Result } from "./save";
import { SortableList } from "./SortableList";
import s from "./Pdf.module.css";

const ACCEPT = ".jpg,.jpeg,.png,image/jpeg,image/png";

type Margin = "none" | "small" | "large";
/** In PDF points: a quarter and a half inch. */
const MARGIN: Record<Margin, number> = { none: 0, small: 18, large: 36 };

export function FromImagesTool() {
  const [images, setImages] = useState<Picked[]>([]);
  const [size, setSize] = useState<ImagePageSize>("a4");
  const [margin, setMargin] = useState<Margin>("small");
  const [error, setError] = useState<string>();
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  // Every preview URL made, so none is left behind when the page closes.
  const urls = useRef(new Set<string>());
  useEffect(() => {
    const made = urls.current;
    return () => made.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  function release(item: Picked) {
    if (!item.preview) return;
    URL.revokeObjectURL(item.preview);
    urls.current.delete(item.preview);
  }

  function add(dropped: File[]) {
    const good = dropped.filter(isImage).map((file) => {
      const preview = URL.createObjectURL(file);
      urls.current.add(preview);
      return { ...pick(file), preview };
    });
    const bad = dropped.filter((f) => !isImage(f));
    setError(bad.length ? rejectMessage(bad, images.length + good.length, "image") : undefined);
    if (good.length) setImages((current) => [...current, ...good]);
  }

  function remove(id: string) {
    const gone = images.find((item) => item.id === id);
    if (gone) release(gone);
    setImages((current) => current.filter((item) => item.id !== id));
    setError(undefined);
  }

  function reset() {
    images.forEach(release);
    setImages([]);
    setResult(null);
    setError(undefined);
  }

  async function build() {
    setError(undefined);
    setProgress({ done: 0, total: images.length });
    try {
      const { imagesToPdf } = await import("@/lib/pdf");
      const data = await imagesToPdf(
        images.map((item) => item.file),
        { pageSize: size, margin: MARGIN[margin], onProgress: (done, total) => setProgress({ done, total }) },
      );
      const done: Result = {
        blob: toBlob(data, "application/pdf"),
        name: "images.pdf",
        facts: [plural(images.length, "page")],
      };
      remember(done, "Images to PDF", "file");
      setResult(done);
    } catch {
      setError("One of these images couldn't be read. Remove it, or save it again as JPG and add it back.");
    } finally {
      setProgress(null);
    }
  }

  if (result) return <ResultCard result={result} onReset={reset} />;
  if (progress) {
    return (
      <Working
        label={`Placing image ${Math.min(progress.done + 1, progress.total)} of ${progress.total} in this tab…`}
        done={progress.done}
        total={progress.total}
      />
    );
  }
  if (images.length === 0) {
    return <DropZone files={[]} error={error} onFiles={add} onRemove={() => {}} accept={ACCEPT} noun="images" />;
  }

  return (
    <div className={s.stack}>
      <SortableList items={images} onChange={setImages} onRemove={remove} label="Images, in page order" />
      <AddMore onFiles={add} accept={ACCEPT} noun="images" />
      {error && <ErrorNote>{error}</ErrorNote>}

      <div className={s.panel}>
        <div className={s.options}>
          <Segmented<ImagePageSize>
            legend="Page size"
            value={size}
            onChange={setSize}
            options={[
              { value: "a4", label: "A4" },
              { value: "letter", label: "Letter" },
              { value: "fit", label: "Fit image" },
            ]}
          />
          <Segmented<Margin>
            legend="Margins"
            value={margin}
            onChange={setMargin}
            options={[
              { value: "none", label: "None" },
              { value: "small", label: "Small" },
              { value: "large", label: "Large" },
            ]}
          />
        </div>
        <p className={s.helper}>
          {size === "fit"
            ? "Each page is the size of its image, so nothing is scaled."
            : "Each image is centred and scaled down to fit. Wide images get a landscape page."}
        </p>
      </div>

      <ActionBar total={`${plural(images.length, "image")} → ${plural(images.length, "page")}`}>
        <Button variant="primary" icon={FileStack} onClick={build}>
          {`Make a ${images.length}-page PDF`}
        </Button>
      </ActionBar>
    </div>
  );
}
