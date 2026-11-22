/**
 * Window events, so any button anywhere can open the palette or AVTAR
 * without threading props through the tree. The frame listens for them.
 */
export const PALETTE_EVENT = "aio:palette";
export const ASK_EVENT = "aio:ask";

/** Opens the ⌘K palette. `filter: "tools"` pre-filters it to tools. */
export function openPalette(filter?: "tools") {
  window.dispatchEvent(new CustomEvent(PALETTE_EVENT, { detail: filter ?? null }));
}

/** Opens AVTAR, optionally asking a first question. */
export function askAvtar(question = "") {
  window.dispatchEvent(new CustomEvent(ASK_EVENT, { detail: question }));
}
