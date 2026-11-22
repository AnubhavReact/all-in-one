"use client";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type Announcements,
  type DragEndEvent,
  type Modifier,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import { FileText, GripVertical, X } from "lucide-react";
import { IconButton } from "@/components/ui/Button";
import { fileMeta, type Picked } from "./files";
import s from "./Pdf.module.css";

/** Rows only move up and down. */
const vertical: Modifier = ({ transform }) => ({ ...transform, x: 0 });

/**
 * A list of files you can put in order: drag a row by its handle with a
 * mouse or finger, or focus the handle and use Space and the arrow keys.
 * Every move is read out ("offer-letter.pdf moved to position 2 of 3").
 */
export function SortableList({
  items,
  onChange,
  onRemove,
  label,
}: {
  items: Picked[];
  onChange: (items: Picked[]) => void;
  onRemove: (id: string) => void;
  /** Accessible name for the list, e.g. "PDFs to merge, in order". */
  label: string;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const n = items.length;
  const nameOf = (id: UniqueIdentifier) => items.find((item) => item.id === id)?.file.name ?? "File";
  const positionOf = (id: UniqueIdentifier | undefined) =>
    id === undefined ? -1 : items.findIndex((item) => item.id === id) + 1;

  const announcements: Announcements = {
    onDragStart: ({ active }) =>
      `Picked up ${nameOf(active.id)}. It is in position ${positionOf(active.id)} of ${n}.`,
    onDragOver: ({ active, over }) =>
      over ? `${nameOf(active.id)} moved to position ${positionOf(over.id)} of ${n}.` : undefined,
    onDragEnd: ({ active, over }) =>
      over
        ? `${nameOf(active.id)} dropped at position ${positionOf(over.id)} of ${n}.`
        : `${nameOf(active.id)} dropped.`,
    onDragCancel: ({ active }) =>
      `Moving cancelled. ${nameOf(active.id)} is back in position ${positionOf(active.id)} of ${n}.`,
  };

  function onDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return;
    const from = items.findIndex((item) => item.id === active.id);
    const to = items.findIndex((item) => item.id === over.id);
    if (from < 0 || to < 0) return;
    onChange(arrayMove(items, from, to));
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[vertical]}
      onDragEnd={onDragEnd}
      accessibility={{
        announcements,
        screenReaderInstructions: {
          draggable:
            "To move this file, press Space to lift it, use the up and down arrow keys to move it, then press Space again to drop it. Press Escape to cancel.",
        },
      }}
    >
      <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
        <ol className={s.list} aria-label={label}>
          {items.map((item, index) => (
            <Row key={item.id} item={item} position={index + 1} total={n} onRemove={() => onRemove(item.id)} />
          ))}
        </ol>
      </SortableContext>
    </DndContext>
  );
}

function Row({
  item,
  position,
  total,
  onRemove,
}: {
  item: Picked;
  position: number;
  total: number;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });
  const name = item.file.name;
  return (
    <li
      ref={setNodeRef}
      className={clsx(s.row, isDragging && s.dragging)}
      style={{ transform: CSS.Translate.toString(transform), transition }}
    >
      <button
        type="button"
        ref={setActivatorNodeRef}
        className={s.grip}
        {...attributes}
        {...listeners}
        aria-label={`Move ${name}, position ${position} of ${total}`}
      >
        <GripVertical aria-hidden strokeWidth={1.8} />
      </button>
      <span className={clsx(s.fileTile, item.preview && s.thumb)} aria-hidden>
        {item.preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.preview} alt="" />
        ) : (
          <FileText strokeWidth={1.8} />
        )}
      </span>
      <span className={s.name}>
        <strong>{name}</strong>
        <span className={s.meta}>{fileMeta(item)}</span>
      </span>
      <IconButton icon={X} label={`Remove ${name}`} onClick={onRemove} />
    </li>
  );
}
